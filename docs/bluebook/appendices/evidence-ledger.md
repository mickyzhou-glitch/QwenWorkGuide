---
title: 主张证据台账
description: V2.0 关键主张的来源、状态与适用边界
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 主张证据台账

> 本页由结构化数据自动生成，请修改 `docs/bluebook/data/evidence-ledger.json`。本文件及其 JSON 源均为公开内容。

已发布主张：13；待核验线索：0。

## 已发布主张

## claim-automation-human-handoff-01

自动化只有在异常时能够停止执行、保护原件、通知责任人、转为人工完成并经重新验证后恢复，才具备进入企业运行的基本条件。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 自动化接管链 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-2/05-automation-boundaries.md#claim-automation-human-handoff-01](/bluebook/part-2/05-automation-boundaries#claim-automation-human-handoff-01) |
| 统计口径 | 不适用：自动化运行控制规则 |
| 适用范围 | 定时任务、浏览器自动化、电脑操控和跨系统工作流 |
| 局限 | 不同系统对撤销和恢复的支持不同；无法撤销的动作需要更严格的事前确认和补救计划。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 自动化运行负责人 |

## claim-connector-authorization-01

连接器用于连接外部数据或工具，实际可访问的数据和可执行动作受当前授权与可用范围约束。

| 字段 | 内容 |
|---|---|
| 主张类型 | product-fact |
| 来源类型 | official-product |
| 来源定位 | [连接器](https://qwenwork.cn/docs/features/connectors) |
| 核验状态 | verified |
| 正文位置 | [docs/bluebook/part-2/04-skills-connectors-expert-kits.md#claim-connector-authorization-01](/bluebook/part-2/04-skills-connectors-expert-kits#claim-connector-authorization-01) |
| 统计口径 | 官方连接器页面公开说明 |
| 适用范围 | 连接外部数据源、账号和工具动作的任务 |
| 局限 | 连接器清单、授权方式和可执行动作可能变化，应以使用时页面、组织配置和账号实测为准。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 产品事实核验者 |

## claim-define-done-first-01

在启动 AI 任务前先定义完成，再决定提示词、工具和自动化方式。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 任务交付协议 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-1/02-task-delivery-protocol.md#claim-define-done-first-01](/bluebook/part-1/02-task-delivery-protocol#claim-define-done-first-01) |
| 统计口径 | 不适用：实践顺序建议 |
| 适用范围 | 企业 AI 任务设计、试运行和复盘 |
| 局限 | 探索性任务也可以使用该顺序，但完成可以定义为形成问题清单或验证假设，而非作出最终结论。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 方法规范负责人 |

## claim-delivery-criteria-01

用可编辑、可验证、可流转三个判据共同定义业务交付；任一判据不满足，都应把任务视为未完成或降级为草稿。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 交付判据 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-1/01-delivery-standard.md#claim-delivery-criteria-01](/bluebook/part-1/01-delivery-standard#claim-delivery-criteria-01) |
| 统计口径 | 不适用：实践验收规则 |
| 适用范围 | 文档、数据、研究、汇报和协同任务的交付验收 |
| 局限 | 高风险任务可把人工复核和明确确认定义为交付的一部分，三个判据不等于全自动化。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 内容复核者 |

## claim-delivery-not-generation-01

生成内容不等于完成工作；只有结果能够继续编辑、接受核验并进入下一业务环节，AI 才完成了一次业务交付。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 交付标准 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-1/01-delivery-standard.md#claim-delivery-not-generation-01](/bluebook/part-1/01-delivery-standard#claim-delivery-not-generation-01) |
| 统计口径 | 不适用：规范性判断 |
| 适用范围 | 企业 AI 任务选型、试点验收和工作流升级 |
| 局限 | 这是本书对业务交付的规范定义，不是行业统计结论，也不要求所有任务自动完成。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 编辑复核者 |

## claim-expert-kit-release-01

专家套件只能组合已经通过岗位阶段门的工作流，不能用套件名称替代组成资产的测试、权限和责任记录。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 专家套件发布规则 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-2/04-skills-connectors-expert-kits.md#claim-expert-kit-release-01](/bluebook/part-2/04-skills-connectors-expert-kits#claim-expert-kit-release-01) |
| 统计口径 | 不适用：资产发布规则 |
| 适用范围 | 岗位级专家套件的设计、评审、发布和回退 |
| 局限 | 该阶段门映射是本书治理建议，不代表官方产品对专家套件的发布条件。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 工作流资产负责人 |

## claim-product-delivery-forms-01

千问办公官方简介将 Word、Excel、PPT、网页等列为可交付产物形态。

| 字段 | 内容 |
|---|---|
| 主张类型 | product-fact |
| 来源类型 | official-product |
| 来源定位 | [千问办公简介](https://qwenwork.cn/docs/product-introduction) |
| 核验状态 | verified |
| 正文位置 | [docs/bluebook/part-1/01-delivery-standard.md#claim-product-delivery-forms-01](/bluebook/part-1/01-delivery-standard#claim-product-delivery-forms-01) |
| 统计口径 | 官方页面列出的产物类型 |
| 适用范围 | 用于说明产品官方列出的交付形态，不用于推断具体任务完成率 |
| 局限 | 产品能力、账号权益、地区可用性和具体任务效果可能变化，应以使用时页面和账号实测为准。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 产品事实核验者 |

## claim-question-workflow-boundary-01

纯问答用法与任务型工作流的差异在于使用方式和责任链，而不是对整个产品类别作优劣判断。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | first-party-disclosure |
| 来源定位 | [千问办公·职场 AI 三千问—基础必修课](https://alidocs.dingtalk.com/i/nodes/mExel2BLV59rgdDPiPER1ZZDVgk9rpMq) |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-1/01-delivery-standard.md#claim-question-workflow-boundary-01](/bluebook/part-1/01-delivery-standard#claim-question-workflow-boundary-01) |
| 统计口径 | 不适用：基于公开材料的编辑判断 |
| 适用范围 | 企业 AI 使用方式比较、任务选型和采购演示评估 |
| 局限 | R10 提供产品方的定位语境；本书将比较范围收窄到使用方式，不据此推出整个产品类别的普遍优劣。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 编辑复核者 |

## claim-six-layer-diagnosis-01

企业 AI 的稳定交付由智能基座、上下文、工具与连接、产物工作台、复用与自动化、治理六层共同决定；模型只是其中一层。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 六层诊断模型 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-2/03-work-environment-architecture.md#claim-six-layer-diagnosis-01](/bluebook/part-2/03-work-environment-architecture#claim-six-layer-diagnosis-01) |
| 统计口径 | 不适用：故障诊断框架 |
| 适用范围 | 企业 AI 试点设计、故障复盘和责任分工 |
| 局限 | 六层是本书的诊断分类，不是产品官方架构；一个故障可能同时涉及多层。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 工作环境架构负责人 |

## claim-skill-asset-boundary-01

Skill 封装可重复方法和工具步骤；它不自动取得数据权限，也不替代专业验收。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | official-product |
| 来源定位 | [技能](https://qwenwork.cn/docs/features/skills) |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-2/04-skills-connectors-expert-kits.md#claim-skill-asset-boundary-01](/bluebook/part-2/04-skills-connectors-expert-kits#claim-skill-asset-boundary-01) |
| 统计口径 | 不适用：基于公开产品说明的资产治理定义 |
| 适用范围 | 个人方法沉淀、团队 Skill 发布和版本治理 |
| 局限 | 官方页面用于确认 Skill 的产品语境；权限和专业验收边界是本书的治理要求。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 工作流资产负责人 |

## claim-task-card-fields-01

任务卡唯一规范由目标、输入、约束、交付、验收五个字段组成。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 五段式任务卡 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-1/02-task-delivery-protocol.md#claim-task-card-fields-01](/bluebook/part-1/02-task-delivery-protocol#claim-task-card-fields-01) |
| 统计口径 | 不适用：任务输入规范 |
| 适用范围 | 文档、数据、研究、汇报和协同类 AI 任务 |
| 局限 | 五个字段规定最低任务合同，不替代各专业领域的法规、质量标准或审批要求。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 方法规范负责人 |

## claim-three-surfaces-choice-01

Web、桌面和钉钉应按任务上下文选择，不存在对所有任务默认最优的入口。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | official-product |
| 来源定位 | [千问办公简介](https://qwenwork.cn/docs/product-introduction) |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-2/03-work-environment-architecture.md#claim-three-surfaces-choice-01](/bluebook/part-2/03-work-environment-architecture#claim-three-surfaces-choice-01) |
| 统计口径 | 不适用：基于官方入口语境的使用建议 |
| 适用范围 | 需要在云端、本地或钉钉组织上下文中运行的企业 AI 任务 |
| 局限 | 入口存在和产品能力以当前官方页面及账号实测为准；选择原则是本书建议，不代表官方优先级。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 工作环境架构负责人 |

## claim-workflow-core-01

企业采用 AI 时，应把关注点从单次模型问答延伸到可验证、可复用、可治理的业务工作流。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 编辑审查 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/executive-summary.md#claim-workflow-core-01](/bluebook/executive-summary#claim-workflow-core-01) |
| 统计口径 | 不适用：社区判断 |
| 适用范围 | 企业 AI 试点、复用、治理和价值评估 |
| 局限 | 这是本书的社区判断，不代表已经得到行业统计证明的普遍事实。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 编辑复核者 |

## 待核验线索（公开安全）


