const doc = (folder) => `AIGC-infra/docs/modules/${folder}/README.md`;
export const stages = [
  { id: 'goals', number: '01', title: '目标与基准', english: 'DEFINE', icon: 'target', tagline: '先定义问题，再定义成功。', description: '用项目协议记录目标、边界与验收，建立整个研发过程的共同起点。', output: '问题定义 · 固定基准 · 验收要求', folder: '01-goals', tools: ['algorithm-template', 'group-dashboard'], steps: ['从 algorithm-template 初始化项目', '记录问题、主指标与退化约束', '固定评测口径并确认下一检查点'], status: '协议可用' },
  { id: 'data', number: '02', title: '数据工程', english: 'PREPARE', icon: 'database', tagline: '让每一份数据，都有来路。', description: '连接获取、处理、存储、预览和消费，以清楚的模块分工交付可追溯的数据版本。', output: '成品数据集 · 元数据 · 划分清单', folder: '02-data', tools: ['pass', 'avproc', 'download-meta'], steps: ['获取与下载交付原片和来源', '处理管线读取原片、交付加工结果', '存储与版本支撑预览和消费'], status: '已有 Infra' },
  { id: 'training', number: '03', title: '模型实验与训练', english: 'EXPERIMENT', icon: 'layers', tagline: '用实验，把假设变成证据。', description: '复现基线、验证方案、训练模型，将配置、数据与结果关联起来。', output: '实验记录 · 训练配置 · Checkpoint', folder: '03-training', tools: ['training', 'experiment-protocol'], steps: ['固定模型、数据和代码版本', '开展最小可行性实验', '记录关键实验与可复现资产'], status: '方案阶段' },
  { id: 'evaluation', number: '04', title: '评测与验收', english: 'EVALUATE', icon: 'compare', tagline: '看清差异，也看清原因。', description: '在统一条件下比较模型，通过人工评分、指标与具体案例形成验收证据。', output: '评分与指标 · 对比报告 · 问题集', folder: '04-evaluation', tools: ['prim-eval', 'eval-upgrade'], steps: ['固定 case、模型与生成配置', '多维评分与同 case 模型对照', '分析差异、保留证据并确认验收'], status: '平台入口' },
  { id: 'serving', number: '05', title: '推理优化与发布', english: 'DELIVER', icon: 'rocket', tagline: '从模型结果，到稳定服务。', description: '优化速度、显存与成本，经过回归验收后发布，并保留回滚能力。', output: '验收版本 · 推理服务 · 回滚记录', folder: '05-serving', tools: ['serving'], steps: ['明确延迟、吞吐与资源目标', '优化配置后回到评测验证', '管理发布版本与回滚路径'], status: '方案阶段' },
  { id: 'feedback', number: '06', title: '运行反馈与迭代', english: 'ITERATE', icon: 'loop', tagline: '让真实反馈，开启下一轮研发。', description: '观察线上结果与失败案例，定位数据、模型或推理问题，形成迭代清单。', output: '问题集 · 归因证据 · 迭代计划', folder: '06-feedback', tools: ['feedback'], steps: ['收集运行事实与用户反馈', '复现问题并关联资产版本', '确认优先级，返回对应研发环节'], status: '方案阶段' }
].map(s => ({ ...s, readme: doc(s.folder) }));
const dataDoc = name => `AIGC-infra/docs/modules/02-data/${name}.design.md`;
export const dataArchitecture = {
  overviewDoc: dataDoc('002-data-modules'),
  processingDoc: dataDoc('003-data-processing'),
  modules: [
    { id: 'acquisition', title: '数据获取', subtitle: '来源与下载', icon: 'external', tone: 'goals', owner: '下载器 / 采集侧', section: '获取与下载', description: '管理来源、下载状态与交付报告，在下载过程中写入 meta。', input: '来源清单与采集规则', output: '原片引用 · 来源 meta · 交付报告', tools: ['download-meta'], related: [] },
    { id: 'processing', title: '数据处理', subtitle: 'avproc-ray', icon: 'branches', tone: 'training', owner: '管线 / 算子侧', section: '处理与管线', description: '按管线配置加工原片，交付样本、指标、标注与条件资产。', input: '原片引用与管线配置', output: '样本关系 · 加工媒体 · 算子结果', tools: ['avproc'], related: [] },
    { id: 'storage', title: '存储与版本', subtitle: 'MongoDB · PASS', icon: 'database', tone: 'data', owner: '数据资产 / 存储侧', section: '存储与版本', description: '保存媒体和元数据，按使用方规则固定快照与版本清单。', input: '原片 / 加工产物与构建规则', output: '媒体引用 · 固定版本 · manifest', tools: ['pass'], related: [{ id: 'foundation', label: '公共技术底座' }] },
    { id: 'preview', title: '数据预览', subtitle: 'DataViewer', icon: 'grid', tone: 'evaluation', owner: '浏览 / 抽检侧', section: '预览与抽检', description: '读取同一批样本、媒体与指标，组织多模态浏览和抽检。', input: '样本视图与媒体引用', output: '抽检证据 · 问题样本引用', tools: [], related: [{ id: 'viewer', label: '统一 DataViewer' }] },
    { id: 'consumption', title: '数据消费', subtitle: '训练 · 评测', icon: 'layers', tone: 'serving', owner: '模型研发 / 使用侧', section: '消费与使用', description: '按固定版本读取训练或评测数据，关联运行并反馈新需求。', input: '固定版本与 JSONL / split', output: '绑定数据版本的训练 / 评测运行', tools: [], related: [{ id: 'training', label: '训练模块' }, { id: 'evaluation', label: '评测模块' }] }
  ],
  steps: {
    raw_ingest: { title: '入库与预处理', detail: '媒体属性 · 解码 · HDR', section: '原片入库与预处理', tone: 'goals' },
    segment: { title: '镜头与场景切分', detail: '边界 · 来源 · 音视频关系', section: '镜头与场景切分', tone: 'data' },
    quality: { title: '去重与质量', detail: '重复组 · 质量 / 同步指标', section: '去重与质量分析', tone: 'evaluation' },
    analyze: { title: '内容与音频分析', detail: 'VAD · 人像 · 音频语义', section: '内容与音频分析', tone: 'training' },
    caption: { title: '描述标注', detail: 'caption · 模板 / 模型版本', section: '描述标注', tone: 'serving' },
    condition_features: { title: '条件与特征', detail: '参考图 · 音色 · 关键帧', section: '条件与特征提取', tone: 'feedback', optional: true }
  },
  lanes: [
    { id: 'single', title: 'SingleShot', label: '单镜头样本', segment: '单镜头切分', steps: ['raw_ingest', 'segment', 'quality', 'analyze', 'caption', 'condition_features'] },
    { id: 'multi', title: 'MultiShot', label: '场景与多镜头样本', segment: '场景与镜头关系', steps: ['raw_ingest', 'segment', 'quality', 'caption', 'analyze', 'condition_features'] }
  ]
};
export const shared = [
  { id: 'lifecycle', title: '项目生命周期管理', english: 'PROJECT CONTEXT', icon: 'branches', description: '把目标、工作项、里程碑、依赖和证据连接起来。', readme: 'AIGC-infra/docs/platform/project-lifecycle/README.md', tools: ['group-dashboard', 'algorithm-template'], steps: ['稳定项目 ID 关联执行记录', '源平台事实汇总为可重建视图', '负责人确认结论与阶段推进'], status: '正在开发', output: '项目概览 · 依赖 · 交付证据', tagline: '连接工作，也连接证据。' },
  { id: 'viewer', title: '统一 DataViewer', english: 'SHARED VIEW', icon: 'grid', description: '复用数据抽样、模型对照与失败案例的多模态浏览。', readme: 'AIGC-infra/docs/platform/data-viewer/README.md', tools: ['viewer-plan'], steps: ['以稳定样本 ID 对齐数据与结果', '复用现有数据与评测平台', '通过媒体引用浏览与比较'], status: '方案阶段', output: '多模态样本视图 · 模型对照', tagline: '用同一视图，读懂不同结果。' },
  { id: 'foundation', title: '公共技术底座', english: 'FOUNDATION', icon: 'server', description: '为研发各环节提供算力、存储、编排、接入与监控。', readme: 'AIGC-infra/docs/platform/foundation/README.md', tools: ['foundation-plan'], steps: ['算力、环境与存储资源', '通用任务编排与平台适配', '访问权限、监控与日志'], status: '方案阶段', output: '通用资源 · 执行与访问能力', tagline: '让基础能力，贯穿每个阶段。' }
];
export const tools = {
  'algorithm-template': { title: 'algorithm-template', kind: '文档协议', icon: 'file', status: '协议可用', description: 'Git + Markdown + YAML，记录目标、方案、实验、决策与交付。', doc: 'algorithm-template/README.md' },
  'group-dashboard': { title: '算法组项目与 Goals', kind: '项目汇总', icon: 'grid', status: '正在开发', description: '从各项目仓库汇总目标与证据，统一查看有哪些项目、各自要实现什么。', doc: 'AIGC-infra/docs/modules/01-goals/001-goal-protocol.design.md', plan: ['项目登记与协议读取', '目标和源文档汇总', '变更刷新及证据关联', '配置真实地址，开放平台入口'] },
  pass: { title: 'PASS 数据平台', kind: '数据资产', icon: 'database', status: '待配置入口', description: '复用已有数据平台管理媒体与资产，通过固定索引组织数据取用。', doc: 'AIGC-infra/docs/modules/02-data/001-data-engineering.design.md' },
  avproc: { title: 'avproc-ray', kind: '处理管线', icon: 'branches', status: '代码入口', description: '已有音视频处理管线，涵盖入库、SingleShot / MultiShot 切分与质量分析。', doc: 'AIGC-infra/docs/modules/02-data/001-data-engineering.design.md' },
  'download-meta': { title: '下载交付与 MongoDB meta', kind: '交付完善', icon: 'database', status: '正在开发', description: '下载过程中写入 meta，支持状态、失败恢复和完整交付报告。', url: 'https://jira.myhexin.com/browse/TCLOUD-12854', linkLabel: '查看 Jira 需求', doc: 'AIGC-infra/docs/modules/02-data/001-data-engineering.requirements.md' },
  training: { title: '训练与实验执行平台', kind: '执行平台', icon: 'layers', status: '待配置入口', description: '接入团队已有的训练 / DLC 平台，关联运行配置、指标与模型资产。', doc: doc('03-training') },
  'experiment-protocol': { title: '关键实验记录协议', kind: '文档协议', icon: 'file', status: '协议可用', description: '在 algorithm-template 中保留重要实验的假设、版本、证据与结论。', doc: 'algorithm-template/experiments/README.md' },
  'prim-eval': { title: 'Prim Eval', kind: '评测平台', icon: 'compare', status: '平台入口', description: '图像、视频、音频的匿名 A/B 对比；通过已知地址进入真实平台。', preview: 'previews/prim-eval/index.html', doc: 'AIGC-infra/docs/modules/04-evaluation/README.md' },
  'eval-upgrade': { title: '多维评分与差异案例预览', kind: '功能完善', icon: 'chart', status: '已提需求', description: 'PASS 文件直读、单视频多维评分、按维度差异查看案例，后期自动报表。', url: 'https://jira.myhexin.com/browse/TCLOUD-12853', linkLabel: '查看 Jira 需求', doc: 'AIGC-infra/docs/modules/04-evaluation/001-evaluation-platform.requirements.md' },
  serving: { title: '推理与发布管理', kind: '服务交付', icon: 'rocket', status: '方案阶段', description: '推理优化、回归验收、版本发布与回滚，具体平台接入待确定。', doc: doc('05-serving'), plan: ['推理目标与性能基线', '优化后统一回归评测', '版本发布、结果获取与回滚'] },
  feedback: { title: '运行看板与案例反馈', kind: '持续迭代', icon: 'loop', status: '方案阶段', description: '关联线上任务、生成结果与反馈，将失败现象转为可验证的研发问题。', doc: doc('06-feedback'), plan: ['运行指标与结果关联', '失败案例复现和归因', '迭代清单与负责人确认'] },
  'viewer-plan': { title: 'DataViewer 共享浏览', kind: '共享能力', icon: 'grid', status: '方案阶段', description: '数据抽样、模型结果对比与失败案例浏览的统一协议及体验。', doc: shared[1].readme },
  'foundation-plan': { title: '资源与平台接入', kind: '公共底座', icon: 'server', status: '方案阶段', description: '统一资源、媒体引用、任务执行、源平台适配和访问能力。', doc: shared[2].readme }
};
