# 03 模型实验与训练

[返回全局架构](../../../README.md) · [上一阶段：数据工程](../02-data/README.md) · [下一阶段：评测与验收](../04-evaluation/README.md)

- **职责**：复现基线、验证模型或训练方法，按需要进行预训练、微调或蒸馏，并对比实验结果。
- **输入 → 输出**：目标、数据集版本与基线模型 → 实验记录、训练配置和模型 Checkpoint。
- **Infra 用途**：通过 PAAS DLC 创建实验与训练任务，或按平台任务提交 Skill 的说明提交；关键实验记录协议关联代码、环境、数据、参数、运行证据与模型 Checkpoint。
- **浏览复用**：[统一 DataViewer](../../platform/data-viewer/README.md)用于实验样例与中间结果检查，复用多模态浏览组件。
- **记录方式**：运行事实以 PAAS 任务记录为准，当前通过任务 ID / 链接关联；工作台自动采集与同步待接入。影响技术路线或交付决策的实验补充简短 MD，沉淀结论并链接原始证据。
- **项目关联**：运行携带 `project_id`，必要时增加 `task_id`；实验、模型版本与结论关联到[项目生命周期管理](../../platform/project-lifecycle/README.md)中的工作项和里程碑。
- **边界**：算力分配与制品存储复用公共底座，生成质量交由 04 评测；允许从已有模型起步。

## 平台与工具

| 工具 | 用途 | 入口 |
| --- | --- | --- |
| PAAS DLC | 创建模型实验与训练任务，按平台表单填写运行配置 | [创建 DLC 任务](https://paas.myhexin.com/mfasset/model/list/createtraintask?projectId=37&tenantId=262&from=trainTaskModelCreate) |
| PAAS 任务提交 Skill | 查看 Skill 说明与接入方式，按其要求准备参数并提交任务 | [查看提交任务 Skill](https://paas.myhexin.com/skill-market-front/skill-detail/953847f3-d535-44e0-8a31-9c66060a580a) |
| 关键实验记录协议 | 保存重要实验的假设、版本、证据与结论 | [实验记录说明](../../../../algorithm-template/experiments/README.md) |

DLC 默认入口使用 PAAS 项目 `37`、租户 `262`。提交前确认平台中的项目、租户及可用资源；其他团队可通过 `web/config.local.json` 覆盖地址。

## 使用流程

1. **准备实验**：明确本次假设与评测口径，固定代码提交、运行镜像、数据集与基线模型版本，准备启动命令、资源需求和输出位置。
2. **创建与提交**：进入 DLC 创建页面填写配置，或进入平台 Skill 详情按说明接入与提交；实际字段、认证方式和支持的任务类型以平台当前说明为准。
3. **关联结果**：保存平台返回的任务 ID / 链接、实际配置、日志与结果引用；将模型 Checkpoint 交给 [04 评测与验收](../04-evaluation/README.md)，关键实验按协议补充结论。

PAAS 保存任务执行事实，项目仓库保存实验定义与确认结论。任务提交成功、训练完成和模型质量验收分别记录；平台 `projectId=37` 与项目协议的 `project_id` 分别保存并建立关联。

## 详细文档

- [PAAS DLC 入口、任务提交与实验关联设计](001-paas-dlc.design.md)
