import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
export function createServer({ root = path.join(project, 'dist'), basePath = process.env.BASE_PATH || '/' } = {}) {
  const base = '/' + basePath.split('/').filter(Boolean).join('/');
  if (!/^\/[a-zA-Z0-9/_-]*$/.test(base)) throw new Error('BASE_PATH 仅允许字母、数字、短横线和斜线');
  return http.createServer(async (req, res) => {
    try {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'");
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end('Method not allowed'); }
      let pathname;
      try { pathname = decodeURIComponent((req.url || '/').split('?')[0]); } catch { res.writeHead(400); return res.end('Bad URL'); }
      if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').some(p => p.startsWith('.'))) { res.writeHead(403); return res.end('Forbidden'); }
      if (base !== '/') {
        if (pathname === base) { res.writeHead(308, { Location: base + '/' }); return res.end(); }
        if (!pathname.startsWith(base + '/')) { res.writeHead(404); return res.end('Not found'); }
        pathname = pathname.slice(base.length);
      }
      if (pathname === '/api/health') {
        const body = JSON.stringify({ status: 'ok', service: 'aigc-infra' });
        res.writeHead(200, { 'Content-Type': types['.json'], 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store' }); return res.end(req.method === 'HEAD' ? undefined : body);
      }
      if (pathname.endsWith('/')) pathname += 'index.html';
      const resolvedRoot = await realpath(root);
      const file = await realpath(path.resolve(root, '.' + pathname));
      if (!file.startsWith(resolvedRoot + path.sep) || !types[path.extname(file)] || !(await stat(file)).isFile()) { res.writeHead(403); return res.end('Forbidden'); }
      if (pathname.startsWith('/previews/')) res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; sandbox; form-action 'none'");
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Content-Length': bytes.length, 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.code === 'ENOENT' ? 'Not found' : '服务读取失败');
    }
  });
}
export async function startServer(options = {}) {
  const host = options.host ?? process.env.HOST ?? '0.0.0.0';
  const port = Number(options.port ?? process.env.PORT ?? 8080);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT 必须是有效端口');
  const server = createServer(options);
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  const configuredBase = options.basePath ?? process.env.BASE_PATH ?? '/';
  const prefix = configuredBase !== '/' ? '/' + configuredBase.split('/').filter(Boolean).join('/') + '/' : '/';
  console.log(`AIGC Infra 已启动，监听 ${host}:${server.address().port}`);
  console.log(`本机：http://localhost:${server.address().port}${prefix}`);
  if (host === '0.0.0.0' || host === '::') for (const entries of Object.values(os.networkInterfaces())) for (const entry of entries || []) if (entry.family === 'IPv4' && !entry.internal) console.log(`网络：http://${entry.address}:${server.address().port}${prefix}`);
  console.log('跨设备访问需要部署机器的端口放行及可达网络；部署说明见 docs/deployment.md。');
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await startServer();
