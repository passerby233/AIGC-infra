import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { build, projectRoot } from '../scripts/build.mjs';

async function fixture(t) {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'aigc-build-'));
  const root = path.join(parent, 'portal');
  await mkdir(root);
  for (const entry of ['README.md', 'docs', 'web']) await cp(path.join(projectRoot, entry), path.join(root, entry), { recursive: true, filter: source => !source.endsWith('config.local.json') });
  t.after(() => rm(parent, { recursive: true, force: true }));
  return root;
}

test('独立部署收录六阶段、共享能力及完整协议，并保留事实与计划状态', async t => {
  const root = await fixture(t);
  const content = await build({ root });
  assert.deepEqual(content.modules.filter(m => m.number).map(m => m.id), ['goals', 'data', 'training', 'evaluation', 'serving', 'feedback']);
  assert.equal(content.modules.length, 9);
  for (const module of content.modules) {
    assert.ok(content.documents[module.readme], module.readme);
    assert.ok(module.documents.length >= 1);
    for (const id of module.tools) assert.ok(content.tools[id]);
  }
  for (const name of ['docs/problem.md', 'docs/eval.md', 'project.yaml', 'experiments/README.md']) assert.ok(content.documents['algorithm-template/' + name], name);
  assert.equal(content.documents['algorithm-template/project.yaml'].format, 'yaml');
  assert.equal(content.documents['algorithm-template/project.yaml'].title, 'project.yaml');
  assert.equal(content.tools['group-dashboard'].url, null);
  assert.equal(content.tools['group-dashboard'].status, '正在开发');
  assert.equal(content.tools['prim-eval'].url, 'http://117.50.195.94:2051/');
  assert.equal(content.tools['prim-eval'].preview, 'previews/prim-eval/index.html');
  assert.equal(content.tools['download-meta'].status, '正在开发');
  assert.equal(content.modules.find(m => m.id === 'data').facts['边界'].includes('本模块定义'), true);
  assert.ok(content.documents['AIGC-infra/docs/deployment.md']);
  assert.ok(!Object.keys(content.documents).some(id => id.includes('_templates')));
  const snapshot = await readFile(path.join(root, 'dist/previews/prim-eval/index.html'), 'utf8');
  assert.doesNotMatch(snapshot, /<(?:script|iframe)\b|\bon\w+=|\b(?:href|src)="(?:https?:|cid:|chrome-extension:)/i);
  const compiled = JSON.parse(await readFile(path.join(root, 'dist/data/content.json')));
  assert.deepEqual(compiled.modules, content.modules);
});

test('真实入口覆盖不伪造完成状态，新增方案自动进入目录', async t => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'web/config.local.json'), JSON.stringify({ platforms: { pass: { url: 'https://pass.company.invalid/' }, 'group-dashboard': { url: 'https://dashboard.company.invalid/' } } }));
  await writeFile(path.join(root, 'docs/modules/03-training/099-extra.design.md'), '# 新增训练方案\n\n测试文档自动收录。');
  const content = await build({ root });
  assert.equal(content.tools.pass.url, 'https://pass.company.invalid/');
  assert.equal(content.tools.pass.status, '平台入口');
  assert.equal(content.tools['group-dashboard'].status, '入口已配置');
  assert.equal(content.tools['prim-eval'].url, 'http://117.50.195.94:2051/');
  assert.ok(content.modules.find(m => m.id === 'training').documents.some(d => d.title === '新增训练方案'));
  assert.equal(content.tools['eval-upgrade'].status, '已提需求');
});

test('拒绝脚本地址和在地址中保存账号密码', async t => {
  const root = await fixture(t);
  for (const url of ['javascript:alert(1)', 'https://user:secret@example.invalid/']) {
    await writeFile(path.join(root, 'web/config.local.json'), JSON.stringify({ platforms: { pass: { url } } }));
    await assert.rejects(build({ root }), /无凭据的 HTTP\(S\) 地址/);
  }
});
