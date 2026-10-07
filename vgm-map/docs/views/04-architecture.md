# 04 模型结构与表示

用户问题：视频如何变成模型可处理的表示，网络怎样连接时间、空间与条件？

定位：拆解模块与信息流。骨干、表示、注意力拓扑和生成顺序是不同属性；同一个模型可以同时具有这些属性。

## 展开大纲

```text
模型结构与表示
├── 视频表示 Representation
│   ├── 像素空间
│   ├── 连续潜变量
│   └── 离散 token
├── 视频编解码器 Codec / Tokenizer
│   ├── 逐帧图像自编码器
│   ├── 时空视频 VAE
│   ├── 因果卷积与分块编解码
│   └── 离散 tokenizer / codebook
├── 骨干 Backbone
│   ├── CNN / U-Net / 3D U-Net
│   ├── DiT / 视频 Transformer
│   ├── 自回归 Transformer
│   └── 多流、多模态骨干；其他结构（扩展）
├── Token 化与位置
│   ├── 时空 patch / tubelet
│   ├── 时间与空间坐标
│   ├── 3D RoPE / 位置编码
│   └── 分辨率、时长变化与坐标外推
├── 时空连接与注意力
│   ├── 全时空注意力
│   ├── 空间/时间分解注意力
│   ├── 窗口与稀疏注意力
│   └── 因果/块因果掩码
├── 条件编码与注入
│   ├── 文本、图像、音频等条件编码器
│   ├── 拼接与联合注意力
│   ├── 交叉注意力
│   ├── AdaLN / 调制
│   └── Adapter / 额外控制分支
└── 模块级效率
    ├── Token 数与压缩选择
    ├── 分块解码与特征缓存
    └── 稀疏计算和并行（工程交叉入口）
```

## 子分类与代表作

完整贡献说明与分类边界见 [分类目录](../02-subclasses-and-representative-works.md#view-architecture)；此表给出本专题每个直接子类的原论文/官方项目入口。各项技术点可继续展开，具体覆盖以作品的贡献说明为准。

| 子类 | 继续展开的技术点 | 代表作 |
| --- | --- | --- |
| 视频表示 | RGB/像素表示；连续压缩潜变量；离散视觉 token | [Video Diffusion Models](https://arxiv.org/abs/2204.03458)（生成模型/系统论文）；[Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文）；[MAGVIT-v2](https://arxiv.org/abs/2310.05737)（表示/编解码器） |
| 视频编解码器 | 逐帧二维编码；时空三维压缩；因果视频 VAE；离散视频 tokenizer | [Stable Video Diffusion](https://arxiv.org/abs/2311.15127)（生成模型/系统论文）；[Wan-VAE](https://arxiv.org/abs/2503.20314)（表示/编解码器）；[CogVideoX VAE](https://arxiv.org/abs/2408.06072)（表示/编解码器）；[MAGVIT-v2](https://arxiv.org/abs/2310.05737)（表示/编解码器） |
| 骨干 | 视频 U-Net；视频 DiT；自回归 Transformer；多模态/多分支骨干 | [Video Diffusion Models](https://arxiv.org/abs/2204.03458)（生成模型/系统论文）；[Latte](https://arxiv.org/abs/2401.03048)（生成模型/系统论文）；[CogVideoX](https://arxiv.org/abs/2408.06072)（生成模型/系统论文）；[VideoPoet](https://arxiv.org/abs/2312.14125)（生成模型/系统论文） |
| Token 化与位置 | 时空 patch/token 化；空间、时间坐标编码；3D RoPE；长度/分辨率外推（后续验证） | [CogVideoX](https://arxiv.org/abs/2408.06072)（生成模型/系统论文）；[Latte](https://arxiv.org/abs/2401.03048)（生成模型/系统论文）；[Wan](https://arxiv.org/abs/2503.20314)（生成模型/系统论文） |
| 时空连接与注意力 | 全时空注意力；空间—时间分解；局部/稀疏注意力；因果/块因果注意力 | [CogVideoX](https://arxiv.org/abs/2408.06072)（生成模型/系统论文）；[Latte](https://arxiv.org/abs/2401.03048)（生成模型/系统论文）；[VSA](https://arxiv.org/abs/2505.13389)（研究方法）；[CausVid](https://arxiv.org/abs/2412.07772)（研究方法） |
| 条件编码与注入 | 条件编码器；拼接/联合序列；交叉注意力；AdaLN 调制；Adapter/条件分支 | [CogVideoX](https://arxiv.org/abs/2408.06072)（生成模型/系统论文）；[Wan](https://arxiv.org/abs/2503.20314)（生成模型/系统论文）；[DynamiCrafter](https://arxiv.org/abs/2310.12190)（研究方法）；[VACE](https://arxiv.org/abs/2503.07598)（研究方法） |
| 模块级效率 | 潜变量/token 压缩；分块编解码与特征缓存；稀疏连接；结构与并行布局 | [Wan-VAE](https://arxiv.org/abs/2503.20314)（表示/编解码器）；[MAGVIT-v2](https://arxiv.org/abs/2310.05737)（表示/编解码器）；[VSA](https://arxiv.org/abs/2505.13389)（研究方法）；[xDiT](https://arxiv.org/abs/2411.01738)（工程系统） |

## 子领域的技术内容

| 子领域 | 深入细节 | 需要比较的属性 | 调研入口 |
| --- | --- | --- | --- |
| 表示 | 编码/解码关系；连续与离散表示；重建与生成误差 | 是否有 tokenizer、表示大小、可表达的细节与运动 | [R13](../../research/sources.md#r13)、[R17](../../research/sources.md#r17) |
| 视频 VAE | 空间与时间压缩、首帧约定、latent 通道、重建损失 | 压缩因子、边界处理、解码延迟、闪烁与细节 | [R04](../../research/sources.md#r04)、[R05](../../research/sources.md#r05) |
| 因果编解码 | 卷积填充、归一化是否泄漏未来、分块历史特征 | 只确认该模块的因果性；首块和后续块处理可能不同 | [R04](../../research/sources.md#r04)、[R05](../../research/sources.md#r05) |
| 骨干 | 多尺度卷积与 token 序列处理；训练目标由范式决定 | 模块结构、条件融合、参数与计算规模 | [R16](../../research/sources.md#r16)、[R19](../../research/sources.md#r19) |
| Patch/位置 | latent 切块、时间坐标、空间坐标及不同长度映射 | token 数、运动跨 patch 对应、分辨率变化 | [R05](../../research/sources.md#r05) |
| 全时空注意力 | 不同帧与空间位置的连接范围 | 大运动的信息路径、序列长度和计算代价 | [R05](../../research/sources.md#r05) |
| 分解/稀疏 | 空间时间分解、固定窗口、数据相关路由、可训练稀疏 | 固定与自适应模式；训练与推理拓扑是否一致 | [R43](../../research/sources.md#r43)、[R35](../../research/sources.md#r35) |
| 因果掩码 | 被禁止的信息边、块内和块间规则 | tokenizer、骨干、训练采样与输出分别标注 | [R17](../../research/sources.md#r17)、[R22](../../research/sources.md#r22) |
| 条件注入 | 编码特征的进入位置、融合算子和可训练模块 | 条件粒度、时间覆盖、模型改动与组合兼容性 | [R13](../../research/sources.md#r13)、[R05](../../research/sources.md#r05)、[R29](../../research/sources.md#r29) |

分解注意力、稀疏注意力和因果掩码可以组合；不是只能三选一。3D U-Net 的卷积结构与 3D attention 的连接范围也不能当作同一概念。

## 模型拆解表

模型详情至少提供：视频表示、codec、token 划分、骨干、位置编码、注意力连接、因果范围、条件编码/注入、训练目标和采样方式。每项能关联到独立技术节点。

首轮可深入展示 CogVideoX 与 Wan 的公开论文模块，并将 HunyuanVideo 作为系统案例继续补读。不同论文版本和后续检查点不自动共享所有属性。

## 详情样例 A：时空视频 VAE

实体：`concept.video-vae`；别名：Video VAE、视频自编码器。

一句话：把视频压缩成潜变量，并从潜变量重建视频，为生成模型提供更紧凑的表示。

主图：像素视频 → 编码器 → 时空 latent → 解码器 → 重建视频。先展示重建过程，再叠加潜变量生成器；避免让用户以为训练视频 VAE 就完成了整个视频生成模型。

细节区展示压缩、因果边界、首帧、分块解码、重建误差。Wan 和 CogVideoX 都提供因果视频 VAE 的原论文依据，但其模块因果性不决定整个生成流程的因果性。[R04](../../research/sources.md#r04)、[R05](../../research/sources.md#r05)

## 详情样例 B：视频 DiT

实体：`concept.dit`。

一句话：用 Transformer 处理生成过程中的视频表示，并结合条件与生成时间信息预测所需输出。

原始 DiT 在图像潜空间中以 Transformer 替换常见的 U-Net 骨干；视频模型需要继续处理时间位置和时空连接。[R16](../../research/sources.md#r16)

教学模块图依次展开 patchify、位置编码、条件融合、Transformer block、unpatchify。每一步注明“示意模块”，具体模型可以采用不同融合方法；输出也可能是噪声或速度，取决于训练目标。

## 详情样例 C：Token 数与注意力连接

实体：`concept.spatiotemporal-attention`。

在各维长度可被 patch 尺寸整除的教学示例中：

```text
N = (T_lat / p_t) × (H_lat / p_h) × (W_lat / p_w)
```

实际首帧、padding 和分块约定另列。主图比较全连接、空间时间分解、窗口和因果连接；“哪些 token 可互相访问”与“何时生成输出”分成两张图。

CogVideoX 讨论 3D full attention，VSA 提供可训练稀疏注意力案例。本页仅展示连接策略及对应问题，不从减少连接数量直接宣称端到端加速。[R05](../../research/sources.md#r05)、[R43](../../research/sources.md#r43)

## 专题页面设计

首屏显示可展开的模块流水线。点击模块展示子领域；右侧详情仍遵循统一模板。进入具体模型后，高亮该模型采用的模块组合，并为未知项保留空缺说明。

架构比较按同一组字段逐项对照，不用参数量替代设计差异。筛选：表示、codec 因果性、骨干、注意力连接、条件注入；骨干因果性单独筛选。

关联：[范式](02-paradigms.md)、[时序依赖](03-temporal.md)、[控制机制](05-control.md)、[模块效率与资源](06-training-inference.md)。

## 编辑优先级与验收

P0：连续/离散表示、视频 VAE、DiT、时空注意力、条件注入。P1：3D RoPE、稀疏注意力、模型拆解比较、音视频多流。P2：其他骨干、tokenizer 专项比较与完整代码级核验。

验收：每个模块都说明输入输出；压缩器与生成器分开；全时空/分解/稀疏/因果属性允许组合；涉及模型结构的标签有具体论文版本支持。
