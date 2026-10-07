# 子分类与代表作目录

版本：0.2；核验日期：2026-10-07（Asia/Shanghai）。

沿用七个交叉视角，共 54 个直接子类、191 个继续展开的技术点及 206 条子类—代表作映射，涉及 71 项不同的论文或官方项目。每个子类至少列出两项代表作。代表作是教学和调研入口，不按性能排名；同一工作可对应多个视角。

阅读层级是“大类 → 子类 → 技术点 → 代表作/技术解释”。三级技术点用于进一步展开；每项作品的实际贡献和覆盖范围单独列出，不表示某一作品支持当前子类下的所有技术点。基础背景、视频生成方法、编解码器、数据集、工程系统和评测基准分别标注。年份使用论文首次提交年份。

机器可读映射见 [representative-works.json](../data/representative-works.json)，完整来源与读取深度见 [sources.md](../research/sources.md)。结构化映射复用已有 54 个子类 ID；现有 108 个共享实体与 39 条关系保持可追踪。

## 七个分类视角

| 大类 | 子类数量 | 专题设计 |
| --- | --- | --- |
| [任务与输入输出](#view-tasks) | 7 | [01-tasks.md](views/01-tasks.md) |
| [生成范式](#view-paradigms) | 7 | [02-paradigms.md](views/02-paradigms.md) |
| [时序生成机制](#view-temporal) | 6 | [03-temporal.md](views/03-temporal.md) |
| [模型结构与表示](#view-architecture) | 7 | [04-architecture.md](views/04-architecture.md) |
| [可控性](#view-control) | 8 | [05-control.md](views/05-control.md) |
| [训练与推理](#view-training) | 7 | [06-training-inference.md](views/06-training-inference.md) |
| [能力与核心问题](#view-capabilities) | 12 | [07-capabilities.md](views/07-capabilities.md) |

<a id="view-tasks"></a>

## 1. 任务与输入输出

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [文生视频](#tasks-text) | 单场景生成；对象、属性与关系组合；动作、事件顺序与叙事指令 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[Wan](https://arxiv.org/abs/2503.20314)、[VideoDirectorGPT](https://arxiv.org/abs/2309.15091) |
| [图生视频](#tasks-image) | 单图/首帧驱动；首尾帧约束；多图/关键帧补全 | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[DynamiCrafter](https://arxiv.org/abs/2310.12190)、[ToonCrafter](https://arxiv.org/abs/2405.17933) |
| [参考生成](#tasks-reference) | 人物身份与角色参考；商品/物体参考；风格与运动参考；多主体、多参考绑定 | [ConsisID](https://arxiv.org/abs/2411.17440)、[DreamVideo](https://arxiv.org/abs/2312.04433)、[DreamVideo-2](https://arxiv.org/abs/2410.13830) |
| [视频到视频](#tasks-video) | 指令编辑；风格重绘；局部修补/空间扩展；时间续写；插值与场景过渡 | [Movie Gen](https://arxiv.org/abs/2410.13720)、[Rerender A Video](https://arxiv.org/abs/2306.07954)、[VACE](https://arxiv.org/abs/2503.07598) |
| [音频驱动](#tasks-audio) | 语音驱动口型/肖像；表情与伴随语音手势；歌唱驱动肖像；音乐到舞蹈运动（相邻领域） | [Hallo](https://arxiv.org/abs/2406.08801)、[Wav2Lip](https://arxiv.org/abs/2008.10010)、[EMO](https://arxiv.org/abs/2402.17485) |
| [多条件输入](#tasks-multimodal) | 文本＋图像；参考＋姿态/轨迹；图像＋音频；条件组合与冲突 | [VideoComposer](https://arxiv.org/abs/2306.02018)、[DragNUWA](https://arxiv.org/abs/2308.08089)、[Animate Anyone](https://arxiv.org/abs/2311.17117) |
| [输出模态扩展](#tasks-outputs) | 无声视频输出；视频生成后配音；联合音视频输出 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[FoleyCrafter](https://arxiv.org/abs/2407.01494)、[Movie Gen](https://arxiv.org/abs/2410.13720) |

<a id="tasks-text"></a>

### 1.1 文生视频

索引 ID：`tasks.text`。

继续展开：单场景生成；对象、属性与关系组合；动作、事件顺序与叙事指令。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 文生视频与文本、视频联合建模。 |
| [Wan](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 生成模型/系统论文 | 大规模文生视频系统；联系数据、表示与生成骨干。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 将多场景文字需求转成场景、实体和布局规划。 |

<a id="tasks-image"></a>

### 1.2 图生视频

索引 ID：`tasks.image`。

继续展开：单图/首帧驱动；首尾帧约束；多图/关键帧补全。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 图像条件的视频潜空间生成。 |
| [DynamiCrafter](https://arxiv.org/abs/2310.12190) · [R51](../research/sources.md#r51) | 2023 / 研究方法 | 结合图像语义上下文与细节条件，驱动静态图像。 |
| [ToonCrafter](https://arxiv.org/abs/2405.17933) · [R52](../research/sources.md#r52) | 2024 / 研究方法 | 卡通关键帧之间的生成式插值。 |
| [SEINE](https://arxiv.org/abs/2310.20700) · [R53](../research/sources.md#r53) | 2023 / 研究方法 | 不同场景图像之间的过渡生成及图像动画。 |

分类边界：ToonCrafter 的验证域是卡通插值；SEINE 研究场景过渡。二者不代表任意数量、任意位置的关键帧控制均已验证。

<a id="tasks-reference"></a>

### 1.3 参考生成

索引 ID：`tasks.reference`。

继续展开：人物身份与角色参考；商品/物体参考；风格与运动参考；多主体、多参考绑定。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [ConsisID](https://arxiv.org/abs/2411.17440) · [R28](../research/sources.md#r28) | 2024 / 研究方法 | 人物身份参考驱动的文生视频。 |
| [DreamVideo](https://arxiv.org/abs/2312.04433) · [R54](../research/sources.md#r54) | 2023 / 研究方法 | 分别定制主体身份与运动模式。 |
| [DreamVideo-2](https://arxiv.org/abs/2410.13830) · [R55](../research/sources.md#r55) | 2024 / 研究方法 | 参考主体图像与边界框运动序列共同约束。 |
| [VACE](https://arxiv.org/abs/2503.07598) · [R50](../research/sources.md#r50) | 2025 / 研究方法 | 将参考生成纳入统一创建/编辑框架。 |

分类边界：人物身份、一般物体与多主体绑定需分别记录验证范围；单主体论文不直接证明多主体能力。

<a id="tasks-video"></a>

### 1.4 视频到视频

索引 ID：`tasks.video`。

继续展开：指令编辑；风格重绘；局部修补/空间扩展；时间续写；插值与场景过渡。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Movie Gen](https://arxiv.org/abs/2410.13720) · [R08](../research/sources.md#r08) | 2024 / 生成模型/系统论文 | 模型集合中的视频编辑任务。 |
| [Rerender A Video](https://arxiv.org/abs/2306.07954) · [R09](../research/sources.md#r09) | 2023 / 研究方法 | 文字引导的视频翻译，结合关键帧处理和时间传播。 |
| [VACE](https://arxiv.org/abs/2503.07598) · [R50](../research/sources.md#r50) | 2025 / 研究方法 | 视频编辑及遮罩编辑的统一框架。 |
| [SEINE](https://arxiv.org/abs/2310.20700) · [R53](../research/sources.md#r53) | 2023 / 研究方法 | 场景过渡与视频未来预测。 |

分类边界：空间扩展是遮罩编辑的专题方向；是否支持某种尺寸或任务需查具体 VACE 实现，不能仅由框架名称推断。

<a id="tasks-audio"></a>

### 1.5 音频驱动

索引 ID：`tasks.audio`。

继续展开：语音驱动口型/肖像；表情与伴随语音手势；歌唱驱动肖像；音乐到舞蹈运动（相邻领域）。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Hallo](https://arxiv.org/abs/2406.08801) · [R30](../research/sources.md#r30) | 2024 / 研究方法 | 音频驱动肖像，分层处理口型、表情与姿态。 |
| [Wav2Lip](https://arxiv.org/abs/2008.10010) · [R67](../research/sources.md#r67) | 2020 / 研究方法 | 用语音修改现有人脸视频的口型。 |
| [EMO](https://arxiv.org/abs/2402.17485) · [R73](../research/sources.md#r73) | 2024 / 研究方法 | 声音直接驱动表情丰富的说话或歌唱肖像。 |
| [EMO2](https://arxiv.org/abs/2501.10687) · [R76](../research/sources.md#r76) | 2025 / 研究方法 | 先预测手部姿态，再结合音频生成手势与表情视频。 |
| [Bailando](https://arxiv.org/abs/2203.13055) · [R75](../research/sources.md#r75) | 2022 / 相邻研究领域 | 音乐驱动三维舞蹈姿态序列；供运动生成扩展阅读。 |

分类边界：Bailando 的直接输出是三维姿态序列，需要额外渲染才能成为像素视频；歌唱肖像和全身音乐舞蹈是不同任务。

<a id="tasks-multimodal"></a>

### 1.6 多条件输入

索引 ID：`tasks.multimodal`。

继续展开：文本＋图像；参考＋姿态/轨迹；图像＋音频；条件组合与冲突。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [VideoComposer](https://arxiv.org/abs/2306.02018) · [R29](../research/sources.md#r29) | 2023 / 研究方法 | 组合文字、空间和时间条件。 |
| [DragNUWA](https://arxiv.org/abs/2308.08089) · [R74](../research/sources.md#r74) | 2023 / 研究方法 | 文字、图像与轨迹共同控制。 |
| [Animate Anyone](https://arxiv.org/abs/2311.17117) · [R27](../research/sources.md#r27) | 2023 / 研究方法 | 参考人物图像与姿态序列相结合。 |
| [Hallo](https://arxiv.org/abs/2406.08801) · [R30](../research/sources.md#r30) | 2024 / 研究方法 | 肖像图像与音频相结合。 |
| [VACE](https://arxiv.org/abs/2503.07598) · [R50](../research/sources.md#r50) | 2025 / 研究方法 | 以统一条件接口组织参考与视频编辑输入。 |

<a id="tasks-outputs"></a>

### 1.7 输出模态扩展

索引 ID：`tasks.outputs`。

继续展开：无声视频输出；视频生成后配音；联合音视频输出。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 用于无声视频生成路线的代表入口。 |
| [FoleyCrafter](https://arxiv.org/abs/2407.01494) · [R68](../research/sources.md#r68) | 2024 / 研究方法 | 给已有无声视频生成对应事件声音。 |
| [Movie Gen](https://arxiv.org/abs/2410.13720) · [R08](../research/sources.md#r08) | 2024 / 生成模型/系统论文 | 视频生成与音频生成模型组成媒体模型集合。 |
| [LTX-2](https://github.com/Lightricks/LTX-2) · [R41](../research/sources.md#r41) | 持续更新 / 官方项目 | 官方仓库说明的联合音视频生成模型家族。 |

分类边界：FoleyCrafter 是视频到音频；Movie Gen 是模型集合；具体联合音视频能力按 LTX-2 版本查看。

<a id="view-paradigms"></a>

## 2. 生成范式

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [对抗生成](#paradigms-gan) | 视频级对抗学习；内容—运动解耦；时间生成器＋逐帧生成器 | [MoCoGAN](https://arxiv.org/abs/1707.04993)、[TGAN](https://arxiv.org/abs/1611.06624)、[GAN 原论文](https://arxiv.org/abs/1406.2661) |
| [变分潜变量生成](#paradigms-vae) | 随机未来帧预测；固定/学习式随机先验；潜变量与重建、预测目标 | [SV2P](https://arxiv.org/abs/1710.11252)、[SVG](https://arxiv.org/abs/1802.07687)、[Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) |
| [扩散与得分建模](#paradigms-diffusion) | 像素空间视频扩散；潜空间视频扩散；去噪/得分与预测参数化 | [Video Diffusion Models](https://arxiv.org/abs/2204.03458)、[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[DDPM](https://arxiv.org/abs/2006.11239) |
| [流与速度场建模](#paradigms-flow) | Flow Matching；Rectified Flow；路径设计与速度场回归 | [Flow Matching](https://arxiv.org/abs/2210.02747)、[Rectified Flow](https://arxiv.org/abs/2209.03003)、[Wan](https://arxiv.org/abs/2503.20314) |
| [自回归生成](#paradigms-ar) | 离散视觉 token 自回归；连续帧/块自回归；文字、视觉、音频的多模态序列 | [VideoPoet](https://arxiv.org/abs/2312.14125)、[Self Forcing](https://arxiv.org/abs/2506.08009)、[Genie](https://arxiv.org/abs/2402.15391) |
| [掩码生成](#paradigms-masked) | 离散 token 掩码预测；迭代填充；多任务掩码条件 | [MAGVIT](https://arxiv.org/abs/2212.05199)、[Phenaki](https://arxiv.org/abs/2210.02399) |
| [混合范式](#paradigms-hybrid) | 自回归＋扩散；全局规划＋局部生成；粗到细/多阶段生成 | [Self Forcing](https://arxiv.org/abs/2506.08009)、[CausVid](https://arxiv.org/abs/2412.07772)、[MovieDreamer](https://arxiv.org/abs/2407.16655) |

<a id="paradigms-gan"></a>

### 2.1 对抗生成

索引 ID：`paradigms.gan`。

继续展开：视频级对抗学习；内容—运动解耦；时间生成器＋逐帧生成器。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [MoCoGAN](https://arxiv.org/abs/1707.04993) · [R44](../research/sources.md#r44) | 2017 / 研究方法 | 把内容与运动分解为不同潜变量。 |
| [TGAN](https://arxiv.org/abs/1611.06624) · [R45](../research/sources.md#r45) | 2016 / 研究方法 | 时间生成器输出逐帧潜变量，再由图像生成器合成。 |
| [GAN 原论文](https://arxiv.org/abs/1406.2661) · [R10](../research/sources.md#r10) | 2014 / 基础背景论文 | 解释对抗学习目标。 |

<a id="paradigms-vae"></a>

### 2.2 变分潜变量生成

索引 ID：`paradigms.vae`。

继续展开：随机未来帧预测；固定/学习式随机先验；潜变量与重建、预测目标。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [SV2P](https://arxiv.org/abs/1710.11252) · [R46](../research/sources.md#r46) | 2017 / 研究方法 | 随机潜变量建模未来视频的多种可能。 |
| [SVG](https://arxiv.org/abs/1802.07687) · [R47](../research/sources.md#r47) | 2018 / 研究方法 | 学习随过去帧变化的先验用于随机视频生成。 |
| [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) · [R11](../research/sources.md#r11) | 2013 / 基础背景论文 | 变分推断与潜变量学习的基础。 |

分类边界：这里的 VAE 是生成建模范式；现代扩散系统中的视频 VAE 编解码器另属模型结构视角。

<a id="paradigms-diffusion"></a>

### 2.3 扩散与得分建模

索引 ID：`paradigms.diffusion`。

继续展开：像素空间视频扩散；潜空间视频扩散；去噪/得分与预测参数化。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Video Diffusion Models](https://arxiv.org/abs/2204.03458) · [R19](../research/sources.md#r19) | 2022 / 生成模型/系统论文 | 视频扩散与图像、视频联合训练的早期路线。 |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 潜空间视频扩散的系统案例。 |
| [DDPM](https://arxiv.org/abs/2006.11239) · [R12](../research/sources.md#r12) | 2020 / 基础背景论文 | 去噪扩散训练与采样的基础。 |
| [Latent Diffusion Models](https://arxiv.org/abs/2112.10752) · [R13](../research/sources.md#r13) | 2021 / 基础背景论文 | 压缩潜空间中生成的基础路线。 |

<a id="paradigms-flow"></a>

### 2.4 流与速度场建模

索引 ID：`paradigms.flow`。

继续展开：Flow Matching；Rectified Flow；路径设计与速度场回归。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Flow Matching](https://arxiv.org/abs/2210.02747) · [R14](../research/sources.md#r14) | 2022 / 基础背景论文 | 通过向量场回归学习概率路径。 |
| [Rectified Flow](https://arxiv.org/abs/2209.03003) · [R15](../research/sources.md#r15) | 2022 / 基础背景论文 | 学习直线路径与流的整直。 |
| [Wan](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 生成模型/系统论文 | 速度场生成目标在视频系统中的具体案例。 |

分类边界：Flow Matching 与 Rectified Flow 有联系但并非同义；连续归一化流作为理论背景继续阅读。

<a id="paradigms-ar"></a>

### 2.5 自回归生成

索引 ID：`paradigms.ar`。

继续展开：离散视觉 token 自回归；连续帧/块自回归；文字、视觉、音频的多模态序列。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [VideoPoet](https://arxiv.org/abs/2312.14125) · [R18](../research/sources.md#r18) | 2023 / 生成模型/系统论文 | 以语言模型式自回归序列处理多模态视频任务。 |
| [Self Forcing](https://arxiv.org/abs/2506.08009) · [R20](../research/sources.md#r20) | 2025 / 研究方法 | 自回归推进帧/块，块内仍采用视频扩散生成。 |
| [Genie](https://arxiv.org/abs/2402.15391) · [R66](../research/sources.md#r66) | 2024 / 相邻研究领域 | 带潜动作条件的自回归动力学模型。 |

分类边界：自回归描述时间或 token 的条件分解，不规定局部生成器必须是离散采样。

<a id="paradigms-masked"></a>

### 2.6 掩码生成

索引 ID：`paradigms.masked`。

继续展开：离散 token 掩码预测；迭代填充；多任务掩码条件。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [MAGVIT](https://arxiv.org/abs/2212.05199) · [R48](../research/sources.md#r48) | 2022 / 生成模型/系统论文 | 三维 tokenizer 与多任务掩码生成。 |
| [Phenaki](https://arxiv.org/abs/2210.02399) · [R17](../research/sources.md#r17) | 2022 / 生成模型/系统论文 | 因果视频 tokenizer 与双向掩码生成器。 |

分类边界：掩码 token 预测与 SEINE 对视频已知区域使用遮罩的扩散方法分别标注。

<a id="paradigms-hybrid"></a>

### 2.7 混合范式

索引 ID：`paradigms.hybrid`。

继续展开：自回归＋扩散；全局规划＋局部生成；粗到细/多阶段生成。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Self Forcing](https://arxiv.org/abs/2506.08009) · [R20](../research/sources.md#r20) | 2025 / 研究方法 | 帧/块自回归与扩散局部生成结合。 |
| [CausVid](https://arxiv.org/abs/2412.07772) · [R22](../research/sources.md#r22) | 2024 / 研究方法 | 由双向扩散教师训练因果少步学生。 |
| [MovieDreamer](https://arxiv.org/abs/2407.16655) · [R24](../research/sources.md#r24) | 2024 / 研究方法 | 全局自回归叙事与局部扩散渲染。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 语言模型规划与布局引导视频合成。 |

<a id="view-temporal"></a>

## 3. 时序生成机制

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [整段联合生成](#temporal-joint) | 整段视频联合去噪/流生成；双向时空交互；带已知帧的联合补全 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[Wan](https://arxiv.org/abs/2503.20314)、[SEINE](https://arxiv.org/abs/2310.20700) |
| [因果生成](#temporal-causal) | 逐帧生成；逐块生成；块因果注意力与 KV 复用 | [CausVid](https://arxiv.org/abs/2412.07772)、[Self Forcing](https://arxiv.org/abs/2506.08009)、[Diffusion Forcing](https://arxiv.org/abs/2407.01392) |
| [上下文延展](#temporal-context) | 滑动窗口/重叠片段；历史压缩与帧打包；提示切换与缓存刷新 | [FramePack](https://arxiv.org/abs/2504.12626)、[LongLive](https://arxiv.org/abs/2509.22622)、[StreamingT2V](https://arxiv.org/abs/2403.14773) |
| [分层生成](#temporal-hierarchical) | 故事/场景规划；关键帧或布局计划；局部片段渲染与衔接 | [MovieDreamer](https://arxiv.org/abs/2407.16655)、[VideoDirectorGPT](https://arxiv.org/abs/2309.15091)、[ControlVideo](https://arxiv.org/abs/2305.13077) |
| [状态与记忆](#temporal-memory) | 历史帧/特征记忆；紧凑历史与持久外观；潜在状态/动作动力学（扩展） | [StreamingT2V](https://arxiv.org/abs/2403.14773)、[FramePack](https://arxiv.org/abs/2504.12626)、[Genie](https://arxiv.org/abs/2402.15391) |
| [流式与交互](#temporal-streaming) | 首段低延迟与持续出帧；动态文字/动作条件；持续生成时的漂移抑制 | [Self Forcing](https://arxiv.org/abs/2506.08009)、[LongLive](https://arxiv.org/abs/2509.22622)、[Genie](https://arxiv.org/abs/2402.15391) |

<a id="temporal-joint"></a>

### 3.1 整段联合生成

索引 ID：`temporal.joint`。

继续展开：整段视频联合去噪/流生成；双向时空交互；带已知帧的联合补全。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 整段潜视频的时空联合建模。 |
| [Wan](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 生成模型/系统论文 | 整段潜视频上的 DiT 与速度场生成。 |
| [SEINE](https://arxiv.org/abs/2310.20700) · [R53](../research/sources.md#r53) | 2023 / 研究方法 | 带场景图像约束的随机遮罩视频扩散。 |

分类边界：整段联合生成仍有多个去噪/积分步骤；“联合”描述时间维度。

<a id="temporal-causal"></a>

### 3.2 因果生成

索引 ID：`temporal.causal`。

继续展开：逐帧生成；逐块生成；块因果注意力与 KV 复用。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CausVid](https://arxiv.org/abs/2412.07772) · [R22](../research/sources.md#r22) | 2024 / 研究方法 | 双向教师到因果视频学生的生成机制转换。 |
| [Self Forcing](https://arxiv.org/abs/2506.08009) · [R20](../research/sources.md#r20) | 2025 / 研究方法 | 自生成历史训练与自回归视频扩散。 |
| [Diffusion Forcing](https://arxiv.org/abs/2407.01392) · [R21](../research/sources.md#r21) | 2024 / 研究方法 | 因果序列与单元独立噪声水平结合。 |

<a id="temporal-context"></a>

### 3.3 上下文延展

索引 ID：`temporal.context`。

继续展开：滑动窗口/重叠片段；历史压缩与帧打包；提示切换与缓存刷新。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [FramePack](https://arxiv.org/abs/2504.12626) · [R57](../research/sources.md#r57) | 2025 / 研究方法 | 按历史帧的重要性打包上下文，控制持续生成成本。 |
| [LongLive](https://arxiv.org/abs/2509.22622) · [R23](../research/sources.md#r23) | 2025 / 研究方法 | 短上下文窗口、frame sink 与提示切换后的缓存重建。 |
| [StreamingT2V](https://arxiv.org/abs/2403.14773) · [R56](../research/sources.md#r56) | 2024 / 研究方法 | 短期上下文与长时外观信息结合，延展视频。 |

分类边界：FramePack 有不同顺序与漂移抑制设计，不把整篇工作一概归为严格单向因果。

<a id="temporal-hierarchical"></a>

### 3.4 分层生成

索引 ID：`temporal.hierarchical`。

继续展开：故事/场景规划；关键帧或布局计划；局部片段渲染与衔接。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [MovieDreamer](https://arxiv.org/abs/2407.16655) · [R24](../research/sources.md#r24) | 2024 / 研究方法 | 长视觉叙事的全局计划与扩散渲染。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 规划场景、角色布局及跨场景一致关系。 |
| [ControlVideo](https://arxiv.org/abs/2305.13077) · [R72](../research/sources.md#r72) | 2023 / 研究方法 | 分层采样组织短片段与长视频。 |

<a id="temporal-memory"></a>

### 3.5 状态与记忆

索引 ID：`temporal.memory`。

继续展开：历史帧/特征记忆；紧凑历史与持久外观；潜在状态/动作动力学（扩展）。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [StreamingT2V](https://arxiv.org/abs/2403.14773) · [R56](../research/sources.md#r56) | 2024 / 研究方法 | 首段外观保留与短期上下文形成两种记忆。 |
| [FramePack](https://arxiv.org/abs/2504.12626) · [R57](../research/sources.md#r57) | 2025 / 研究方法 | 保留并压缩不同时间距离的历史帧信息。 |
| [Genie](https://arxiv.org/abs/2402.15391) · [R66](../research/sources.md#r66) | 2024 / 相邻研究领域 | 潜动作与学习到的动力学，用于交互环境。 |

分类边界：历史信息、外观特征和环境状态是不同记忆对象；Genie 是相邻交互环境案例，并不证明真实世界物理正确。

<a id="temporal-streaming"></a>

### 3.6 流式与交互

索引 ID：`temporal.streaming`。

继续展开：首段低延迟与持续出帧；动态文字/动作条件；持续生成时的漂移抑制。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Self Forcing](https://arxiv.org/abs/2506.08009) · [R20](../research/sources.md#r20) | 2025 / 研究方法 | 支持持续自回归推进的少步视频生成。 |
| [LongLive](https://arxiv.org/abs/2509.22622) · [R23](../research/sources.md#r23) | 2025 / 研究方法 | 长视频生成中的动态提示与持续交互。 |
| [Genie](https://arxiv.org/abs/2402.15391) · [R66](../research/sources.md#r66) | 2024 / 相邻研究领域 | 潜动作驱动的交互式环境生成。 |

<a id="view-architecture"></a>

## 4. 模型结构与表示

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [视频表示](#architecture-representation) | RGB/像素表示；连续压缩潜变量；离散视觉 token | [Video Diffusion Models](https://arxiv.org/abs/2204.03458)、[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[MAGVIT-v2](https://arxiv.org/abs/2310.05737) |
| [视频编解码器](#architecture-codec) | 逐帧二维编码；时空三维压缩；因果视频 VAE；离散视频 tokenizer | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[Wan-VAE](https://arxiv.org/abs/2503.20314)、[CogVideoX VAE](https://arxiv.org/abs/2408.06072) |
| [骨干](#architecture-backbone) | 视频 U-Net；视频 DiT；自回归 Transformer；多模态/多分支骨干 | [Video Diffusion Models](https://arxiv.org/abs/2204.03458)、[Latte](https://arxiv.org/abs/2401.03048)、[CogVideoX](https://arxiv.org/abs/2408.06072) |
| [Token 化与位置](#architecture-position) | 时空 patch/token 化；空间、时间坐标编码；3D RoPE；长度/分辨率外推（后续验证） | [CogVideoX](https://arxiv.org/abs/2408.06072)、[Latte](https://arxiv.org/abs/2401.03048)、[Wan](https://arxiv.org/abs/2503.20314) |
| [时空连接与注意力](#architecture-attention) | 全时空注意力；空间—时间分解；局部/稀疏注意力；因果/块因果注意力 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[Latte](https://arxiv.org/abs/2401.03048)、[VSA](https://arxiv.org/abs/2505.13389) |
| [条件编码与注入](#architecture-condition) | 条件编码器；拼接/联合序列；交叉注意力；AdaLN 调制；Adapter/条件分支 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[Wan](https://arxiv.org/abs/2503.20314)、[DynamiCrafter](https://arxiv.org/abs/2310.12190) |
| [模块级效率](#architecture-efficiency) | 潜变量/token 压缩；分块编解码与特征缓存；稀疏连接；结构与并行布局 | [Wan-VAE](https://arxiv.org/abs/2503.20314)、[MAGVIT-v2](https://arxiv.org/abs/2310.05737)、[VSA](https://arxiv.org/abs/2505.13389) |

<a id="architecture-representation"></a>

### 4.1 视频表示

索引 ID：`architecture.representation`。

继续展开：RGB/像素表示；连续压缩潜变量；离散视觉 token。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Video Diffusion Models](https://arxiv.org/abs/2204.03458) · [R19](../research/sources.md#r19) | 2022 / 生成模型/系统论文 | 像素空间视频生成的代表路线。 |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 连续潜空间视频生成。 |
| [MAGVIT-v2](https://arxiv.org/abs/2310.05737) · [R49](../research/sources.md#r49) | 2023 / 表示/编解码器 | 图像、视频共享词表的离散视觉 tokenizer。 |

<a id="architecture-codec"></a>

### 4.2 视频编解码器

索引 ID：`architecture.codec`。

继续展开：逐帧二维编码；时空三维压缩；因果视频 VAE；离散视频 tokenizer。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 从图像潜空间系统扩展视频建模的入口。 |
| [Wan-VAE](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 表示/编解码器 | 时空压缩、因果处理与分块编解码。 |
| [CogVideoX VAE](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 表示/编解码器 | 三维因果 VAE 与视频潜变量压缩。 |
| [MAGVIT-v2](https://arxiv.org/abs/2310.05737) · [R49](../research/sources.md#r49) | 2023 / 表示/编解码器 | 离散 tokenizer 对视频序列建模的作用。 |

分类边界：编解码器的因果性与生成网络的因果性分开判断。

<a id="architecture-backbone"></a>

### 4.3 骨干

索引 ID：`architecture.backbone`。

继续展开：视频 U-Net；视频 DiT；自回归 Transformer；多模态/多分支骨干。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Video Diffusion Models](https://arxiv.org/abs/2204.03458) · [R19](../research/sources.md#r19) | 2022 / 生成模型/系统论文 | 扩展视频时间维度的扩散网络。 |
| [Latte](https://arxiv.org/abs/2401.03048) · [R65](../research/sources.md#r65) | 2024 / 生成模型/系统论文 | 潜视频 Transformer 骨干与时空分解设计。 |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 视频生成中的专家 Transformer。 |
| [VideoPoet](https://arxiv.org/abs/2312.14125) · [R18](../research/sources.md#r18) | 2023 / 生成模型/系统论文 | 多模态自回归 Transformer 视频生成。 |

分类边界：DiT 是网络骨干，不能由骨干名称推断具体扩散或流训练目标。

<a id="architecture-position"></a>

### 4.4 Token 化与位置

索引 ID：`architecture.position`。

继续展开：时空 patch/token 化；空间、时间坐标编码；3D RoPE；长度/分辨率外推（后续验证）。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 时空 token 与三维旋转位置编码。 |
| [Latte](https://arxiv.org/abs/2401.03048) · [R65](../research/sources.md#r65) | 2024 / 生成模型/系统论文 | 视频 token 的时空组织及位置条件设计。 |
| [Wan](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 生成模型/系统论文 | 视频潜变量 patch 化和时空位置表示。 |

分类边界：位置编码的存在不直接证明任意长度或分辨率外推；外推需单列实验设置。

<a id="architecture-attention"></a>

### 4.5 时空连接与注意力

索引 ID：`architecture.attention`。

继续展开：全时空注意力；空间—时间分解；局部/稀疏注意力；因果/块因果注意力。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 全时空注意力的代表结构。 |
| [Latte](https://arxiv.org/abs/2401.03048) · [R65](../research/sources.md#r65) | 2024 / 生成模型/系统论文 | 空间、时间分解的 Transformer 变体。 |
| [VSA](https://arxiv.org/abs/2505.13389) · [R43](../research/sources.md#r43) | 2025 / 研究方法 | 可训练的稀疏注意力。 |
| [CausVid](https://arxiv.org/abs/2412.07772) · [R22](../research/sources.md#r22) | 2024 / 研究方法 | 因果自回归学生的时间依赖。 |

<a id="architecture-condition"></a>

### 4.6 条件编码与注入

索引 ID：`architecture.condition`。

继续展开：条件编码器；拼接/联合序列；交叉注意力；AdaLN 调制；Adapter/条件分支。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 文本、视觉融合与 Expert AdaLN。 |
| [Wan](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 生成模型/系统论文 | 文本条件交叉注意力的视频 DiT。 |
| [DynamiCrafter](https://arxiv.org/abs/2310.12190) · [R51](../research/sources.md#r51) | 2023 / 研究方法 | 图像上下文表示和图像条件拼接。 |
| [VACE](https://arxiv.org/abs/2503.07598) · [R50](../research/sources.md#r50) | 2025 / 研究方法 | 统一视频条件单元与上下文适配器。 |

<a id="architecture-efficiency"></a>

### 4.7 模块级效率

索引 ID：`architecture.efficiency`。

继续展开：潜变量/token 压缩；分块编解码与特征缓存；稀疏连接；结构与并行布局。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Wan-VAE](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 表示/编解码器 | 时空压缩与分块处理减少表示、解码成本。 |
| [MAGVIT-v2](https://arxiv.org/abs/2310.05737) · [R49](../research/sources.md#r49) | 2023 / 表示/编解码器 | 用紧凑离散表示支撑视觉序列建模。 |
| [VSA](https://arxiv.org/abs/2505.13389) · [R43](../research/sources.md#r43) | 2025 / 研究方法 | 通过稀疏时空连接降低注意力成本。 |
| [xDiT](https://arxiv.org/abs/2411.01738) · [R64](../research/sources.md#r64) | 2024 / 工程系统 | 组织 DiT 序列、流水线与引导分支并行。 |

分类边界：本子类从模块结构解释成本；端到端延迟、显存和吞吐在能力视角另行评测。

<a id="view-control"></a>

## 5. 可控性

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [语义与指令](#control-semantic) | 文字描述与属性绑定；编辑指令；事件/场景计划；条件引导强度 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[Movie Gen](https://arxiv.org/abs/2410.13720)、[VideoDirectorGPT](https://arxiv.org/abs/2309.15091) |
| [身份与外观](#control-appearance) | 人脸身份；整体角色/一般物体；外观与风格；主体与运动解耦 | [ConsisID](https://arxiv.org/abs/2411.17440)、[DreamVideo](https://arxiv.org/abs/2312.04433)、[DreamVideo-2](https://arxiv.org/abs/2410.13830) |
| [空间结构](#control-structure) | 深度/几何结构；边缘/草图；遮罩/局部区域；布局/边界框 | [ControlVideo](https://arxiv.org/abs/2305.13077)、[ToonCrafter](https://arxiv.org/abs/2405.17933)、[VACE](https://arxiv.org/abs/2503.07598) |
| [运动](#control-motion) | 人体姿态序列；点/对象轨迹；光流与运动向量；对象—运动绑定 | [Animate Anyone](https://arxiv.org/abs/2311.17117)、[DragAnything](https://arxiv.org/abs/2403.07420)、[DragNUWA](https://arxiv.org/abs/2308.08089) |
| [相机](#control-camera) | 相机姿态/轨迹；视角与环绕路线；相机内参及镜头运动表达 | [CameraCtrl](https://arxiv.org/abs/2404.02101)、[SV3D](https://arxiv.org/abs/2403.12008)、[Stable Video Diffusion](https://arxiv.org/abs/2311.15127) |
| [时间锚点](#control-temporal) | 首帧/首尾帧锚定；中间关键帧与过渡；事件顺序/时长计划 | [ToonCrafter](https://arxiv.org/abs/2405.17933)、[SEINE](https://arxiv.org/abs/2310.20700)、[VideoDirectorGPT](https://arxiv.org/abs/2309.15091) |
| [音频](#control-audio) | 语音—口型同步；表情/头部姿态；伴随语音手势；歌唱/节奏运动扩展 | [Hallo](https://arxiv.org/abs/2406.08801)、[Wav2Lip](https://arxiv.org/abs/2008.10010)、[EMO](https://arxiv.org/abs/2402.17485) |
| [多条件与统一控制](#control-multiple) | 多条件组合；条件角色/主体绑定；条件缺失与强度冲突；统一输入接口 | [VideoComposer](https://arxiv.org/abs/2306.02018)、[DragNUWA](https://arxiv.org/abs/2308.08089)、[VACE](https://arxiv.org/abs/2503.07598) |

<a id="control-semantic"></a>

### 5.1 语义与指令

索引 ID：`control.semantic`。

继续展开：文字描述与属性绑定；编辑指令；事件/场景计划；条件引导强度。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 文字语义与视频内容的联合建模。 |
| [Movie Gen](https://arxiv.org/abs/2410.13720) · [R08](../research/sources.md#r08) | 2024 / 生成模型/系统论文 | 文字指导生成及视频编辑任务。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 将文字指令分解为场景与实体规划。 |
| [Classifier-Free Guidance](https://arxiv.org/abs/2207.12598) · [R33](../research/sources.md#r33) | 2022 / 基础背景论文 | 条件引导强度的基础机制。 |

<a id="control-appearance"></a>

### 5.2 身份与外观

索引 ID：`control.appearance`。

继续展开：人脸身份；整体角色/一般物体；外观与风格；主体与运动解耦。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [ConsisID](https://arxiv.org/abs/2411.17440) · [R28](../research/sources.md#r28) | 2024 / 研究方法 | 人脸身份条件与频率分解。 |
| [DreamVideo](https://arxiv.org/abs/2312.04433) · [R54](../research/sources.md#r54) | 2023 / 研究方法 | 主体身份和运动各自通过适配器学习。 |
| [DreamVideo-2](https://arxiv.org/abs/2410.13830) · [R55](../research/sources.md#r55) | 2024 / 研究方法 | 指定参考主体并控制其运动轨迹。 |
| [Rerender A Video](https://arxiv.org/abs/2306.07954) · [R09](../research/sources.md#r09) | 2023 / 研究方法 | 保留视频内容的文字引导风格翻译。 |

<a id="control-structure"></a>

### 5.3 空间结构

索引 ID：`control.structure`。

继续展开：深度/几何结构；边缘/草图；遮罩/局部区域；布局/边界框。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [ControlVideo](https://arxiv.org/abs/2305.13077) · [R72](../research/sources.md#r72) | 2023 / 研究方法 | 输入深度或边缘序列，约束视频空间结构。 |
| [ToonCrafter](https://arxiv.org/abs/2405.17933) · [R52](../research/sources.md#r52) | 2024 / 研究方法 | 草图条件辅助卡通帧间生成。 |
| [VACE](https://arxiv.org/abs/2503.07598) · [R50](../research/sources.md#r50) | 2025 / 研究方法 | 遮罩编辑及统一视频条件表示。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 布局与实体计划指导场景生成。 |
| [DreamVideo-2](https://arxiv.org/abs/2410.13830) · [R55](../research/sources.md#r55) | 2024 / 研究方法 | 边界框序列绑定主体与位置变化。 |

分类边界：法线、任意布局、多区域细粒度组合保留为进一步阅读方向；上述方法各有其条件格式。

<a id="control-motion"></a>

### 5.4 运动

索引 ID：`control.motion`。

继续展开：人体姿态序列；点/对象轨迹；光流与运动向量；对象—运动绑定。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Animate Anyone](https://arxiv.org/abs/2311.17117) · [R27](../research/sources.md#r27) | 2023 / 研究方法 | 人物参考与姿态序列驱动的角色动画。 |
| [DragAnything](https://arxiv.org/abs/2403.07420) · [R26](../research/sources.md#r26) | 2024 / 研究方法 | 通过实体表示对指定对象施加运动轨迹。 |
| [DragNUWA](https://arxiv.org/abs/2308.08089) · [R74](../research/sources.md#r74) | 2023 / 研究方法 | 文字、图像和轨迹条件联合控制。 |
| [DreamVideo-2](https://arxiv.org/abs/2410.13830) · [R55](../research/sources.md#r55) | 2024 / 研究方法 | 通过边界框序列控制指定主体的运动。 |
| [VideoComposer](https://arxiv.org/abs/2306.02018) · [R29](../research/sources.md#r29) | 2023 / 研究方法 | 使用压缩视频运动向量作为时间条件的代表入口。 |

分类边界：光流与压缩视频运动向量分别解释；VideoComposer 的运动向量案例不直接证明光流控制。

<a id="control-camera"></a>

### 5.5 相机

索引 ID：`control.camera`。

继续展开：相机姿态/轨迹；视角与环绕路线；相机内参及镜头运动表达。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CameraCtrl](https://arxiv.org/abs/2404.02101) · [R25](../research/sources.md#r25) | 2024 / 研究方法 | 相机轨迹参数化和可插拔控制模块。 |
| [SV3D](https://arxiv.org/abs/2403.12008) · [R71](../research/sources.md#r71) | 2024 / 研究方法 | 明确相机控制的环绕多视角合成。 |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 相机运动适配的训练案例。 |

分类边界：内参和镜头语义作为展开内容；具体支持的相机参数需查相应版本。

<a id="control-temporal"></a>

### 5.6 时间锚点

索引 ID：`control.temporal`。

继续展开：首帧/首尾帧锚定；中间关键帧与过渡；事件顺序/时长计划。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [ToonCrafter](https://arxiv.org/abs/2405.17933) · [R52](../research/sources.md#r52) | 2024 / 研究方法 | 给定卡通关键帧生成中间过渡。 |
| [SEINE](https://arxiv.org/abs/2310.20700) · [R53](../research/sources.md#r53) | 2023 / 研究方法 | 给定不同场景图像与文字生成场景过渡。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 通过场景计划组织事件和镜头顺序。 |

分类边界：场景顺序规划不等于逐帧精确时间控制；任意关键帧与精确时长另记验证状态。

<a id="control-audio"></a>

### 5.7 音频

索引 ID：`control.audio`。

继续展开：语音—口型同步；表情/头部姿态；伴随语音手势；歌唱/节奏运动扩展。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Hallo](https://arxiv.org/abs/2406.08801) · [R30](../research/sources.md#r30) | 2024 / 研究方法 | 分层音频条件控制肖像口型、表情和姿态。 |
| [Wav2Lip](https://arxiv.org/abs/2008.10010) · [R67](../research/sources.md#r67) | 2020 / 研究方法 | 语音约束现有视频中的嘴部运动。 |
| [EMO](https://arxiv.org/abs/2402.17485) · [R73](../research/sources.md#r73) | 2024 / 研究方法 | 说话及歌唱声音驱动肖像表情。 |
| [EMO2](https://arxiv.org/abs/2501.10687) · [R76](../research/sources.md#r76) | 2025 / 研究方法 | 音频到手部姿态，再到表情与手势视频。 |
| [Bailando](https://arxiv.org/abs/2203.13055) · [R75](../research/sources.md#r75) | 2022 / 相邻研究领域 | 音乐节拍对应三维舞蹈运动。 |

分类边界：Bailando 是音乐到运动序列，不能据此标注为端到端像素视频生成。

<a id="control-multiple"></a>

### 5.8 多条件与统一控制

索引 ID：`control.multiple`。

继续展开：多条件组合；条件角色/主体绑定；条件缺失与强度冲突；统一输入接口。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [VideoComposer](https://arxiv.org/abs/2306.02018) · [R29](../research/sources.md#r29) | 2023 / 研究方法 | 统一编码并组合不同文字、空间和时间条件。 |
| [DragNUWA](https://arxiv.org/abs/2308.08089) · [R74](../research/sources.md#r74) | 2023 / 研究方法 | 文字、图像、轨迹三种信息联合控制。 |
| [VACE](https://arxiv.org/abs/2503.07598) · [R50](../research/sources.md#r50) | 2025 / 研究方法 | 统一视频条件单元组织创建与编辑任务。 |
| [DreamVideo-2](https://arxiv.org/abs/2410.13830) · [R55](../research/sources.md#r55) | 2024 / 研究方法 | 参考主体与边界框运动条件联合约束。 |

分类边界：统一接口、任意条件兼容和冲突自动解决是不同主张，分别记录证据。

<a id="view-training"></a>

## 6. 训练与推理

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [数据工程](#training-data) | 切镜/语义切段；去重、视觉质量和运动过滤；caption/重标注；时间采样与数据混合 | [OpenVid-1M](https://arxiv.org/abs/2407.02371)、[Panda-70M](https://arxiv.org/abs/2402.19479)、[Stable Video Diffusion](https://arxiv.org/abs/2311.15127) |
| [预训练](#training-pretrain) | 图像初始化/预训练；图像—视频联合训练；分辨率/时长渐进训练；噪声/时间采样与目标 | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[HunyuanVideo](https://arxiv.org/abs/2412.03603)、[CogVideoX](https://arxiv.org/abs/2408.06072) |
| [参数适配](#training-parameters) | 全参数微调；LoRA/低秩适配；Adapter/条件分支 | [LoRA](https://arxiv.org/abs/2106.09685)、[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[DreamVideo](https://arxiv.org/abs/2312.04433) |
| [后训练目标](#training-post) | 高质量 SFT；自训练/合成监督；教师—学生蒸馏；局部/整体偏好优化；奖励优化/RL/GRPO | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)、[CausVid](https://arxiv.org/abs/2412.07772)、[LocalDPO](https://arxiv.org/abs/2601.04068) |
| [时序训练策略](#training-temporal) | 真值历史与自生成历史；自回归 rollout；逐单元独立噪声；长序列调优 | [Self Forcing](https://arxiv.org/abs/2506.08009)、[Diffusion Forcing](https://arxiv.org/abs/2407.01392)、[LongLive](https://arxiv.org/abs/2509.22622) |
| [采样与推理](#training-sampling) | 路径/噪声时间调度；ODE/扩散数值求解器；CFG 条件引导；推理时选择/约束（扩展） | [DPM-Solver](https://arxiv.org/abs/2206.00927)、[UniPC](https://arxiv.org/abs/2302.04867)、[Classifier-Free Guidance](https://arxiv.org/abs/2207.12598) |
| [效率与系统](#training-efficiency) | 少步蒸馏/一致性；KV/去噪/VAE 三种缓存；稀疏注意力；量化/混合精度；序列/流水线/CFG 并行；内存与解码成本 | [CausVid](https://arxiv.org/abs/2412.07772)、[AnimateLCM](https://arxiv.org/abs/2402.00769)、[VideoLCM](https://arxiv.org/abs/2312.09109) |

<a id="training-data"></a>

### 6.1 数据工程

索引 ID：`training.data`。

继续展开：切镜/语义切段；去重、视觉质量和运动过滤；caption/重标注；时间采样与数据混合。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [OpenVid-1M](https://arxiv.org/abs/2407.02371) · [R59](../research/sources.md#r59) | 2024 / 数据集 | 高质量文生视频训练数据的整理案例。 |
| [Panda-70M](https://arxiv.org/abs/2402.19479) · [R60](../research/sources.md#r60) | 2024 / 数据集 | 语义片段切分、多教师描述与描述筛选。 |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 数据筛选与分阶段训练联系的案例。 |

<a id="training-pretrain"></a>

### 6.2 预训练

索引 ID：`training.pretrain`。

继续展开：图像初始化/预训练；图像—视频联合训练；分辨率/时长渐进训练；噪声/时间采样与目标。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 图像预训练、视频预训练与高质量微调的分阶段路线。 |
| [HunyuanVideo](https://arxiv.org/abs/2412.03603) · [R06](../research/sources.md#r06) | 2024 / 生成模型/系统论文 | 数据、渐进训练和基础设施的系统案例。 |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 视频表示、形状处理与联合训练的案例。 |
| [Video Diffusion Models](https://arxiv.org/abs/2204.03458) · [R19](../research/sources.md#r19) | 2022 / 生成模型/系统论文 | 图像与视频联合学习视频扩散。 |

<a id="training-parameters"></a>

### 6.3 参数适配

索引 ID：`training.parameters`。

继续展开：全参数微调；LoRA/低秩适配；Adapter/条件分支。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [LoRA](https://arxiv.org/abs/2106.09685) · [R31](../research/sources.md#r31) | 2021 / 基础背景论文 | 低秩参数增量的基础；原论文验证语言模型。 |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 视频模型微调与相机运动 LoRA 案例。 |
| [DreamVideo](https://arxiv.org/abs/2312.04433) · [R54](../research/sources.md#r54) | 2023 / 研究方法 | 身份与运动适配器分开训练。 |
| [CameraCtrl](https://arxiv.org/abs/2404.02101) · [R25](../research/sources.md#r25) | 2024 / 研究方法 | 增加可训练相机控制模块。 |

分类边界：参数更新方式与监督/偏好/RL 训练目标是可组合的两个维度。

<a id="training-post"></a>

### 6.4 后训练目标

索引 ID：`training.post`。

继续展开：高质量 SFT；自训练/合成监督；教师—学生蒸馏；局部/整体偏好优化；奖励优化/RL/GRPO。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Stable Video Diffusion](https://arxiv.org/abs/2311.15127) · [R07](../research/sources.md#r07) | 2023 / 生成模型/系统论文 | 高质量视频微调阶段。 |
| [CausVid](https://arxiv.org/abs/2412.07772) · [R22](../research/sources.md#r22) | 2024 / 研究方法 | 从双向扩散教师蒸馏因果少步学生。 |
| [LocalDPO](https://arxiv.org/abs/2601.04068) · [R36](../research/sources.md#r36) | 2026 / 研究方法 | 时空局部细节的直接偏好优化。 |
| [DanceGRPO](https://arxiv.org/abs/2505.07818) · [R42](../research/sources.md#r42) | 2025 / 研究方法 | 视觉生成中的奖励与 GRPO 优化。 |
| [VideoLCM](https://arxiv.org/abs/2312.09109) · [R62](../research/sources.md#r62) | 2023 / 研究方法 | 视频潜空间一致性蒸馏。 |

分类边界：Self Forcing 的自生成历史属于时序训练策略；不因名称相近就当成合成数据自训练。

<a id="training-temporal"></a>

### 6.5 时序训练策略

索引 ID：`training.temporal`。

继续展开：真值历史与自生成历史；自回归 rollout；逐单元独立噪声；长序列调优。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Self Forcing](https://arxiv.org/abs/2506.08009) · [R20](../research/sources.md#r20) | 2025 / 研究方法 | 训练时使用模型自身生成的历史，缓解训练推理差异。 |
| [Diffusion Forcing](https://arxiv.org/abs/2407.01392) · [R21](../research/sources.md#r21) | 2024 / 研究方法 | 训练序列单元采用独立噪声水平。 |
| [LongLive](https://arxiv.org/abs/2509.22622) · [R23](../research/sources.md#r23) | 2025 / 研究方法 | 面向长期持续生成的序列调优。 |

<a id="training-sampling"></a>

### 6.6 采样与推理

索引 ID：`training.sampling`。

继续展开：路径/噪声时间调度；ODE/扩散数值求解器；CFG 条件引导；推理时选择/约束（扩展）。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [DPM-Solver](https://arxiv.org/abs/2206.00927) · [R69](../research/sources.md#r69) | 2022 / 基础背景论文 | 通用扩散 ODE 数值求解器。 |
| [UniPC](https://arxiv.org/abs/2302.04867) · [R70](../research/sources.md#r70) | 2023 / 基础背景论文 | 通用预测—校正采样框架。 |
| [Classifier-Free Guidance](https://arxiv.org/abs/2207.12598) · [R33](../research/sources.md#r33) | 2022 / 基础背景论文 | 条件与无条件预测组合的引导机制。 |
| [Flow Matching](https://arxiv.org/abs/2210.02747) · [R14](../research/sources.md#r14) | 2022 / 基础背景论文 | 路径与速度场决定的生成积分背景。 |

分类边界：这些代表作是通用基础论文。视频系统能否使用某个求解器，取决于预测参数化、调度和实现；不从原文推出视频性能或通用兼容性。

<a id="training-efficiency"></a>

### 6.7 效率与系统

索引 ID：`training.efficiency`。

继续展开：少步蒸馏/一致性；KV/去噪/VAE 三种缓存；稀疏注意力；量化/混合精度；序列/流水线/CFG 并行；内存与解码成本。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CausVid](https://arxiv.org/abs/2412.07772) · [R22](../research/sources.md#r22) | 2024 / 研究方法 | 少步因果视频扩散的蒸馏。 |
| [AnimateLCM](https://arxiv.org/abs/2402.00769) · [R61](../research/sources.md#r61) | 2024 / 研究方法 | 视频一致性学习与风格适配。 |
| [VideoLCM](https://arxiv.org/abs/2312.09109) · [R62](../research/sources.md#r62) | 2023 / 研究方法 | 视频潜空间少步一致性蒸馏。 |
| [Self Forcing](https://arxiv.org/abs/2506.08009) · [R20](../research/sources.md#r20) | 2025 / 研究方法 | 自回归持续生成中的滚动 KV 缓存。 |
| [TeaCache](https://arxiv.org/abs/2411.19108) · [R34](../research/sources.md#r34) | 2024 / 研究方法 | 复用不同去噪步骤的模型计算。 |
| [Wan-VAE](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 表示/编解码器 | 分块编解码及历史卷积特征复用。 |
| [VSA](https://arxiv.org/abs/2505.13389) · [R43](../research/sources.md#r43) | 2025 / 研究方法 | 通过可训练稀疏注意力减少计算。 |
| [ViDiT-Q](https://arxiv.org/abs/2406.02540) · [R63](../research/sources.md#r63) | 2024 / 研究方法 | 视频 DiT 的量化与混合精度。 |
| [xDiT](https://arxiv.org/abs/2411.01738) · [R64](../research/sources.md#r64) | 2024 / 工程系统 | 序列、流水线和引导分支的并行组织。 |
| [FastVideo](https://github.com/hao-ai-lab/FastVideo) · [R35](../research/sources.md#r35) | 持续更新 / 官方项目 | 视频生成加速与蒸馏的工程入口。 |

分类边界：每种技术记录优化对象、硬件、精度、视频形状与质量损失；不把模块节省等同端到端收益。

进一步分组：缓存（`training.efficiency.cache`）。

- [Self Forcing](https://arxiv.org/abs/2506.08009)：KV 缓存：复用历史注意力 key/value。
- [TeaCache](https://arxiv.org/abs/2411.19108)：去噪缓存：复用去噪步骤之间的模型计算。
- [Wan-VAE](https://arxiv.org/abs/2503.20314)：VAE 缓存：复用分块编解码的历史卷积特征。

<a id="view-capabilities"></a>

## 7. 能力与核心问题

| 子类 | 继续展开的技术点 | 代表作入口 |
| --- | --- | --- |
| [视觉质量](#capabilities-visual) | 清晰度/细节；伪影/人体形态；美学/风格 | [Wan](https://arxiv.org/abs/2503.20314)、[CogVideoX](https://arxiv.org/abs/2408.06072)、[VBench](https://arxiv.org/abs/2311.17982) |
| [语义与指令执行](#capabilities-semantic) | 对象/属性/数量；空间关系与绑定；动作/事件顺序 | [CogVideoX](https://arxiv.org/abs/2408.06072)、[VideoDirectorGPT](https://arxiv.org/abs/2309.15091)、[VBench](https://arxiv.org/abs/2311.17982) |
| [运动质量](#capabilities-motion) | 运动幅度/动态性；自然性/流畅性；动作完整性/多样性 | [MoCoGAN](https://arxiv.org/abs/1707.04993)、[Animate Anyone](https://arxiv.org/abs/2311.17117)、[VBench](https://arxiv.org/abs/2311.17982) |
| [时间一致性](#capabilities-temporal) | 闪烁/局部抖动；运动连续；跨块/跨镜头衔接 | [Rerender A Video](https://arxiv.org/abs/2306.07954)、[StreamingT2V](https://arxiv.org/abs/2403.14773)、[ControlVideo](https://arxiv.org/abs/2305.13077) |
| [主体与场景一致性](#capabilities-subject) | 人脸/角色身份；物体持久性与遮挡后恢复；场景/背景一致 | [ConsisID](https://arxiv.org/abs/2411.17440)、[DreamVideo-2](https://arxiv.org/abs/2410.13830)、[StreamingT2V](https://arxiv.org/abs/2403.14773) |
| [空间与几何](#capabilities-geometry) | 相机/视角一致；多视角三维结构；遮挡与几何关系 | [SV3D](https://arxiv.org/abs/2403.12008)、[CameraCtrl](https://arxiv.org/abs/2404.02101) |
| [物理与常识](#capabilities-physics) | 重力/接触/碰撞；材料/变形/流体交互；因果顺序/常识 | [VideoPhy](https://arxiv.org/abs/2406.03520)、[VBench-2.0](https://arxiv.org/abs/2503.21755) |
| [长程与叙事](#capabilities-long) | 长期主体/场景一致；故事与镜头关系；状态保持/误差积累 | [MovieDreamer](https://arxiv.org/abs/2407.16655)、[VideoDirectorGPT](https://arxiv.org/abs/2309.15091)、[LongLive](https://arxiv.org/abs/2509.22622) |
| [控制忠实度](#capabilities-control) | 姿态/轨迹执行；相机条件执行；多条件执行与冲突 | [CameraCtrl](https://arxiv.org/abs/2404.02101)、[DragAnything](https://arxiv.org/abs/2403.07420)、[VideoComposer](https://arxiv.org/abs/2306.02018) |
| [音画对应](#capabilities-audio) | 口型—语音同步；手势/表情与语音对应；视觉事件—声音对应 | [Wav2Lip](https://arxiv.org/abs/2008.10010)、[Hallo](https://arxiv.org/abs/2406.08801)、[EMO2](https://arxiv.org/abs/2501.10687) |
| [效率与资源](#capabilities-efficiency) | 首段延迟/持续吞吐；显存/并发；训练与端到端成本 | [CausVid](https://arxiv.org/abs/2412.07772)、[TeaCache](https://arxiv.org/abs/2411.19108)、[ViDiT-Q](https://arxiv.org/abs/2406.02540) |
| [评测方法与协议](#capabilities-evaluation) | 分布级指标；多维通用基准；物理/同步专项评测；模型评估与人类判断；多目标协议 | [FVD](https://arxiv.org/abs/1812.01717)、[VBench](https://arxiv.org/abs/2311.17982)、[VBench-2.0](https://arxiv.org/abs/2503.21755) |

<a id="capabilities-visual"></a>

### 7.1 视觉质量

索引 ID：`capabilities.visual`。

继续展开：清晰度/细节；伪影/人体形态；美学/风格。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Wan](https://arxiv.org/abs/2503.20314) · [R04](../research/sources.md#r04) | 2025 / 生成模型/系统论文 | 视觉质量与数据、压缩表示联系的系统研究入口。 |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 高质量视频生成的架构研究入口。 |
| [VBench](https://arxiv.org/abs/2311.17982) · [R37](../research/sources.md#r37) | 2023 / 评测基准 | 视觉质量、美学等维度的评测入口。 |
| [VBench-2.0](https://arxiv.org/abs/2503.21755) · [R38](../research/sources.md#r38) | 2025 / 评测基准 | 人类形态等内在忠实度维度的评测。 |

<a id="capabilities-semantic"></a>

### 7.2 语义与指令执行

索引 ID：`capabilities.semantic`。

继续展开：对象/属性/数量；空间关系与绑定；动作/事件顺序。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CogVideoX](https://arxiv.org/abs/2408.06072) · [R05](../research/sources.md#r05) | 2024 / 生成模型/系统论文 | 文字条件与视觉内容的联合建模研究。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 通过实体、布局和场景计划改善复杂需求组织。 |
| [VBench](https://arxiv.org/abs/2311.17982) · [R37](../research/sources.md#r37) | 2023 / 评测基准 | 对象、属性、空间关系等语义维度评测。 |
| [VBench-2.0](https://arxiv.org/abs/2503.21755) · [R38](../research/sources.md#r38) | 2025 / 评测基准 | 控制与常识等细粒度评估。 |

分类边界：复杂事件顺序需要额外的分项协议，不能用一个总体语义分数完全代表。

<a id="capabilities-motion"></a>

### 7.3 运动质量

索引 ID：`capabilities.motion`。

继续展开：运动幅度/动态性；自然性/流畅性；动作完整性/多样性。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [MoCoGAN](https://arxiv.org/abs/1707.04993) · [R44](../research/sources.md#r44) | 2017 / 研究方法 | 将运动与外观内容分开建模。 |
| [Animate Anyone](https://arxiv.org/abs/2311.17117) · [R27](../research/sources.md#r27) | 2023 / 研究方法 | 姿态驱动的角色运动生成。 |
| [VBench](https://arxiv.org/abs/2311.17982) · [R37](../research/sources.md#r37) | 2023 / 评测基准 | 动态程度与运动流畅性等维度评测。 |

分类边界：运动幅度大、轨迹执行准确与自然性好是不同观察维度。

<a id="capabilities-temporal"></a>

### 7.4 时间一致性

索引 ID：`capabilities.temporal`。

继续展开：闪烁/局部抖动；运动连续；跨块/跨镜头衔接。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Rerender A Video](https://arxiv.org/abs/2306.07954) · [R09](../research/sources.md#r09) | 2023 / 研究方法 | 时间传播用于保持视频重绘连续。 |
| [StreamingT2V](https://arxiv.org/abs/2403.14773) · [R56](../research/sources.md#r56) | 2024 / 研究方法 | 短期上下文及片段衔接研究。 |
| [ControlVideo](https://arxiv.org/abs/2305.13077) · [R72](../research/sources.md#r72) | 2023 / 研究方法 | 跨帧交互与中间帧平滑。 |
| [VBench](https://arxiv.org/abs/2311.17982) · [R37](../research/sources.md#r37) | 2023 / 评测基准 | 时间闪烁等一致性评估入口。 |

<a id="capabilities-subject"></a>

### 7.5 主体与场景一致性

索引 ID：`capabilities.subject`。

继续展开：人脸/角色身份；物体持久性与遮挡后恢复；场景/背景一致。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [ConsisID](https://arxiv.org/abs/2411.17440) · [R28](../research/sources.md#r28) | 2024 / 研究方法 | 身份保留的专门生成方法。 |
| [DreamVideo-2](https://arxiv.org/abs/2410.13830) · [R55](../research/sources.md#r55) | 2024 / 研究方法 | 参考主体与运动绑定。 |
| [StreamingT2V](https://arxiv.org/abs/2403.14773) · [R56](../research/sources.md#r56) | 2024 / 研究方法 | 长时外观记忆研究。 |
| [VBench](https://arxiv.org/abs/2311.17982) · [R37](../research/sources.md#r37) | 2023 / 评测基准 | 主体与背景一致性的评测维度。 |

分类边界：人脸相似、物体不消失和遮挡后恢复需独立验证，不能相互代替。

<a id="capabilities-geometry"></a>

### 7.6 空间与几何

索引 ID：`capabilities.geometry`。

继续展开：相机/视角一致；多视角三维结构；遮挡与几何关系。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [SV3D](https://arxiv.org/abs/2403.12008) · [R71](../research/sources.md#r71) | 2024 / 研究方法 | 相机可控多视角生成与三维重建评估。 |
| [CameraCtrl](https://arxiv.org/abs/2404.02101) · [R25](../research/sources.md#r25) | 2024 / 研究方法 | 相机轨迹条件执行的研究。 |

分类边界：SV3D 的对象环绕多视角与开放场景动态视频的几何问题分别讨论。

<a id="capabilities-physics"></a>

### 7.7 物理与常识

索引 ID：`capabilities.physics`。

继续展开：重力/接触/碰撞；材料/变形/流体交互；因果顺序/常识。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [VideoPhy](https://arxiv.org/abs/2406.03520) · [R39](../research/sources.md#r39) | 2024 / 评测基准 | 用物体、材料交互检验物理常识。 |
| [VBench-2.0](https://arxiv.org/abs/2503.21755) · [R38](../research/sources.md#r38) | 2025 / 评测基准 | 物理和常识的细粒度评测。 |

分类边界：这里列的是问题定义和评测代表作，不表示这些基准本身解决物理一致性。

<a id="capabilities-long"></a>

### 7.8 长程与叙事

索引 ID：`capabilities.long`。

继续展开：长期主体/场景一致；故事与镜头关系；状态保持/误差积累。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [MovieDreamer](https://arxiv.org/abs/2407.16655) · [R24](../research/sources.md#r24) | 2024 / 研究方法 | 长视觉叙事的分层生成。 |
| [VideoDirectorGPT](https://arxiv.org/abs/2309.15091) · [R58](../research/sources.md#r58) | 2023 / 研究方法 | 多场景故事规划与角色布局关系。 |
| [LongLive](https://arxiv.org/abs/2509.22622) · [R23](../research/sources.md#r23) | 2025 / 研究方法 | 长期持续生成与提示切换研究。 |
| [FramePack](https://arxiv.org/abs/2504.12626) · [R57](../research/sources.md#r57) | 2025 / 研究方法 | 长视频历史预算与漂移抑制。 |

分类边界：多镜头叙事和单镜头持续生成分开评测；输出长不直接等于故事连贯。

<a id="capabilities-control"></a>

### 7.9 控制忠实度

索引 ID：`capabilities.control`。

继续展开：姿态/轨迹执行；相机条件执行；多条件执行与冲突。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CameraCtrl](https://arxiv.org/abs/2404.02101) · [R25](../research/sources.md#r25) | 2024 / 研究方法 | 相机轨迹忠实度的研究入口。 |
| [DragAnything](https://arxiv.org/abs/2403.07420) · [R26](../research/sources.md#r26) | 2024 / 研究方法 | 指定实体运动轨迹的执行。 |
| [VideoComposer](https://arxiv.org/abs/2306.02018) · [R29](../research/sources.md#r29) | 2023 / 研究方法 | 组合文字、空间与时间控制。 |
| [VBench-2.0](https://arxiv.org/abs/2503.21755) · [R38](../research/sources.md#r38) | 2025 / 评测基准 | 控制能力评估入口。 |

<a id="capabilities-audio"></a>

### 7.10 音画对应

索引 ID：`capabilities.audio`。

继续展开：口型—语音同步；手势/表情与语音对应；视觉事件—声音对应。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [Wav2Lip](https://arxiv.org/abs/2008.10010) · [R67](../research/sources.md#r67) | 2020 / 研究方法 | 口型同步生成及同步评估。 |
| [Hallo](https://arxiv.org/abs/2406.08801) · [R30](../research/sources.md#r30) | 2024 / 研究方法 | 音频与口型、表情、姿态对应。 |
| [EMO2](https://arxiv.org/abs/2501.10687) · [R76](../research/sources.md#r76) | 2025 / 研究方法 | 伴随语音手势的同步生成。 |
| [FoleyCrafter](https://arxiv.org/abs/2407.01494) · [R68](../research/sources.md#r68) | 2024 / 研究方法 | 视觉事件与合成声音的语义、时间对应。 |
| [LTX-2](https://github.com/Lightricks/LTX-2) · [R41](../research/sources.md#r41) | 持续更新 / 官方项目 | 联合音视频生成的官方项目入口。 |

分类边界：口型任务、视频后配音和联合音视频生成采用不同协议。

<a id="capabilities-efficiency"></a>

### 7.11 效率与资源

索引 ID：`capabilities.efficiency`。

继续展开：首段延迟/持续吞吐；显存/并发；训练与端到端成本。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [CausVid](https://arxiv.org/abs/2412.07772) · [R22](../research/sources.md#r22) | 2024 / 研究方法 | 因果少步视频生成的效率研究。 |
| [TeaCache](https://arxiv.org/abs/2411.19108) · [R34](../research/sources.md#r34) | 2024 / 研究方法 | 跨去噪步骤复用计算的效率研究。 |
| [ViDiT-Q](https://arxiv.org/abs/2406.02540) · [R63](../research/sources.md#r63) | 2024 / 研究方法 | 视频 DiT 精度和资源成本的量化研究。 |
| [xDiT](https://arxiv.org/abs/2411.01738) · [R64](../research/sources.md#r64) | 2024 / 工程系统 | 并行推理及通信成本研究。 |

分类边界：这些是优化方法或系统论文；横向比较必须统一硬件、精度、形状、步数和计时范围。

<a id="capabilities-evaluation"></a>

### 7.12 评测方法与协议

索引 ID：`capabilities.evaluation`。

继续展开：分布级指标；多维通用基准；物理/同步专项评测；模型评估与人类判断；多目标协议。

| 代表作 | 年份/类型 | 为什么列在这里 |
| --- | --- | --- |
| [FVD](https://arxiv.org/abs/1812.01717) · [R40](../research/sources.md#r40) | 2018 / 评测指标 | 衡量生成与真实视频分布的距离。 |
| [VBench](https://arxiv.org/abs/2311.17982) · [R37](../research/sources.md#r37) | 2023 / 评测基准 | 多维视频生成质量与提示集评测。 |
| [VBench-2.0](https://arxiv.org/abs/2503.21755) · [R38](../research/sources.md#r38) | 2025 / 评测基准 | 进一步细分内在忠实度评测。 |
| [VideoPhy](https://arxiv.org/abs/2406.03520) · [R39](../research/sources.md#r39) | 2024 / 评测基准 | 专项物理常识评测。 |
| [Wav2Lip](https://arxiv.org/abs/2008.10010) · [R67](../research/sources.md#r67) | 2020 / 研究方法 | 口型同步任务的评估入口。 |

分类边界：FVD 是集合分布指标，不是单条视频真实性证明；内容安全等扩展方向需另行专题调研。

## 内容维护规则

- 新增作品时先登记原论文或官方项目及读取深度，再按实际贡献关联子类。
- 全部子类都保留“为什么归入”和“验证范围”，避免只堆论文名字。
- 模型、报告版本与具体检查点分别描述；支持条件、时长或效率数字必须有版本和实验设置。
- 三级技术点继续补写时，增加针对该点的直接文献；当前上级代表作不自动继承到全部叶节点。
- 评测基准用于定义和测量问题；基础论文用于解释机制；二者不标为已解决相应视频能力的生成方法。
