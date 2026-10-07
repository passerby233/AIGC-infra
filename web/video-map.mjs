import { readFile } from 'node:fs/promises';
import path from 'node:path';

const views = {
  'view.tasks': { icon: 'grid', english: 'TASKS & INPUTS', question: '提供什么条件，得到什么输出？', description: '从文本、图像、视频和音频出发，理解生成任务与需要保留的内容。' },
  'view.paradigms': { icon: 'layers', english: 'GENERATIVE PARADIGMS', question: '生成过程怎样定义和学习？', description: '比较对抗、变分、扩散、流、自回归与掩码路线，以及它们的组合。' },
  'view.temporal': { icon: 'loop', english: 'TEMPORAL GENERATION', question: '视频如何沿时间展开？', description: '理解整段生成、逐帧推进、上下文延展、记忆和流式交互。' },
  'view.architecture': { icon: 'server', english: 'ARCHITECTURE & REPRESENTATION', question: '视频怎样编码，网络怎样处理？', description: '从像素和潜变量到编解码器、骨干、位置编码、时空注意力与条件注入。' },
  'view.control': { icon: 'target', english: 'CONTROLLABILITY', question: '如何约束主体、动作和镜头？', description: '按控制目标组织身份、空间、运动、相机、时间和音频条件。' },
  'view.training': { icon: 'chart', english: 'TRAINING & INFERENCE', question: '如何训练、适配并提高效率？', description: '沿数据、训练、后训练与推理展开，区分目标、参数更新方式和系统优化。' },
  'view.capabilities': { icon: 'compare', english: 'CAPABILITIES & EVALUATION', question: '生成得怎样，如何验证？', description: '从可观察的质量问题连接研究方法与评测，分别看清语义、运动、物理和效率。' }
};

const summaries = {
  'tasks.text': '文字指定对象、场景和动作，模型将描述转为随时间变化的画面。复杂指令还需要检查属性绑定与事件顺序。',
  'tasks.image': '图像提供初始状态或时间锚点，生成过程补充运动及新出现的内容。单图驱动与双侧关键帧补全具有不同约束。',
  'tasks.reference': '参考材料指定主体、身份或风格，同时允许构图、动作与场景变化。先明确要保留的内容，再比较条件表示。',
  'tasks.video': '以源视频为基础进行编辑、翻译、修补或延展，同时衡量目标修改与原内容保留。',
  'tasks.audio': '音频提供发音、节奏或情绪条件，视觉参考提供身份。口型、表情、手势与全身动作分别组织。',
  'tasks.multimodal': '为每路输入指定角色、作用时间和控制强度，再组合文本、参考图、姿态、轨迹或音频条件。',
  'tasks.outputs': '按输出模态区分无声视频、视频后配音与联合音视频生成，分别讨论语义和时间对应。',
  'paradigms.gan': '生成器与判别器通过对抗目标学习视频分布。视频 GAN 常进一步分解外观内容与时间运动。',
  'paradigms.vae': '随机潜变量表达未来的不确定性，变分学习连接先验、后验和视频重建或预测目标。',
  'paradigms.diffusion': '学习从含噪视频中恢复内容，通过多次更新生成样本；既可在像素空间，也可在压缩潜空间工作。',
  'paradigms.flow': '学习概率路径上的速度场，再积分得到样本。重点比较路径、回归目标以及生成时的数值更新。',
  'paradigms.ar': '将序列概率拆为依赖历史的条件分布。生成单元可以是离散 token，也可以是连续帧或片段。',
  'paradigms.masked': '预测缺失的离散视觉 token，通过迭代填充完成视频；已知 token 和任务掩码共同定义条件。',
  'paradigms.hybrid': '在不同层级组合生成机制，例如用自回归推进时间、用扩散合成局部片段，或先规划再渲染。',
  'temporal.joint': '在一次时间建模范围内联合处理整段视频，各帧可交换信息；生成仍可能包含多次去噪或积分更新。',
  'temporal.causal': '当前帧或块依赖已经生成的历史。核心问题是依赖掩码、历史误差与可以复用的状态。',
  'temporal.context': '在有限上下文预算内延展视频，决定保留、压缩或淘汰哪些历史，并处理片段边界和条件变化。',
  'temporal.hierarchical': '先组织故事、场景、布局或关键帧，再生成局部内容并衔接，分开处理全局关系与局部细节。',
  'temporal.memory': '显式保留历史画面、外观特征或潜在状态，使后续生成能够访问更早的信息。不同记忆对象分别比较。',
  'temporal.streaming': '持续交付生成片段并响应新条件，需要同时关注首段延迟、稳定吞吐和长时间漂移。',
  'architecture.representation': '选择像素、连续潜变量或离散 token 作为生成对象，在信息保真、序列长度和模型成本之间取舍。',
  'architecture.codec': '编码器压缩视频，解码器还原画面。比较时空压缩率、重建质量、因果边界与分块处理方式。',
  'architecture.backbone': '骨干负责处理视频表示和条件；U-Net、DiT 与自回归 Transformer 具有不同的信息连接方式。',
  'architecture.position': '将时空内容组织为 token，并编码空间位置与时间顺序。位置方案与长度、分辨率适应性分别验证。',
  'architecture.attention': '决定哪些空间和时间位置交换信息。全连接、分解、稀疏与因果连接各有质量和计算取舍。',
  'architecture.condition': '先编码文本、图像或结构条件，再通过拼接、注意力、调制或适配器将条件传入生成网络。',
  'architecture.efficiency': '从表示长度、模块连接与编解码方式减少成本，再检查优化是否转化为端到端收益。',
  'control.semantic': '把文字和指令转为生成约束，检查对象、属性、动作与编辑目标是否执行，并控制引导强度。',
  'control.appearance': '以参考材料约束身份、角色、物体细节或风格，分开衡量主体保持与新场景、新运动的自由度。',
  'control.structure': '通过深度、边缘、草图、遮罩或布局限定空间内容。各信号的坐标、覆盖范围和精度分别记录。',
  'control.motion': '用姿态、轨迹或运动场指定时间变化，同时将运动绑定到正确主体，区分对象运动与相机运动。',
  'control.camera': '用相机姿态、路线或视角条件控制镜头变化，关注相机信号表示及生成内容的视角一致性。',
  'control.temporal': '用首尾帧、关键帧或场景计划提供时间锚点，分别检查中间过渡、事件顺序和时间约束。',
  'control.audio': '将音频与口型、表情、头部动作或手势对齐。歌唱肖像和音乐驱动舞蹈属于不同输出任务。',
  'control.multiple': '组合多路控制时，明确条件角色、主体绑定和冲突；统一输入接口与实际控制效果分别观察。',
  'training.data': '把原始视频变成可追溯的训练样本，通过切段、过滤、描述和采样控制质量与分布覆盖。',
  'training.pretrain': '确定初始化、数据混合、分辨率与时长阶段，以及噪声采样和训练目标，形成基础生成能力。',
  'training.parameters': '规定更新哪些参数：全量权重、低秩增量或额外条件模块。该选择可以与不同训练目标组合。',
  'training.post': '在基础模型之上使用高质量监督、教师信号、偏好或奖励进行优化，分别记录监督来源和质量取舍。',
  'training.temporal': '选择历史来源、生成展开和噪声设置，使训练条件更接近实际推理，减少长期误差积累。',
  'training.sampling': '根据模型预测和时间调度执行数值更新，并使用条件引导。求解器需要匹配目标参数化与实现。',
  'training.efficiency': '分别优化步数、重复计算、注意力、精度和通信；统一输入规模、硬件与计时边界后再比较收益。',
  'capabilities.visual': '检查清晰度、细节、伪影、人体形态与美学，并追溯数据、表示和训练对结果的影响。',
  'capabilities.semantic': '拆分文字中的对象、属性、数量、关系和事件，逐项检查执行情况，避免总体分数掩盖遗漏。',
  'capabilities.motion': '分别观察动态程度、自然性、流畅性及动作完整性；运动更大不自动代表动作更合理。',
  'capabilities.temporal': '识别闪烁、局部抖动、运动突变和片段边界跳变，同时区分真实运动与错误的外观变化。',
  'capabilities.subject': '检查身份、角色、物体与背景是否保持，尤其关注遮挡、镜头变化和较长时间后的恢复。',
  'capabilities.geometry': '检查视角、相机、结构与遮挡关系是否一致，并结合多视角或三维任务分析几何错误。',
  'capabilities.physics': '在接触、碰撞、材料交互和因果场景中评估物理常识，将语义完成与物理合理性分开测量。',
  'capabilities.long': '区分连续长视频和多镜头故事，检查长期身份、场景状态、镜头关系和累积误差。',
  'capabilities.control': '将指定姿态、轨迹、相机和组合条件与结果逐项比较，观察执行精度及不同条件间的干扰。',
  'capabilities.audio': '检查口型与发音、手势与语音、事件与声音之间的语义和时间对应，采用任务匹配的协议。',
  'capabilities.efficiency': '统一硬件、精度、视频形状和步数，分别测量首段延迟、吞吐、显存及端到端成本。',
  'capabilities.evaluation': '组合分布指标、多维基准、专项评测和人类判断，明确测量对象、评测设置与工具偏差。'
};

export async function loadVideoMap(root) {
  const base = path.join(root, 'vgm-map');
  const [catalog, registry, knowledge] = await Promise.all(['data/representative-works.json', 'research/sources.json', 'data/knowledge-map.json'].map(async file => JSON.parse(await readFile(path.join(base, file), 'utf8'))));
  const sources = new Map(registry.sources.map(source => [source.id, source]));
  const entities = new Map(knowledge.entities.map(entity => [entity.id, entity]));
  const ids = new Set(), linkedSources = new Set();
  const compiled = catalog.views.map(view => {
    const metadata = views[view.id];
    if (!metadata) throw new Error(`未知视频分类视角：${view.id}`);
    if (ids.has(view.id)) throw new Error(`重复视频分类 ID：${view.id}`);
    ids.add(view.id);
    const navigation = knowledge.views.find(item => item.id === view.id);
    const subclasses = view.subclasses.map(topic => {
      if (ids.has(topic.id)) throw new Error(`重复视频分类 ID：${topic.id}`);
      ids.add(topic.id);
      if (!summaries[topic.id] || !topic.subdivisions?.length || topic.works?.length < 2) throw new Error(`视频子类内容不完整：${topic.id}`);
      const works = topic.works.map(work => {
        const source = sources.get(work.source_id);
        if (!source || work.url !== source.url) throw new Error(`视频代表作来源不匹配：${topic.id} / ${work.source_id}`);
        const url = new URL(source.url);
        if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`视频来源需要无凭据的 HTTPS 地址：${source.id}`);
        if (!catalog.role_labels[work.role] || !work.rationale) throw new Error(`视频代表作缺少类型或贡献：${source.id}`);
        linkedSources.add(source.id);
        return { ...work, title: source.title, roleLabel: catalog.role_labels[work.role] };
      });
      const section = navigation?.sections.find(item => item.id === topic.id);
      if (!section) throw new Error(`视频分类缺少导航定义：${topic.id}`);
      const concepts = section.entity_ids.map(id => {
        const entity = entities.get(id);
        if (!entity) throw new Error(`视频分类缺少概念：${id}`);
        return { id, label: entity.label, summary: entity.summary, type: entity.type };
      });
      return { ...topic, summary: summaries[topic.id], works, concepts };
    });
    return { ...view, ...metadata, key: view.id.slice(5), subclasses };
  });
  if (compiled.length !== Object.keys(views).length) throw new Error('视频技术汇总需要完整的七个视角');
  return {
    checkedOn: catalog.checked_on,
    catalogDoc: 'AIGC-infra/vgm-map/docs/02-subclasses-and-representative-works.md',
    sourcesDoc: 'AIGC-infra/vgm-map/research/sources.md',
    views: compiled,
    stats: { views: compiled.length, subclasses: compiled.reduce((total, view) => total + view.subclasses.length, 0), points: compiled.reduce((total, view) => total + view.subclasses.reduce((count, topic) => count + topic.subdivisions.length, 0), 0), works: linkedSources.size }
  };
}
