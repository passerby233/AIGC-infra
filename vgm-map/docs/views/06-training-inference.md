# 06 训练、后训练与推理

用户问题：模型怎样从数据中学习，如何适配目标任务，哪些技术使推理更快或更省资源？

定位：覆盖研发流程和方法选择。训练目标、参数更新方式、采样方法与系统优化分别记录，允许组合。

## 展开大纲

```text
训练与推理
├── 数据工程
│   ├── 数据来源与切镜/切段
│   ├── 去重、质量与运动过滤
│   ├── 文字描述与重标注
│   ├── 时间采样、分辨率与长宽比
│   └── 数据混合与分布覆盖
├── 预训练
│   ├── 图像预训练/初始化
│   ├── 图像视频联合训练
│   ├── 渐进分辨率与时长
│   └── 噪声、时间采样与损失参数化
├── 参数适配
│   ├── 全参数微调
│   ├── LoRA / 低秩适配
│   └── Adapter / 条件分支训练
├── 后训练目标
│   ├── 高质量 SFT
│   ├── 自训练与合成数据
│   ├── 教师学生蒸馏
│   ├── 偏好优化：DPO 等
│   └── 奖励优化 / RL / GRPO
├── 时序训练策略
│   ├── 真值历史与自生成历史
│   ├── rollout 与梯度截断
│   ├── 单元独立噪声水平
│   └── 长序列调优与上下文一致
├── 采样与推理
│   ├── 噪声/路径时间调度
│   ├── 数值求解器
│   ├── CFG 与条件引导
│   └── 推理时选择、约束与重排序
└── 效率与系统
    ├── 少步蒸馏 / 一致性
    ├── KV 缓存
    ├── 去噪特征缓存
    ├── VAE 特征缓存 / 分块编解码
    ├── 稀疏注意力
    ├── 量化与精度
    ├── 序列/模型/数据并行
    └── 卸载、内存与解码成本
```

## 子分类与代表作

完整贡献说明与分类边界见 [分类目录](../02-subclasses-and-representative-works.md#view-training)；此表给出本专题每个直接子类的原论文/官方项目入口。各项技术点可继续展开，具体覆盖以作品的贡献说明为准。

| 子类 | 继续展开的技术点 | 代表作 |
| --- | --- | --- |
| 数据工程 | 切镜/语义切段；去重、视觉质量和运动过滤；caption/重标注；时间采样与数据混合 | [OpenVid-1M](https://arxiv.org/abs/2407.02371)（数据集）；[Panda-70M](https://arxiv.org/abs/2402.19479)（数据集）；[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文） |
| 预训练 | 图像初始化/预训练；图像—视频联合训练；分辨率/时长渐进训练；噪声/时间采样与目标 | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文）；[HunyuanVideo](https://arxiv.org/abs/2412.03603)（生成模型/系统论文）；[CogVideoX](https://arxiv.org/abs/2408.06072)（生成模型/系统论文）；[Video Diffusion Models](https://arxiv.org/abs/2204.03458)（生成模型/系统论文） |
| 参数适配 | 全参数微调；LoRA/低秩适配；Adapter/条件分支 | [LoRA](https://arxiv.org/abs/2106.09685)（基础背景论文）；[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文）；[DreamVideo](https://arxiv.org/abs/2312.04433)（研究方法）；[CameraCtrl](https://arxiv.org/abs/2404.02101)（研究方法） |
| 后训练目标 | 高质量 SFT；自训练/合成监督；教师—学生蒸馏；局部/整体偏好优化；奖励优化/RL/GRPO | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文）；[CausVid](https://arxiv.org/abs/2412.07772)（研究方法）；[LocalDPO](https://arxiv.org/abs/2601.04068)（研究方法）；[DanceGRPO](https://arxiv.org/abs/2505.07818)（研究方法）；[VideoLCM](https://arxiv.org/abs/2312.09109)（研究方法） |
| 时序训练策略 | 真值历史与自生成历史；自回归 rollout；逐单元独立噪声；长序列调优 | [Self Forcing](https://arxiv.org/abs/2506.08009)（研究方法）；[Diffusion Forcing](https://arxiv.org/abs/2407.01392)（研究方法）；[LongLive](https://arxiv.org/abs/2509.22622)（研究方法） |
| 采样与推理 | 路径/噪声时间调度；ODE/扩散数值求解器；CFG 条件引导；推理时选择/约束（扩展） | [DPM-Solver](https://arxiv.org/abs/2206.00927)（基础背景论文）；[UniPC](https://arxiv.org/abs/2302.04867)（基础背景论文）；[Classifier-Free Guidance](https://arxiv.org/abs/2207.12598)（基础背景论文）；[Flow Matching](https://arxiv.org/abs/2210.02747)（基础背景论文） |
| 效率与系统 | 少步蒸馏/一致性；KV/去噪/VAE 三种缓存；稀疏注意力；量化/混合精度；序列/流水线/CFG 并行；内存与解码成本 | [CausVid](https://arxiv.org/abs/2412.07772)（研究方法）；[AnimateLCM](https://arxiv.org/abs/2402.00769)（研究方法）；[VideoLCM](https://arxiv.org/abs/2312.09109)（研究方法）；[Self Forcing](https://arxiv.org/abs/2506.08009)（研究方法）；[TeaCache](https://arxiv.org/abs/2411.19108)（研究方法）；[Wan-VAE](https://arxiv.org/abs/2503.20314)（表示/编解码器）；[VSA](https://arxiv.org/abs/2505.13389)（研究方法）；[ViDiT-Q](https://arxiv.org/abs/2406.02540)（研究方法）；[xDiT](https://arxiv.org/abs/2411.01738)（工程系统）；[FastVideo](https://github.com/hao-ai-lab/FastVideo)（官方项目） |

求解器和 CFG 条目是通用基础论文；视频兼容性与性能需绑定具体实现。三种缓存的代表作分别为 Self Forcing（KV）、TeaCache（去噪）及 Wan-VAE（编解码）。

## 子领域的技术内容

| 子领域 | 继续展开的细节 | 需要记录的条件与权衡 | 调研入口 |
| --- | --- | --- | --- |
| 数据过滤 | 切段、重复、视觉质量、运动量、文字与视频匹配 | 过滤阈值与数据覆盖；过度过滤可能改变运动/场景分布 | [R07](../../research/sources.md#r07)、[R04](../../research/sources.md#r04) |
| Caption | 对象、动作、相机、时间描述及重标注 | 描述质量与遗漏；训练 caption 与评测提示扩写分开 | [R05](../../research/sources.md#r05) |
| 预训练 | 初始化、图像视频混合、逐步提高尺寸和时长 | 数据阶段、损失、采样、适配不同形状；不把通用阶段视为唯一配方 | [R07](../../research/sources.md#r07)、[R06](../../research/sources.md#r06) |
| LoRA/Adapter | 可训练参数、目标层、秩和适配内容 | 它描述参数化，不规定 SFT、偏好或 RL 目标 | [R31](../../research/sources.md#r31)，视频应用另看 [R07](../../research/sources.md#r07) |
| SFT/自训练 | 高质量样本、合成数据来源、筛选、监督目标 | 质量与多样性；合成数据不能因来自教师就视为真值 | [R03](../../research/sources.md#r03) |
| 蒸馏 | 教师/学生、输出/轨迹/分布监督、步数与依赖转换 | 蒸馏不只减步数；学生结构或时间依赖也可能改变 | [R22](../../research/sources.md#r22) |
| 偏好与奖励 | 偏好对、参考模型、奖励粒度、离线与在线样本 | 数据偏差、多目标冲突、奖励过拟合；优化奖励不等于普遍变好 | [R36](../../research/sources.md#r36)、[R42](../../research/sources.md#r42) |
| 时序训练 | 历史来源、rollout、噪声设置、长序列与梯度范围 | 训练推理分布、暴露偏差与长程稳定性 | [R20](../../research/sources.md#r20)、[R21](../../research/sources.md#r21)、[R23](../../research/sources.md#r23) |
| 求解器/CFG | 模型预测、积分/去噪更新、调度及条件组合 | 模型调用次数、引导强度、稳定性、细节和多样性 | [R14](../../research/sources.md#r14)、[R33](../../research/sources.md#r33) |
| 少步/一致性 | 原始教师、学生目标、一步与多步采样 | 原始背景论文的图像结果不直接证明视频效果 | [R32](../../research/sources.md#r32)、[R22](../../research/sources.md#r22) |
| 缓存 | 缓存对象、有效条件、失效与刷新、近似误差 | 三种缓存明确分开，见下表 | [R20](../../research/sources.md#r20)、[R34](../../research/sources.md#r34)、[R04](../../research/sources.md#r04) |
| 稀疏/量化/并行 | 连接选择、精度、通信、负载与布局 | attention 加速不等于端到端加速；兼容性需绑定实现 | [R43](../../research/sources.md#r43)、[R35](../../research/sources.md#r35)、[R23](../../research/sources.md#r23) |

## 详情样例 A：LoRA 与 SFT 是两个维度

实体：`concept.lora`、`concept.sft`。

一句话：LoRA 规定怎样参数化更新；SFT 规定使用监督数据优化模型的训练方式。

页面可以组合“LoRA＋SFT”，也可以出现“LoRA＋偏好目标”。不能把 LoRA 与 SFT 表现成互斥分支。详情先展示冻结权重与低秩增量的教学图，再展开适配层、秩和目标；原始 LoRA 论文是语言模型背景，视频适用性引用视频工作。[R31](../../research/sources.md#r31)、[R07](../../research/sources.md#r07)

## 详情样例 B：蒸馏

实体：`concept.distillation`。

一句话：借助教师的行为或分布信号训练学生，使学生以所需成本或机制生成。

比较字段：教师与学生、监督对象、采样步骤、时间依赖是否变化、训练数据、质量与多样性验证。CausVid 是双向教师与因果学生结合少步蒸馏的例子，说明蒸馏不仅改变步数。[R22](../../research/sources.md#r22)

图像一致性模型用于解释背景思想；视频代表作可读 AnimateLCM 与 VideoLCM，不用 LCM 原论文的图像性能替代视频证据。[R32](../../research/sources.md#r32)、[R61](../../research/sources.md#r61)、[R62](../../research/sources.md#r62)

## 详情样例 C：三种缓存

| 共享实体 | 复用什么 | 有效性问题 | 具体入口 |
| --- | --- | --- | --- |
| `concept.kv-cache` | 历史 token/帧的注意力 key/value | 历史状态、掩码或提示改变后是否仍可用；去噪状态是否相同 | Self Forcing、LongLive |
| `concept.denoising-cache` | 不同去噪步骤中的模型/层计算 | 复用近似误差、变化阈值、刷新时机 | TeaCache |
| `concept.vae-cache` | 分块编解码中的历史卷积特征 | 因果边界、首块 padding、块间连续 | Wan-VAE |

依据：[R20](../../research/sources.md#r20)、[R23](../../research/sources.md#r23)、[R34](../../research/sources.md#r34)、[R04](../../research/sources.md#r04)。

缓存详情必须写出“何时失效”。不在所有整段双向去噪模型中默认宣称历史 KV 都能直接复用。

## 详情样例 D：偏好与奖励优化

实体：`concept.preference-optimization`、`concept.reward-rl`。

页面以“偏好对 → 训练目标”和“生成样本 → 奖励 → 参数更新”两条教学流程区分离线偏好与在线奖励方法。LocalDPO 为区域级偏好提供案例，DanceGRPO 为视觉生成中的 GRPO 适配提供案例。[R36](../../research/sources.md#r36)、[R42](../../research/sources.md#r42)

必须同时提供独立评测链接，说明训练奖励与最终评测是否相同。用户可以比较语义、画质、运动和一致性的取舍。

## 专题页面设计

首屏用数据 → 预训练 → 后训练/适配 → 推理 → 评测流程。每一阶段点击后展开其技术树；参数更新方式作为可组合属性呈现。

效率比较使用“优化对象、是否需训练、适用骨干、近似性、质量检查、端到端测量”六列。FastVideo 作为工程索引入口，不将框架名视为一种生成范式，也不在本轮安装或运行。[R35](../../research/sources.md#r35)

实验卡片字段：硬件/设备数、精度、分辨率、帧数与播放 FPS、步数与模型调用次数、批大小、预热、计时范围、基线及模型版本。去噪吞吐、解码吞吐、端到端吞吐分开显示。

关联：[范式目标](02-paradigms.md)、[时序训练差异](03-temporal.md)、[架构成本](04-architecture.md)、[效率与独立评测](07-capabilities.md)。

## 编辑优先级与验收

P0：数据、渐进训练、SFT/LoRA 区分、蒸馏、CFG、三种缓存。P1：偏好/RL、时序训练、稀疏、量化和并行。P2：推理时搜索、具体后训练配方的实现复现及跨系统性能对照。

验收：目标/参数化/采样/系统四维可组合；每个优化说明适用条件；未经同设置核验不做速度排名；视频后训练实例与图像/语言背景来源区分。
