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
    if (id === 'foundation') {
      assert.equal(await evaluate('document.querySelectorAll(".foundation-capability").length'), 5);
      assert.equal(await evaluate('document.querySelectorAll("#module-tools,#module-context,#module-documents,.module-tabs").length'), 0);
      assert.equal(await evaluate('document.querySelector(".foundation-platform a").getAttribute("href")'), 'https://paas.myhexin.com/mfasset/resourcePoolV2?tenantId=262&projectId=42');
      await screenshot('foundation-desktop');
      continue;
    }
    assert.ok(await evaluate('document.querySelectorAll(".document-row").length >= 1'));
    assert.ok(await evaluate(id === 'data' ? 'document.querySelectorAll(".data-module-card").length === 5' : 'document.querySelectorAll(".tool-card").length >= 1'));
  }
  await route('#/module/data', '数据工程');
  assert.equal(await evaluate('document.querySelectorAll("#data-overview .data-module-node").length'), 5);
  assert.equal(await evaluate('document.querySelectorAll("#data-processing .data-processing-lane").length'), 2);
  assert.equal(await evaluate('document.querySelectorAll(".data-connection,.data-handoff-lines,#module-tools,.data-capability-card").length'), 0, '能力模块不显示流转箭头或重复职责卡片');
  assert.equal(await evaluate('document.querySelector("#data-processing h2").textContent'), '数据处理管线');
  assert.equal(await evaluate('document.querySelectorAll("#data-processing [data-diagram-panel]").length'), 2);
  await evaluate('document.querySelector("#data-pipeline-diagrams").scrollIntoView({behavior:"instant"})');
  const sourcePosition = await evaluate('scrollY');
  for (const [pipeline, file] of [['multi','multishot'],['single','singleshot']]) {
    await evaluate(`document.querySelector('[data-diagram-select=${pipeline}]').click()`);
    await waitFor(`(()=>{const panel=document.querySelector('[data-diagram-panel=${pipeline}]');const img=panel.querySelector('img');return !panel.hidden&&img.complete&&img.naturalWidth>5000})()`);
    assert.ok(await evaluate(`Math.abs(scrollY-${sourcePosition})<=1`), '原图切换保持页面位置');
    const pdf = await fetch(base + 'images/' + file + '.pdf');
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers.get('content-type'), 'application/pdf');
    assert.ok(Buffer.from(await pdf.arrayBuffer()).subarray(0,5).equals(Buffer.from('%PDF-')));
  }
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
  await delay(700);
  await evaluate('window.scrollTo({top:document.querySelector("#data-processing").getBoundingClientRect().top+scrollY-90,behavior:"instant"});window.dataPipelineRef=document.querySelector(".data-processing-panel")');
  const stageLinks = await evaluate('[...document.querySelectorAll(".data-process-step")].map(a=>a.getAttribute("href"))');
  for (const href of stageLinks) {
    const before = await evaluate('({y:scrollY,top:document.querySelector(".data-processing-panel").getBoundingClientRect().top})');
    await evaluate(`window.clickedDataStage=[...document.querySelectorAll('.data-process-step')].find(a=>a.getAttribute('href')===${JSON.stringify(href)});clickedDataStage.focus({preventScroll:true});clickedDataStage.click()`);
    const params = new URLSearchParams(href.split('?')[1]);
    const selector = `.data-stage-detail[data-pipeline="${params.get('pipeline')}"][data-step="${params.get('stage')}"]`;
    await waitFor(`!!document.querySelector(${JSON.stringify(selector)})`);
    await delay(80);
    assert.ok(await evaluate(`Math.abs(scrollY-${before.y})<=1 && Math.abs(document.querySelector('.data-processing-panel').getBoundingClientRect().top-${before.top})<=1`), '切换 Stage 保持页面与管线的位置');
    assert.ok(await evaluate('document.querySelector(".data-processing-panel")===dataPipelineRef && document.activeElement===clickedDataStage'), '管线节点与键盘焦点保留');
    assert.equal(await evaluate('document.querySelectorAll(".data-context-node,.data-stage-context").length'), 0);
    assert.equal(await evaluate('document.querySelectorAll(".data-process-step.is-active").length'), 1);
    assert.ok(await evaluate('document.querySelectorAll(".data-operations span").length >= 3'));
    assert.equal(await evaluate('document.querySelectorAll(".doc-page").length'), 0);
  }
  await route('#/module/data?pipeline=multi&stage=caption', '数据工程');
  await waitFor('document.querySelector(".data-stage-detail[data-pipeline=multi][data-step=caption]")');
  assert.ok(await evaluate('document.querySelector(".data-stage-detail .eyebrow").textContent.includes("STAGE 3")'));
  assert.ok(await evaluate('new Set([...document.querySelectorAll(".data-input-block,.data-output-block,.data-operation")].map(el=>getComputedStyle(el).backgroundColor)).size>=5'), '输入、输出和内部处理能力有不同颜色');
  const stageScroll = await evaluate('scrollY');
  await evaluate('document.querySelector(".data-processing-lane[data-pipeline=multi] .data-process-step[data-step=analyze]").click()');
  await waitFor('document.querySelector(".data-stage-detail[data-step=analyze]")');
  await evaluate('history.back()');
  await waitFor('document.querySelector(".data-stage-detail[data-step=caption]")');
  assert.ok(await evaluate(`Math.abs(scrollY-${stageScroll})<=1`), '历史切换保留管线位置');
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
  const cleaned = await evaluate(`(async()=>{const {renderMarkdown}=await import(document.querySelector('script[type="module"]').src);return renderMarkdown('<script>window.bad=1</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">bad</a><iframe src="https://invalid/"></iframe><a href="../project.yaml">project</a>','algorithm-template/docs/problem.md')})()`);
  assert.doesNotMatch(cleaned, /<script|onerror|javascript:|<iframe/);
  assert.match(cleaned, /#\/doc\/algorithm-template%2Fproject.yaml/);

  await route('#/video-generation', '视频生成技术汇总');
  await waitFor('!!document.querySelector(".vgm-detail-heading")');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-view-tab[role=tab]").length'), 7);
  assert.equal(await evaluate('document.querySelectorAll(".vgm-category").length'), 0);
  assert.ok(await evaluate('document.querySelector(".vgm-view-tabs").getBoundingClientRect().top > document.querySelector(".vgm-search").getBoundingClientRect().bottom'), '分类按钮在搜索栏下方');
  assert.equal(await evaluate('new Set([...document.querySelectorAll(".vgm-view-tab")].map(tab=>getComputedStyle(tab).getPropertyValue("--vgm-accent").trim())).size'), 7, '七个大类分别使用代表色');
  assert.ok(await evaluate('new Set([...document.querySelectorAll(".vgm-view-tab")].map(tab=>tab.getBoundingClientRect().top)).size===1'), '七个按钮保持横排');
  assert.ok(await evaluate('document.querySelector(\'#navigation a[href="#/tools"]\').nextElementSibling.getAttribute("href") === "#/video-generation"'), '技术入口紧跟平台工具');
  assert.equal(await evaluate('document.querySelector(\'#navigation a[href="#/video-generation"]\').getAttribute("aria-current")'), 'page');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-mindmap").length'), 4);
  assert.ok(await evaluate('document.querySelector(".vgm-mindmaps").getBoundingClientRect().bottom <= document.querySelector(".vgm-tree-toolbar").getBoundingClientRect().top'), '四张导图位于技术分支栏目上方');
  assert.ok(await evaluate('!document.querySelector(".vgm-mindmaps .vgm-work") && !document.querySelector(".vgm-mindmaps a") && !document.querySelector(".vgm-mindmaps").textContent.includes("代表作与贡献")'), '导图只显示子类及技术点');
  await screenshot('video-map-desktop');
  const mindMapClip = await evaluate('(()=>{const r=document.querySelector(".vgm-mindmaps").getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()');
  const mindMapShot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: mindMapClip });
  await writeFile(path.join(output, 'video-mindmaps-desktop.png'), Buffer.from(mindMapShot.data, 'base64'));
  const videoViews = await evaluate('(async()=> (await (await fetch("./data/content.json")).json()).videoMap.views.map(view=>({id:view.id,label:view.label,topics:view.subclasses.map(topic=>({id:topic.id,label:topic.label,points:topic.subdivisions.length,works:topic.works.length}))})))()');
  await evaluate('window.vgmPage=document.querySelector(".vgm-page");window.vgmHeader=document.querySelector(".vgm-header");window.vgmSearch=document.querySelector("#vgm-search");window.vgmHashChanges=0;window.addEventListener("hashchange",()=>window.vgmHashChanges++);vgmSearch.value="TeaCache";vgmSearch.dispatchEvent(new Event("input",{bubbles:true}));window.scrollTo({top:80,behavior:"instant"})');
  const vgmPosition = await evaluate('scrollY');
  for (const view of videoViews) {
    await evaluate(`document.querySelector('[data-vgm-view="${view.id}"]').click()`);
    await waitFor('document.querySelector(".vgm-view-intro h2")?.textContent === ' + JSON.stringify(view.label));
    assert.ok(await evaluate(`document.querySelector('.vgm-page')===vgmPage && document.querySelector('.vgm-header')===vgmHeader && document.querySelector('#vgm-search')===vgmSearch && vgmSearch.value==='TeaCache' && Math.abs(scrollY-${vgmPosition})<=1`), '切换大类只更新内容，保留页面、搜索框与滚动位置');
    assert.equal(await evaluate('document.querySelectorAll(".vgm-view-tab[aria-selected=true]").length'), 1);
    assert.equal(await evaluate('document.querySelector(".vgm-view-tab[aria-selected=true]").dataset.vgmView'), view.id);
    assert.equal(await evaluate('document.querySelectorAll(".vgm-branch").length'), view.topics.length);
    assert.equal(await evaluate('document.querySelectorAll(".vgm-mindmap").length'), 4);
    assert.equal(await evaluate('document.querySelectorAll(".vgm-map-topic").length'), view.topics.length);
    assert.equal(await evaluate('document.querySelectorAll(".vgm-map-point").length'), view.topics.reduce((count, topic) => count + topic.points, 0), '导图覆盖所有技术点');
  }
  assert.equal(await evaluate('vgmHashChanges'), 0, '按钮切换不触发路由跳转');
  await evaluate('vgmSearch.value="";vgmSearch.dispatchEvent(new Event("input",{bubbles:true}));document.querySelector(".vgm-view-tab[aria-selected=true]").focus()');
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await waitFor('document.activeElement.dataset.vgmView === "view.tasks" && document.activeElement.getAttribute("aria-selected") === "true"');
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await waitFor('document.activeElement.dataset.vgmView === "view.paradigms" && document.activeElement.getAttribute("aria-selected") === "true"');
  for (const view of videoViews) {
    for (const topic of view.topics) {
      await route('#/video-generation/' + view.id + '?topic=' + topic.id, '视频生成技术汇总');
      await waitFor('document.querySelector(".vgm-view-intro h2")?.textContent === ' + JSON.stringify(view.label));
      await waitFor('document.querySelector(".vgm-detail-heading")?.textContent === ' + JSON.stringify(topic.label));
      assert.equal(await evaluate('document.querySelectorAll(".vgm-branch").length'), view.topics.length);
      assert.equal(await evaluate('document.querySelectorAll(".vgm-point").length'), topic.points);
      assert.equal(await evaluate('document.querySelectorAll(".vgm-work a[target=\'_blank\']").length'), topic.works);
      assert.ok(await evaluate('[...document.querySelectorAll(".vgm-work a")].every(a=>a.rel.includes("noopener") && a.href.startsWith("https://"))'));
      await evaluate(`document.querySelector('.vgm-map-topic[data-vgm-map-topic="${topic.id}"]').click()`);
      assert.ok(await evaluate(`document.querySelector('.vgm-branch.is-selected').dataset.vgmTopic==='${topic.id}' && document.querySelector('.vgm-branch.is-selected').open`), '导图子类复用技术分支选择');
      assert.equal(await evaluate('location.hash'), '#/video-generation/' + view.id + '?topic=' + topic.id);
      await evaluate(`document.querySelector('.vgm-map-point[data-vgm-map-topic="${topic.id}"]').click()`);
      assert.ok(await evaluate('document.querySelector(".vgm-map-point.is-selected").dataset.vgmMapPoint===document.querySelector(".vgm-point.is-selected").dataset.vgmDetailPoint && document.querySelector(".vgm-leaf.is-selected").dataset.vgmPoint===new URLSearchParams(location.hash.split("?")[1]).get("point")'), '导图技术点同步详情、分类树与链接');
      assert.ok(await evaluate('(()=>{const heading=document.querySelector(".vgm-detail-heading").getBoundingClientRect();return heading.top>=70 && heading.bottom<innerHeight})()'), '点击导图后详情标题在视口中可见，且不被顶栏遮挡');
      await evaluate(`document.querySelector('[data-vgm-topic="${topic.id}"] > summary').click()`);
      assert.equal(await evaluate('document.querySelectorAll(".vgm-map-point.is-selected").length'), 0, '原分类树选择同步回导图');
    }
  }
  await route('#/video-generation/view.control?topic=control.motion', '视频生成技术汇总');
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
  await evaluate('document.querySelector(".vgm-branch.is-selected .vgm-leaf").click();window.vgmSavedPoint=document.querySelector(".vgm-point.is-selected").dataset.vgmDetailPoint;document.querySelector(\'[data-vgm-view="view.training"]\').click();document.querySelector(\'[data-vgm-view="view.control"]\').click()');
  assert.ok(await evaluate('document.querySelector(".vgm-detail-heading").textContent==="相机" && document.querySelector(".vgm-point.is-selected").dataset.vgmDetailPoint===vgmSavedPoint && document.querySelector(\'[data-vgm-topic="control.camera"]\').open'), '切回大类恢复子类、技术点与展开状态');
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
  await route('#/video-generation/view.architecture?topic=architecture.attention', '视频生成技术汇总');
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
  await evaluate('window.scrollTo({top:document.querySelector(".data-processing-lane[data-pipeline=single]").getBoundingClientRect().top+scrollY-75,behavior:"instant"});window.mobileDataViewport=document.querySelector(".data-processing-lane[data-pipeline=single] .data-diagram-viewport");mobileDataViewport.scrollLeft=mobileDataViewport.scrollWidth');
  const mobileStagePosition = await evaluate('({y:scrollY,x:mobileDataViewport.scrollLeft})');
  for (const id of ['caption','condition_features']) {
    await evaluate(`document.querySelector('.data-processing-lane[data-pipeline=single] .data-process-step[data-step=${id}]').click()`);
    await waitFor(`!!document.querySelector('.data-stage-detail[data-step=${id}]')`);
    await delay(80);
    assert.ok(await evaluate(`Math.abs(scrollY-${mobileStagePosition.y})<=1 && document.querySelector('.data-processing-lane[data-pipeline=single] .data-diagram-viewport')===mobileDataViewport && mobileDataViewport.scrollLeft===${mobileStagePosition.x}`), '手机连续切换保留页面与图内滚动位置');
    assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  }
  await screenshot('data-stage-mobile');
  await evaluate('document.querySelector("#data-pipeline-diagrams").scrollIntoView({behavior:"instant"});document.querySelector("[data-diagram-select=multi]").click()');
  await waitFor('document.querySelector("#data-diagram-multi img").complete && document.querySelector("#data-diagram-multi img").naturalWidth>5000');
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'), '手机原图预览不溢出页面');
  await screenshot('data-pipelines-mobile');

  await route('#/video-generation', '视频生成技术汇总');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), '手机技术总览不横向溢出');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-mindmap").length'), 4);
  assert.ok(await evaluate('[...document.querySelectorAll(".vgm-mindmap-viewport")].every(viewport=>viewport.scrollWidth>viewport.clientWidth)'), '手机导图在各自视口内横向滚动');
  await screenshot('video-map-mobile');
  assert.ok(await evaluate('document.querySelector(".vgm-view-tabs").scrollWidth > document.querySelector(".vgm-view-tabs").clientWidth'), '手机分类按钮在栏内横向滚动');
  assert.ok(await evaluate('new Set([...document.querySelectorAll(".vgm-view-tab")].map(tab=>tab.getBoundingClientRect().top)).size===1'), '手机七个按钮保持单行');
  await evaluate('document.querySelector("[data-vgm-view=\\"view.capabilities\\"]").click()');
  await waitFor('document.querySelector(".vgm-view-intro h2")?.textContent === "能力与核心问题"');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-branch").length'), 12);
  assert.ok(await evaluate('(()=>{const tab=document.querySelector(".vgm-view-tab.is-current").getBoundingClientRect();const strip=document.querySelector(".vgm-view-tabs").getBoundingClientRect();return tab.left>=strip.left-1 && tab.right<=strip.right+1})()'), '手机选中的分类按钮保持可见');
  await evaluate('document.querySelectorAll(".vgm-branch > summary")[1].click()');
  await waitFor('!!document.querySelector(".vgm-detail-heading")');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), '手机分类树和资料面板不横向溢出');
  await evaluate('document.querySelector(".vgm-branch.is-selected .vgm-leaf").click()');
  assert.equal(await evaluate('document.querySelectorAll(".vgm-point.is-selected").length'), 1);
  await screenshot('video-map-category-mobile');
  await evaluate('document.querySelector("#menu-toggle").click(); document.querySelector(\'#navigation a[href="#/video-generation"]\').click()');
  await waitFor('document.querySelector("#main h1")?.textContent === "视频生成技术汇总" && !document.querySelector("#sidebar").classList.contains("mobile-open")');

  assert.deepEqual(exceptions, [], '浏览器执行异常');
  assert.deepEqual(failures, [], '资源请求失败');
  console.log('浏览器通过：9 个模块、数据流程、视频技术 7 色按钮/原位切换/每类 4 张思维导图/54 个子类与 191 个技术点联动、键盘、搜索、历史刷新、手机导图滚动和代理路径。');
  console.log(`截图：${output}`);
} finally {
  socket?.close();
  if (chrome.exitCode === null) chrome.kill();
  await new Promise(resolve => server.close(resolve));
  for (let i = 0; i < 30 && chrome.exitCode === null; i++) await delay(100);
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
}
