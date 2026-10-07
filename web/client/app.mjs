import { marked } from './vendor/marked.esm.js';
import { mountVideoMap, videoMapLink } from './video-map.mjs';
import { dataEngineeringView, mountDataDiagrams } from './data-engineering.mjs';
import { foundationView } from './foundation.mjs';
const main = document.querySelector('#main');
const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paths = {
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8zm-9 9 9 5 9-5M3 17l9 5 9-5"/>',
  compare: '<rect x="2" y="4" width="8" height="16" rx="2"/><rect x="14" y="4" width="8" height="16" rx="2"/><path d="m5 9 2 3-2 3m12-6 2 3-2 3"/>',
  rocket: '<path d="M9 15c-3-7 5-12 12-12 0 7-5 15-12 12Zm0 0-3 3M7 10H3l-1 6 6-1m6 2v4l-6 1 1-6"/><circle cx="16" cy="8" r="2"/>',
  loop: '<path d="M20 7a9 9 0 0 0-15-2L2 8m0-5v5h5m-3 9a9 9 0 0 0 15 2l3-3m0 5v-5h-5"/>',
  branches: '<circle cx="6" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M6 8v8m0-3c9 0 12-2 12-5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5M12 17.5h5"/>',
  file: '<path d="M14 2H5v20h14V7zm0 0v6h5M8 12h8M8 16h8"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external: '<path d="M14 3h7v7m0-7L10 14m-1-9H3v16h16v-6"/>',
  chart: '<path d="M4 3v18h17M8 16v-5m5 5V7m5 9V4"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  book: '<path d="M12 5c-4-3-8-2-10-1v16c3-2 6-2 10 0 4-2 7-2 10 0V4c-3-1-6-2-10 1zm0 0v15"/>',
  close: '<path d="m5 5 14 14M5 19 19 5"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
const docLink = (id, section = '') => `#/doc/${encodeURIComponent(id)}${section ? '?section=' + encodeURIComponent(section) : ''}`;
const moduleLink = id => `#/module/${id}`;
const isExternal = value => { try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password; } catch { return false; } };
const badge = status => `<span class="badge ${['协议可用', '平台入口', '代码入口', '入口已配置'].includes(status) ? 'badge-ready' : status === '正在开发' ? 'badge-dev' : 'badge-plan'}"><i></i>${esc(status)}</span>`;
let content, filter = 'all';
let routeToken = 0;
let disposePage;
function externalLink(url, label, cls = 'button button-primary') { return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ${icon('external')}</a>`; }
function documentAction(id, label = '阅读方案', cls = 'button button-secondary') { return content.documents[id] ? `<a class="${cls}" href="${docLink(id)}">${icon('file')}${esc(label)}</a>` : ''; }
function renderNavigation(active = '') {
  const stages = content.modules.filter(m => m.number);
  const shared = content.modules.filter(m => !m.number);
  document.querySelector('#navigation').innerHTML = `<a class="nav-item ${active === 'home' ? 'active' : ''}" href="#/">${icon('grid')}<span>研发总览</span></a><a class="nav-item ${active === 'tools' ? 'active' : ''}" href="#/tools">${icon('server')}<span>平台与工具</span></a><a class="nav-item ${active === 'video-generation' ? 'active' : ''}" href="#/video-generation">${icon('branches')}<span>视频生成技术汇总</span></a><div class="nav-label">研发流程 <span>01 — 06</span></div>${stages.map(m => `<a class="nav-item ${active === m.id ? 'active' : ''}" href="${moduleLink(m.id)}"><span class="nav-number">${m.number}</span><span>${m.title}</span>${active === m.id ? '<b class="nav-active-dot"></b>' : ''}</a>`).join('')}<div class="nav-label">跨流程共享能力</div>${shared.map(m => `<a class="nav-item ${active === m.id ? 'active' : ''}" href="${moduleLink(m.id)}">${icon(m.icon)}<span>${m.title}</span></a>`).join('')}<div class="nav-divider"></div><a class="nav-item ${active === 'architecture' ? 'active' : ''}" href="${docLink('AIGC-infra/README.md')}">${icon('book')}<span>架构与文档</span></a>`;
  document.querySelectorAll('.nav-item.active').forEach(el => el.setAttribute('aria-current', 'page'));
}
function breadcrumbs(...items) { document.querySelector('#breadcrumb').innerHTML = ['工作台', ...items].map(esc).join('<span>/</span>'); }
function toolCard(id) {
  const tool = content.tools[id];
  return `<article class="tool-card"><div class="tool-top"><span class="tool-icon">${icon(tool.icon)}</span>${badge(tool.status)}</div><div class="tool-kind">${esc(tool.kind)}</div><h3>${esc(tool.title)}</h3><p>${esc(tool.description)}</p>${tool.plan ? `<div class="plan-mini">${tool.plan.map((p, i) => `<span><b>${String(i + 1).padStart(2, '0')}</b>${esc(p)}</span>`).join('')}</div>` : ''}<div class="tool-actions">${tool.url && isExternal(tool.url) ? externalLink(tool.url, tool.linkLabel || '打开平台', 'button button-small button-primary') : ''}${documentAction(tool.doc, tool.status === '协议可用' ? '使用说明' : '阅读方案', 'button button-small button-secondary')}${tool.preview ? `<button class="button button-small button-secondary" data-preview="${id}">${icon('grid')}查看界面</button>` : ''}</div></article>`;
}
function workflowDiagram(stages) {
  const edge = (from, to, type, d, label = '', x = 0, y = 0) => `<g class="workflow-connection edge-${type}" data-from="${from}" data-to="${to}"><path d="${d}" marker-end="url(#workflow-arrow-${type})"/>${label ? `<text x="${x}" y="${y}">${label}</text>` : ''}</g>`;
  const edges = [
    edge('goals', 'data', 'main', 'M180 76H220'),
    edge('data', 'training', 'main', 'M380 76H420'),
    edge('training', 'evaluation', 'main', 'M580 76H620'),
    edge('evaluation', 'serving', 'pass', 'M780 76H820', '通过', 800, 60),
    edge('serving', 'feedback', 'main', 'M980 76H1020'),
    edge('evaluation', 'training', 'rework', 'M675 124V160H500V124', '未通过：改模型', 585, 153),
    edge('evaluation', 'data', 'rework', 'M715 124V192H300V124', '未通过：补数据', 505, 185),
    edge('serving', 'evaluation', 'rework', 'M900 124V160H745V124', '优化后回归评测', 825, 153),
    edge('feedback', 'goals', 'iteration', 'M1100 124V228H100V124', '下一轮迭代', 600, 221)
  ].join('');
  const markers = `<defs>${['main', 'pass', 'rework', 'iteration'].map(type => `<marker id="workflow-arrow-${type}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="arrow-${type}" d="M1 1L9 5L1 9Z"/></marker>`).join('')}</defs>`;
  return `<figure class="workflow-diagram"><div class="workflow-viewport" tabindex="0" aria-label="研发流程图，可横向滚动"><div class="workflow-canvas"><svg class="workflow-lines" viewBox="0 0 1200 262" preserveAspectRatio="none" role="img" aria-label="六个阶段从左到右展开；评测通过进入发布；下方箭头表示未通过返回模型或数据、优化后回归评测，以及运行反馈返回目标的下一轮迭代。">${markers}${edges}</svg>${stages.map(m => `<a class="workflow-step workflow-${m.id} tone-${m.id}" href="${moduleLink(m.id)}"><span class="step-number">${m.number}</span><span class="step-icon">${icon(m.icon)}</span><strong>${m.title}</strong><small>${m.english}</small></a>`).join('')}</div></div><figcaption class="workflow-legend"><span class="legend-main">研发主线</span><span class="legend-pass">评测通过</span><span class="legend-rework">未通过 / 回归评测</span><span class="legend-iteration">下一轮迭代</span></figcaption></figure>`;
}
function home() {
  renderNavigation('home'); breadcrumbs('研发总览');
  const stages = content.modules.filter(m => m.number), shared = content.modules.filter(m => !m.number);
  main.innerHTML = `<div class="page home-page"><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="small-dot"></span> AIGC RESEARCH · INFRASTRUCTURE</div><h1>从问题定义，<br>到可靠交付<span>。</span></h1><p>沿着视频生成研发的完整链路，找到每一步的工具、<br class="desktop-break">平台入口与建设方案。</p><div class="hero-actions"><a class="button button-primary" href="#/module/goals">开始了解研发流程 ${icon('arrow')}</a><a class="text-link" href="#/tools">浏览平台工具 ${icon('external')}</a></div><div class="hero-meta"><span><b>06</b> 研发阶段</span><i></i><span><b>03</b> 共享能力</span><i></i><span>目标 · 资产 · 证据</span></div></div><div class="hero-visual" aria-label="项目协议连接目标、执行和证据"><div class="visual-grid"></div><div class="visual-heading"><span>ONE CONNECTED WORKFLOW</span><span class="visual-plus">＋</span></div><div class="visual-node visual-goal">${icon('target')}<div><small>DEFINE THE PROBLEM</small><strong>目标与验收</strong></div><span>01</span></div><div class="visual-connector"><span></span><i></i><span></span></div><div class="visual-pair"><div>${icon('database')}<span>数据与资产</span></div><div>${icon('layers')}<span>实验与模型</span></div></div><div class="visual-connector"><span></span><i></i><span></span></div><div class="visual-node visual-evidence">${icon('compare')}<div><small>RETURN TO EVIDENCE</small><strong>评测与证据</strong></div><span>04</span></div><div class="visual-caption"><span class="small-dot"></span> algorithm-template 贯穿研发过程</div></div></section>
  <section class="workflow-section" id="workflow"><div class="section-header"><div><div class="eyebrow">THE RESEARCH LOOP</div><h2>一条主线，持续迭代</h2></div><p>先验证，再规模化。评测贯穿实验与优化。</p></div>${workflowDiagram(stages)}</section>
  <section><div class="section-header"><div><div class="eyebrow">EXPLORE EACH STAGE</div><h2>每一步，都有清晰的产物</h2></div><a class="text-link" href="${docLink('AIGC-infra/README.md')}">查看全局架构 ${icon('external')}</a></div><div class="stage-grid">${stages.map(m => `<a class="stage-card tone-${m.id}" href="${moduleLink(m.id)}"><div class="stage-card-top"><span class="stage-icon">${icon(m.icon)}</span><span class="stage-index">${m.number} / ${m.english}</span></div><h3>${m.title} ${icon('arrow')}</h3><p>${m.description}</p><div class="stage-output"><span>阶段产物</span>${m.output}</div></a>`).join('')}</div></section>
  <section class="shared-section"><div class="section-header"><div><div class="eyebrow">ACROSS THE WORKFLOW</div><h2>共享能力，连接整个研发过程</h2></div><span class="subtle-label">跨阶段复用</span></div><div class="shared-grid">${shared.map(m => `<a class="shared-card" href="${moduleLink(m.id)}"><span class="shared-icon">${icon(m.icon)}</span><h3>${m.title}${icon('arrow')}</h3><p>${m.description}</p></a>`).join('')}</div></section>
  <section class="dashboard-callout"><div><div class="eyebrow">PROJECTS & GOALS</div><h2>目标留在项目里，<br>视野汇总到算法组。</h2><p>每个项目从 algorithm-template 初始化。未来通过算法组 dashboard，统一查看各项目的目标与证据。</p><a class="button button-light" href="#/module/goals">查看协议与建设计划 ${icon('arrow')}</a></div><div class="dashboard-plan">${badge('正在开发')}<h3>算法组项目与 Goals</h3><ol><li>项目登记与协议读取</li><li>目标、源文档与证据汇总</li><li>变更刷新与真实入口接入</li></ol></div></section></div>`;
}
function modulePage(module, params = new URLSearchParams()) {
  if (module.id === 'foundation') return foundationPage(module);
  renderNavigation(module.id); breadcrumbs(module.number ? '研发流程' : '共享能力', module.title);
  const facts = Object.entries(module.facts).filter(([key]) => ['职责', '输入 → 输出', 'Infra 用途', '项目关联', '边界'].includes(key));
  const data = module.dataArchitecture ? dataEngineeringView(module.dataArchitecture, { content, esc, icon, docLink, moduleLink, externalLink, params }) : null;
  const tabs = data ? '<a href="#data-overview">能力与工具</a><a href="#data-processing">数据处理管线</a>' : `<a href="#module-tools">平台与工具 <span>${module.tools.length}</span></a>`;
  main.innerHTML = `<div class="page module-page tone-${module.id}${data ? ' data-engineering-page' : ''}"><div class="module-topline"><a class="text-link" href="#/">← 研发总览</a>${badge(module.status)}</div><section class="module-hero"><div><div class="eyebrow">${module.number || 'SHARED'} / ${module.english}</div><h1>${module.title}</h1><p class="module-tagline">${module.tagline}</p><p class="module-description">${module.description}</p></div><span class="module-hero-icon">${icon(module.icon)}</span></section><div class="module-tabs">${tabs}${data ? '' : '<a href="#module-context">职责与边界</a>'}<a href="#module-documents">方案文档 <span>${module.documents.length}</span></a></div>
  ${data ? data.diagrams : `<section id="module-tools"><div class="section-header"><div><div class="eyebrow">TOOLS & PLATFORMS</div><h2>这一阶段，使用哪些工具</h2></div><span class="subtle-label">已知入口直接跳转 · 规划能力阅读方案</span></div><div class="tool-grid">${module.tools.map(toolCard).join('')}</div></section>`}
  ${module.id === 'evaluation' && content.tools['prim-eval'].preview ? `<section class="preview-section" id="interface-preview"><div class="section-header"><div><div class="eyebrow">INTERFACE REFERENCE</div><h2>Prim Eval · 界面快照</h2></div>${externalLink(content.tools['prim-eval'].url, '打开真实平台', 'text-link')}</div><div class="browser-frame"><div class="browser-chrome"><span class="traffic-dots">● ● ●</span><span>Prim Eval / Arena</span><span class="readonly-label">本地只读快照</span></div><iframe src="./${content.tools['prim-eval'].preview}" title="Prim Eval 本地只读界面快照" sandbox="" loading="lazy"></iframe></div><p class="caption">来自保存的 Prim Eval 页面，仅作界面参考；平台操作与实时数据请进入真实平台。</p><details class="reference-gallery"><summary>查看 Jira 需求中的报表与评分界面参考</summary><div class="reference-images"><figure><img src="./images/eval-dashboard.png" alt="Jira 需求中多模型维度评分与数量报表参考" loading="lazy"><figcaption>报表展示参考 · 后期进阶功能</figcaption></figure><figure><img src="./images/eval-scores.png" alt="Jira 需求中逐视频多维评分明细参考" loading="lazy"><figcaption>多维打分展示参考 · 已提需求</figcaption></figure></div></details></section>` : ''}
  ${data ? '' : `<section id="module-context"><div class="section-header"><div><div class="eyebrow">CONTEXT & BOUNDARIES</div><h2>职责、产物与协作边界</h2></div>${documentAction(module.readme, '完整模块说明', 'text-link')}</div><div class="context-layout"><div class="fact-list">${facts.length ? facts.map(([key, value]) => `<div class="fact-row"><h3>${esc(key)}</h3><div>${renderMarkdown(value, module.readme)}</div></div>`).join('') : `<div class="fact-row"><h3>职责</h3><p>${module.description}</p></div><div class="fact-row"><h3>输入 → 输出</h3><p>${module.output}</p></div>`}</div><aside class="process-panel"><div class="eyebrow">WORKFLOW</div><h3>如何开展这一阶段</h3><ol>${module.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><div class="process-output"><small>阶段产物</small><p>${module.output}</p></div></aside></div></section>`}
  <section id="module-documents"><div class="section-header"><div><div class="eyebrow">PLANS & DOCUMENTATION</div><h2>阅读完整方案</h2></div><span class="subtle-label">与仓库 Markdown 保持一致</span></div><div class="document-list">${module.documents.map(d => `<a class="document-row" href="${docLink(d.id)}"><span class="document-icon">${icon('file')}</span><div><h3>${esc(d.title)}</h3><small>${esc(d.id.split('/').at(-1))}</small></div><span class="document-type">${d.id.includes('requirements') ? '需求' : d.id.includes('design') ? '设计' : '说明'}</span>${icon('arrow')}</a>`).join('')}</div></section>${module.number ? `<nav class="stage-pagination" aria-label="阶段切换">${[Number(module.number) - 2, Number(module.number)].map((index, i) => { const m = content.modules[index]; return m?.number ? `<a href="${moduleLink(m.id)}"><small>${i ? '下一阶段' : '上一阶段'}</small><span>${i ? '' : '← '}${m.number} ${m.title}${i ? ' →' : ''}</span></a>` : '<span></span>'; }).join('')}</nav>` : ''}</div>`;
  main.querySelectorAll('.module-tabs a').forEach(el => el.addEventListener('click', event => { event.preventDefault(); main.querySelector(el.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  if (data) mountDataDiagrams(main);
}
function updateDataStage(params) {
  const architecture = content.modules.find(module => module.id === 'data').dataArchitecture;
  const view = dataEngineeringView(architecture, { content, esc, icon, docLink, moduleLink, externalLink, params });
  main.querySelector('#data-stage-detail').outerHTML = view.detail;
  main.querySelectorAll('.data-process-step').forEach(step => {
    const active = step.closest('.data-processing-lane').dataset.pipeline === view.selectedLaneId && step.dataset.step === view.selectedId;
    step.classList.toggle('is-active', active);
    if (active) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
}
function resolveLink(href, currentDoc) {
  if (!href) return null;
  if (isExternal(href)) return { href, external: true };
  if (href.startsWith('#')) return { href: '#' + href.slice(1), anchor: true };
  try {
    const u = new URL(href.replace(/\\/g, '/'), 'https://documents.invalid/' + currentDoc);
    if (u.origin !== 'https://documents.invalid') return null;
    const id = decodeURIComponent(u.pathname.slice(1));
    if (content.documents[id]) return { href: docLink(id, decodeURIComponent(u.hash.slice(1))) };
    const diagram = content.modules.find(module => module.id === 'data').dataArchitecture.lanes.flatMap(lane => [lane.diagram.image, lane.diagram.pdf]).find(asset => id === 'AIGC-infra/img/' + asset.split('/').at(-1));
    if (diagram) return { href: './' + diagram, external: true };
  } catch { /* Unresolved source references are displayed without a broken URL. */ }
  return null;
}
const safeTags = new Set('p h1 h2 h3 h4 h5 h6 strong em b i a ul ol li blockquote pre code table thead tbody tr th td hr br span div details summary img del'.split(' '));
export function renderMarkdown(text, currentDoc) {
  if (['yaml', 'json'].includes(content.documents[currentDoc]?.format)) return `<pre><code>${esc(text)}</code></pre>`;
  const raw = marked.parse(text.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n/, ''));
  const doc = new DOMParser().parseFromString(raw, 'text/html');
  function clean(node) {
    if (node.nodeType === Node.TEXT_NODE) return esc(node.textContent);
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const tag = node.tagName.toLowerCase();
    if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta'].includes(tag)) return '';
    let children = [...node.childNodes].map(clean).join('');
    if (!safeTags.has(tag)) return children;
    let attrs = '';
    if (tag === 'a') {
      const anchor = node.getAttribute('id');
      if (!node.getAttribute('href') && /^[a-zA-Z][\w-]*$/.test(anchor || '')) return `<span id="${esc(anchor)}">${children}</span>`;
      const resolved = resolveLink(node.getAttribute('href'), currentDoc);
      if (!resolved) return `<span class="unavailable-reference" title="源材料暂未收录到网页">${children}<span class="reference-label">源资料</span></span>`;
      attrs = ` href="${esc(resolved.href)}"${resolved.external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
    }
    if (tag === 'img') {
      const source = node.getAttribute('src') || '';
      if (!/^\.?\/?images\/[\w.-]+$/.test(source)) return `<span class="unavailable-reference">${esc(node.getAttribute('alt') || '图示见源材料')}</span>`;
      attrs = ` src="${esc(source)}" alt="${esc(node.getAttribute('alt') || '')}" loading="lazy"`;
    }
    if (['th', 'td'].includes(tag)) for (const name of ['colspan', 'rowspan']) { const n = node.getAttribute(name); if (/^\d{1,2}$/.test(n || '')) attrs += ` ${name}="${n}"`; }
    if (tag === 'code' && node.className === 'language-mermaid') return `<code class="language-mermaid">${children}</code>`;
    if (tag === 'table') return `<div class="table-scroll"><table>${children}</table></div>`;
    return `<${tag}${attrs}>${children}${['hr', 'br', 'img'].includes(tag) ? '' : `</${tag}>`}`;
  }
  return [...doc.body.childNodes].map(clean).join('');
}
function enhanceDocument() {
  const reader = main.querySelector('.markdown');
  const headings = reader.querySelectorAll('h1,h2,h3,h4');
  const used = new Map();
  for (const heading of headings) {
    let slug = heading.textContent.replace(/[^\p{L}\p{N}_\-\s]/gu, '').trim().toLowerCase().replace(/\s/g, '-');
    const count = used.get(slug) || 0; used.set(slug, count + 1);
    heading.id = slug + (count ? '-' + count : '');
  }
  main.querySelector('#document-toc').innerHTML = [...reader.querySelectorAll('h2,h3')].map(h => `<a class="toc-${h.tagName.toLowerCase()}" href="#${esc(h.id)}">${esc(h.textContent)}</a>`).join('') || '<span>此文档没有章节目录</span>';
  for (const el of main.querySelectorAll('#document-toc a,.markdown a[href^="#"]')) {
    if (el.getAttribute('href').startsWith('#/')) continue;
    el.addEventListener('click', event => { event.preventDefault(); const id = decodeURIComponent(el.getAttribute('href').slice(1)); const target = document.getElementById(id); target?.scrollIntoView({ behavior: 'smooth' }); });
  }
  for (const code of reader.querySelectorAll('code.language-mermaid')) {
    const source = code.textContent;
    const names = Object.fromEntries([...source.matchAll(/([A-Za-z]\w*)\[([^\]]+)\]/g)].map(m => [m[1], m[2]]));
    const edges = [];
    for (const line of source.split('\n')) {
      const m = line.trim().match(/^([A-Za-z]\w*)(?:\[[^\]]+\])?\s*(?:-->|-\.->)(?:\|([^|]+)\|)?\s*([A-Za-z]\w*)/);
      if (m) edges.push({ from: names[m[1]] || m[1], to: names[m[3]] || m[3], label: m[2] || '' });
    }
    if (edges.length) code.closest('pre').outerHTML = `<div class="document-diagram" aria-label="文档流程关系">${edges.map(e => `<div><strong>${esc(e.from)}</strong><span>${e.label ? `<small>${esc(e.label)}</small>` : ''}→</span><strong>${esc(e.to)}</strong></div>`).join('')}</div>`;
  }
}
function foundationPage(module, section) {
  renderNavigation(module.id); breadcrumbs('共享能力', module.title);
  main.innerHTML = foundationView(module, { content, esc, icon, moduleLink, renderMarkdown });
  if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
}
function documentPage(id, section) {
  const doc = content.documents[id];
  if (!doc) return notFound('这份文档尚未收录。');
  const module = content.modules.find(m => m.documents.some(d => d.id === id));
  if (module?.id === 'foundation' && id === module.readme) return foundationPage(module, section);
  const videoDoc = id.startsWith('AIGC-infra/vgm-map/');
  renderNavigation(videoDoc ? 'video-generation' : module?.id || 'architecture'); breadcrumbs(videoDoc ? '视频生成技术汇总' : module?.title || (doc.scope === 'algorithm-template' ? '项目协议' : '架构与文档'), doc.title);
  main.innerHTML = `<div class="page doc-page"><div class="doc-topline"><a class="text-link" href="${videoDoc ? videoMapLink() : module ? moduleLink(module.id) : '#/'}">← ${videoDoc ? '视频生成技术汇总' : module?.title || '研发总览'}</a><button class="button button-small button-secondary" data-download="${esc(id)}">下载源文件 ↓</button></div><div class="doc-heading"><div class="eyebrow">${doc.scope === 'algorithm-template' ? 'ALGORITHM TEMPLATE · 项目协议模板' : 'PLANS & DOCUMENTATION'}</div><h1>${esc(doc.title)}</h1><span class="document-path">${esc(id)}</span>${doc.scope === 'algorithm-template' ? '<p class="document-note">模板说明与填写约定；真实项目目标以各项目仓库为准。</p>' : ''}</div><div class="reader-layout"><article class="markdown">${renderMarkdown(doc.text, id)}</article><aside class="document-outline"><span>本页目录</span><nav id="document-toc" aria-label="文档章节"></nav></aside></div></div>`;
  main.querySelector('.markdown > h1')?.remove(); enhanceDocument();
  if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
}
function toolsPage() {
  renderNavigation('tools'); breadcrumbs('平台与工具');
  const list = Object.values(content.tools).filter(t => filter === 'all' || filter === 'entry' && t.url && !t.linkLabel || filter === 'protocol' && t.status === '协议可用' || filter === 'plan' && ['正在开发', '已提需求', '方案阶段', '待配置入口'].includes(t.status));
  main.innerHTML = `<div class="page tools-page"><div class="page-heading"><div class="eyebrow">PLATFORM DIRECTORY</div><h1>平台与工具</h1><p>已有入口直接进入，尚在建设的能力先阅读方案。</p></div><div class="filter-bar">${[['all', '全部工具'], ['entry', '平台与代码入口'], ['protocol', '文档协议'], ['plan', '规划与待接入']].map(([key, label]) => `<button class="filter-button ${filter === key ? 'selected' : ''}" data-filter="${key}" aria-pressed="${filter === key}">${label}</button>`).join('')}<span>${list.length} 项</span></div><div class="tool-grid tool-directory">${list.map(t => toolCard(t.id)).join('')}</div></div>`;
}
function videoGenerationPage(viewId, query) {
  const map = content.videoMap;
  if (!map || viewId && !map.views.some(view => view.id === viewId)) return notFound('没有找到这个技术分类。');
  renderNavigation('video-generation');
  breadcrumbs('视频生成技术汇总');
  const params = new URLSearchParams(query);
  disposePage = mountVideoMap(main, map, { esc, icon, docLink }, { viewId, topicId: params.get('topic'), point: params.get('point'), work: params.get('work') });
}
function notFound(message = '没有找到这个页面。') { renderNavigation(); breadcrumbs('页面未找到'); main.innerHTML = `<div class="page empty-state">${icon('file')}<h1>${message}</h1><p>可从研发总览重新进入，或通过搜索查找相关文档。</p><a class="button button-primary" href="#/">返回研发总览</a></div>`; }
function route() {
  disposePage?.(); disposePage = undefined;
  const token = ++routeToken;
  document.querySelector('#sidebar').classList.remove('mobile-open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
  const [rawPath, query = ''] = location.hash.replace(/^#/, '').split('?');
  const path = rawPath || '/';
  try {
    const params = new URLSearchParams(query);
    if (path === '/module/data' && main.querySelector('.data-engineering-page') && (!params.get('section') || params.get('section') === 'data-stage-detail')) {
      updateDataStage(params);
      document.querySelector('#search-dialog').close();
      return;
    }
    if (path === '/') home();
    else if (path === '/tools') toolsPage();
    else if (path === '/video-generation' || path.startsWith('/video-generation/')) videoGenerationPage(decodeURIComponent(path.slice('/video-generation/'.length)), query);
    else if (path.startsWith('/module/')) { const m = content.modules.find(m => m.id === path.slice(8)); m ? modulePage(m, new URLSearchParams(query)) : notFound(); }
    else if (path.startsWith('/doc/')) documentPage(decodeURIComponent(path.slice(5)), new URLSearchParams(query).get('section'));
    else notFound();
  } catch (err) { console.error(err); notFound('页面暂时无法加载。'); }
  document.title = `${main.querySelector('h1')?.textContent.replace(/\s/g, '') || '研发总览'} · AIGC Infra`;
  window.scrollTo(0, 0);
  if (path.startsWith('/module/')) {
    const section = new URLSearchParams(query).get('section');
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }));
  }
  if (token === routeToken) document.querySelector('#search-dialog').close();
}
function notify(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('visible'); setTimeout(() => toast.classList.remove('visible'), 3500); }
function search(query = '') {
  const term = query.trim().toLowerCase();
  const options = [ ...content.modules.map(m => ({ title: m.title, type: '模块', text: m.description, href: moduleLink(m.id) })), ...Object.values(content.tools).map(t => ({ title: t.title, type: '工具', text: t.description, href: docLink(t.doc) })), ...content.videoMap.views.flatMap(view => view.subclasses.map(topic => ({ title: topic.label, type: '技术', text: view.label + ' ' + topic.summary + ' ' + topic.subdivisions.join(' ') + ' ' + topic.works.map(work => work.label + ' ' + work.title).join(' '), href: videoMapLink(view.id, topic.id) }))), ...Object.values(content.documents).map(d => ({ title: d.title, type: d.scope === 'algorithm-template' ? '协议' : '文档', text: d.text, href: docLink(d.id) })) ];
  const results = options.filter(o => !term || (o.title + ' ' + o.text).toLowerCase().includes(term)).sort((a, b) => Number(b.title.toLowerCase().includes(term)) - Number(a.title.toLowerCase().includes(term))).slice(0, 16);
  document.querySelector('#search-results').innerHTML = results.map(o => `<a href="${o.href}" class="search-result"><span class="result-type">${o.type}</span><div><strong>${esc(o.title)}</strong><small>${esc(o.text.replace(/[#*`\n]/g, '').slice(0, 75))}…</small></div>${icon('arrow')}</a>`).join('') || '<div class="search-empty">没有找到相关内容，试试其他关键词。</div>';
}
document.addEventListener('click', event => {
  const preview = event.target.closest('[data-preview]');
  if (preview) {
    if (location.hash.startsWith('#/module/evaluation')) main.querySelector('#interface-preview')?.scrollIntoView({ behavior: 'smooth' });
    else location.hash = '#/module/evaluation?section=interface-preview';
  }
  const option = event.target.closest('[data-filter]'); if (option) { filter = option.dataset.filter; toolsPage(); }
  const download = event.target.closest('[data-download]');
  if (download) { const doc = content.documents[download.dataset.download]; const url = URL.createObjectURL(new Blob([doc.text], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = doc.id.split('/').at(-1); a.click(); setTimeout(() => URL.revokeObjectURL(url), 500); notify('已下载文档源文件'); }
});
const dialog = document.querySelector('#search-dialog');
const openSearch = () => { dialog.showModal(); search(); document.querySelector('#search-input').value = ''; document.querySelector('#search-input').focus(); };
document.querySelector('#search-open').addEventListener('click', openSearch);
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); main.focus(); main.scrollIntoView(); });
document.querySelector('#search-close').addEventListener('click', () => dialog.close());
document.querySelector('#search-input').addEventListener('input', e => search(e.target.value));
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
document.querySelector('#menu-toggle').addEventListener('click', e => { const open = document.querySelector('#sidebar').classList.toggle('mobile-open'); e.currentTarget.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (content) openSearch(); } if (e.key === 'Escape') { document.querySelector('#sidebar').classList.remove('mobile-open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false'); } });
try {
  const response = await fetch('./data/content.json');
  if (!response.ok) throw new Error('Content failed');
  content = await response.json();
  window.addEventListener('hashchange', route); route();
} catch (err) { main.innerHTML = '<div class="page empty-state"><h1>文档内容暂时无法载入</h1><p>请确认已执行构建，并通过 HTTP 网页服务打开。</p><button class="button button-primary" id="reload">重新加载</button></div>'; document.querySelector('#reload').onclick = () => location.reload(); console.error(err); }
