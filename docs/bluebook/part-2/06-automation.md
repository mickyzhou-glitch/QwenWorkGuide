---
title: 自动化：从我来问到到点就做
description: 用定时任务、IM、浏览器和电脑操控建立可治理自动化
status: verified
verifiedAt: 2026-07-29
sources:
  - https://qwenwork.cn/docs/desktop/scheduled-tasks
  - https://qwenwork.cn/docs/desktop/computer-use
  - https://qwenwork.cn/docs/desktop/im-channels
---

# 自动化：从我来问到到点就做

千问办公公开支持云端和桌面端定时任务、IM 频道、浏览器自动化、电脑操控与 Hooks。[来源](../appendices/sources#r3) [来源](../appendices/sources#r5) [来源](../appendices/sources#r6)

## 定时任务

官方文档列出一次性、间隔、每小时、每天、每周和每月等调度方式，并建议复杂任务先手动跑通后再固化。[来源](../appendices/sources#r5)

适合自动化：行业早报、项目状态汇总、经营数据检查、价格库存监测和固定目录资料整理。

不宜无人值守：对外发送或发布、修改财务合同客户主数据、发起审批付款删除，以及来源和验收不稳定的研究任务。

## IM 频道与远程接管

桌面任务可以通过 IM 绑定后在手机继续对话、补充指令或提供验证码；文档也说明了文件处理、远程派活、定时推送和群聊协作场景。[来源](../appendices/sources#r7)

## 浏览器自动化与电脑操控

优先级建议为：**结构化 API / Connector ＞ 浏览器自动化 ＞ 电脑操控**。越靠右，环境波动与误操作概率通常越高，应使用截图确认、分步执行与人工看护。

## 自动化验收清单

- 固定输入位置与数据范围；
- 明确输出格式和命名；
- 处理空数据、字段变化和登录过期；
- 留存运行记录与失败提醒；
- 防止重复执行；
- 对关键动作实施人工确认；
- 配置停用开关和手动回退。
