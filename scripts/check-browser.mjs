import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { build, projectRoot } from './build.mjs';
import { startServer } from '../web/server.mjs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const candidates = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].filter(Boolean);
let executable;
for (const candidate of candidates) if (await access(candidate).then(() => true, () => false)) { executable = candidate; break; }
if (!executable) throw new Error('需要已安装的 Chrome / Chromium；请设置 CHROME_PATH。');
await build();
const server = await startServer({ host: '127.0.0.1', port: 0, basePath: '/aigc-infra/' });
const base = `http://127.0.0.1:${server.address().port}/aigc-infra/`;
const output = path.join(projectRoot, '.preview');
await mkdir(output, { recursive: true });
const profile = await mkdtemp(path.join(output, 'chrome-'));
const chrome = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let stderr = '', launchError;
chrome.stderr.on('data', chunk => { stderr += chunk.toString(); });
chrome.on('error', error => { launchError = error; });
let socket;
const exceptions = [], failures = [];
try {
  let endpoint;
  for (let i = 0; i < 200; i++) {
    if (launchError) throw launchError;
    endpoint = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];
    if (endpoint) break;
    if (chrome.exitCode !== null) throw new Error(`浏览器退出：${stderr.slice(-2000)}`);
    await delay(100);
  }
  if (!endpoint) throw new Error('浏览器调试端口未就绪');
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let counter = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) { const handlers = pending.get(message.id); if (handlers) { pending.delete(message.id); message.error ? handlers.reject(new Error(JSON.stringify(message.error))) : handlers.resolve(message.result); } }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failures.push(message.params.response.url);
  });
  function send(method, params = {}, sessionId) {
    const id = ++counter;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP 超时：${method}`)); }, 15000);
      pending.set(id, { resolve: result => { clearTimeout(timeout); resolve(result); }, reject: error => { clearTimeout(timeout); reject(error); } });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const command = (method, params = {}) => send(method, params, sessionId);
  await command('Page.enable'); await command('Runtime.enable'); await command('Network.enable');
  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await delay(50); }
    console.error('页面状态：', await evaluate('document.querySelector("#main")?.innerText.slice(0, 600)'));
    console.error('浏览器异常：', exceptions, '资源错误：', failures);
    throw new Error(`页面条件未满足：${expression}`);
  };
  const route = async (hash, title) => { await evaluate(`location.hash = ${JSON.stringify(hash)}`); await waitFor(`document.querySelector('#main h1')?.textContent === ${JSON.stringify(title)}`); };
  const screenshot = async name => { await evaluate('window.scrollTo(0,0)'); await delay(100); const { data } = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); await writeFile(path.join(output, name + '.png'), Buffer.from(data, 'base64')); };
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: base });
  await waitFor('document.querySelectorAll(".stage-card").length === 6');
  assert.equal(await evaluate('document.querySelectorAll(".workflow-step").length'), 6);
  assert.equal(await evaluate('document.querySelectorAll(".shared-card").length'), 3);
  await screenshot('home-desktop');
  const modules = [['goals', '目标与基准'], ['data', '数据工程'], ['training', '模型实验与训练'], ['evaluation', '评测与验收'], ['serving', '推理优化与发布'], ['feedback', '运行反馈与迭代'], ['lifecycle', '项目生命周期管理'], ['viewer', '统一 DataViewer'], ['foundation', '公共技术底座']];
  for (const [id, title] of modules) {
    await route('#/module/' + id, title);
    assert.ok(await evaluate('document.querySelectorAll(".document-row").length >= 1'));
    assert.ok(await evaluate(id === 'data' ? 'document.querySelectorAll(".data-module-card").length === 5' : 'document.querySelectorAll(".tool-card").length >= 1'));
  }
  await route('#/module/data', '数据工程');
  assert.equal(await evaluate('document.querySelectorAll("#data-overview .data-module-node").length'), 5);
  assert.equal(await evaluate('document.querySelectorAll("#data-processing .data-processing-lane").length'), 2);
  assert.equal(await evaluate('document.querySelectorAll(".data-connection,.data-handoff-lines,#module-tools,.data-capability-card").length'), 0, '能力模块不显示流转箭头或重复职责卡片');
  assert.equal(await evaluate('document.querySelector("#data-processing h2").textContent'), '数据处理管线');
  await screenshot('data-desktop');
  const dataLinks = await evaluate('[...new Set([...document.querySelectorAll(".data-module-node,.data-tool-link")].map(a=>a.getAttribute("href")))].filter(href=>href.startsWith("#/doc/"))');
  for (const href of dataLinks) {
    await route('#/module/data', '数据工程');
    await evaluate(`[...document.querySelectorAll('.data-module-node,.data-tool-link')].find(a=>a.getAttribute('href')===${JSON.stringify(href)}).click()`);
    const section = new URLSearchParams(href.split('?')[1]).get('section');
    await waitFor(`!!document.querySelector('.doc-page')${section ? ` && !!document.getElementById(${JSON.stringify(section)})` : ''}`);
  }
  await route('#/module/data', '数据工程');
  await evaluate('document.querySelector(".data-node-processing .data-module-node").click()');
  await waitFor('location.hash.includes("section=data-processing")');
  const stageLinks = await evaluate('[...document.querySelectorAll(".data-process-step")].map(a=>a.getAttribute("href"))');
  for (const href of stageLinks) {
    await evaluate(`[...document.querySelectorAll('.data-process-step')].find(a=>a.getAttribute('href')===${JSON.stringify(href)}).click()`);
    const params = new URLSearchParams(href.split('?')[1]);
    const selector = `.data-stage-detail[data-pipeline="${params.get('pipeline')}"][data-step="${params.get('stage')}"]`;
    await waitFor(`!!document.querySelector(${JSON.stringify(selector)})`);
    assert.equal(await evaluate('document.querySelectorAll(".data-context-node").length'), 3);
    assert.ok(await evaluate('document.querySelectorAll(".data-operations span").length >= 3'));
    assert.equal(await evaluate('document.querySelectorAll(".doc-page").length'), 0);
  }
  await route('#/module/data?pipeline=multi&stage=caption', '数据工程');
  await waitFor('document.querySelector(".data-stage-detail[data-pipeline=multi][data-step=caption]")');
  assert.equal(await evaluate('document.querySelector(".data-context-node.is-active small").textContent'), 'Stage 3');
  assert.equal(await evaluate('document.querySelector(".data-stage-context a:last-child strong").textContent'), '内容与音频分析');
  await evaluate('document.querySelector(".data-stage-context a:last-child").click()');
  await waitFor('document.querySelector(".data-stage-detail[data-step=analyze]")');
  await evaluate('history.back()');
  await waitFor('document.querySelector(".data-stage-detail[data-step=caption]")');
  await command('Page.reload');
  await waitFor('document.querySelector(".data-stage-detail[data-pipeline=multi][data-step=caption]")');
  await screenshot('data-stage-desktop');
  await route('#/module/data?pipeline=single&stage=missing', '数据工程');
  await waitFor('document.querySelector(".data-stage-detail[data-step=raw_ingest]")');
  await route('#/module/evaluation', '评测与验收');
  await evaluate('document.querySelector("#interface-preview").scrollIntoView()');
  await delay(700);
  assert.equal(await evaluate('document.querySelector("iframe").getAttribute("sandbox")'), '');
  assert.equal(await evaluate(`document.querySelector('a[href="http://117.50.195.94:2051/"]').target`), '_blank');
  await screenshot('evaluation-desktop');
  await route('#/module/goals', '目标与基准');
  assert.ok(await evaluate('document.querySelector(".tool-grid").textContent.includes("正在开发")'));
  assert.equal(await evaluate(`[...document.querySelectorAll('.tool-card')].find(el=>el.textContent.includes('算法组项目与 Goals')).querySelectorAll('a[target="_blank"]').length`), 0);
  const problemRoute = '#/doc/' + encodeURIComponent('algorithm-template/docs/problem.md');
  await route(problemRoute, '问题定义与验收');
  assert.ok(await evaluate('document.querySelectorAll(".markdown table").length >= 1'));
  assert.ok(await evaluate('document.querySelectorAll("#document-toc a").length >= 4'));
  await evaluate(`document.querySelector('.markdown a[href*="project.yaml"]').click()`);
  await waitFor('document.querySelector("#main h1")?.textContent === "project.yaml"');
  assert.ok(await evaluate('document.querySelector(".markdown pre code").textContent.includes("goal:")'));
  await route('#/tools', '平台与工具');
  await evaluate(`document.querySelector('[data-filter="plan"]').click()`);
  assert.ok(await evaluate('document.querySelector(".tool-grid").textContent.includes("下载交付与 MongoDB meta")'));
  assert.ok(await evaluate('document.querySelector(".tool-grid").textContent.includes("多维评分与差异案例预览")'));
  await evaluate(`document.querySelector('[data-filter="protocol"]').click()`);
  assert.equal(await evaluate('document.querySelectorAll(".tool-card").length'), 2);
  await evaluate('document.querySelector("#search-open").click(); const input=document.querySelector("#search-input"); input.value="MongoDB"; input.dispatchEvent(new Event("input",{bubbles:true}));');
  assert.ok(await evaluate('document.querySelectorAll(".search-result").length > 0'));
  await evaluate('document.querySelector(".search-result").click()');
  await waitFor('!document.querySelector("#search-dialog").open && document.querySelector(".markdown")');
  await route('#/tools', '平台与工具');
  await evaluate(`document.querySelector('[data-filter="all"]').click();document.querySelector('[data-preview="prim-eval"]').click()`);
  await waitFor('document.querySelector("#main h1")?.textContent === "评测与验收" && location.hash.includes("section=interface-preview")');
  const cleaned = await evaluate(`(async()=>{const {renderMarkdown}=await import('./app.mjs');return renderMarkdown('<script>window.bad=1</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">bad</a><iframe src="https://invalid/"></iframe><a href="../project.yaml">project</a>','algorithm-template/docs/problem.md')})()`);
  assert.doesNotMatch(cleaned, /<script|onerror|javascript:|<iframe/);
  assert.match(cleaned, /#\/doc\/algorithm-template%2Fproject.yaml/);

  await route('#/video-generation', '视频生成技术汇总');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-category").length'), 7);
  assert.equal(await evaluate('document.querySelectorAll(".vgm-category-topics a").length'), 54);
  assert.ok(await evaluate('document.querySelector(\'#navigation a[href="#/tools"]\').nextElementSibling.getAttribute("href") === "#/video-generation"'), '技术入口紧跟平台工具');
  assert.equal(await evaluate('document.querySelector(\'#navigation a[href="#/video-generation"]\').getAttribute("aria-current")'), 'page');
  await screenshot('video-map-desktop');
  const videoViews = await evaluate('(async()=> (await (await fetch("./data/content.json")).json()).videoMap.views.map(view=>({id:view.id,label:view.label,topics:view.subclasses.map(topic=>({id:topic.id,label:topic.label,points:topic.subdivisions.length,works:topic.works.length}))})))()');
  for (const view of videoViews) {
    for (const topic of view.topics) {
      await route('#/video-generation/' + view.id + '?topic=' + topic.id, view.label);
      await waitFor('document.querySelector(".vgm-detail-heading")?.textContent === ' + JSON.stringify(topic.label));
      assert.equal(await evaluate('document.querySelectorAll(".vgm-branch").length'), view.topics.length);
      assert.equal(await evaluate('document.querySelectorAll(".vgm-point").length'), topic.points);
      assert.equal(await evaluate('document.querySelectorAll(".vgm-work a[target=\'_blank\']").length'), topic.works);
      assert.ok(await evaluate('[...document.querySelectorAll(".vgm-work a")].every(a=>a.rel.includes("noopener") && a.href.startsWith("https://"))'));
    }
  }
  await route('#/video-generation/view.control?topic=control.motion', '可控性');
  await waitFor('document.querySelector(".vgm-detail-heading")?.textContent === "运动"');
  await evaluate('document.querySelector(".vgm-branch.is-selected .vgm-leaf").click()');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-point.is-selected").length'), 1);
  assert.ok(await evaluate('new URLSearchParams(location.hash.split("?")[1]).has("point")'));
  await evaluate('history.back()');
  await waitFor('location.hash === "#/video-generation/view.control?topic=control.motion" && document.querySelectorAll(".vgm-point.is-selected").length === 0');
  await evaluate('document.querySelector(\'[data-vgm-expand="all"]\').click()');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-branch[open]").length'), 8);
  await evaluate('document.querySelector(\'[data-vgm-expand="none"]\').click()');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-branch[open]").length'), 0);
  await command('Page.bringToFront');
  await evaluate('document.querySelector(\'[data-vgm-topic="control.camera"] > summary\').focus()');
  assert.ok(await evaluate('document.activeElement.matches(\'[data-vgm-topic="control.camera"] > summary\')'));
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor('document.querySelector(".vgm-detail-heading")?.textContent === "相机" && document.querySelector(\'[data-vgm-topic="control.camera"]\').open');
  await screenshot('video-map-category-desktop');
  await evaluate('(()=>{const input=document.querySelector("#vgm-search"); input.value="TeaCache"; input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-search-result").length'), 2);
  await evaluate('document.querySelector(".vgm-search-result").click()');
  await waitFor('document.querySelector(\'.vgm-work[data-vgm-work="R34"]\')?.classList.contains("is-highlighted")');
  assert.ok(await evaluate('document.querySelector(".vgm-more-works").open'));
  await evaluate('document.querySelector(".vgm-works-section .text-link").click()');
  await waitFor('!!document.querySelector(".doc-page") && !!document.getElementById("training-efficiency")');
  assert.ok(await evaluate('document.querySelector(".doc-topline a").textContent.includes("视频生成技术汇总")'));
  assert.equal(await evaluate('document.querySelector(\'#navigation a[href="#/video-generation"]\').getAttribute("aria-current")'), 'page');
  await evaluate('document.querySelector(\'.markdown a[href="#tasks-image"]\').click()');
  assert.ok(await evaluate('document.getElementById("tasks-image").getBoundingClientRect().top < 120'), '命名章节锚点可跳转');
  await route('#/doc/' + encodeURIComponent('AIGC-infra/vgm-map/research/sources.json'), 'sources.json');
  assert.ok(await evaluate('document.querySelector(".markdown pre code").textContent.includes("R76")'));
  await command('Page.reload');
  await waitFor('document.querySelector(".markdown pre code")?.textContent.includes("R76")');
  await route('#/video-generation/view.architecture?topic=architecture.attention', '模型结构与表示');
  await waitFor('document.querySelector(".vgm-detail-heading")?.textContent === "时空连接与注意力"');
  await command('Page.reload');
  await waitFor('document.querySelector(".vgm-detail-heading")?.textContent === "时空连接与注意力"');

  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await route('#/', '从问题定义，到可靠交付。');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), '手机页面不应横向溢出');
  await screenshot('home-mobile');
  await evaluate('document.querySelector("#menu-toggle").click()');
  assert.equal(await evaluate('document.querySelector("#menu-toggle").getAttribute("aria-expanded")'), 'true');
  await evaluate(`document.querySelector('.nav-item[href="#/module/data"]').click()`);
  await waitFor('document.querySelector("#main h1")?.textContent === "数据工程"');
  assert.ok(await evaluate('!document.querySelector("#sidebar").classList.contains("mobile-open")'));
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await screenshot('data-mobile');
  await evaluate('const viewport=document.querySelector(".data-overview-diagram .data-diagram-viewport");viewport.scrollLeft=viewport.scrollWidth');
  assert.ok(await evaluate('(()=>{const viewport=document.querySelector(".data-overview-diagram .data-diagram-viewport");const node=document.querySelector(".data-node-consumption");return viewport.scrollLeft>0 && node.getBoundingClientRect().right<=viewport.getBoundingClientRect().right})()'), '手机可在图内滚动查看消费模块');

  await route('#/video-generation', '视频生成技术汇总');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), '手机技术总览不横向溢出');
  await screenshot('video-map-mobile');
  await evaluate('document.querySelector(".vgm-category-topics a").click()');
  await waitFor('!!document.querySelector(".vgm-detail-heading")');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), '手机分类树和资料面板不横向溢出');
  await evaluate('document.querySelector(".vgm-branch.is-selected .vgm-leaf").click()');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-point.is-selected").length'), 1);
  await screenshot('video-map-category-mobile');
  await evaluate('document.querySelector("#menu-toggle").click(); document.querySelector(\'#navigation a[href="#/video-generation"]\').click()');
  await waitFor('document.querySelector("#main h1")?.textContent === "视频生成技术汇总" && !document.querySelector("#sidebar").classList.contains("mobile-open")');

  assert.deepEqual(exceptions, [], '浏览器执行异常');
  assert.deepEqual(failures, [], '资源请求失败');
  console.log('浏览器通过：9 个模块、数据流程、视频技术 7 类/54 个子类、分类树/键盘展开、跨类搜索、历史与刷新、资料锚点/JSON、手机布局和代理路径。');
  console.log(`截图：${output}`);
} finally {
  socket?.close();
  if (chrome.exitCode === null) chrome.kill();
  await new Promise(resolve => server.close(resolve));
  for (let i = 0; i < 30 && chrome.exitCode === null; i++) await delay(100);
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
}
