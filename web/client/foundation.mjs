// Use the rendered README as the source for both content and capability cards.
export function foundationView(module, { content, esc, icon, moduleLink, renderMarkdown }) {
  const reader = document.createElement('article');
  reader.className = 'markdown foundation-reader';
  reader.innerHTML = renderMarkdown(content.documents[module.readme].text, module.readme);
  for (const heading of reader.querySelectorAll('h1,h2,h3')) {
    heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
  }
  const table = [...reader.querySelectorAll('table')].find(table => table.querySelector('th')?.textContent === '能力');
  if (table) {
    const rows = [...table.querySelectorAll('tbody tr')].map(row => [...row.querySelectorAll('td')].map(cell => cell.innerHTML));
    const headers = [...table.querySelectorAll('th')].map(cell => cell.textContent);
    const symbols = ['server', 'database', 'branches', 'grid', 'chart'];
    const grid = document.createElement('div');
    grid.className = 'foundation-capabilities';
    grid.innerHTML = rows.map(([title, tools, purpose], index) => `<article class="foundation-capability"><div class="foundation-capability-heading"><span>${icon(symbols[index])}</span><h3>${title}</h3><small>${String(index + 1).padStart(2, '0')}</small></div><dl><dt>${esc(headers[1])}</dt><dd>${tools}</dd><dt>${esc(headers[2])}</dt><dd>${purpose}</dd></dl></article>`).join('');
    table.closest('.table-scroll').replaceWith(grid);

    const stages = content.modules.filter(entry => entry.number);
    const shared = content.modules.filter(entry => !entry.number && entry.id !== module.id);
    const diagram = document.createElement('figure');
    diagram.className = 'foundation-diagram';
    diagram.setAttribute('aria-label', '公共技术底座通过通用资源与接口支撑六阶段研发、项目生命周期管理和 DataViewer');
    diagram.innerHTML = `<figcaption><span class="eyebrow">SHARED INFRASTRUCTURE</span><strong>通用资源与接口，贯穿研发全过程</strong></figcaption><div class="foundation-layer-label">六阶段研发</div><div class="foundation-stage-grid">${stages.map(stage => `<a href="${moduleLink(stage.id)}"><small>${esc(stage.number)}</small>${icon(stage.icon)}<span>${esc(stage.title)}</span></a>`).join('')}</div><div class="foundation-shared-layer"><span>${icon('layers')}Project Workspace</span>${shared.map(entry => `<a href="${moduleLink(entry.id)}">${icon(entry.icon)}${esc(entry.title)}</a>`).join('')}</div><div class="foundation-support-arrow" aria-hidden="true">↑</div><div class="foundation-base"><div>${icon('server')}<strong>公共技术底座</strong><span>提供通用资源与接口</span></div><ul>${rows.map(([title], index) => `<li>${icon(symbols[index])}${title}</li>`).join('')}</ul></div>`;
    // The diagram is a peer support view; the five capabilities are not sequential steps.
    reader.querySelector('h2')?.before(diagram);
  }
  const platformHeading = [...reader.querySelectorAll('h2')].find(heading => heading.textContent === '平台入口');
  if (platformHeading) {
    const entry = document.createElement('section');
    entry.className = 'foundation-platform';
    platformHeading.before(entry);
    entry.append(platformHeading);
    const paragraph = entry.nextElementSibling;
    if (paragraph?.tagName === 'P') {
      entry.append(paragraph);
      const link = paragraph.querySelector('a[target="_blank"]');
      if (link) {
        link.className = 'button button-primary';
        link.insertAdjacentHTML('beforeend', icon('external'));
        const url = document.createElement('small');
        url.className = 'foundation-platform-url';
        url.textContent = link.getAttribute('href');
        paragraph.append(url);
      }
    }
    // Keep the platform action above the supporting diagram.
    reader.querySelector('.foundation-diagram')?.before(entry);
  }
  return `<div class="page foundation-page"><div class="foundation-topline"><a class="text-link" href="#/">← 研发总览</a><span class="eyebrow">SHARED / FOUNDATION</span></div>${reader.outerHTML}</div>`;
}
