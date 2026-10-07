import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { loadVideoMap } from '../web/video-map.mjs';
import { searchVideoMap, videoMapLink } from '../web/client/video-map.mjs';
import { build, projectRoot } from '../scripts/build.mjs';

test('视频分类保留完整层级、贡献和来源，关联现有概念说明', async () => {
  const map = await loadVideoMap(projectRoot);
  assert.deepEqual(map.stats, { views: 7, subclasses: 54, points: 191, works: 71 });
  for (const view of map.views) for (const topic of view.subclasses) {
    assert.ok(topic.summary && topic.concepts.length);
    assert.ok(topic.works.length >= 2);
    for (const work of topic.works) assert.ok(work.rationale && work.roleLabel && work.title && work.url.startsWith('https://'));
  }
  const physics = map.views.flatMap(view => view.subclasses).find(topic => topic.id === 'capabilities.physics');
  assert.ok(physics.works.every(work => work.role === 'benchmark'));
  const audio = map.views.flatMap(view => view.subclasses).find(topic => topic.id === 'tasks.audio');
  assert.equal(audio.works.find(work => work.label === 'Bailando').role, 'adjacent');
  assert.match(audio.note, /三维姿态/);
});

test('跨分类搜索定位作品、技术点及全角英文，并产生可恢复的子类链接', async () => {
  const map = await loadVideoMap(projectRoot);
  assert.deepEqual(searchVideoMap(map, ''), []);
  assert.deepEqual(searchVideoMap(map, '[不存在<脚本>'), []);
  const cache = searchVideoMap(map, 'TeaCache');
  assert.deepEqual(cache.map(item => item.topicId).sort(), ['capabilities.efficiency', 'training.efficiency']);
  for (const result of cache) {
    const query = new URLSearchParams(result.href.split('?')[1]);
    assert.equal(query.get('work'), 'R34');
    assert.equal(query.get('topic'), result.topicId);
  }
  const rope = searchVideoMap(map, '3D RoPE');
  assert.ok(rope.some(item => item.topicId === 'architecture.position' && item.match === '3D RoPE'));
  assert.ok(searchVideoMap(map, 'ＣｏｇＶｉｄｅｏＸ').length > 0);
  const link = videoMapLink('view.control', 'control.motion', '点/对象轨迹');
  assert.equal(new URLSearchParams(link.split('?')[1]).get('point'), '点/对象轨迹');
});

test('独立构建打包分类、专题及 JSON 来源，源文件相对链接可继续阅读', async t => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'aigc-video-build-'));
  const root = path.join(parent, 'portal');
  t.after(async () => { assert.equal(path.dirname(path.resolve(parent)), path.resolve(os.tmpdir())); await rm(parent, { recursive: true, force: true }); });
  for (const entry of ['README.md', 'docs', 'web', 'vgm-map']) await cp(path.join(projectRoot, entry), path.join(root, entry), { recursive: true, filter: source => !source.endsWith('config.local.json') });
  const content = await build({ root });
  assert.equal(content.videoMap.views.length, 7);
  for (const view of content.videoMap.views) assert.ok(content.documents['AIGC-infra/vgm-map/' + view.doc_path]);
  assert.ok(content.documents[content.videoMap.catalogDoc]);
  assert.ok(content.documents[content.videoMap.sourcesDoc]);
  assert.equal(content.documents['AIGC-infra/vgm-map/data/representative-works.json'].format, 'json');
  const compiled = JSON.parse(await readFile(path.join(root, 'dist/data/content.json'), 'utf8'));
  assert.deepEqual(compiled.videoMap, content.videoMap);
  for (const file of ['video-map.mjs', 'video-map.css']) assert.ok((await readFile(path.join(root, 'dist', file))).length > 0);
  const sourcePath = path.join(root, 'vgm-map/data/representative-works.json');
  const catalog = JSON.parse(await readFile(sourcePath, 'utf8'));
  catalog.views[0].subclasses[0].works[0].source_id = 'missing-source';
  await writeFile(sourcePath, JSON.stringify(catalog));
  await assert.rejects(loadVideoMap(root), /来源不匹配/);
});
