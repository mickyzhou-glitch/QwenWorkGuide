---
title: 主张证据台账
description: V2.0 关键主张的来源、状态与适用边界
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 主张证据台账

> 本页由结构化数据自动生成，请修改 `docs/bluebook/data/evidence-ledger.json`。本文件及其 JSON 源均为公开内容。

已发布主张：31；待核验线索：0。

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

## claim-capacity-separate-01

现金 ROI 与可释放产能必须分开报告；质量和风险也单独报告，只有形成可核验的实际损失或收益时才进入现金口径。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 现金与产能分列规则 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/13-value-measurement.md#claim-capacity-separate-01](/bluebook/part-4/13-value-measurement#claim-capacity-separate-01) |
| 统计口径 | 同口径任务时长、有效任务量、现金凭证及质量风险记录 |
| 适用范围 | 企业 AI 试点价值报告、预算复盘和规模化决策 |
| 局限 | 可释放产能不保证形成支出减少或增量毛利；质量和风险金额只有在实际发生且可核验时才进入现金账。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 财务与价值复核者 |

## claim-cash-roi-formula-01

现金 ROI 只纳入已经实现或有可核验依据的现金收益，并计入从输入准备、人工复核到治理和失败损失的全部增量成本。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 现金 ROI 口径 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/13-value-measurement.md#claim-cash-roi-formula-01](/bluebook/part-4/13-value-measurement#claim-cash-roi-formula-01) |
| 统计口径 | 已实现现金收益、增量总成本、现金净收益和现金 ROI 的社区规范公式 |
| 适用范围 | 边界明确且能够取得同口径任务、成本和现金凭证的企业 AI 场景 |
| 局限 | 该公式是本书的管理决策口径，不是会计准则或估值意见；增量总成本为 0 时不计算现金 ROI。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 财务与价值复核者 |

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

## claim-critical-error-hard-gate-01

关键错误、法律、安全和未授权动作是不可放宽的硬门；效率、采用率和满意度是可调整的实验阈值。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 关键错误硬门 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/10-pilot-roadmap.md#claim-critical-error-hard-gate-01](/bluebook/part-4/10-pilot-roadmap#claim-critical-error-hard-gate-01) |
| 统计口径 | 阶段内全量登记关键错误、法律、安全和未授权事件 |
| 适用范围 | 企业 AI 场景试点、团队发布、规模化推广和事件复盘 |
| 局限 | 本书只定义最低关键错误类别；业务负责人和数据/安全责任人还需按场景补充更严格分类与判定证据。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 试点治理负责人 |

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

## claim-demo-boundary-01

公开演示只能证明可观察的交付形态，不能据此推导客户身份、实施成本、生产稳定性或业务效果。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | first-party-disclosure |
| 来源定位 | [千问办公·案例库](https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8DMGQKRatejr3EKoWxLq0Ee4) |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/08-research-evidence-chain.md#claim-demo-boundary-01](/bluebook/part-3/08-research-evidence-chain#claim-demo-boundary-01) |
| 统计口径 | 不适用：公开材料证据边界判断 |
| 适用范围 | 公开网页、看板、报告和其他示例产物的引用 |
| 局限 | R11 提供案例库入口；对示例产物可支持范围的界定是本书编辑判断。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 案例证据复核者 |

## claim-ecosystem-status-columns-01

产品与生态讨论统一分为已公开能力、已实测组合、基于公开接口的可行推断、待验证路线假设四类，不能把推断或建议写成已经发布的产品能力。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 产品生态状态栏 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/conclusion-product-ecosystem.md#claim-ecosystem-status-columns-01](/bluebook/conclusion-product-ecosystem#claim-ecosystem-status-columns-01) |
| 统计口径 | 不适用：产品与生态建议的证据状态分类 |
| 适用范围 | 产品路线讨论、伙伴方案评审和企业架构假设验证 |
| 局限 | 四类状态是本书的编辑治理方法，不代表官方路线、产品排期或行业通用成熟度等级。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 产品与生态建议复核者 |

## claim-evidence-card-fields-01

研究证据卡唯一规范由主张、来源原文、来源类型、日期、统计口径、适用范围、限制、冲突、状态九个字段组成。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 证据卡 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/08-research-evidence-chain.md#claim-evidence-card-fields-01](/bluebook/part-3/08-research-evidence-chain#claim-evidence-card-fields-01) |
| 统计口径 | 不适用：研究工作记录规范 |
| 适用范围 | 需要形成可复核事实、推断和建议的研究任务 |
| 局限 | 字段完整只能提高可复核性，不能保证来源真实、口径正确或结论成立。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 研究方法负责人 |

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

## claim-g0-g3-controls-01

G0–G3 只表示动作风险等级；数据敏感度和专业后果必须独立判断，并采用三者中更严格的控制。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 G0–G3 动作控制模型 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/11-security-governance.md#claim-g0-g3-controls-01](/bluebook/part-4/11-security-governance#claim-g0-g3-controls-01) |
| 统计口径 | 不适用：动作、数据和专业后果的治理分类 |
| 适用范围 | 读取、草稿写入、内部业务写入和高后果动作的企业工作流 |
| 局限 | G0–G3 是本书的社区治理模型，不是产品官方评级；组织政策或适用规则更严格时，应采用更严格控制。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 数据与安全治理负责人 |

## claim-g2-continuous-authorization-01

G2 只有在工作流正式发布、边界明确且取得共同批准的持续授权后，才可从逐批事前确认转为批准范围内运行和抽检；G3 每次仍须事前确认。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 G2 持续授权规则 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/11-security-governance.md#claim-g2-continuous-authorization-01](/bluebook/part-4/11-security-governance#claim-g2-continuous-authorization-01) |
| 统计口径 | 不适用：有界工作流授权、留痕和抽检规则 |
| 适用范围 | 创建或更新内部待办、台账、日志、CRM 等 G2 业务对象 |
| 局限 | 持续授权只适用于登记的工作流版本、执行主体、运行环境、批准用途和业务边界；权限、字段、接收对象、错误率、工作流逻辑或规则、版本、模型、连接器、执行主体或运行环境任一变化时均立即失效，并要求重验和共同批准。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 数据与安全治理负责人 |

## claim-human-responsibility-01

业务负责人始终对最终业务结果负责，不能把责任转移给 AI 或流程维护者；G3 执行者与动作批准人不得为同一人。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 人机责任模型 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/11-security-governance.md#claim-human-responsibility-01](/bluebook/part-4/11-security-governance#claim-human-responsibility-01) |
| 统计口径 | 不适用：企业工作流责任与职责分离原则 |
| 适用范围 | 企业 AI 工作流的设计、执行、复核、批准、事件处置和结果问责 |
| 局限 | 角色可由小团队成员兼任，但不得破坏 G3 执行与批准分离；具体法定责任仍以适用法律和组织制度为准。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 企业治理负责人 |

## claim-office-delivery-acceptance-01

文档、数据、汇报和网页任务都按输入、处理、产物、验收、风险、人工确认设计，不能把文件成功生成当成交付通过。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 办公交付规范 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/06-office-delivery.md#claim-office-delivery-acceptance-01](/bluebook/part-3/06-office-delivery#claim-office-delivery-acceptance-01) |
| 统计口径 | 不适用：办公任务验收规范 |
| 适用范围 | 文档、数据、汇报和网页类企业办公任务 |
| 局限 | 各专业领域仍需追加法务、财务、品牌、隐私和无障碍等强制标准。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 办公交付方法负责人 |

## claim-pilot-stage-gates-01

个人模板候选、团队工作流发布和规模化推广构成唯一三阶段门；日历时间、场景评分或平均效率提升都不能替代阶段门。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 试点阶段门 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/10-pilot-roadmap.md#claim-pilot-stage-gates-01](/bluebook/part-4/10-pilot-roadmap#claim-pilot-stage-gates-01) |
| 统计口径 | 不适用：试点发布与升级规则 |
| 适用范围 | 企业 AI 场景从个人验证、团队发布到规模化推广的决策 |
| 局限 | 三阶段门是本书的默认治理建议；组织可以提高标准，但不能用日历时间代替验证结果。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 试点治理负责人 |

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

## claim-public-case-count-01

截至 2026-08-01，满足案例级来源定位与发布门的公开案例为 0。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | first-party-disclosure |
| 来源定位 | [千问办公·案例库](https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8DMGQKRatejr3EKoWxLq0Ee4) |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/09-public-case-atlas.md#claim-public-case-count-01](/bluebook/part-3/09-public-case-atlas#claim-public-case-count-01) |
| 统计口径 | 截至 2026-08-01，逐条检查案例候选的外部记录 ID、案例级来源定位、核验状态和公开计数标记；满足全部发布门的条目数为 0。 |
| 适用范围 | QwenWorkGuide 当前公开案例图谱、案例入口和对外案例计数 |
| 局限 | R11 只提供候选集合级入口，公开计数 0 是本仓库截至核验日的发布门审计结果；后续取得案例级证据并重新核验后，计数可能变化。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 案例证据复核者 |

## claim-public-demo-boundary-01

示例产物只证明产物形态，不能证明案例归属、实施成本、生产稳定性或业务效果。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | first-party-disclosure |
| 来源定位 | [千问办公·案例库](https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8DMGQKRatejr3EKoWxLq0Ee4) |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/09-public-case-atlas.md#claim-public-demo-boundary-01](/bluebook/part-3/09-public-case-atlas#claim-public-demo-boundary-01) |
| 统计口径 | 不适用：案例候选中的示例产物与案例级来源证据分开判断 |
| 适用范围 | 公开案例候选中的网页、看板、报告和其他示例产物链接 |
| 局限 | R11 未暴露可把单个示例产物稳定绑定到具体候选案例的案例级记录；该边界不评价示例产物本身的质量。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 案例证据复核者 |

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

## claim-research-question-tree-01

研究先把决策问题拆成可由证据回答的问题树，再检索和写作。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 研究问题树 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/08-research-evidence-chain.md#claim-research-question-tree-01](/bluebook/part-3/08-research-evidence-chain#claim-research-question-tree-01) |
| 统计口径 | 不适用：研究流程建议 |
| 适用范围 | 行业扫描、竞品分析、客户研究、政策跟踪和内部立项 |
| 局限 | 问题树帮助限定研究范围，但不能代替新证据出现后的假设修正。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 研究方法负责人 |

## claim-role-scenario-card-01

岗位 AI 场景统一使用业务问题、角色、输入、当前步骤、交付物、验收、禁做动作、指标、风险、基线十个字段登记。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 岗位场景卡 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-3/07-role-roadmaps.md#claim-role-scenario-card-01](/bluebook/part-3/07-role-roadmaps#claim-role-scenario-card-01) |
| 统计口径 | 不适用：岗位场景登记规范 |
| 适用范围 | HR、销售与商务、产品与项目、财务与法务、内容与市场场景 |
| 局限 | 场景卡用于任务选型和基线采集，不是岗位绩效评价，也不代表固定优先级。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 岗位场景方法负责人 |

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

## claim-usage-not-value-01

DAU、对话数、Token 和产物数只能说明使用，不能单独证明企业 AI 已产生业务价值。

| 字段 | 内容 |
|---|---|
| 主张类型 | community-judgment |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 使用与价值边界 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/13-value-measurement.md#claim-usage-not-value-01](/bluebook/part-4/13-value-measurement#claim-usage-not-value-01) |
| 统计口径 | 不适用：价值度量的指标解释边界 |
| 适用范围 | 企业 AI 试点运营看板、价值复盘和扩大决策 |
| 局限 | 使用指标仍可用于判断采用和负载，但必须与同口径效率、质量、风险和现金证据共同解释。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 价值度量负责人 |

## claim-workflow-card-fields-01

团队工作流卡唯一规范由 Owner（业务负责人）、流程维护者、版本、适用范围、输入输出、权限、测试样本、质量门、变更记录、失败案例、回退方式、运行日志和复盘节奏十三个字段组成。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 团队工作流卡 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/12-workflow-operations.md#claim-workflow-card-fields-01](/bluebook/part-4/12-workflow-operations#claim-workflow-card-fields-01) |
| 统计口径 | 不适用：团队工作流运营记录规范 |
| 适用范围 | 进入团队复用范围的 AI 工作流设计、发布、运行、变更和退役 |
| 局限 | 十三字段是最低运营记录，不替代组织制度、专业标准或每次运行的实际日志。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 工作流运营负责人 |

## claim-workflow-change-gate-01

字段、权限、模型、连接器或接收对象发生变化时，工作流必须停止沿用旧验证结论，按受影响范围重新测试、复核和批准。

| 字段 | 内容 |
|---|---|
| 主张类型 | practice-guidance |
| 来源类型 | community-framework |
| 来源定位 | QwenWorkGuide V2.0 工作流变更门 |
| 核验状态 | editor-reviewed |
| 正文位置 | [docs/bluebook/part-4/12-workflow-operations.md#claim-workflow-change-gate-01](/bluebook/part-4/12-workflow-operations#claim-workflow-change-gate-01) |
| 统计口径 | 不适用：版本变化后的重验和批准规则 |
| 适用范围 | 包含字段、权限、模型、连接器或接收对象的团队工作流 |
| 局限 | 重验范围可按变更影响缩小，但涉及授权边界的变化仍必须先使旧授权失效并恢复事前确认。 |
| 核验日期 | 2026-08-01 |
| 责任角色 | 工作流运营负责人 |

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


