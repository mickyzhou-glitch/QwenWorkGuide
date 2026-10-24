# 2026-10-25 指南重构发布检查

## 内容范围

- 站点版本 0.2.0；当前指南核验日期为 2026-10-25。
- 官方客户端更新核对至 2026-10-15 / 1.3.1，学习社区动态核对至 2026-10-14。
- 六个任务实操、可复制新手样本、能力地图、扩展、自动化、团队试点、排障与更新页。
- 原蓝皮书 V2.0 与下载 PDF 保留为 2026-08-01 快照；不将当前产品信息追写为历史证据。
- 新增内容只使用公开来源及虚构练习；没有导入内部客户资料。

## 本地验证

- `npm run check`：109 项测试全部通过；内容、案例、证据生成一致性校验通过；生产构建通过。
- GitHub Pages 路径 `/QwenWorkGuide/`：67 页站内目标与锚点检查通过。
- `CF_PAGES=1 npm run build` 与 `CF_PAGES=1 npm run check:site`：根路径 `/` 的 67 页检查通过。
- 渲染 HTML：单一首页主标题、六张任务卡、初始任务计数、历史与当前提示、首页静态资源均存在。
- 新指南引用的 15 个官方页面均返回 HTTP 200。
- `git diff --check` 通过。

## 已知限制

- 当前 Work 设置关闭本地浏览器操作，因此未进行真实浏览器点击、截图或移动端视觉验收。搜索和分类逻辑由单元测试覆盖，界面结构由构建结果检查覆盖。
- 使用兼容范围内的 `npm audit fix` 更新 Vue 等构建依赖。VitePress 1.6.4 依赖链仍有 npm 报告的 3 项开发工具告警（2 moderate、1 high），当前审计未提供兼容修复。本次不跨主版本迁移构建框架。线上产物为静态文件；开发服务不应对外开放。

## 发布方式

生产分支为 main，推送后由 GitHub Actions 发布 GitHub Pages，并由已有 Cloudflare Pages GitHub 集成发布主站。发布完成后应确认两个正式地址的首页、任务页、更新页和历史 PDF；线上验证结果另记本地知识库项目索引。

## 线上结果

实现提交：`8d1fbf8`，已合并并推送 origin/main。

- [GitHub Pages 发布](https://github.com/mickyzhou-glitch/QwenWorkGuide/actions/runs/40115927761)：成功。
- [Quality 双路径校验](https://github.com/mickyzhou-glitch/QwenWorkGuide/actions/runs/40115927762)：成功。
- Cloudflare Pages 对同一提交的检查：success，正式主站已返回新首页。
- 两站共 18 项 HTTP 验证全部通过：各自首页、快速开始、任务索引、电商任务、更新页、旧蓝皮书章节，以及 V2.0 / V1.3 / V1 PDF。
- 首页均含新版主标题与六张任务卡，旧章节显示历史参考提示。
