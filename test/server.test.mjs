import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { startServer } from '../web/server.mjs';

async function fixture(t, basePath = '/') {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'aigc-server-'));
  const root = path.join(parent, 'dist');
  await mkdir(path.join(root, 'previews'), { recursive: true });
  await writeFile(path.join(root, 'index.html'), '<h1>AIGC Infra</h1>');
  await writeFile(path.join(root, 'app.mjs'), 'export const test = true;');
  await writeFile(path.join(root, '.env'), 'TEST_SECRET=hidden');
  await writeFile(path.join(parent, 'private.md'), 'outside serving root');
  await writeFile(path.join(root, 'previews/test.html'), '<p>只读参考</p>');
  const server = await startServer({ root, port: 0, basePath });
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(parent, { recursive: true, force: true }); });
  const port = server.address().port;
  const request = (pathname, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: pathname, method }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject); req.end();
  });
  return { server, request };
}

test('默认监听所有 IPv4 网卡；静态页面、HEAD 与健康检查可用', async t => {
  const { server, request } = await fixture(t);
  assert.equal(server.address().address, '0.0.0.0');
  const page = await request('/');
  assert.equal(page.status, 200);
  assert.match(page.headers['content-type'], /text\/html/);
  assert.match(page.headers['content-security-policy'], /script-src 'self'/);
  assert.equal(page.headers['x-content-type-options'], 'nosniff');
  const head = await request('/', 'HEAD');
  assert.equal(head.status, 200); assert.equal(head.body, '');
  assert.equal(head.headers['content-length'], page.headers['content-length']);
  assert.deepEqual(JSON.parse((await request('/api/health')).body), { status: 'ok', service: 'aigc-infra' });
});

test('拒绝路径越界、隐藏文件、写请求和非法编码；预览禁用脚本', async t => {
  const { request } = await fixture(t);
  for (const pathname of ['/../private.md', '/%2e%2e/private.md', '/.%65nv', '/%5c..%5cprivate.md', '/%00']) assert.equal((await request(pathname)).status, 403, pathname);
  assert.equal((await request('/%ZZ')).status, 400);
  assert.equal((await request('/missing.html')).status, 404);
  assert.equal((await request('/', 'POST')).status, 405);
  assert.equal((await request('/app.mjs')).status, 200);
  const preview = await request('/previews/test.html');
  assert.equal(preview.status, 200);
  assert.match(preview.headers['content-security-policy'], /sandbox/);
  assert.doesNotMatch(preview.headers['content-security-policy'], /script-src/);
});

test('反向代理前缀保留，边界与相对资源可用', async t => {
  const { request } = await fixture(t, '/aigc-infra/');
  const redirect = await request('/aigc-infra');
  assert.equal(redirect.status, 308); assert.equal(redirect.headers.location, '/aigc-infra/');
  assert.equal((await request('/aigc-infra/')).status, 200);
  assert.equal((await request('/aigc-infra/app.mjs')).status, 200);
  assert.equal((await request('/aigc-infra/api/health')).status, 200);
  assert.equal((await request('/')).status, 404);
  assert.equal((await request('/aigc-infra-other/')).status, 404);
});
