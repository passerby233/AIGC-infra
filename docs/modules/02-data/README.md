# 02 数据工程

[返回全局架构](../../../README.md) · [上一阶段：目标与基准](../01-goals/README.md) · [下一阶段：模型实验与训练](../03-training/README.md)

- **职责**：管理下载交付与来源元数据，完成视频入库、切片、质量筛选、描述标注、条件配对及数据划分。
- **输入 → 输出**：数据需求与原始素材 → 下载交付报告、可追溯的成品数据集版本、元数据及划分清单。
- **Infra 用途**：复用现有 MongoDB、音视频处理管线与 PASS 数据平台；通过 Parquet 索引和 JSONL 样本清单组织训练取用，保存加工过程和训练 / 验证 / 测试边界。
- **浏览复用**：[统一 DataViewer](../../platform/data-viewer/README.md)用于数据抽样、条件配对检查与质量浏览，接入现有数据平台。
- **项目关联**：处理运行携带 `project_id`，必要时增加 `task_id`；数据集版本与处理记录作为证据，关联到[项目生命周期管理](../../platform/project-lifecycle/README.md)中的工作项和里程碑。
- **边界**：本模块定义数据内容与加工规则；存储和通用任务执行复用公共底座。Latent、文本特征缓存按模型与训练方式需要建设，并关联编码器版本。

## 两层抽象与模块入口

数据工程按获取、处理、存储与版本、验收、消费五个能力模块协作；具体团队和负责人在接入时登记。数据验收按项目规则组织抽检、保存证据，由负责人确认结论。上层展示能力分工和工具入口，存储读写贯穿所有环节，排列不表示真实数据流转顺序。下层「数据处理管线」展开上层「数据处理」模块，分别展示 SingleShot / MultiShot 的步骤依赖。点击 Stage 保持管线与滚动位置，只切换下方当前模块的处理能力和输入输出详情。

| 模块 | 承担角色 | 交付或使用的内容 | 说明与入口 |
| --- | --- | --- | --- |
| 获取与下载 | 下载器 / 采集侧 | 原片、来源 meta、下载状态与交付报告 | [模块说明](002-data-modules.design.md#获取与下载) · [下载交付需求](https://jira.myhexin.com/browse/TCLOUD-12854) |
| 处理与管线 | avproc-ray / 算子侧 | 切片、指标、caption、条件与运行记录 | [模块说明](002-data-modules.design.md#处理与管线) · [内部管线](003-data-processing.design.md) · [代码入口](https://git-cc.myhexin.com:6443/10jqka/llm/aigc-05-04/avproc-ray) |
| 存储与版本 | MongoDB / PASS / 公共底座 | 媒体、元数据、固定版本及清单 | [模块说明](002-data-modules.design.md#存储与版本) · [版本协议](001-data-engineering.design.md#数据集版本与训练交付) |
| 验收与抽检 | 数据验收 / 抽检侧，复用 DataViewer | 验收结论、抽检证据与问题引用 | [模块说明](002-data-modules.design.md#验收与抽检) · [DataViewer](../../platform/data-viewer/README.md) |
| 消费与使用 | 训练 / 评测侧 | 固定数据版本、split、媒体与必需条件 | [模块说明](002-data-modules.design.md#消费与使用) · [训练](../03-training/README.md) · [评测](../04-evaluation/README.md) |

完整说明：[上层能力模块与交付](002-data-modules.design.md) · [下层数据处理管线](003-data-processing.design.md)。

## 当前方案与进展

现有规范记录的主链路是：各集群下载后汇总至乌兰察布，在低成本算力上处理并写入 MongoDB，导出 Parquet；按训练需求筛选出 JSONL，同步成品媒体与索引至亚特兰大 OSS，必要时进入 CPFS。原始数据与切片分别使用 `raw_data`、`vidproc` 数据库，媒体保存于存储系统。

[数据下载交付物完善需求 TCLOUD-12854](https://jira.myhexin.com/browse/TCLOUD-12854) **已提需求，开发中**；已敲定使用 **MongoDB 管理下载数据 meta，并在下载过程中写入**。该改进覆盖下载状态、失败续传、汇总统计和来源构造方法，详见[需求文档](001-data-engineering.requirements.md#下载交付完善需求)。进展按本次用户确认记录，不据本地 Jira 快照推断实时状态。

本模块文档供后续 Codex 开发使用。现有规范、已确认方案和本轮设计草案分别标注；字段、接口及尚未验证的算法方案按设计文档继续确认。

## 详细文档

| 文档 | 用途 | 状态 |
| --- | --- | --- |
| [数据工程需求](001-data-engineering.requirements.md) | 现有规范、功能范围、交付与验收要求 | 需求梳理；新增验收场景为草案 |
| [数据工程设计](001-data-engineering.design.md) | 数据对象、下载写库、处理协议、版本与平台接入、后续开发顺序 | 设计草案；下载 meta 的 MongoDB 选型已确认 |
| [数据模块分层与交付](002-data-modules.design.md) | 五个能力模块的职责、工具入口与交付约定 | 模块边界已确认；具体接入待核对 |
| [数据处理管线](003-data-processing.design.md) | SingleShot / MultiShot 的内部步骤、可视化详情与处理边界 | 已接入两张原始 PDF 管线图；实际配置待核对 |

关键待定：下载质量阈值冲突与分包口径、现有数据库字段映射、SingleShot / MultiShot 算子版本、标注与多参考方案、平台适配接口，以及各项目的质量和性能验收门槛。

## 参考资料

原始资料集中见[需求文档中的来源索引](001-data-engineering.requirements.md#参考资料与采用范围)，主要采用数据下载规范、处理规范、管线总图及阶段协议；统计报告作为运行证据，不作为通用接口规范。

补充背景：[Wan 技术报告](https://arxiv.org/abs/2503.20314)；预编码缓存示例：[NeMo 数据准备文档](https://docs.nvidia.com/nemo/automodel/latest/datasets/diffusion-dataset)。模型相关缓存按实际训练方案确定。
