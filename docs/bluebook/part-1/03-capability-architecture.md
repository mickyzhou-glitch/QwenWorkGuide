---
title: 六层能力架构
description: 用六层模型定位任务中的能力、上下文和治理问题
status: verified
verifiedAt: 2026-07-29
sources:
  - https://qwenwork.cn/docs/product-introduction
  - https://qwenwork.cn/docs/features/connectors
---

# 六层能力架构

## 1. 智能基座层

负责理解、推理、规划、长上下文与多模态理解。帮助中心说明平台基于千问系列模型，并支持模型选择；具体列表可能更新。[来源](../appendices/sources#r3)

## 2. 上下文层

对话、附件、本地目录、网盘、应用快照、企业 IM、日历、邮件、知识库与外部系统数据共同构成上下文。其完整、准确和时效会影响结果。

## 3. 工具与连接层

包括浏览器、macOS 应用、Microsoft 365、钉钉和第三方 SaaS，也支持自定义 MCP。官方列出飞书、Notion、Linear、Todoist、Canva、Supabase、Vercel、Slack、Figma、Google 日历等集成；连接器默认关闭，授权后才可访问。[来源](../appendices/sources#r4)

## 4. 产物工作台层

负责 Word、Excel、PPT、设计与网页等产物的生成、预览、修改和交付。

## 5. 复用与自动化层

包括技能、专家套件、记忆/意识、定时任务、IM 频道与 Hooks，用于把一次成功任务固化为可重复流程。

## 6. 治理层

包括授权、操作确认、权限分层、用量控制、审计线索、人工复核与异常回退。

::: info 社区实践
模型决定“能不能做”，上下文与工具决定“能不能做对”，流程与治理决定“能不能长期稳定地做”。
:::
