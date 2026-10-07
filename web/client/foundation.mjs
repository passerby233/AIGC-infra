// Use the rendered README as the source for both content and capability cards.
export function foundationView(module, { content, icon, renderMarkdown }) {
  const reader = document.createElement('article');
  reader.className = 'markdown foundation-reader';
  reader.innerHTML = renderMarkdown(content.documents[module.readme].text, module.readme);
  for (const heading of reader.querySelectorAll('h1,h2,h3')) {
    heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
  }
  const table = [...reader.querySelectorAll('table')].find(table => table.querySelector('th')?.textContent === '能力');
  if (table) {
    const rows = [...table.querySelectorAll('tbody tr')].map(row => [...row.querySelectorAll('td')].map(cell => cell.innerHTML));
    const symbols = ['server', 'database', 'branches', 'grid', 'chart'];
    const viewport = document.createElement('div');
    viewport.className = 'foundation-capabilities-viewport';
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', '五项通用能力及对应 infra 工具，可横向滚动');
    const grid = document.createElement('div');
    grid.className = 'foundation-capabilities';
    grid.innerHTML = rows.map(([title, tools], index) => `<article class="foundation-capability"><div class="foundation-capability-heading"><span>${icon(symbols[index])}</span><h3>${title}</h3></div><small class="foundation-capability-tools">${tools}</small></article>`).join('');
    viewport.append(grid);
    table.closest('.table-scroll').before(viewport);

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
  }
  return `<div class="page foundation-page"><div class="foundation-topline"><a class="text-link" href="#/">← 研发总览</a><span class="eyebrow">SHARED / FOUNDATION</span></div>${reader.outerHTML}</div>`;
}
