import { cp, mkdir, readFile, readdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stages, shared, tools, dataArchitecture } from '../web/catalog.mjs';
import { loadVideoMap } from '../web/video-map.mjs';
export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exists = async p => access(p).then(() => true, () => false);
const readJson = async p => JSON.parse(await readFile(p, 'utf8'));
export async function build({ root = projectRoot, out = path.join(root, 'dist') } = {}) {
  const config = await readJson(path.join(root, 'web/config.json'));
  const local = path.join(root, 'web/config.local.json');
  if (await exists(local)) {
    const overrides = await readJson(local);
    Object.assign(config, { ...overrides, platforms: { ...config.platforms, ...overrides.platforms } });
  }
  for (const [key, entry] of Object.entries(config.platforms)) {
    if (!entry.url) continue;
    const url = new URL(entry.url);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(`平台 ${key} 需要无凭据的 HTTP(S) 地址`);
  }
  const documents = {};
  async function addTree(base, scope, rel = '', includeYaml = false, includeJson = false) {
    for (const entry of await readdir(path.join(base, rel), { withFileTypes: true })) {
      const name = path.posix.join(rel, entry.name);
      if (entry.isDirectory()) { if (!entry.name.startsWith('.') && entry.name !== '_templates') await addTree(base, scope, name, includeYaml, includeJson); }
      else if (entry.name.endsWith('.md') || includeYaml && entry.name.endsWith('.yaml') || includeJson && entry.name.endsWith('.json')) {
        const text = await readFile(path.join(base, name), 'utf8');
        documents[`${scope}/${name}`] = { id: `${scope}/${name}`, title: /\.(yaml|json)$/.test(entry.name) ? entry.name : text.match(/^#\s+(.+)$/m)?.[1].trim() || entry.name, text, scope, format: entry.name.endsWith('.yaml') ? 'yaml' : entry.name.endsWith('.json') ? 'json' : 'markdown' };
      }
    }
  }
  const ownReadme = await readFile(path.join(root, 'README.md'), 'utf8');
  documents['AIGC-infra/README.md'] = { id: 'AIGC-infra/README.md', title: '全局架构', text: ownReadme, scope: 'AIGC-infra' };
  await addTree(path.join(root, 'docs'), 'AIGC-infra', '');
  // Retain virtual source paths for Markdown's original relative links.
  for (const key of Object.keys(documents).filter(k => k !== 'AIGC-infra/README.md')) {
    const next = key.replace('AIGC-infra/', 'AIGC-infra/docs/');
    documents[next] = { ...documents[key], id: next }; delete documents[key];
  }
  const videoMap = await loadVideoMap(root);
  await addTree(path.join(root, 'vgm-map'), 'AIGC-infra/vgm-map', '', false, true);
  const fallback = path.join(root, 'web/reference-docs/algorithm-template');
  const template = path.resolve(process.env.ALGORITHM_TEMPLATE_DIR || path.join(root, '../algorithm-template'));
  if (await exists(fallback)) await addTree(fallback, 'algorithm-template', '', true);
  if (await exists(template)) {
    const allowed = ['README.md', 'project.yaml', 'assets.yaml', 'AGENTS.md', 'progress.md', 'docs/problem.md', 'docs/eval.md', 'docs/design.md', 'docs/data.md', 'docs/delivery.md', 'experiments/README.md', 'decisions/README.md', 'code/README.md', 'code/location.yaml'];
    for (const name of allowed) {
      if (!(await exists(path.join(template, name)))) continue;
      const text = await readFile(path.join(template, name), 'utf8');
      documents[`algorithm-template/${name}`] = { id: `algorithm-template/${name}`, title: name.endsWith('.yaml') ? path.basename(name) : text.match(/^#\s+([^\n]+)$/m)?.[1].trim() || path.basename(name), text, scope: 'algorithm-template', format: name.endsWith('.yaml') ? 'yaml' : 'markdown' };
    }
  }
  const summaries = [...stages, ...shared].map(module => {
    if (!documents[module.readme]) throw new Error(`缺少模块文档：${module.readme}`);
    const text = documents[module.readme].text;
    const facts = Object.fromEntries([...text.matchAll(/^- \*\*([^*]+)\*\*：(.+)$/gm)].map(m => [m[1], m[2]]));
    const prefix = module.readme.slice(0, -'README.md'.length);
    return { ...module, ...(module.id === 'data' ? { dataArchitecture } : {}), facts, documents: Object.values(documents).filter(d => d.id.startsWith(prefix)).map(({ id, title }) => ({ id, title })) };
  });
  const resolvedTools = {};
  for (const [id, tool] of Object.entries(tools)) {
    const configured = config.platforms[id]?.url;
    resolvedTools[id] = { ...tool, id, url: configured || tool.url || null, status: configured && !tool.url ? (id === 'group-dashboard' ? '入口已配置' : tool.status === '待配置入口' ? '平台入口' : tool.status) : tool.status, preview: tool.preview && await exists(path.join(root, 'web/client', tool.preview)) ? tool.preview : null };
  }
  await mkdir(out, { recursive: true });
  await cp(path.join(root, 'web/client'), out, { recursive: true });
  await mkdir(path.join(out, 'data'), { recursive: true });
  const content = { title: config.title, subtitle: config.subtitle, modules: summaries, tools: resolvedTools, documents, videoMap, builtAt: new Date().toISOString() };
  await writeFile(path.join(out, 'data/content.json'), JSON.stringify(content));
  await writeFile(path.join(out, 'data/manifest.json'), JSON.stringify({ documents: Object.keys(documents), builtAt: content.builtAt }, null, 2));
  console.log(`已构建 ${summaries.length} 个模块，${Object.keys(documents).length} 份文档 → ${out}`);
  return content;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await build();
