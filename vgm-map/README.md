# 视频生成技术地图：内容与体验设计

本目录保存视频生成技术地图的调研、分类和页面设计。现已接入 AIGC-infra 门户左侧的“视频生成技术汇总”，通过搜索栏下方的七色横排按钮原位切换分类树、子类解释与代表作，并提供跨类搜索与资料阅读。

版本：0.2；调研核验日期：2026-10-07（Asia/Shanghai）。

设计起点是用户提供的[视频生成分类整理对话](https://chatgpt.com/share/6ac5ee37-04e0-83e8-9d02-8fdca2f9ba2b)。分享对话已通过本机 Clash 代理读取；它提供需求与组织思路，技术判断另以原论文和官方资料核验。

网页入口：`#/video-generation`；页面实现及维护方式见 [门户技术汇总设计](../docs/platform/001-video-generation-map.design.md)。以下资料继续作为分类与来源的权威内容。

## 子分类与代表作

从 [七大类、54 个子类与代表作完整目录](docs/02-subclasses-and-representative-works.md) 开始，可逐项查看 191 个继续展开的技术点、206 条作品映射及选入理由。每个子类至少有两项原论文或官方项目链接；同一作品允许跨视角归类。

机器可读映射保存在 [representative-works.json](data/representative-works.json)，与已有知识索引中的子类 ID 一致。七篇专题也已加入各自的子类—代表作表。来源总目录现有 76 项，其中本轮新增 33 项。

## 阅读顺序

1. [内容模型与分类边界](docs/00-content-model.md)：解释七个视角、多层大纲与共享节点。
2. [页面与展开交互](docs/01-interaction-design.md)：说明总览、领域页、技术详情、跨视角跳转和搜索。
3. 以下七个专题：每篇包括展开树、子领域的技术细节、详情样例、比较维度、专题展示方式与内容验收条件。
4. [调研结论与待深入问题](research/findings.md)、[来源目录](research/sources.md)、[跨视角代表案例](research/representative-cases.md)：区分已核验信息、设计建议和研究缺口。
5. [结构化知识索引](data/knowledge-map.json)：保存核心实体、导航入口和有证据的关联，供后续内容管理使用。

当前形成 7 篇专题设计、54 个直接子类、191 个展开技术点、76 项原始来源、108 个核心实体、55 个导航分组和 39 条跨节点关系。[内容检查记录](research/validation.md)包含链接、ID 和引用检查结果。

| 专题 | 核心问题 | 设计文档 |
| --- | --- | --- |
| 任务与输入输出 | 给模型什么，得到什么？ | [01-tasks.md](docs/views/01-tasks.md) |
| 生成范式 | 如何定义生成过程？ | [02-paradigms.md](docs/views/02-paradigms.md) |
| 时序生成机制 | 视频时间如何展开？ | [03-temporal.md](docs/views/03-temporal.md) |
| 模型结构与表示 | 视频如何编码，网络如何处理？ | [04-architecture.md](docs/views/04-architecture.md) |
| 可控性 | 如何约束生成内容？ | [05-control.md](docs/views/05-control.md) |
| 训练与推理 | 如何训练、适配与加速？ | [06-training-inference.md](docs/views/06-training-inference.md) |
| 能力与核心问题 | 生成得怎样，如何评估？ | [07-capabilities.md](docs/views/07-capabilities.md) |

## 内容层级

```text
vgm-map/
├── README.md
├── docs/
│   ├── 00-content-model.md
│   ├── 01-interaction-design.md
│   ├── 02-subclasses-and-representative-works.md  子分类、代表作与选入理由
│   └── views/                 七类专题设计
├── research/
│   ├── sources.md             可阅读的原始来源目录
│   ├── sources.json           来源 ID、URL、核验深度
│   ├── findings.md            调研如何改变设计
│   ├── representative-cases.md 跨视角代表案例与未知项
│   └── validation.md          本轮文档与索引检查结果
└── data/
    ├── knowledge-map.json     核心知识实体与七个导航投影
    └── representative-works.json  子类、展开技术点与作品映射
```

## 本轮交付边界

本轮形成可供审阅的详细内容架构与体验规格。专题展开树覆盖主要方向，结构化索引只收录首批核心实体；索引范围不等于全部研究方向。技术样例用于说明详情页写法，其他叶节点提供编辑提纲与调研依据，尚未全部扩写成完整教材。

不采用“七类互斥”“因果 VAE 等于因果生成”“模型家族名代表所有版本能力”等假设。性能数值、模型支持条件和实验结论必须绑定版本与实验设置。

P0 表示首批详细内容；P1 表示随后补充的深入内容；P2 表示需要专门调研的扩展。它们是内容编辑优先级，不是技术水平或研究价值排名。
