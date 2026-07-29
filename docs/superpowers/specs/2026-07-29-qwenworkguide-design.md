# QwenWorkGuide 开源项目设计规格

## 1. 项目概述

### 1.1 目标

将现有《千问办公（Qwen Work）蓝皮书》升级为一个可公开阅读、可持续维护、支持社区共同贡献的开源知识库。

项目名称为 `QwenWorkGuide`，公开仓库目标地址为：

`https://github.com/mickyzhou-glitch/QwenWorkGuide`

首版站点通过 GitHub Pages 发布，预期地址为：

`https://mickyzhou-glitch.github.io/QwenWorkGuide/`

### 1.2 定位

QwenWorkGuide 是非官方、独立维护的千问办公实践指南，不代表千问办公或阿里巴巴官方立场。

项目以真实工作任务为主线，帮助读者完成以下进阶：

1. 完成第一项可验收的千问办公任务；
2. 学会使用 Skill、连接器、专家套件与自动化；
3. 把一次成功任务沉淀为可复用工作流；
4. 将个人经验扩展为岗位与组织级 AI 工作系统。

### 1.3 首版范围

首版包含：

- 蓝皮书四篇十二章；
- 常用指令模板；
- 场景速查表；
- 组织上线验收清单；
- 社区案例库入口与案例模板；
- 阅读指南与贡献指南；
- Word 和 PDF 下载；
- GitHub Issue 与 Pull Request 共创流程；
- 自动构建、质量检查和 GitHub Pages 发布。

首版不包含：

- 在线投稿数据库或审核后台；
- 用户登录和社区账户系统；
- 评论、点赞或贡献者积分系统；
- 千问办公账号、API 或企业数据连接；
- 工作区中的内部 Excel、客户图片和未公开资料。

## 2. 技术方案

### 2.1 技术栈

- 文档站：VitePress；
- 内容格式：Markdown；
- 包管理：npm；
- 搜索：VitePress 本地搜索；
- 持续集成：GitHub Actions；
- 托管：GitHub Pages；
- 代码许可证：MIT；
- 内容许可证：CC BY 4.0。

选择 VitePress 的原因：

- 与 WorkBuddyGuide 的技术路线一致；
- Markdown 贡献门槛低；
- 原生支持侧边栏、页内目录、全文搜索与深色模式；
- 静态输出适合 GitHub Pages；
- 后续可以增加多语言、版本和自定义主题。

### 2.2 仓库结构

```text
QwenWorkGuide/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ bug-report.yml
│  │  ├─ content-correction.yml
│  │  ├─ case-proposal.yml
│  │  └─ config.yml
│  ├─ workflows/
│  │  ├─ checks.yml
│  │  └─ deploy-pages.yml
│  ├─ CASE_TEMPLATE.md
│  └─ PULL_REQUEST_TEMPLATE.md
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts
│  │  └─ theme/
│  ├─ bluebook/
│  ├─ cases/
│  │  ├─ index.md
│  │  └─ submissions/
│  ├─ guides/
│  ├─ community/
│  ├─ public/
│  │  └─ downloads/
│  ├─ index.md
│  └─ reading-guide.md
├─ scripts/
│  ├─ validate-frontmatter.mjs
│  └─ validate-case.mjs
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ LICENSE-CODE
├─ LICENSE-CONTENT
├─ README.md
├─ package.json
└─ package-lock.json
```

### 2.3 内容与站点同仓库

每个 Markdown 文件对应一个可独立维护的页面。内容修改与站点代码使用同一套 Pull Request 流程。

这样做的结果：

- 修改历史可追踪；
- 章节审核与发布保持一致；
- 社区贡献者无需使用单独 CMS；
- 构建失败时不会覆盖线上稳定版本。

## 3. 信息架构与站点体验

### 3.1 首页方向

首页采用“阅读优先”结构。

顶部导航：

- 蓝皮书；
- 案例库；
- 阅读指南；
- 参与共创；
- GitHub。

首屏内容：

- `QwenWorkGuide` 项目名称；
- “从一句话，到可交付的工作系统”；
- “非官方 · 开源 · 社区共创”声明；
- 主按钮“开始阅读”；
- 次按钮“查找案例”和“参与共创”。

首屏下方提供四个内容入口：

1. 使用手册；
2. 真实案例；
3. 进阶方法；
4. 企业落地。

后续区块：

- 推荐阅读路线；
- 热门工作场景；
- 最新更新；
- 贡献方式；
- 许可证与免责声明。

首版不显示虚构的贡献者数量、案例数量或社区活跃数据。

### 3.2 阅读页

桌面端：

- 左侧章节导航；
- 中间正文；
- 右侧页内目录；
- 顶部全文搜索。

移动端：

- 左右导航折叠为抽屉；
- 表格支持横向滚动；
- 代码块和提示词支持复制；
- 文字大小和行距适合长文阅读。

章节底部：

- 上一章；
- 下一章；
- 编辑本页；
- 报告问题。

### 3.3 视觉系统

视觉基于现有蓝皮书：

- 深海军蓝：标题和主要结构；
- 清亮蓝：链接与主操作；
- 青绿色：社区与进阶提示；
- 中性灰：背景、边框和辅助信息。

视觉原则：

- 保持开源文档站的克制与可读性；
- 不复制千问办公官方页面；
- 不使用容易造成官方背书误解的品牌标识；
- 深色模式保持对比度和代码可读性；
- 避免装饰性动画影响阅读。

## 4. 内容模型

### 4.1 正式章节

正式章节 Frontmatter：

```yaml
---
title: 第 1 章 从回答问题到交付结果
description: 理解千问办公的任务闭环与交付逻辑
status: verified
verifiedAt: 2026-07-29
sources:
  - https://qwenwork.cn/docs/product-introduction
---
```

状态值：

- `verified`：已与当前官方资料核验；
- `review-needed`：产品更新后需要复核；
- `community-practice`：社区实践，不代表官方承诺。

### 4.2 社区案例

案例必填字段：

- 场景与问题；
- 适用角色；
- 输入资料；
- 使用能力；
- 任务描述；
- 执行步骤；
- 最终产物；
- 验收标准；
- 权限与安全边界；
- 可复现证据；
- 贡献者与核验日期。

社区案例先进入 `docs/cases/submissions/`。经过复现、编辑和稳定性验证后，维护者可以将其升级为蓝皮书正式章节。

### 4.3 引用与时效性

- 产品功能、价格、权益、界面和连接器范围必须注明核验日期；
- 优先引用官方帮助中心、一手披露与原始资料；
- 社区文章只能作为实践证据，不替代官方能力说明；
- 事实、判断和建议使用不同措辞；
- 失效链接和过期功能通过 Issue 标记并修订。

## 5. 社区共创与治理

### 5.1 三条贡献路径

#### 勘误与小修改

适合：

- 错别字；
- 失效链接；
- 产品更新；
- 表述修正；
- 来源补充。

贡献方式：

- 内容勘误 Issue；
- GitHub 页面直接编辑；
- 小型 Pull Request。

#### 真实案例投稿

贡献者使用统一 Case 模板，提交到 `docs/cases/submissions/`。

案例必须：

- 来自真实任务；
- 隐去敏感信息；
- 提供可复现步骤；
- 明确验收标准；
- 描述失败边界；
- 不夸大产品能力。

#### 章节与专题共建

贡献者先提交“内容提案”Issue。维护者确认范围、目录位置、重复性和来源要求后，再开始完整撰写。

### 5.2 审核规则

- `main` 是稳定发布分支；
- 所有变更通过 Pull Request 合入；
- 至少一名维护者审核；
- 案例重点审核可复现性、来源与安全边界；
- 专业内容需要相关从业者复核；
- AI 辅助撰写允许，但贡献者对事实和最终内容负责；
- 禁止提交客户隐私、企业内部资料、密钥与未经授权的截图。

### 5.3 社区规范

仓库包含：

- `CODE_OF_CONDUCT.md`；
- `CONTRIBUTING.md`；
- 案例投稿指南；
- Issue 模板；
- Pull Request 模板；
- 安全与隐私提醒；
- 许可证与署名说明。

## 6. 构建、发布与错误处理

### 6.1 Pull Request 检查

每次 Pull Request 自动执行：

- npm 依赖安装；
- VitePress 构建；
- Markdown 内部链接检查；
- 图片路径检查；
- Frontmatter 必填字段检查；
- Case 模板完整性检查；
- 常见密钥模式和敏感信息扫描；
- 许可证与来源声明检查。

### 6.2 GitHub Pages 发布

当变更合并到 `main`：

1. GitHub Actions 安装依赖；
2. 构建静态站点；
3. 上传 Pages Artifact；
4. 部署到 GitHub Pages；
5. 保留构建日志和部署结果。

如果构建失败：

- 线上稳定版本保持不变；
- 失败原因显示在 Actions 与 Pull Request；
- 修复并重新运行后才允许发布新版本。

### 6.3 基础路径

VitePress 的 `base` 设置为 `/QwenWorkGuide/`，保证 GitHub Pages 项目站点中的资源、路由和下载链接正确。

如果未来绑定自定义域名，应将 `base` 调整为 `/`，并增加 `CNAME` 文件。

## 7. 测试与验收

### 7.1 自动化测试

- `npm run build` 成功；
- 导航和侧边栏配置能够解析；
- 站内链接不存在未解析路径；
- 案例 Frontmatter 与必填章节完整；
- GitHub Actions 使用锁定版本；
- Pages Artifact 正确生成。

### 7.2 人工验收

- 桌面和移动端可完整阅读；
- 搜索、导航、复制与章节跳转可用；
- 表格在窄屏不会截断正文；
- 深色模式有足够对比度；
- Word 和 PDF 可下载；
- “编辑本页”和“报告问题”指向正确仓库；
- 新贡献者可以按模板完成一次案例投稿；
- README 明确说明非官方定位和双许可证；
- GitHub Pages 公开地址可以访问。

### 7.3 发布完成标准

首版只有在以下条件全部满足时才视为完成：

- 仓库公开；
- `main` 分支包含完整源代码与内容；
- 首次 GitHub Pages 部署成功；
- 首页、蓝皮书、案例库和共创页可访问；
- Word/PDF 下载可用；
- Issue 与 Pull Request 模板可用；
- 构建检查在公开 Pull Request 中运行；
- 不包含工作区内部资料和凭证。

## 8. 后续演进

首版之后按实际社区需求评估：

- 绑定自定义域名；
- 英文版；
- 版本化文档；
- 外部搜索服务；
- 贡献者页面；
- 案例标签与岗位筛选；
- 自动检测官方文档变化；
- 内容更新时间仪表板。

这些能力不进入首版，避免在社区冷启动阶段增加不必要的维护成本。

