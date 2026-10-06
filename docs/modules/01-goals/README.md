# 01 目标与基准

[返回全局架构](../../../README.md) · [下一阶段：数据工程](../02-data/README.md)

- **职责**：通过 algorithm-template 记录项目解决的问题、预期算法能力、输入输出、范围、主目标、退化约束和验收口径，明确为什么做、怎样判断进步以及何时继续或停止。
- **输入 → 输出**：业务 / 研究诉求、使用场景和已有证据 → 项目仓库中的问题定义、结构化 goal、固定评测与资产引用、里程碑和下一检查点；未来这些定义汇总到算法组 dashboard。
- **Infra 用途**：[algorithm-template](<../../../../algorithm-template/README.md>)提供 Git + Markdown + YAML 的项目通信协议，供人和 Agent 在整个研发流程中读写目标、方案、数据、评测、进展、决策与交付。Goals 所需工具是这套文档记录协议。
- **项目关联**：每个项目从 algorithm-template 初始化，以 `project.yaml.id` 标识项目；运行平台通过映射使用同一 `project_id` 关联证据。算法组 dashboard 未来汇总各项目及其 goal，AIGC-infra 提供该 dashboard 的查看入口，生命周期层连接工作项、里程碑和验收。
- **边界**：项目仓库保存实际目标与变更，dashboard 汇总和链接源记录，AIGC-infra 按研发流程展示工具、用途与跳转入口。01 定义比较口径，04 执行评测；Owner / 使用方确认目标和验收，Agent 辅助检查与起草。

## algorithm-template 的功能与使用场景

新项目从模板初始化并建立自己的 Git 仓库；已有项目可按模板合并协议文件，保留原有代码与历史。模板自身提供文档和字段约定，dashboard、自动采集及网页服务由后续平台建设。

| 场景 | 在项目仓库中使用的协议文件 |
| --- | --- |
| 立项、对齐目标与验收 | `project.yaml`、`docs/problem.md`、`docs/eval.md` |
| 制定方案并连接数据、代码和模型 | `docs/design.md`、`docs/data.md`、`assets.yaml`、`code/location.yaml` |
| 研发检查点、关键实验与调整方向 | `progress.md`、`experiments/`、`decisions/` |
| 评测、目标核对与最终交付 | `docs/eval.md`、原始报告引用、`docs/delivery.md` |

该协议贯穿六阶段，六阶段是工具与能力地图；项目按需要设置阶段及检查点，不强制经历大规模训练或逐阶段串行执行。

## Goal 如何定义

1. 初始化项目，填写稳定 `id`、项目名称、唯一 Owner 和期限。
2. 在 [`docs/problem.md`](<../../../../algorithm-template/docs/problem.md>)说明业务场景、失败例子、预期能力、输入输出、范围内 / 范围外事项，以及成功、阶段推进和停止条件。
3. 在 [`project.yaml`](<../../../../algorithm-template/project.yaml>)填写 `goal.metric / direction / unit / baseline / target`，用 `guardrails` 记录不能退化的约束；未取得同口径证据时 `goal.current` 保持 `null`。
4. 在 [`docs/eval.md`](<../../../../algorithm-template/docs/eval.md>)固定评测集、计算方式、人评和效率测试口径，在 `assets.yaml` 登记不可变评测集等资产，并用 `goal.evalset` 引用。
5. Owner / 使用方确认验收要求，在 `project.yaml` 设置必要里程碑和 `next_checkpoint`，提交第一版项目定义。

Goal 包括能力与验收要求，不仅是一个主指标。`problem.md` 的业务能力、算法效果、关键 case、工程效率、退化约束、可复现交付六类验收项按项目填写；不适用项说明原因。当前数字以 `project.yaml` 为准，详细定义和历史证据通过文档引用保存。

## 后续如何查看和修改

**现在查看**：进入实际项目仓库，先读 `project.yaml` 的 goal、Owner、阶段与下一检查点，再读 `docs/problem.md` 理解边界和验收、`docs/eval.md` 核对口径；沿 `goal.evidence`、实验、进展和决策查看原始依据。这里链接的 algorithm-template 文件是填写模板，实际项目目标以初始化后的项目仓库为准。

**现在修改**：在项目仓库按协议编辑并提交 Git。新结果只更新有证据支持的当前指标、资产和进展；更改目标阈值、范围或评测口径需记录理由、影响和 Owner 确认，必要时新增 ADR，保留旧实验标准。评测口径变化后重测 baseline，不能直接比较异版本结果。详见[目标维护与汇总设计](001-goal-protocol.design.md#查看与修改流程)。

**未来查看**：从 AIGC-infra 进入算法组 dashboard，查看“有哪些项目、各自是什么 goal”，再跳转各项目的目标文档、评测口径与证据。修改仍回到项目仓库，dashboard 更新汇总视图；采集与刷新方式待 dashboard 研发确定。

## 算法组 dashboard：正在开发

后续 Codex 开发 AIGC-infra 网页时，在 goals 模块预留“算法组项目与 Goals”区域，当前仅展示 **“正在开发”**、方案与建设计划：

- 所有项目按 algorithm-template 初始化，目标及验收记录保存在各自仓库。
- dashboard 将汇总项目列表、负责人、goal 与源文档 / 证据入口，帮助查看和比较项目目标。
- dashboard 上线并配置真实地址后，AIGC-infra 提供“查看算法组项目与 Goals”的跳转入口。

当前入口显示开发中状态和建设计划，不提供尚未配置的跳转操作；页面不展示虚构项目、目标或同步结果。建设计划及后续验收见[设计文档](001-goal-protocol.design.md#网页预留位置与建设计划)。

## 详细文档

| 文档 | 用途 | 状态 |
| --- | --- | --- |
| [目标定义、维护与 dashboard 汇总](001-goal-protocol.design.md) | 文件分工、定义与修改流程、未来汇总关系、网页占位及验收场景 | 协议分工按模板和本次要求记录；dashboard 接入细节待研发 |

待定：dashboard 地址、项目登记及算法组归属、仓库采集与权限、刷新与版本展示、深链接规则。具体目标和验收阈值由各项目定义，本模块不集中保存各项目的第二份目标。
