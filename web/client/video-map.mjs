export function videoMapLink(viewId = '', topicId = '', point = '', work = '') {
  const query = new URLSearchParams();
  if (topicId) query.set('topic', topicId);
  if (point) query.set('point', point);
  if (work) query.set('work', work);
  return '#/video-generation' + (viewId ? '/' + encodeURIComponent(viewId) : '') + (query.size ? '?' + query : '');
}

const normalize = value => String(value || '').normalize('NFKC').toLowerCase();
export function searchVideoMap(map, query) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const matches = text => terms.every(term => normalize(text).includes(term));
  return map.views.flatMap(view => view.subclasses.flatMap(topic => {
    const text = [view.label, view.english, topic.label, topic.id, topic.summary, ...topic.subdivisions, ...topic.works.flatMap(work => [work.label, work.title, work.rationale])].join(' ');
    if (!matches(text)) return [];
    const point = topic.subdivisions.find(matches) || '';
    const work = topic.works.find(work => matches([work.label, work.title, work.rationale].join(' ')));
    return [{ viewId: view.id, viewLabel: view.label, topicId: topic.id, label: topic.label, summary: topic.summary, match: point || work?.label || '', href: videoMapLink(view.id, topic.id, point, work?.source_id) }];
  }));
}

export function mountVideoMap(container, map, { esc, icon, docLink }, { viewId = '', topicId = '', point = '', work = '' } = {}) {
  const view = map.views.find(item => item.id === viewId);
  let selectedId = view?.subclasses.find(item => item.id === topicId)?.id || view?.subclasses[0].id;
  let selectedPoint = point, selectedWork = work;
  const title = view ? view.label : '视频生成技术汇总';
  const allViews = map.views.map(item => `<a class="vgm-view-tab vgm-tone-${item.key}${view?.id === item.id ? ' is-current' : ''}" href="${videoMapLink(item.id)}"${view?.id === item.id ? ' aria-current="page"' : ''}>${icon(item.icon)}${esc(item.label)}<span>${item.subclasses.length}</span></a>`).join('');
  const header = `<header class="vgm-header"><div class="vgm-topline">${view ? `<a class="text-link" href="${videoMapLink()}">← 全部技术分类</a>` : '<span class="eyebrow">VIDEO GENERATION · KNOWLEDGE MAP</span>'}<span class="vgm-date">资料核验 ${esc(map.checkedOn)}</span></div><div class="vgm-title-row"><div>${view ? `<div class="eyebrow">${esc(view.english)}</div>` : ''}<h1>${esc(title)}</h1><p>${esc(view ? view.description : '从七个视角理解视频生成。展开技术分支，连接概念、方法与代表论文。')}</p></div><span class="vgm-header-icon">${icon(view?.icon || 'branches')}</span></div>${view ? `<nav class="vgm-view-tabs" aria-label="切换技术分类">${allViews}</nav>` : `<div class="vgm-stat-strip">${[['views', '技术视角'], ['subclasses', '子类'], ['points', '展开技术点'], ['works', '代表作']].map(([key, label]) => `<span><b>${map.stats[key]}</b>${label}</span>`).join('')}<a class="text-link" href="${docLink(map.catalogDoc)}">阅读完整资料 ${icon('arrow')}</a></div>`}<div class="vgm-search-wrap"><label class="vgm-search">${icon('search')}<input type="search" id="vgm-search" placeholder="搜索子类、技术点或代表作，例如：相机、缓存、TeaCache" aria-label="搜索视频生成技术"><kbd>/</kbd></label><span class="vgm-search-hint">跨七个分类查找</span></div><div id="vgm-search-status" class="vgm-search-status" role="status" aria-live="polite"></div><div id="vgm-search-results" class="vgm-search-results" hidden></div></header>`;

  function overview() {
    return `<section class="vgm-overview" aria-label="七个技术分类">${map.views.map((item, index) => `<article class="vgm-category vgm-tone-${item.key}"><div class="vgm-category-top"><span class="vgm-category-icon">${icon(item.icon)}</span><span class="vgm-index">${String(index + 1).padStart(2, '0')} / ${esc(item.english)}</span><span class="vgm-count">${item.subclasses.length} 个子类</span></div><a class="vgm-category-heading" href="${videoMapLink(item.id)}"><h2>${esc(item.label)}</h2>${icon('arrow')}</a><p class="vgm-category-question">${esc(item.question)}</p><p class="vgm-category-description">${esc(item.description)}</p><div class="vgm-category-topics">${item.subclasses.map(topic => `<a href="${videoMapLink(item.id, topic.id)}">${esc(topic.label)}</a>`).join('')}</div><a class="vgm-category-explore" href="${videoMapLink(item.id)}">展开分类树 ${icon('arrow')}</a></article>`).join('')}</section><div class="vgm-reading-note">${icon('branches')}<p>七个视角可以交叉。同一作品可能同时涉及任务、结构、时序和训练；展开子类后，可查看它在当前分类中的具体贡献。</p><a href="${docLink(map.sourcesDoc)}">来源目录 ↗</a></div>`;
  }

  function tree() {
    return `<div class="vgm-explorer vgm-tone-${view.key}"><aside class="vgm-tree-panel" aria-label="${esc(view.label)}分类树"><div class="vgm-tree-toolbar"><span>技术分支</span><div><button type="button" data-vgm-expand="all">展开全部</button><button type="button" data-vgm-expand="none">收起</button></div></div><div class="vgm-tree-root">${icon(view.icon)}<div><strong>${esc(view.label)}</strong><small>${view.subclasses.length} 个子类 · 逐层展开</small></div></div><div class="vgm-tree-scroll"><ul class="vgm-tree">${view.subclasses.map(topic => `<li><details class="vgm-branch${topic.id === selectedId ? ' is-selected' : ''}" data-vgm-topic="${esc(topic.id)}"${topic.id === selectedId ? ' open' : ''}><summary aria-controls="vgm-detail"><span class="vgm-branch-name">${esc(topic.label)}</span><span class="vgm-branch-count">${topic.subdivisions.length}</span></summary><ul class="vgm-leaves">${topic.subdivisions.map(label => `<li><button type="button" class="vgm-leaf" data-vgm-point="${esc(label)}">${esc(label)}</button></li>`).join('')}</ul></details></li>`).join('')}</ul></div><a class="vgm-tree-doc" href="${docLink('AIGC-infra/vgm-map/' + view.doc_path)}">${icon('book')}阅读专题资料 ${icon('external')}</a></aside><article class="vgm-detail" id="vgm-detail" aria-label="子类技术内容"></article></div>`;
  }

  container.innerHTML = `<div class="page vgm-page${view ? ' vgm-topic-page' : ''}">${header}${view ? tree() : overview()}</div>`;
  const searchInput = container.querySelector('#vgm-search');
  const searchResults = container.querySelector('#vgm-search-results');
  const searchStatus = container.querySelector('#vgm-search-status');

  function paper(item) {
    return `<li class="vgm-work${selectedWork === item.source_id ? ' is-highlighted' : ''}" data-vgm-work="${esc(item.source_id)}"><div class="vgm-work-meta"><span class="vgm-role vgm-role-${esc(item.role)}">${esc(item.roleLabel)}</span><span>${item.first_submission_year || '官方项目'}</span></div><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(item.label)}</strong>${icon('external')}</a><p>${esc(item.rationale)}</p></li>`;
  }

  function detail(topic) {
    if (!topic.subdivisions.includes(selectedPoint)) selectedPoint = '';
    if (!topic.works.some(item => item.source_id === selectedWork)) selectedWork = '';
    const index = view.subclasses.indexOf(topic);
    const rest = topic.works.slice(3);
    const catalogLink = docLink(map.catalogDoc, topic.id.replaceAll('.', '-'));
    return `<div class="vgm-detail-top"><span class="eyebrow">${String(index + 1).padStart(2, '0')} / ${esc(view.label)}</span><span>${topic.subdivisions.length} 个技术点 · ${topic.works.length} 项代表作</span></div><h2 class="vgm-detail-heading">${esc(topic.label)}</h2><p class="vgm-topic-summary">${esc(topic.summary)}</p><section class="vgm-points-section"><div class="vgm-section-title"><h3>技术点展开</h3><span>点击分支定位</span></div><div class="vgm-points">${topic.subdivisions.map((label, i) => `<button type="button" class="vgm-point${label === selectedPoint ? ' is-selected' : ''}" data-vgm-detail-point="${esc(label)}" aria-pressed="${label === selectedPoint}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(label)}</strong>${icon('branches')}</button>`).join('')}</div>${topic.concepts.length ? `<details class="vgm-concepts"><summary>相关概念 <span>${topic.concepts.length}</span></summary><dl>${topic.concepts.map(concept => `<div><dt>${esc(concept.label)}</dt><dd>${esc(concept.summary)}</dd></div>`).join('')}</dl></details>` : ''}</section>${topic.groups?.length ? `<section class="vgm-cache"><h3>进一步分组：缓存</h3><div>${topic.groups.flatMap(group => group.works.map(item => `<p><strong>${esc(item.label)}</strong><span>${esc(item.rationale)}</span></p>`)).join('')}</div></section>` : ''}<section class="vgm-works-section"><div class="vgm-section-title"><h3>代表作与贡献</h3><a class="text-link" href="${catalogLink}">查看完整条目 ${icon('arrow')}</a></div><ul class="vgm-works">${topic.works.slice(0, 3).map(paper).join('')}</ul>${rest.length ? `<details class="vgm-more-works"${rest.some(item => item.source_id === selectedWork) ? ' open' : ''}><summary>查看其余 ${rest.length} 项代表作</summary><ul class="vgm-works">${rest.map(paper).join('')}</ul></details>` : ''}</section>${topic.note ? `<details class="vgm-boundary"><summary>适用范围与分类边界</summary><p>${esc(topic.note)}</p></details>` : ''}<nav class="vgm-topic-pagination" aria-label="切换子类">${[view.subclasses[index - 1], view.subclasses[index + 1]].map((item, i) => item ? `<a href="${videoMapLink(view.id, item.id)}"><small>${i ? '下一子类' : '上一子类'}</small><span>${i ? '' : '← '}${esc(item.label)}${i ? ' →' : ''}</span></a>` : '<span></span>').join('')}</nav>`;
  }

  function selectTopic(id, nextPoint = '', nextWork = '', updateHistory = true) {
    const topic = view.subclasses.find(item => item.id === id);
    if (!topic) return;
    selectedId = id; selectedPoint = nextPoint; selectedWork = nextWork;
    container.querySelector('#vgm-detail').innerHTML = detail(topic);
    for (const branch of container.querySelectorAll('.vgm-branch')) {
      const active = branch.dataset.vgmTopic === id;
      branch.classList.toggle('is-selected', active);
      for (const leaf of branch.querySelectorAll('.vgm-leaf')) {
        const selected = active && leaf.dataset.vgmPoint === selectedPoint;
        leaf.classList.toggle('is-selected', selected);
        leaf.setAttribute('aria-pressed', String(selected));
      }
    }
    if (updateHistory) {
      const hash = videoMapLink(view.id, selectedId, selectedPoint, selectedWork);
      if (location.hash !== hash) history.pushState(null, '', hash);
    }
  }
  if (view) selectTopic(selectedId, selectedPoint, selectedWork, false);

  function onClick(event) {
    const expand = event.target.closest('[data-vgm-expand]');
    if (expand) for (const branch of container.querySelectorAll('.vgm-branch')) branch.open = expand.dataset.vgmExpand === 'all';
    const summary = event.target.closest('.vgm-branch > summary');
    if (summary) selectTopic(summary.parentElement.dataset.vgmTopic);
    const leaf = event.target.closest('[data-vgm-point]');
    if (leaf) selectTopic(leaf.closest('.vgm-branch').dataset.vgmTopic, leaf.dataset.vgmPoint);
    const pointButton = event.target.closest('[data-vgm-detail-point]');
    if (pointButton) {
      const label = pointButton.dataset.vgmDetailPoint;
      selectedPoint = label === selectedPoint ? '' : label;
      for (const button of container.querySelectorAll('[data-vgm-detail-point]')) {
        const selected = button.dataset.vgmDetailPoint === selectedPoint;
        button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected));
      }
      const branch = [...container.querySelectorAll('.vgm-branch')].find(item => item.dataset.vgmTopic === selectedId);
      branch.open = true;
      for (const button of branch.querySelectorAll('.vgm-leaf')) {
        const selected = button.dataset.vgmPoint === selectedPoint;
        button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected));
      }
      const hash = videoMapLink(view.id, selectedId, selectedPoint, selectedWork);
      if (location.hash !== hash) history.pushState(null, '', hash);
    }
  }
  function onSearch() {
    const query = searchInput.value.trim();
    searchResults.hidden = !query;
    if (!query) { searchResults.innerHTML = ''; searchStatus.textContent = ''; return; }
    const results = searchVideoMap(map, query);
    searchStatus.textContent = results.length ? `找到 ${results.length} 个相关子类` : '没有找到相关内容，试试其他技术点或作品名称。';
    searchResults.innerHTML = results.slice(0, 16).map(result => `<a class="vgm-search-result" href="${esc(result.href)}"><span>${esc(result.viewLabel)}</span><div><strong>${esc(result.label)}</strong><small>${esc(result.match || result.summary)}</small></div>${icon('arrow')}</a>`).join('');
    if (results.length > 16) searchStatus.textContent += '，显示前 16 项';
  }
  function onKeydown(event) {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,[contenteditable]') && !document.querySelector('dialog[open]')) {
      event.preventDefault(); searchInput.focus();
    }
    if (event.key === 'Escape' && document.activeElement === searchInput) { searchInput.value = ''; onSearch(); }
  }
  container.addEventListener('click', onClick);
  searchInput.addEventListener('input', onSearch);
  document.addEventListener('keydown', onKeydown);
  return () => { container.removeEventListener('click', onClick); searchInput.removeEventListener('input', onSearch); document.removeEventListener('keydown', onKeydown); };
}
