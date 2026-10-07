import test from 'node:test';
import assert from 'node:assert/strict';
import { build, projectRoot } from '../scripts/build.mjs';
import { cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('重新构建后脚本、依赖模块、样式与内容请求一起换版本，避开旧缓存', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'aigc-version-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const entry of ['README.md', 'docs', 'web', 'vgm-map']) {
    await cp(path.join(projectRoot, entry), path.join(root, entry), { recursive: true, filter: source => !source.endsWith('config.local.json') });
  }
  await build({ root });
  const first = JSON.parse(await readFile(path.join(root, 'dist/data/manifest.json'), 'utf8'));
  await writeFile(path.join(root, 'docs/modules/03-training/099-update.design.md'), '# 本次网页更新\n\n应展示最新内容。');
  await build({ root });
  const next = JSON.parse(await readFile(path.join(root, 'dist/data/manifest.json'), 'utf8'));
  assert.notEqual(next.buildVersion, first.buildVersion);
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  for (const asset of ['app.mjs', 'app.css', 'video-map.css']) assert.ok(html.includes(`./${asset}?v=${next.buildVersion}`), asset);
  const app = await readFile(path.join(root, 'dist/app.mjs'), 'utf8');
  for (const asset of ['video-map.mjs', 'data-engineering.mjs', 'vendor/marked.esm.js', 'data/content.json']) {
    assert.ok(app.includes(`./${asset}?v=${next.buildVersion}`), asset);
  }
  const content = JSON.parse(await readFile(path.join(root, 'dist/data/content.json'), 'utf8'));
  assert.equal(content.builtAt, next.builtAt);
  assert.ok(content.documents['AIGC-infra/docs/modules/03-training/099-update.design.md']);
  assert.equal(content.videoMap.views.length, 7);
  assert.equal((await readFile(path.join(root, 'web/client/app.mjs'), 'utf8')).includes('?v='), false);
});
