export function groupMindMapTopics(view) {
  let offset = 0;
  return Array.from({ length: 4 }, (_, index) => {
    const size = Math.floor(view.subclasses.length / 4) + Number(index < view.subclasses.length % 4);
    const topics = view.subclasses.slice(offset, offset + size);
    offset += size;
    return { number: index + 1, topics };
  });
}

export function renderVideoMindMaps(view, { esc, icon }) {
  return `<section class="vgm-mindmaps" aria-label="${esc(view.label)}技术思维导图"><div class="vgm-mindmaps-heading"><h3>技术思维导图</h3><span>4 组 · 点击子类或技术点查看详情</span></div><div class="vgm-mindmaps-grid">${groupMindMapTopics(view).map(group => `<article class="vgm-mindmap" data-vgm-mindmap="${group.number}"><header><span class="vgm-mindmap-number">${String(group.number).padStart(2, '0')}</span><h4>${group.topics.map(topic => esc(topic.label)).join(' · ')}</h4><small>${group.topics.reduce((count, topic) => count + topic.subdivisions.length, 0)} 个技术点</small></header><div class="vgm-mindmap-viewport" tabindex="0" role="group" aria-label="第 ${group.number} 组思维导图，可横向滚动"><div class="vgm-mindmap-canvas"><div class="vgm-map-root">${icon(view.icon)}<strong>${esc(view.label)}</strong><span>第 ${group.number} 组</span></div><ul class="vgm-map-topics">${group.topics.map(topic => `<li class="vgm-map-topic-row"><button type="button" class="vgm-map-topic" data-vgm-map-topic="${esc(topic.id)}" aria-pressed="false" aria-controls="vgm-detail">${esc(topic.label)}</button><ul class="vgm-map-points">${topic.subdivisions.map(label => `<li><button type="button" class="vgm-map-point" data-vgm-map-topic="${esc(topic.id)}" data-vgm-map-point="${esc(label)}" aria-pressed="false" aria-controls="vgm-detail">${esc(label)}</button></li>`).join('')}</ul></li>`).join('')}</ul></div></div></article>`).join('')}</div></section>`;
}
