# 02 生成范式

用户问题：模型如何定义生成过程，训练时学习什么，推理时如何得到样本？

定位：面向算法理解的入口。用统一问题比较不同范式，网络骨干、时间依赖和视频表示分别链接到其他视角。

## 展开大纲

```text
生成范式
├── 对抗生成 GAN
│   ├── 生成器与判别器
│   └── 对抗目标与条件生成
├── 变分潜变量生成 VAE
│   ├── 编码器、解码器与先验
│   ├── 变分下界与重参数化
│   └── 与“视频压缩 VAE”的角色区分
├── 扩散与得分建模
│   ├── DDPM 与离散噪声步骤
│   ├── 连续时间得分/去噪视角
│   ├── 预测参数化：噪声、样本、速度
│   └── 潜空间扩散（表示交叉入口）
├── 流与速度场建模
│   ├── Flow Matching
│   ├── Rectified Flow
│   ├── 概率路径与样本耦合
│   └── 连续流与一般可逆流的背景
├── 自回归生成 Autoregressive
│   ├── 离散 token 条件预测
│   ├── 连续潜变量条件生成
│   └── 生成单位与条件分解
├── 掩码生成 Masked Generation
│   ├── 掩码 token 预测
│   └── 迭代补全与生成顺序
└── 混合范式 Hybrid
    ├── 自回归外层＋扩散/流内部生成
    ├── 全局规划＋局部渲染
    └── 粗到细多阶段组合
```

扩散、流和混合路线的分支用于组织阅读，不是严格数学集合。Rectified Flow 不简单等同于所有 Flow Matching；潜空间是表示选择，出现于多个范式。

## 子分类与代表作

完整贡献说明与分类边界见 [分类目录](../02-subclasses-and-representative-works.md#view-paradigms)；此表给出本专题每个直接子类的原论文/官方项目入口。各项技术点可继续展开，具体覆盖以作品的贡献说明为准。

| 子类 | 继续展开的技术点 | 代表作 |
| --- | --- | --- |
| 对抗生成 | 视频级对抗学习；内容—运动解耦；时间生成器＋逐帧生成器 | [MoCoGAN](https://arxiv.org/abs/1707.04993)（研究方法）；[TGAN](https://arxiv.org/abs/1611.06624)（研究方法）；[GAN 原论文](https://arxiv.org/abs/1406.2661)（基础背景论文） |
| 变分潜变量生成 | 随机未来帧预测；固定/学习式随机先验；潜变量与重建、预测目标 | [SV2P](https://arxiv.org/abs/1710.11252)（研究方法）；[SVG](https://arxiv.org/abs/1802.07687)（研究方法）；[Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)（基础背景论文） |
| 扩散与得分建模 | 像素空间视频扩散；潜空间视频扩散；去噪/得分与预测参数化 | [Video Diffusion Models](https://arxiv.org/abs/2204.03458)（生成模型/系统论文）；[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文）；[DDPM](https://arxiv.org/abs/2006.11239)（基础背景论文）；[Latent Diffusion Models](https://arxiv.org/abs/2112.10752)（基础背景论文） |
| 流与速度场建模 | Flow Matching；Rectified Flow；路径设计与速度场回归 | [Flow Matching](https://arxiv.org/abs/2210.02747)（基础背景论文）；[Rectified Flow](https://arxiv.org/abs/2209.03003)（基础背景论文）；[Wan](https://arxiv.org/abs/2503.20314)（生成模型/系统论文） |
| 自回归生成 | 离散视觉 token 自回归；连续帧/块自回归；文字、视觉、音频的多模态序列 | [VideoPoet](https://arxiv.org/abs/2312.14125)（生成模型/系统论文）；[Self Forcing](https://arxiv.org/abs/2506.08009)（研究方法）；[Genie](https://arxiv.org/abs/2402.15391)（相邻研究领域） |
| 掩码生成 | 离散 token 掩码预测；迭代填充；多任务掩码条件 | [MAGVIT](https://arxiv.org/abs/2212.05199)（生成模型/系统论文）；[Phenaki](https://arxiv.org/abs/2210.02399)（生成模型/系统论文） |
| 混合范式 | 自回归＋扩散；全局规划＋局部生成；粗到细/多阶段生成 | [Self Forcing](https://arxiv.org/abs/2506.08009)（研究方法）；[CausVid](https://arxiv.org/abs/2412.07772)（研究方法）；[MovieDreamer](https://arxiv.org/abs/2407.16655)（研究方法）；[VideoDirectorGPT](https://arxiv.org/abs/2309.15091)（研究方法） |

基础论文与视频作品分别标注；变分视频预测与用于压缩的视频 VAE 分开归类。

## 子领域的技术内容

| 子领域 | 深入内容 | 需要避免的推断 | 调研入口 |
| --- | --- | --- | --- |
| GAN | 两个网络的角色、对抗目标、条件注入；视频扩展涉及时间判别与运动建模 | 一次前向采样不意味着训练简单或覆盖所有分布 | [R10](../../research/sources.md#r10)、[R01](../../research/sources.md#r01) |
| VAE | 先验、近似后验、重建项与 KL 项；重参数化 | 存在 VAE 模块不等于整个视频生成器采用 VAE 采样 | [R11](../../research/sources.md#r11)、[R13](../../research/sources.md#r13) |
| DDPM/得分建模 | 加噪分布、去噪目标、噪声调度、离散与连续解释 | 训练目标、预测参数化和采样器不能合成一个标签 | [R12](../../research/sources.md#r12)、[R19](../../research/sources.md#r19) |
| 潜空间扩散 | 编码、潜空间建模、解码；压缩误差与生成误差 | 更少 token 不保证所有细节或运动被保留 | [R13](../../research/sources.md#r13)、[R07](../../research/sources.md#r07) |
| Flow Matching | 条件路径、速度场监督、采样时间分布、数值积分 | 学习直线路径监督不保证实际模型轨迹绝对直线或单步优质 | [R14](../../research/sources.md#r14) |
| Rectified Flow | 直线插值、耦合、rectification/reflow；与其他流训练的关系 | 名称相近不能合并；方法的速度收益需要实验设置 | [R15](../../research/sources.md#r15) |
| 自回归 | 概率条件分解、token/帧/块单位、条件采样器 | 沿 token 顺序自回归不一定等于沿视频帧顺序生成 | [R18](../../research/sources.md#r18)、[R20](../../research/sources.md#r20) |
| 掩码生成 | 掩码模式、双向上下文、迭代预测和置信度/采样策略 | tokenizer 使用因果注意力不代表生成器是因果的 | [R17](../../research/sources.md#r17) |
| 混合路线 | 对每一阶段分别描述表示、训练目标、生成顺序与误差传播 | “AR＋Diffusion”本身还不能说明哪一部分负责时间或细节 | [R20](../../research/sources.md#r20)、[R24](../../research/sources.md#r24) |

## 统一比较表的字段

比较对象使用训练目标、预测对象、状态表示、生成步骤、条件处理、时间单位、典型瓶颈与失败模式。各项先给定性解释；不同模型的数值性能另以绑定实验的记录展示。

“扩散 → DiT → Flow → AR”的单线进化图会混合范式、结构和时间顺序。建议用历史时间轴介绍代表工作，同时用关系线标注并行及交叉路线。

## 详情样例 A：Flow Matching

实体：`concept.flow-matching`；别名：FM、流匹配。

一句话：通过回归概率路径上的速度场，学习从基础分布到数据分布的连续生成过程。[R14](../../research/sources.md#r14)

以下为线性条件路径的教学简化，不覆盖所有路径、耦合或模型实现：

```text
z：基础分布样本；x：数据样本；s：生成路径时间
x_s = (1-s)z + sx
监督速度 = x-z
目标 = 预测速度与监督速度的平方误差期望
```

视频自身的时间轴另用 τ 表示，不能和路径时间 s 混用。推理区说明数值求解器与步数属于采样选择；若要解释某一模型，必须补充其噪声约定、时间采样及求解设置。

建议可视化：同一个视频潜变量在不同 s 上的状态，加上速度箭头。图旁始终注明它展示的是生成路径时间。

## 详情样例 B：自回归与扩散组合

实体：`concept.ar-diffusion`。

一句话：外层按顺序生成 token、帧或块，内层用扩散模型生成当前单元。

教学条件分解为 `p(z_1,…,z_N | c) = ∏ p(z_i | z_<i,c)`；每一项的条件生成器仍可执行多步去噪。N 的含义由当前方法的生成单位决定。

展开区先展示外层依赖，再展示单元内部的去噪步骤，避免把两个时间轴混在同一动画里。Self Forcing 为这一路线提供具体训练案例。[R20](../../research/sources.md#r20)

## 详情样例 C：掩码视频 token 生成

实体：`concept.masked-generation`。

一句话：根据可见条件与已有 token 预测缺失 token，逐步完成视频表示。

Phenaki 使用离散视频表示和双向掩码 Transformer；它的 tokenizer 又使用时间因果注意力。该案例适合展示“表示模块属性与生成器属性分别记录”。[R17](../../research/sources.md#r17)

## 专题页面设计

首屏先显示每个范式的一句话和生成过程缩略图；选中后再展开训练目标。比较面板最多先选两条路线，字段保持一致。

筛选：离散/连续表示、单阶段/多阶段、迭代生成、条件生成。筛选结果是满足标签的条目，不用于推断全领域的优劣排名。

关联入口：骨干结构 → 架构；帧/块顺序 → 时序；调度器、CFG、蒸馏 → 训练推理。

## 编辑优先级与验收

P0：扩散、FM、AR、混合范式与角色消歧。P1：掩码生成、Rectified Flow、GAN/VAE 背景。P2：完整连续流理论、精确似然和更多视频范式实例。

验收：每条路线有训练与采样两段解释；DiT 不与 Diffusion 并列为范式；视频时间与去噪时间分开；图像背景论文的结果不直接外推到视频。
