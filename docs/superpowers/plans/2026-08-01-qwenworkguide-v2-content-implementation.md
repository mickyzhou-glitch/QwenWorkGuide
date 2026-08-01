# QwenWorkGuide V2.0 内容优化实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 `superpowers-zh:subagent-driven-development`（推荐）或 `superpowers-zh:executing-plans` 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将现有 V1.3 蓝皮书重构为一份面向企业 AI 负责人和业务负责人的观点型 V2.0 蓝皮书，并交付带结构化证据、兼容旧链接和可复现 PDF 的本地发布候选。

**架构：** 以 `evidence-ledger.json` 和 `case-source-map.json` 作为证据与案例的唯一结构化规范源，由确定性脚本生成公开附录，并由仓库级校验器约束正文标记、发布状态、案例计数和兼容页面。内容层先新增序章、13 个规范章节与结语，最后原子切换导航和 17 个旧 URL；打印层用固定 manifest、VitePress Markdown 渲染器、仓库自有 Chrome 脚本和逐页 QA 生成 V2.0 PDF。

**技术栈：** Node.js 20–24、npm、VitePress 1.6.4、Markdown、JSON、Node.js 原生测试、Bash 3.2+、Chrome Headless CLI、Poppler `pdfinfo`/`pdftoppm`

---

## 文件结构与职责

### 结构化证据与生成页

- `docs/bluebook/data/evidence-ledger.json`：主张类型、正文定位、来源、发布状态和责任角色的唯一规范源。
- `docs/bluebook/data/case-source-map.json`：32 个候选场景的唯一来源映射，公开计数由 `included_in_public_count` 计算。
- `docs/public/evidence-snapshots/`：可公开复核的来源快照；只有目录内真实存在且 SHA-256 与台账一致的文件可作为发布证据。
- `docs/bluebook/appendices/evidence-ledger.md`：由脚本生成的公开主张证据台账，不手工编辑。
- `docs/bluebook/appendices/case-source-map.md`：由脚本生成的公开案例来源映射，不手工编辑。
- `scripts/generate-evidence-pages.mjs`：校验 JSON、确定性渲染两份公开附录，支持写入和只检查两种模式。

### 内容校验与测试

- `scripts/content-utils.mjs`：保留现有 Frontmatter、案例章节和敏感信息函数，并新增证据、案例、主张标记、来源目录、兼容页、作者遗留标记和公开计数纯函数。
- `scripts/validate-content.mjs`：递归扫描正式内容，并聚合 V2 清单、证据仓库、执行摘要、旧 URL 兼容和生成页一致性错误。
- `tests/content-utils.test.mjs`：全部纯函数红绿测试。
- `tests/content-validators.test.mjs`：临时仓库、生成器、打印构建器和 shell 导出器的集成测试；真实浏览器不进入 `npm test`。
- `tests/fixtures/evidence/*`：合法证据台账、32 条案例映射、执行摘要、来源目录和错误状态夹具。
- `tests/fixtures/pdf/*`：打印 manifest、Markdown、宽表、长链接、代码块和 fake Chrome 夹具。
- `package.json`：新增证据生成/检查和 PDF 唯一构建入口；不新增运行时依赖。

### V2.0 规范正文

- `docs/bluebook/executive-summary.md`：唯一执行摘要，承载核心命题、三个支撑判断、企业行动地图和证据边界。
- `docs/bluebook/part-1/01-delivery-standard.md`：第 1 章，交付标准和五层任务闭环。
- `docs/bluebook/part-1/02-task-delivery-protocol.md`：第 2 章，任务卡字段和使用规则的唯一规范来源。
- `docs/bluebook/part-2/03-work-environment-architecture.md`：第 3 章，三端、六层、失败信号、责任人和证据。
- `docs/bluebook/part-2/04-skills-connectors-expert-kits.md`：第 4 章，Skill、连接器与专家套件边界和发布门槛。
- `docs/bluebook/part-2/05-automation-boundaries.md`：第 5 章，自动化、人工接管、回退、撤销和恢复。
- `docs/bluebook/part-3/06-office-delivery.md`：第 6 章，文档、数据、汇报和网页的工作流与验收。
- `docs/bluebook/part-3/07-role-roadmaps.md`：第 7 章，五类岗位的统一场景卡。
- `docs/bluebook/part-3/08-research-evidence-chain.md`：第 8 章，证据卡的唯一规范来源。
- `docs/bluebook/part-3/09-public-case-atlas.md`：第 9 章，仅发布满足来源门槛的场景和代表案例卡。
- `docs/bluebook/part-4/10-pilot-roadmap.md`：第 10 章，场景评分、阈值登记表和 30/60/90 天阶段门的唯一规范来源。
- `docs/bluebook/part-4/11-security-governance.md`：第 11 章，G0–G3、数据敏感度、专业后果和人机责任。
- `docs/bluebook/part-4/12-workflow-operations.md`：第 12 章，工作流卡和团队运营的唯一规范来源。
- `docs/bluebook/part-4/13-value-measurement.md`：第 13 章，现金 ROI 与可释放产能公式的唯一规范来源。
- `docs/bluebook/conclusion-product-ecosystem.md`：结语，按证据状态分栏的产品与生态路线建议。

### 附录、入口与案例

- `docs/bluebook/appendices/prompt-templates.md`：可复制模板，只引用正文中的规范定义。
- `docs/bluebook/appendices/scenario-index.md`：场景速查与评分填写副本，不重定义权重或阶段门。
- `docs/bluebook/appendices/launch-checklist.md`：组织上线硬门的唯一规范位置。
- `docs/bluebook/appendices/sources.md`：R1–R13 规范来源目录；R14/R15 分别保留为 R8/R4 的可点击兼容锚点，不得作为 `source_ref`。
- `docs/bluebook/releases/v2.0.md`：版本范围、证据边界、迁移和本地发布候选说明。
- `docs/bluebook/releases/v2.0-pdf-qa.md`：工具版本、哈希、页数和逐页视觉检查记录。
- `docs/bluebook/index.md`、`docs/index.md`、`docs/reading-guide.md`、`README.md`：V2.0 定位、阅读路径、下载和规范链接。
- `docs/guides/quick-start.md`：引用第 2 章任务卡和第 10 章阶段门。
- `docs/cases/index.md`：以结构化映射统计公开案例数量。
- `docs/cases/submissions/qwenwork-public-case-atlas.md`：公开案例投稿页，删除未经发布门核验的硬编码数量与效果外推。
- `docs/cases/submissions/pisen-competitive-research-product-materials.md`：按最低客户证据包决定精确数字的保留、降级或移出。
- `docs/cases/submissions/youkela-product-rd-payroll.md`：按最低客户证据包决定精确数字的保留、降级或移出。
- `docs/.vitepress/config.mts`：执行摘要、13 章、结语和 6 个公开附录的唯一主导航。

### 兼容旧 URL

以下 17 个文件改为短兼容页；每页只保留 canonical、`noindex,follow`、`search: false`、关闭前后页导航和一个规范页链接：

- `docs/bluebook/part-1/01-from-answer-to-delivery.md`
- `docs/bluebook/part-1/02-three-surfaces.md`
- `docs/bluebook/part-1/03-capability-architecture.md`
- `docs/bluebook/part-2/04-first-task.md`
- `docs/bluebook/part-2/05-skills-connectors-experts.md`
- `docs/bluebook/part-2/06-automation.md`
- `docs/bluebook/part-2/13-task-delivery-protocol.md`
- `docs/bluebook/part-3/07-office-delivery.md`
- `docs/bluebook/part-3/08-role-roadmaps.md`
- `docs/bluebook/part-3/14-research-evidence-chain.md`
- `docs/bluebook/part-3/17-public-case-atlas.md`
- `docs/bluebook/part-4/09-organization-rollout.md`
- `docs/bluebook/part-4/10-security-governance.md`
- `docs/bluebook/part-4/11-value-measurement.md`
- `docs/bluebook/part-4/12-product-ecosystem.md`
- `docs/bluebook/part-4/15-team-workflow-operations.md`
- `docs/bluebook/part-4/16-value-measurement-playbook.md`

### PDF 与发布候选

- `scripts/bluebook-v2-manifest.json`：按序列出执行摘要、13 章、结语和 6 个公开附录，共 21 项。
- `scripts/build-bluebook-print.mjs`：读取 Markdown、重写内部锚点和资源 URL、生成独立打印 HTML。
- `docs/.vitepress/theme/print.css`：A4 分页、中文排版、表格、代码、提示块和页眉页脚。
- `scripts/html-to-pdf.sh`：独立实现 Chrome Headless HTML→PDF 原子导出。
- `scripts/build-bluebook-pdf.sh`：预检工具、生成内容、构建站点、导出 PDF、校验元数据并渲染全部页面。
- `docs/public/downloads/qwenwork-bluebook-v2.0.pdf`：本地 V2.0 发布候选 PDF。
- `docs/public/downloads/qwenwork-bluebook-v1.pdf`、`docs/public/downloads/qwenwork-bluebook-v1.3.pdf`：只读历史产物，路径和文件内容不得改变。

## 固定数据契约

### 主张证据台账

`evidence-ledger.json` 使用 `schema_version: 1` 和 `claims` 数组。每个元素固定使用以下字段；所有日期为 `YYYY-MM-DD`，不写生成时间，保证生成结果确定性：

```json
{
  "claim_id": "claim-workflow-core-01",
  "claim_type": "community-judgment",
  "claim_text": "企业采用 AI 时，应把关注点从单次模型问答延伸到可验证、可复用、可治理的业务工作流。",
  "content_path": "docs/bluebook/executive-summary.md",
  "content_anchor": "claim-workflow-core-01",
  "is_key": true,
  "summary_eligible": true,
  "blocks_release": true,
  "source": {
    "source_type": "community-framework",
    "source_ref": null,
    "title": "QwenWorkGuide V2.0 编辑审查",
    "organization": "QwenWorkGuide 社区",
    "excerpt": null,
    "external_record_id": null,
    "deep_link": null,
    "snapshot_path": null,
    "content_hash": null,
    "published_at": null,
    "accessed_at": "2026-08-01",
    "captured_at": null
  },
  "customer_evidence": null,
  "measurement_basis": "不适用：社区判断",
  "applicability": "企业 AI 试点、复用、治理和价值评估",
  "limitations": ["这是本书的社区判断，不代表已经得到行业统计证明的普遍事实。"],
  "conflicts": [],
  "verification_status": "editor-reviewed",
  "last_verified_at": "2026-08-01",
  "stale_after": null,
  "reviewer_role": "编辑复核者"
}
```

枚举固定为：

```js
export const CLAIM_TYPES = new Set([
  "product-fact",
  "customer-result",
  "demo-example",
  "research-finding",
  "community-judgment",
  "practice-guidance",
]);

export const SOURCE_TYPES = new Set([
  "official-product",
  "regulatory-statistical",
  "first-party-disclosure",
  "customer-authorized",
  "independent-research",
  "public-demo",
  "internal-pilot",
  "community-framework",
]);

export const VERIFICATION_STATUSES = new Set([
  "verified",
  "limited",
  "editor-reviewed",
  "pending",
  "stale",
]);
```

正文只识别以下精确标记，两个属性值必须相同：

```html
<span id="claim-workflow-core-01" data-claim-id="claim-workflow-core-01"></span>
```

已从发布内容移除、只保留在台账中的 `pending` 或 `stale` 主张使用 `content_path: null` 和 `content_anchor: null`；仅当 `summary_eligible: false`、`blocks_release: false` 时允许这两个字段为空。其余主张必须有正文路径，且 `content_anchor` 等于 `claim_id`。

`evidence-ledger.json` 与生成附录都属于公开仓库内容，`pending`/`stale` 只表示“未进入正文”，不表示私密。未经公开授权的客户名称、客户归属、精确指标、原始材料和可反推身份的信息不得写入该 JSON；需要内部保留的审计材料留在仓库外的授权系统。本仓库待核验记录只能使用公开安全、不可反推客户身份的描述。

所有非空 `snapshot_path` 必须是 `docs/public/evidence-snapshots/` 下不含绝对路径或 `..` 的仓库相对路径，同时提供 `sha256:` 前缀的内容哈希。仓库级校验读取真实文件并比较 SHA-256；无法公开提交或无法通过哈希复核的材料不能用快照路径绕过发布门，只能改用公开深链，或降级为满足摘记、访问日期和内容哈希要求的 `limited` 来源。

进入发布内容的 `customer-result` 使用以下固定 `customer_evidence` 形状；其他类型为 `null`：

```json
{
  "authorization_scope": "客户书面授权公开该指标、口径和样本范围",
  "metric_definition": "指标的完整定义与单位",
  "denominator": "指标分母及排除项",
  "sample_size": 42,
  "sample_period": "2026-01-01/2026-03-31",
  "comparison_period": "2025-10-01/2025-12-31",
  "comparison_basis": "同业务范围、同口径的前后期比较",
  "human_work_included": {
    "input_preparation": true,
    "review": true,
    "rework": true
  },
  "audit_disclosure": "客户陈述、未经独立审计"
}
```

`sample_size` 必须为正整数；两个期间使用 `YYYY-MM-DD/YYYY-MM-DD`；三个人工工作字段必须为布尔值；`audit_disclosure` 必须逐字等于上例，确保发布页能同屏使用一致说明。

### 案例来源映射

`case-source-map.json` 使用 `schema_version: 1` 和恰好 32 个候选元素。每个元素固定使用以下字段：

```json
{
  "case_id": "case-ecommerce-operations-dashboard",
  "original_name": "搭建电商经营数据看板",
  "original_tags": ["看板搭建", "数据分析"],
  "book_category": "数据、研究与经营决策",
  "source_ref": "R11",
  "external_record_id": null,
  "deep_link": "https://zckh3emb.qwenwork.host/",
  "snapshot_path": null,
  "content_hash": null,
  "verified_at": "2026-08-01",
  "verification_status": "pending",
  "included_in_public_count": false,
  "artifact_links": ["https://zckh3emb.qwenwork.host/"],
  "limitations": ["示例产物只证明产物形态，不能证明案例归属、实施成本或业务效果。"]
}
```

`included_in_public_count: true` 必须同时满足：状态为 `verified` 或 `limited`；`external_record_id` 非空且不等于 `case_id`；具有公开深链，或具有通过文件存在性和 SHA-256 校验的公开快照。核验不能满足这些条件时，条目保留在“待核验线索”分组且不进入标题、正文总数或传播文案。

所有条目的 `source_ref` 必须对应来源目录中唯一的 `## R数字` 规范 section，且该 section 至少包含一个可解析的 HTTP(S) URL；裸 HTML 锚点和 R14/R15 兼容别名不能充当来源。`verified_at` 必须是真实日期；`original_tags` 和 `limitations` 是非空字符串数组，`artifact_links` 是 HTTP(S) URL 数组；可空定位字段只能是 `null` 或非空字符串，URL 与 `sha256:` 哈希必须通过格式校验。结构错误必须返回错误数组，不能在 `.join()` 或 `.includes()` 时抛异常。

## 实施约束

- 所有命令从工作树根目录 `/Users/micky/Desktop/不同视角看钉钉/AI商业化/千问办公/QwenWorkGuide/.worktrees/qwenworkguide-v2-content` 执行。
- 本计划审核完成后必须先作为单独提交落库，该提交即实施基线；不得把任何实现文件混入该提交，执行期间也不得再修改本计划。
- 不向远端推送、不创建 GitHub Release、不部署生产站点。
- 不新增无法公开核验的名称、指标、授权或来源定位。
- 每个内容提交先更新 JSON 规范源，再运行生成器；生成的两份证据附录不得手工维护。
- 新规范页全部存在并通过构建后，才原子切换导航和 17 个旧兼容页。
- 任务 6–13 创建规范正文时，“边界与下一步”只写边界，不链接尚未创建的后续章节；任务 14 在全部规范页存在后一次性写入完整下一章链。
- 任何 Markdown、JSON、manifest、打印 CSS 或 PDF 脚本变化后，都重新生成 PDF 并逐页检查。

## 任务 0：锁定基线与历史产物

**文件：** 无修改。本任务只能在本计划已经单独提交后开始。

- [ ] **步骤 1：确认分支和干净工作树**

运行：

```bash
set -e
QWG_PLAN_PATH="docs/superpowers/plans/2026-08-01-qwenworkguide-v2-content-implementation.md"
git ls-files --error-unmatch "$QWG_PLAN_PATH"
QWG_IMPLEMENTATION_BASE="$(
  git log --diff-filter=A -1 --format=%H -- "$QWG_PLAN_PATH"
)"
test -n "$QWG_IMPLEMENTATION_BASE"
test "$QWG_IMPLEMENTATION_BASE" = "$(git rev-parse HEAD)"
git diff --quiet "$QWG_IMPLEMENTATION_BASE" -- "$QWG_PLAN_PATH"
test -z "$(git status --porcelain)"
git status --short --branch
printf 'Implementation base: %s\n' "$QWG_IMPLEMENTATION_BASE"
```

预期计划文件已跟踪，创建该文件的提交就是当前 `HEAD`，计划相对该提交无差异且工作树完全干净；状态第一行为 `## codex/qwenworkguide-v2-content`，其后没有文件列表。任一前置检查失败都会立即停止，不会被末尾输出掩盖。把打印的 40 位 `QWG_IMPLEMENTATION_BASE` 原样记录到最终 PDF QA 的环境表。若存在用户改动，记录路径并在实施中保留，不清理或覆盖，不开始任务 1。

- [ ] **步骤 2：运行现有基线**

运行：

```bash
npm test
npm run check:content
npm run build
```

预期：24 项测试通过；输出“正式内容校验通过”和“案例校验通过”；VitePress 构建退出码为 0。

- [ ] **步骤 3：记录两份历史 PDF 的基线哈希**

运行：

```bash
shasum -a 256 docs/public/downloads/qwenwork-bluebook-v1.pdf docs/public/downloads/qwenwork-bluebook-v1.3.pdf
```

预期：输出两行 SHA-256；将两行原样保留到最终 PDF QA 记录的“历史产物保护”表中。

## 任务 1：用测试定义主张证据状态机

**文件：**

- 创建：`tests/fixtures/evidence/ledger-valid.json`
- 修改：`tests/content-utils.test.mjs`
- 修改：`scripts/content-utils.mjs`

- [ ] **步骤 1：创建最小合法台账夹具**

创建 `tests/fixtures/evidence/ledger-valid.json`，内容为“固定数据契约”中的完整主张对象，外层包装为：

```json
{
  "schema_version": 1,
  "claims": [
    {
      "claim_id": "claim-workflow-core-01",
      "claim_type": "community-judgment",
      "claim_text": "企业采用 AI 时，应把关注点从单次模型问答延伸到可验证、可复用、可治理的业务工作流。",
      "content_path": "docs/bluebook/executive-summary.md",
      "content_anchor": "claim-workflow-core-01",
      "is_key": true,
      "summary_eligible": true,
      "blocks_release": true,
      "source": {
        "source_type": "community-framework",
        "source_ref": null,
        "title": "QwenWorkGuide V2.0 编辑审查",
        "organization": "QwenWorkGuide 社区",
        "excerpt": null,
        "external_record_id": null,
        "deep_link": null,
        "snapshot_path": null,
        "content_hash": null,
        "published_at": null,
        "accessed_at": "2026-08-01",
        "captured_at": null
      },
      "customer_evidence": null,
      "measurement_basis": "不适用：社区判断",
      "applicability": "企业 AI 试点、复用、治理和价值评估",
      "limitations": ["这是本书的社区判断，不代表已经得到行业统计证明的普遍事实。"],
      "conflicts": [],
      "verification_status": "editor-reviewed",
      "last_verified_at": "2026-08-01",
      "stale_after": null,
      "reviewer_role": "编辑复核者"
    }
  ]
}
```

- [ ] **步骤 2：编写失败的台账单元测试**

在 `tests/content-utils.test.mjs` 添加：

```js
import { validateEvidenceLedger } from "../scripts/content-utils.mjs";

const evidenceFixtures = new URL("./fixtures/evidence/", import.meta.url);

async function readJsonFixture(name) {
  return JSON.parse(await readFile(new URL(name, evidenceFixtures), "utf8"));
}

test("validateEvidenceLedger accepts the approved schema", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  assert.deepEqual(validateEvidenceLedger(ledger, { today: "2026-08-01" }), []);
});

test("validateEvidenceLedger enforces claim status invariants", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const claim = ledger.claims[0];
  claim.claim_type = "product-fact";
  claim.verification_status = "editor-reviewed";
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("editor-reviewed")));

  claim.claim_type = "community-judgment";
  claim.verification_status = "pending";
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("blocks_release")));

  claim.summary_eligible = false;
  claim.blocks_release = false;
  claim.content_path = null;
  claim.content_anchor = null;
  assert.deepEqual(validateEvidenceLedger(ledger, { today: "2026-08-01" }), []);
});

test("validateEvidenceLedger requires a complete customer evidence package", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const claim = ledger.claims[0];
  claim.claim_type = "customer-result";
  claim.verification_status = "limited";
  claim.source.source_type = "customer-authorized";
  claim.source.external_record_id = "customer-record-001";
  claim.source.deep_link = "https://example.com/customer-record-001";
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("customer_evidence")));

  claim.customer_evidence = {
    authorization_scope: "客户书面授权公开该指标、口径和样本范围",
    metric_definition: "有效任务按一次完整交付计，单位为项",
    denominator: "授权样本期内完成验收的全部有效任务",
    sample_size: 42,
    sample_period: "2026-01-01/2026-03-31",
    comparison_period: "2025-10-01/2025-12-31",
    comparison_basis: "同业务范围、同口径的前后期比较",
    human_work_included: { input_preparation: true, review: true, rework: true },
    audit_disclosure: "客户陈述、未经独立审计",
  };
  assert.equal(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("customer_evidence")), false);
  delete claim.customer_evidence.denominator;
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("customer_evidence.denominator")));
});

test("validateEvidenceLedger requires traceable external source material", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const claim = ledger.claims[0];
  claim.claim_type = "product-fact";
  claim.verification_status = "verified";
  claim.source.source_type = "official-product";
  claim.source.deep_link = null;
  claim.source.snapshot_path = null;
  claim.source.excerpt = null;
  claim.source.content_hash = null;
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("外部来源定位")));

  claim.verification_status = "limited";
  claim.source.excerpt = "官方页面原文摘记";
  claim.source.accessed_at = "2026-08-01";
  claim.source.content_hash = `sha256:${"a".repeat(64)}`;
  assert.equal(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("外部来源定位")), false);
});

test("validateEvidenceLedger marks expired claims stale", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims[0].stale_after = "2026-07-31";
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("stale_after")));
});

test("validateEvidenceLedger rejects malformed nested fields without throwing", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  Object.assign(ledger.claims[0], {
    limitations: "not-an-array",
    conflicts: [null],
    last_verified_at: "2026-99-99",
  });
  Object.assign(ledger.claims[0].source, {
    source_ref: "source-eleven",
    deep_link: "not-a-url",
    content_hash: "sha256:bad",
    accessed_at: "yesterday",
  });
  const errors = validateEvidenceLedger(ledger, { today: "2026-08-01" });
  for (const field of ["limitations", "conflicts", "last_verified_at", "source_ref",
    "deep_link", "content_hash", "accessed_at"]) {
    assert.ok(errors.some((error) => error.includes(field)), field);
  }
});

test("validateEvidenceLedger rejects non-object claim entries without throwing", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims[0] = null;
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("claims[0]: 必须为对象")));
});

test("validateEvidenceLedger requires public snapshot paths and hashes", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const source = ledger.claims[0].source;
  source.snapshot_path = "../private/source.html";
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("snapshot_path")));
  source.snapshot_path = "docs/public/evidence-snapshots/source.html";
  source.content_hash = null;
  assert.ok(validateEvidenceLedger(ledger, { today: "2026-08-01" })
    .some((error) => error.includes("snapshot_path 要求 content_hash")));
});
```

- [ ] **步骤 3：运行测试确认红灯**

运行：

```bash
node --test --test-name-pattern="validateEvidenceLedger" tests/content-utils.test.mjs
```

预期：FAIL，报错说明 `validateEvidenceLedger` 尚未导出。

- [ ] **步骤 4：实现最小完整状态校验**

在 `scripts/content-utils.mjs` 添加固定枚举，并实现 `validateEvidenceLedger(ledger, { today }) => string[]`。函数必须逐条检查：对象形状、`schema_version`、ID 格式与唯一性、全部布尔字段、枚举、内容路径与锚点一致、来源字段、日期、关键主张责任角色、摘要资格、阻断发布状态、`editor-reviewed` 适用类型、动态来源降级和客户结果最低证据包。核心分支如下：

```js
const CLAIM_ID_PATTERN = /^claim-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isNullableString(value) {
  return value === null || typeof value === "string";
}

function isHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (!DATE_PATTERN.test(value ?? "")) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isPublicSnapshotPath(value) {
  return isNonEmptyString(value) &&
    value.startsWith("docs/public/evidence-snapshots/") &&
    !value.split("/").some((segment) => ["", ".", ".."].includes(segment));
}

export function validateEvidenceLedger(ledger, { today }) {
  const errors = [];
  if (ledger?.schema_version !== 1) errors.push("evidence-ledger: schema_version 必须为 1");
  if (!Array.isArray(ledger?.claims)) return [...errors, "evidence-ledger: claims 必须为数组"];

  const ids = new Set();
  for (const [index, claim] of ledger.claims.entries()) {
    const label = `claims[${index}]`;
    if (claim === null || typeof claim !== "object" || Array.isArray(claim)) {
      errors.push(`${label}: 必须为对象`);
      continue;
    }
    if (!CLAIM_ID_PATTERN.test(claim?.claim_id ?? "")) errors.push(`${label}: claim_id 格式错误`);
    if (ids.has(claim?.claim_id)) errors.push(`${label}: claim_id 重复`);
    ids.add(claim?.claim_id);
    const isUnpublished = ["pending", "stale"].includes(claim?.verification_status) &&
      claim?.summary_eligible === false && claim?.blocks_release === false;
    if (isUnpublished) {
      if (claim.content_path !== null || claim.content_anchor !== null) {
        errors.push(`${label}: 未发布主张的正文路径和锚点必须为 null`);
      }
    } else if (!isNonEmptyString(claim?.content_path) || claim?.content_anchor !== claim?.claim_id) {
      errors.push(`${label}: 已发布主张必须有正文路径，且 content_anchor 等于 claim_id`);
    }
    if (isNonEmptyString(claim?.content_path) &&
        !/^docs\/[a-zA-Z0-9_./-]+\.md$/.test(claim.content_path)) {
      errors.push(`${label}: content_path 必须是 docs/ 下的 Markdown 路径`);
    }
    if (!CLAIM_TYPES.has(claim?.claim_type)) errors.push(`${label}: claim_type 枚举错误`);
    if (!VERIFICATION_STATUSES.has(claim?.verification_status)) errors.push(`${label}: verification_status 枚举错误`);
    for (const key of ["is_key", "summary_eligible", "blocks_release"]) {
      if (typeof claim?.[key] !== "boolean") errors.push(`${label}: ${key} 必须为布尔值`);
    }
    if (claim?.summary_eligible && (!claim.is_key || !claim.blocks_release)) {
      errors.push(`${label}: summary_eligible 要求 is_key 和 blocks_release 同时为 true`);
    }
    if (claim?.summary_eligible && ["pending", "stale"].includes(claim.verification_status)) {
      errors.push(`${label}: summary_eligible 不允许 pending 或 stale`);
    }
    if (claim?.blocks_release && ["pending", "stale"].includes(claim.verification_status)) {
      errors.push(`${label}: blocks_release 主张不能处于 pending 或 stale`);
    }
    if (claim?.verification_status === "editor-reviewed" &&
        !["community-judgment", "practice-guidance"].includes(claim.claim_type)) {
      errors.push(`${label}: editor-reviewed 只适用于社区判断或实践建议`);
    }
    if (claim?.claim_type === "customer-result" && !isUnpublished) {
      const evidence = claim?.customer_evidence;
      for (const key of ["authorization_scope", "metric_definition", "denominator",
        "sample_period", "comparison_period", "comparison_basis"]) {
        if (!isNonEmptyString(evidence?.[key])) {
          errors.push(`${label}: customer_evidence.${key} 不得为空`);
        }
      }
      if (!Number.isInteger(evidence?.sample_size) || evidence.sample_size <= 0) {
        errors.push(`${label}: customer_evidence.sample_size 必须为正整数`);
      }
      for (const key of ["sample_period", "comparison_period"]) {
        const [start, end, extra] = String(evidence?.[key] ?? "").split("/");
        if (extra !== undefined || !isIsoDate(start) || !isIsoDate(end) || start > end) {
          errors.push(`${label}: customer_evidence.${key} 格式错误`);
        }
      }
      for (const key of ["input_preparation", "review", "rework"]) {
        if (typeof evidence?.human_work_included?.[key] !== "boolean") {
          errors.push(`${label}: customer_evidence.human_work_included.${key} 必须为布尔值`);
        }
      }
      if (evidence?.audit_disclosure !== "客户陈述、未经独立审计") {
        errors.push(`${label}: customer_evidence.audit_disclosure 必须使用固定审计说明`);
      }
    } else if (claim?.claim_type !== "customer-result" && claim?.customer_evidence !== null) {
      errors.push(`${label}: 非 customer-result 的 customer_evidence 必须为 null`);
    }
    const source = claim?.source;
    const hasVerifiedSnapshot = isPublicSnapshotPath(source?.snapshot_path) &&
      /^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "");
    const hasStableLocator = isHttpUrl(source?.deep_link) || hasVerifiedSnapshot;
    const hasLimitedFallback = isNonEmptyString(source?.excerpt) && isIsoDate(source?.accessed_at) &&
      /^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "");
    if (source?.source_type !== "community-framework" && !isUnpublished &&
        !hasStableLocator && !(claim?.verification_status === "limited" && hasLimitedFallback)) {
      errors.push(`${label}: 外部来源定位不足，必须有深链/快照，或以 limited 提供摘记、日期和哈希`);
    }
    if (source?.source_type === "internal-pilot" && !isUnpublished) {
      errors.push(`${label}: internal-pilot 不得直接进入公开内容`);
    }
    if (claim?.stale_after && isIsoDate(claim.stale_after) && claim.stale_after < today &&
        claim.verification_status !== "stale") {
      errors.push(`${label}: 已超过 stale_after，状态必须为 stale`);
    }
    if (!isIsoDate(claim?.last_verified_at)) {
      errors.push(`${label}: last_verified_at 日期格式错误`);
    }
    if (claim?.stale_after !== null && !isIsoDate(claim?.stale_after)) {
      errors.push(`${label}: stale_after 必须为日期或 null`);
    }
    if (!isNonEmptyString(claim?.claim_text) || !isNonEmptyString(claim?.measurement_basis) ||
        !isNonEmptyString(claim?.applicability) ||
        !isNonEmptyString(claim?.reviewer_role)) {
      errors.push(`${label}: 主张、统计口径、适用范围和责任角色不得为空`);
    }
    if (!source || !SOURCE_TYPES.has(source.source_type) || !isNonEmptyString(source.title) ||
        !isNonEmptyString(source.organization)) {
      errors.push(`${label}: source 字段不完整`);
    }
    for (const key of ["source_ref", "excerpt", "external_record_id", "deep_link",
      "snapshot_path", "content_hash", "published_at", "accessed_at", "captured_at"]) {
      if (!isNullableString(source?.[key])) errors.push(`${label}: source.${key} 必须为字符串或 null`);
    }
    if (source?.source_ref !== null && !/^R[1-9][0-9]*$/.test(source?.source_ref ?? "")) {
      errors.push(`${label}: source.source_ref 格式错误`);
    }
    for (const key of ["excerpt", "external_record_id"]) {
      if (source?.[key] !== null && !isNonEmptyString(source?.[key])) {
        errors.push(`${label}: source.${key} 必须为非空字符串或 null`);
      }
    }
    if (source?.deep_link !== null && !isHttpUrl(source?.deep_link)) {
      errors.push(`${label}: source.deep_link 必须为 HTTP(S) URL 或 null`);
    }
    if (source?.snapshot_path !== null && !isPublicSnapshotPath(source?.snapshot_path)) {
      errors.push(`${label}: source.snapshot_path 必须位于 docs/public/evidence-snapshots/ 且不得包含空、. 或 .. 路径段`);
    }
    if (source?.content_hash !== null && !/^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "")) {
      errors.push(`${label}: source.content_hash 格式错误`);
    }
    if (source?.snapshot_path !== null &&
        !/^sha256:[a-f0-9]{64}$/.test(source?.content_hash ?? "")) {
      errors.push(`${label}: source.snapshot_path 要求 content_hash`);
    }
    for (const key of ["published_at", "captured_at"]) {
      if (source?.[key] !== null && !isIsoDate(source?.[key])) {
        errors.push(`${label}: source.${key} 必须为日期或 null`);
      }
    }
    if (!isIsoDate(source?.accessed_at)) {
      errors.push(`${label}: source.accessed_at 日期格式错误`);
    }
    if (!Array.isArray(claim?.limitations) || claim.limitations.length === 0 ||
        claim.limitations.some((item) => !isNonEmptyString(item))) {
      errors.push(`${label}: limitations 必须为非空字符串数组`);
    }
    if (!Array.isArray(claim?.conflicts) ||
        claim.conflicts.some((item) => !isNonEmptyString(item))) {
      errors.push(`${label}: conflicts 必须为字符串数组`);
    }
  }
  return errors;
}
```

对进入发布内容的客户结果，客户包校验必须逐字段、逐类型检查固定契约，不能只检查对象非空。未发布且已经公开安全脱敏的 `pending`/`stale` 客户结果允许 `customer_evidence: null`，但正文路径和锚点也必须为 `null`；未经授权的具名客户信息不得借此进入公开 JSON。

- [ ] **步骤 5：运行台账测试确认绿灯**

运行：

```bash
node --test --test-name-pattern="validateEvidenceLedger" tests/content-utils.test.mjs
```

预期：8 项匹配测试 PASS。

- [ ] **步骤 6：提交状态机**

```bash
git add scripts/content-utils.mjs tests/content-utils.test.mjs tests/fixtures/evidence/ledger-valid.json
git commit -m "feat(证据校验): 添加主张台账状态规则"
```

## 任务 2：用测试定义 32 条案例发布门

**文件：**

- 创建：`tests/fixtures/evidence/case-map-valid-32.mjs`
- 修改：`tests/content-utils.test.mjs`
- 修改：`scripts/content-utils.mjs`

- [ ] **步骤 1：创建 32 条候选案例夹具**

创建模块化夹具；32 个稳定 ID、名称、分组和完整字段均由下列代码一次定义，不复制半完整 JSON：

```js
const groups = [
  ["数据、研究与经营决策", [
    ["ecommerce-operations-dashboard", "搭建电商经营数据看板"],
    ["ai-model-comparison-report", "产出主流 AI 模型对比报告"],
    ["ecommerce-data-analysis", "分析电商经营数据"],
    ["nvidia-financial-analysis", "分析英伟达财报"],
    ["multi-platform-product-selection", "抓取多平台数据用于电商选品"],
    ["multi-platform-operations-review", "复盘多平台经营数据并优化投放"],
    ["instant-retail-operations-review", "复盘闪购经营数据并识别爆品、低效品与断货损失"],
    ["marketing-review-dashboard", "搭建营销复盘看板"],
    ["smartphone-competitive-research", "输出全球智能手机市场竞品调研报告"],
  ]],
  ["电商、闪购与直播运营", [
    ["product-video-analysis", "分析商品宣传视频并形成报告"],
    ["livestream-clip-analysis", "分析直播切片并拆解头部主播带货增长模型"],
    ["creator-matrix-dashboard", "搭建达人矩阵管理数据看板"],
    ["ecommerce-product-images", "批量生成电商上新商品图片"],
    ["instant-retail-product-listing", "用浏览器自动化完成闪购商品上下架"],
    ["instant-retail-campaign-costing", "按平台规则制作闪购活动策划并测算优惠成本"],
    ["food-delivery-product-page", "设计外卖商品页面以提升吸引力与下单转化"],
  ]],
  ["网站、营销与内容生产", [
    ["flower-shop-homepage", "生成花店商家宣传官网首页"],
    ["homestay-product-page", "搭建临海民宿产品介绍网页"],
    ["technology-company-homepage", "搭建科技公司动态官网首页"],
    ["marketing-plan", "生成营销策划方案"],
    ["scheduled-content-distribution", "定时多渠道分发营销内容"],
    ["multi-platform-marketing-assets", "批量生成多平台营销素材"],
    ["resume-website", "搭建求职简历网页"],
  ]],
  ["教育与个人发展", [
    ["aircraft-engine-learning-site", "搭建飞机发动机教学网站"],
    ["classroom-materials", "设计课堂 PPT、教案和配套作业"],
    ["student-learning-analysis", "生成学情分析报告并支持定制辅导"],
    ["enrollment-page", "搭建招生宣传网页"],
    ["english-exam-plan", "整理中考英语百日备考方案"],
    ["thesis-outline", "设计论文初稿框架"],
  ]],
  ["组织协同与人才管理", [
    ["dingtalk-document-to-todo", "调动钉钉完成从文档归纳到待办创建的系列任务"],
    ["talent-pipeline-plan", "生成人才梯队发展规划"],
    ["campus-recruiting-dashboard", "搭建校招面试管理看板"],
  ]],
];

export default {
  schema_version: 1,
  cases: groups.flatMap(([bookCategory, items]) => items.map(([slug, originalName]) => ({
    case_id: `case-${slug}`,
    original_name: originalName,
    original_tags: ["结构校验夹具"],
    book_category: bookCategory,
    source_ref: "R11",
    external_record_id: null,
    deep_link: null,
    snapshot_path: null,
    content_hash: null,
    verified_at: "2026-08-01",
    verification_status: "pending",
    included_in_public_count: false,
    artifact_links: [],
    limitations: ["测试夹具不用于公开案例计数。"],
  }))),
};
```

- [ ] **步骤 2：编写失败的案例映射测试**

在 `tests/content-utils.test.mjs` 添加：

```js
import { validateCaseSourceMap } from "../scripts/content-utils.mjs";
import validCaseMap from "./fixtures/evidence/case-map-valid-32.mjs";

test("validateCaseSourceMap accepts exactly 32 candidate cases", () => {
  const caseMap = structuredClone(validCaseMap);
  assert.deepEqual(validateCaseSourceMap(caseMap), []);
});

test("validateCaseSourceMap rejects duplicate and malformed case ids", () => {
  const caseMap = structuredClone(validCaseMap);
  caseMap.cases[1].case_id = caseMap.cases[0].case_id;
  const errors = validateCaseSourceMap(caseMap);
  assert.ok(errors.some((error) => error.includes("case_id 重复")));
});

test("validateCaseSourceMap enforces public source evidence", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    verification_status: "limited",
    included_in_public_count: true,
    external_record_id: null,
  });
  assert.ok(validateCaseSourceMap(caseMap)
    .some((error) => error.includes("external_record_id")));

  caseMap.cases[0].external_record_id = "external-case-record-001";
  caseMap.cases[0].deep_link = "https://artifact.example/demo";
  caseMap.cases[0].artifact_links = ["https://artifact.example/demo"];
  assert.ok(validateCaseSourceMap(caseMap)
    .some((error) => error.includes("示例产物链接不能代替来源定位")));
});

test("validateCaseSourceMap rejects book ids used as external ids", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    verification_status: "verified",
    included_in_public_count: true,
    external_record_id: caseMap.cases[0].case_id,
  });
  assert.ok(validateCaseSourceMap(caseMap)
    .some((error) => error.includes("不能等于 case_id")));
});

test("validateCaseSourceMap accepts a traceable limited public case", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    verification_status: "limited",
    included_in_public_count: true,
    external_record_id: "external-case-record-001",
    deep_link: null,
    snapshot_path: "docs/public/evidence-snapshots/case-001.html",
    content_hash: `sha256:${"b".repeat(64)}`,
    artifact_links: ["https://artifact.example/demo-001"],
    limitations: ["样本和外推范围有限。"],
  });
  assert.deepEqual(validateCaseSourceMap(caseMap), []);
});

test("validateCaseSourceMap reports malformed nested fields without throwing", () => {
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    source_ref: "source-eleven",
    verified_at: "2026-99-99",
    original_tags: "not-an-array",
    artifact_links: "not-an-array",
    limitations: [],
    deep_link: "not-a-url",
    content_hash: "sha256:bad",
  });
  const errors = validateCaseSourceMap(caseMap);
  for (const field of ["source_ref", "verified_at", "original_tags", "artifact_links",
    "limitations", "deep_link", "content_hash"]) {
    assert.ok(errors.some((error) => error.includes(field)), field);
  }
});

test("validateCaseSourceMap rejects non-object case entries without throwing", () => {
  const caseMap = structuredClone(validCaseMap);
  caseMap.cases[0] = null;
  assert.ok(validateCaseSourceMap(caseMap)
    .some((error) => error.includes("cases[0]: 必须为对象")));
});

test("validateCaseSourceMap requires public snapshot paths and hashes", () => {
  const caseMap = structuredClone(validCaseMap);
  const item = caseMap.cases[0];
  item.snapshot_path = "/private/source.html";
  assert.ok(validateCaseSourceMap(caseMap)
    .some((error) => error.includes("snapshot_path")));
  item.snapshot_path = "docs/public/evidence-snapshots/case-001.html";
  item.content_hash = null;
  assert.ok(validateCaseSourceMap(caseMap)
    .some((error) => error.includes("snapshot_path 要求 content_hash")));
});
```

- [ ] **步骤 3：运行测试确认红灯**

运行：

```bash
node --test --test-name-pattern="validateCaseSourceMap" tests/content-utils.test.mjs
```

预期：FAIL，报错说明 `validateCaseSourceMap` 尚未导出。

- [ ] **步骤 4：实现案例映射校验**

在 `scripts/content-utils.mjs` 添加：

```js
const CASE_ID_PATTERN = /^case-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCaseSourceMap(caseMap) {
  const errors = [];
  if (caseMap?.schema_version !== 1) errors.push("case-source-map: schema_version 必须为 1");
  if (!Array.isArray(caseMap?.cases)) return [...errors, "case-source-map: cases 必须为数组"];
  if (caseMap.cases.length !== 32) errors.push("case-source-map: 必须恰好包含 32 个候选案例");

  const ids = new Set();
  for (const [index, item] of caseMap.cases.entries()) {
    const label = `cases[${index}]`;
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${label}: 必须为对象`);
      continue;
    }
    if (!CASE_ID_PATTERN.test(item?.case_id ?? "")) errors.push(`${label}: case_id 格式错误`);
    if (ids.has(item?.case_id)) errors.push(`${label}: case_id 重复`);
    ids.add(item?.case_id);
    for (const key of ["original_name", "book_category"]) {
      if (!isNonEmptyString(item?.[key])) errors.push(`${label}: ${key} 不得为空`);
    }
    if (!/^R[1-9][0-9]*$/.test(item?.source_ref ?? "")) {
      errors.push(`${label}: source_ref 格式错误`);
    }
    if (!isIsoDate(item?.verified_at)) errors.push(`${label}: verified_at 日期格式错误`);
    if (!Array.isArray(item?.original_tags) || item.original_tags.length === 0 ||
        item.original_tags.some((value) => !isNonEmptyString(value))) {
      errors.push(`${label}: original_tags 必须为非空字符串数组`);
    }
    const artifactLinks = Array.isArray(item?.artifact_links) ? item.artifact_links : [];
    if (!Array.isArray(item?.artifact_links) || artifactLinks.some((value) => !isHttpUrl(value))) {
      errors.push(`${label}: artifact_links 必须为 HTTP(S) URL 数组`);
    }
    if (!Array.isArray(item?.limitations) || item.limitations.length === 0 ||
        item.limitations.some((value) => !isNonEmptyString(value))) {
      errors.push(`${label}: limitations 必须为非空字符串数组`);
    }
    if (item?.external_record_id !== null && !isNonEmptyString(item?.external_record_id)) {
      errors.push(`${label}: external_record_id 必须为非空字符串或 null`);
    }
    if (item?.snapshot_path !== null && !isPublicSnapshotPath(item?.snapshot_path)) {
      errors.push(`${label}: snapshot_path 必须位于 docs/public/evidence-snapshots/ 且不得包含空、. 或 .. 路径段`);
    }
    if (item?.deep_link !== null && !isHttpUrl(item?.deep_link)) {
      errors.push(`${label}: deep_link 必须为 HTTP(S) URL 或 null`);
    }
    if (item?.content_hash !== null && !/^sha256:[a-f0-9]{64}$/.test(item?.content_hash ?? "")) {
      errors.push(`${label}: content_hash 格式错误`);
    }
    if (item?.snapshot_path !== null &&
        !/^sha256:[a-f0-9]{64}$/.test(item?.content_hash ?? "")) {
      errors.push(`${label}: snapshot_path 要求 content_hash`);
    }
    if (!["verified", "limited", "pending", "stale"].includes(item?.verification_status)) {
      errors.push(`${label}: verification_status 枚举错误`);
    }
    if (typeof item?.included_in_public_count !== "boolean") {
      errors.push(`${label}: included_in_public_count 必须为布尔值`);
    }
    if (item?.included_in_public_count) {
      if (!["verified", "limited"].includes(item.verification_status)) {
        errors.push(`${label}: 公开案例状态必须为 verified 或 limited`);
      }
      if (!isNonEmptyString(item.external_record_id)) errors.push(`${label}: 缺少 external_record_id`);
      if (item.external_record_id === item.case_id) errors.push(`${label}: external_record_id 不能等于 case_id`);
      if (!isHttpUrl(item.deep_link) &&
          !(isPublicSnapshotPath(item.snapshot_path) &&
            /^sha256:[a-f0-9]{64}$/.test(item.content_hash ?? ""))) {
        errors.push(`${label}: 公开案例必须有 deep_link 或 snapshot_path`);
      }
      if (isNonEmptyString(item.deep_link) && artifactLinks.includes(item.deep_link) &&
          !isNonEmptyString(item.snapshot_path)) {
        errors.push(`${label}: 示例产物链接不能代替来源定位`);
      }
    }
  }
  return errors;
}
```

- [ ] **步骤 5：运行案例测试确认绿灯**

运行：

```bash
node --test --test-name-pattern="validateCaseSourceMap" tests/content-utils.test.mjs
```

预期：8 项匹配测试 PASS。

- [ ] **步骤 6：提交案例发布门**

```bash
git add scripts/content-utils.mjs tests/content-utils.test.mjs tests/fixtures/evidence/case-map-valid-32.mjs
git commit -m "feat(案例校验): 添加案例来源映射发布门"
```

## 任务 3：关联正文主张、来源目录和公开案例计数

**文件：**

- 创建：`tests/fixtures/evidence/executive-summary-valid.md`
- 创建：`tests/fixtures/evidence/sources-valid-aliases.md`
- 修改：`tests/content-utils.test.mjs`
- 修改：`scripts/content-utils.mjs`

- [ ] **步骤 1：创建正文和来源夹具**

创建 `executive-summary-valid.md`：

```markdown
---
title: 企业 AI 从功能竞赛走向工作流竞赛
description: 测试执行摘要主张覆盖
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 企业 AI 从功能竞赛走向工作流竞赛

<span id="claim-workflow-core-01" data-claim-id="claim-workflow-core-01"></span>本书主张：企业采用 AI 时，应把关注点延伸到可验证、可复用、可治理的工作流。

| 判断 | 行动 |
|---|---|
| <span id="claim-workflow-action-01" data-claim-id="claim-workflow-action-01"></span>本书建议：先定义验收 | 从一个任务开始 |
```

创建 `sources-valid-aliases.md`，其中 R14/R15 使用显式 HTML 锚点和正文链接，不重复写同一 URL：

```markdown
# 来源与延伸阅读

兼容编号入口：[R14](#r14)、[R15](#r15)。

## R4

[连接器](https://qwenwork.cn/docs/features/connectors)

## R8

[Skill](https://qwenwork.cn/docs/features/skills)

## R11

[公开案例库](https://qwenwork.cn/cases)

<span id="r14"></span>R14 是 [R8](#r8) 的兼容锚点。

<span id="r15"></span>R15 是 [R4](#r4) 的兼容锚点。
```

- [ ] **步骤 2：编写失败的标记、来源与计数测试**

在 `tests/content-utils.test.mjs` 添加：

```js
import { fileURLToPath } from "node:url";
import { resolveConfig } from "vitepress";

import {
  extractClaimMarkers,
  normalizeSourceUrl,
  validateClaimReferences,
  validatePublicCaseMembership,
  validatePublicCaseCountReferences,
  validateSourceCatalog,
  validateSourceReferences,
} from "../scripts/content-utils.mjs";

test("extractClaimMarkers accepts only the standard claim span", () => {
  const valid = '<span id="claim-a-01" data-claim-id="claim-a-01"></span>';
  assert.deepEqual(extractClaimMarkers(valid, "docs/page.md"), {
    markers: [{ claimId: "claim-a-01", contentPath: "docs/page.md" }],
    errors: [],
  });
  const invalid = '<span data-claim-id="claim-a-01" id="claim-b-01"></span>';
  assert.ok(extractClaimMarkers(invalid, "docs/page.md").errors.length > 0);
});

test("validateClaimReferences requires summary paragraphs and table rows to be marked", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims.push({
    ...structuredClone(ledger.claims[0]),
    claim_id: "claim-workflow-action-01",
    content_anchor: "claim-workflow-action-01",
    claim_text: "先定义验收，再启动任务。",
  });
  const valid = await readFile(new URL("executive-summary-valid.md", evidenceFixtures), "utf8");
  assert.deepEqual(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", valid]]),
    executiveSummaryPath: "docs/bluebook/executive-summary.md",
  }), []);

  const invalid = `${valid}\n这个段落没有主张标记。\n`;
  assert.ok(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", invalid]]),
    executiveSummaryPath: "docs/bluebook/executive-summary.md",
  }).some((error) => error.includes("执行摘要未关联 claim_id")));

  const unlabeledJudgment = valid.replace("本书主张：", "");
  assert.ok(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", unlabeledJudgment]]),
    executiveSummaryPath: "docs/bluebook/executive-summary.md",
  }).some((error) => error.includes("本书主张/本书建议")));

  ledger.claims[0].verification_status = "limited";
  assert.ok(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", valid]]),
    executiveSummaryPath: "docs/bluebook/executive-summary.md",
  }).some((error) => error.includes("limited 主张必须同块披露局限")));
  const disclosed = valid.replace("工作流。", "工作流。（局限：这是限定范围内的判断。）");
  assert.equal(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", disclosed]]),
    executiveSummaryPath: "docs/bluebook/executive-summary.md",
  }).some((error) => error.includes("limited 主张必须同块披露局限")), false);
});

test("validateClaimReferences enforces claim and page publication states", async () => {
  const ledger = await readJsonFixture("ledger-valid.json");
  const source = await readFile(new URL("executive-summary-valid.md", evidenceFixtures), "utf8");
  const oneClaimSource = source.replace(/\n\| 判断[\s\S]*$/, "\n");
  ledger.claims[0].verification_status = "pending";
  ledger.claims[0].summary_eligible = false;
  ledger.claims[0].blocks_release = false;
  assert.ok(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", oneClaimSource]]),
    executiveSummaryPath: "docs/bluebook/other-summary.md",
  }).some((error) => error.includes("pending 或 stale 主张不得出现在发布正文")));

  ledger.claims[0].verification_status = "editor-reviewed";
  const verifiedPage = oneClaimSource.replace("status: community-practice", "status: verified");
  assert.ok(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", verifiedPage]]),
    executiveSummaryPath: "docs/bluebook/other-summary.md",
  }).some((error) => error.includes("verified 页面")));

  ledger.claims[0].content_path = "docs/bluebook/missing.md";
  assert.ok(validateClaimReferences({
    ledger,
    documents: new Map([["docs/bluebook/executive-summary.md", oneClaimSource]]),
    executiveSummaryPath: "docs/bluebook/other-summary.md",
  }).some((error) => error.includes("正文路径不存在")));
});

test("normalizeSourceUrl removes tracking and normalizes host and trailing slash", () => {
  assert.equal(
    normalizeSourceUrl("HTTPS://QWENWORK.CN/docs/features/skills/?utm_source=test#intro"),
    "https://qwenwork.cn/docs/features/skills",
  );
});

test("validateSourceCatalog permits only the R14 and R15 aliases", async () => {
  const source = await readFile(new URL("sources-valid-aliases.md", evidenceFixtures), "utf8");
  assert.deepEqual(validateSourceCatalog(source, {
    allowedAliases: new Map([["R14", "R8"], ["R15", "R4"]]),
  }), []);
  const duplicate = `${source}\n## R16\n\n[重复](https://qwenwork.cn/docs/features/skills/)\n`;
  assert.ok(validateSourceCatalog(duplicate, {
    allowedAliases: new Map([["R14", "R8"], ["R15", "R4"]]),
  }).some((error) => error.includes("来源 URL 重复")));

  const withoutClickableEntries = source.replace(/^兼容编号入口：.*\n\n/m, "");
  assert.ok(validateSourceCatalog(withoutClickableEntries, {
    allowedAliases: new Map([["R14", "R8"], ["R15", "R4"]]),
  }).some((error) => error.includes("缺少可点击兼容编号入口")));

  const duplicateId = `${source}\n## R8\n\n[另一来源](https://example.com/r8)\n`;
  assert.ok(validateSourceCatalog(duplicateId, {
    allowedAliases: new Map([["R14", "R8"], ["R15", "R4"]]),
  }).some((error) => error.includes("R8: 来源 ID 重复")));

  const emptyCanonical = `${source}\n## R99\n`;
  assert.ok(validateSourceCatalog(emptyCanonical, {
    allowedAliases: new Map([["R14", "R8"], ["R15", "R4"]]),
  }).some((error) => error.includes("R99: canonical 来源必须包含有效 URL")));

  const unapprovedAlias = `${source}\n<span id="r98"></span>`;
  assert.ok(validateSourceCatalog(unapprovedAlias, {
    allowedAliases: new Map([["R14", "R8"], ["R15", "R4"]]),
  }).some((error) => error.includes("R98: 未允许的来源别名")));
});

test("validateSourceReferences requires every R id to exist in the catalog", async () => {
  const source = await readFile(new URL("sources-valid-aliases.md", evidenceFixtures), "utf8");
  const ledger = await readJsonFixture("ledger-valid.json");
  ledger.claims[0].source.source_ref = "R8";
  assert.deepEqual(validateSourceReferences({ ledger, caseMap: validCaseMap, source }), []);
  ledger.claims[0].source.source_ref = "R99";
  assert.ok(validateSourceReferences({ ledger, caseMap: validCaseMap, source })
    .some((error) => error.includes("R99")));
  const fakeSources = `${source}\n## R99\n\n<span id="r98"></span>`;
  assert.ok(validateSourceReferences({ ledger, caseMap: validCaseMap, source: fakeSources })
    .some((error) => error.includes("R99")));
  ledger.claims[0].source.source_ref = "R14";
  assert.ok(validateSourceReferences({ ledger, caseMap: validCaseMap, source })
    .some((error) => error.includes("R14")));
  const invalidCaseMap = structuredClone(validCaseMap);
  invalidCaseMap.cases[0].source_ref = "R98";
  assert.ok(validateSourceReferences({ ledger: { claims: [] }, caseMap: invalidCaseMap, source })
    .some((error) => error.includes("R98")));
});

test("validatePublicCaseCountReferences matches every count marker", () => {
  const documents = new Map([
    ["docs/cases/index.md", '<span data-public-case-count="3">3</span> 个公开案例'],
  ]);
  assert.deepEqual(validatePublicCaseCountReferences(documents, 3), []);
  assert.ok(validatePublicCaseCountReferences(documents, 2)[0].includes("公开案例计数"));
});

test("validatePublicCaseMembership requires the exact published case set", () => {
  const caseMap = structuredClone(validCaseMap);
  const publicId = caseMap.cases[0].case_id;
  caseMap.cases[0].included_in_public_count = true;
  const valid = `<span data-public-case-id="${publicId}"></span>`;
  assert.deepEqual(validatePublicCaseMembership(valid, caseMap), []);
  assert.ok(validatePublicCaseMembership("", caseMap)
    .some((error) => error.includes(`缺少公开案例 ${publicId}`)));
  assert.ok(validatePublicCaseMembership(`${valid}\n${valid}`, caseMap)
    .some((error) => error.includes("重复")));
  const pendingId = caseMap.cases[1].case_id;
  assert.ok(validatePublicCaseMembership(
    `${valid}\n<span data-public-case-id="${pendingId}"></span>`, caseMap,
  ).some((error) => error.includes("未通过发布门")));
  assert.ok(validatePublicCaseMembership(`${valid}\n<span data-public-case-id="bad"></span>`, caseMap)
    .some((error) => error.includes("非标准")));
});
```

- [ ] **步骤 3：运行测试确认红灯**

运行：

```bash
node --test --test-name-pattern="ClaimMarkers|ClaimReferences|SourceCatalog|SourceReferences|PublicCaseCount|PublicCaseMembership|normalizeSourceUrl" tests/content-utils.test.mjs
```

预期：FAIL，报错说明新增函数尚未导出。

- [ ] **步骤 4：实现标准标记和执行摘要覆盖检查**

在 `scripts/content-utils.mjs` 添加精确标记提取。执行摘要采用“一项主张一个 Markdown 段落或表格行”的稳定排版；除 Frontmatter、标题、空行、表头分隔线、容器边界和纯导航链接外，每个正文段落、列表项、引用和数据行必须在同一块包含标准标记：

```js
const CLAIM_MARKER_PATTERN =
  /<span id="(claim-[a-z0-9]+(?:-[a-z0-9]+)*)" data-claim-id="(claim-[a-z0-9]+(?:-[a-z0-9]+)*)"><\/span>/g;

export function extractClaimMarkers(markdown, contentPath) {
  const markers = [];
  const errors = [];
  for (const match of markdown.matchAll(CLAIM_MARKER_PATTERN)) {
    if (match[1] !== match[2]) errors.push(`${contentPath}: claim span 两个属性值不一致`);
    markers.push({ claimId: match[1], contentPath });
  }
  for (const match of markdown.matchAll(/data-claim-id="([^"]+)"/g)) {
    if (!markers.some((marker) => marker.claimId === match[1])) {
      errors.push(`${contentPath}: 非标准 claim span：${match[1]}`);
    }
  }
  return { markers, errors };
}

function summaryBlocks(body) {
  const blocks = [];
  let fence = null;
  const lines = body.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      fence = fence ? null : fenceMatch[1][0];
      continue;
    }
    const nextLineIsTableDivider = /^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?$/.test(lines[index + 1] ?? "");
    if (fence || line.trim() === "" || /^#{1,6}\s/.test(line) || /^:::/.test(line) ||
        /^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?$/.test(line) ||
        (/^\|/.test(line) && nextLineIsTableDivider) ||
        /^\s*\[[^\]]+\]\([^)]+\)\s*$/.test(line)) continue;
    blocks.push({ line: index + 1, source: line });
  }
  return blocks;
}

export function validateClaimReferences({ ledger, documents, executiveSummaryPath }) {
  const errors = [];
  const claims = Array.isArray(ledger?.claims)
    ? ledger.claims.filter((claim) => claim && typeof claim === "object" && !Array.isArray(claim))
    : [];
  const claimsById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  const seenMarkers = new Map();
  const parsedDocuments = new Map();
  for (const [path, source] of documents) {
    let parsed;
    try {
      parsed = parseFrontmatter(source);
    } catch (error) {
      errors.push(`${path}: ${error.message}`);
      continue;
    }
    parsedDocuments.set(path, parsed);
    const extracted = extractClaimMarkers(source, path);
    errors.push(...extracted.errors);
    const pageClaims = [];
    for (const marker of extracted.markers) {
      if (!claimsById.has(marker.claimId)) errors.push(`${path}: 未登记主张 ${marker.claimId}`);
      if (seenMarkers.has(marker.claimId)) errors.push(`${path}: 主张标记重复 ${marker.claimId}`);
      seenMarkers.set(marker.claimId, path);
      const claim = claimsById.get(marker.claimId);
      if (claim) pageClaims.push(claim);
      if (claim && ["pending", "stale"].includes(claim.verification_status)) {
        errors.push(`${path}: pending 或 stale 主张不得出现在发布正文：${marker.claimId}`);
      }
    }
    if (parsed.attributes.status === "verified" &&
        pageClaims.some((claim) => claim.is_key && claim.verification_status !== "verified")) {
      errors.push(`${path}: verified 页面的关键主张必须全部为 verified`);
    }
  }
  for (const claim of claims) {
    if (claim.content_path === null) continue;
    if (!documents.has(claim.content_path)) {
      errors.push(`${claim.claim_id}: 正文路径不存在：${claim.content_path}`);
    } else if (seenMarkers.get(claim.claim_id) !== claim.content_path) {
      errors.push(`${claim.claim_id}: 正文锚点不存在或位于错误页面`);
    }
  }
  const summary = parsedDocuments.get(executiveSummaryPath);
  if (summary) {
    for (const block of summaryBlocks(summary.body)) {
      const ids = [...block.source.matchAll(CLAIM_MARKER_PATTERN)].map((match) => match[1]);
      if (ids.length === 0) errors.push(`${executiveSummaryPath}:${block.line}: 执行摘要未关联 claim_id`);
      for (const id of ids) {
        const claim = claimsById.get(id);
        if (claim && (!claim.is_key || !claim.summary_eligible || !claim.blocks_release ||
            ["pending", "stale"].includes(claim.verification_status))) {
          errors.push(`${id}: 不满足执行摘要发布条件`);
        }
        if (claim?.verification_status === "limited" && !/(?:局限|限制)[:：]/.test(block.source)) {
          errors.push(`${id}: limited 主张必须同块披露局限`);
        }
        if (claim?.verification_status === "editor-reviewed" &&
            !/本书(?:主张|建议)/.test(block.source)) {
          errors.push(`${id}: editor-reviewed 主张必须明确写“本书主张/本书建议”`);
        }
      }
    }
  }
  return errors;
}
```

- [ ] **步骤 5：实现 URL 去重和案例计数检查**

在同一文件添加：

```js
export function normalizeSourceUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|spm$)/i.test(key)) url.searchParams.delete(key);
  }
  url.pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
}

function analyzeSourceCatalog(markdown, allowedAliases) {
  const errors = [];
  const resolvedIds = new Set();
  const urls = new Map();
  const sectionPattern = /^##[ \t]+(R[1-9][0-9]*)[ \t]*$\n?([\s\S]*?)(?=^##[ \t]+R[1-9][0-9]*[ \t]*$|(?![\s\S]))/gm;
  const sections = [...markdown.matchAll(sectionPattern)];
  const counts = new Map();
  for (const match of sections) counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);

  for (const [id, count] of counts) {
    if (count > 1) errors.push(`${id}: 来源 ID 重复`);
    if (allowedAliases.has(id)) errors.push(`${id}: 兼容编号不得声明为 canonical 来源`);
  }
  for (const match of sections) {
    const [, id, body] = match;
    if (counts.get(id) !== 1 || allowedAliases.has(id)) continue;
    const validUrls = [];
    for (const urlMatch of body.matchAll(/https?:\/\/[^\s)<>\]}]+/g)) {
      try {
        validUrls.push(normalizeSourceUrl(urlMatch[0]));
      } catch {
        errors.push(`${id}: 来源 URL 无法解析：${urlMatch[0]}`);
      }
    }
    if (validUrls.length === 0) {
      errors.push(`${id}: canonical 来源必须包含有效 URL`);
      continue;
    }
    resolvedIds.add(id);
    for (const normalized of validUrls) {
      if (urls.has(normalized)) {
        errors.push(`来源 URL 重复：${urls.get(normalized)} 与 ${id}`);
      } else {
        urls.set(normalized, id);
      }
    }
  }

  const aliasCounts = new Map();
  for (const match of markdown.matchAll(/<span[ \t]+id="r([1-9][0-9]*)"[ \t]*><\/span>/g)) {
    const alias = `R${match[1]}`;
    aliasCounts.set(alias, (aliasCounts.get(alias) ?? 0) + 1);
    if (!allowedAliases.has(alias)) errors.push(`${alias}: 未允许的来源别名`);
  }
  for (const [alias, target] of allowedAliases) {
    const anchor = alias.toLowerCase();
    if (!markdown.includes(`[${alias}](#${anchor})`)) {
      errors.push(`${alias}: 缺少可点击兼容编号入口`);
    }
    if (aliasCounts.get(alias) !== 1 ||
        !markdown.includes(`[${target}](#${target.toLowerCase()})`) ||
        !resolvedIds.has(target)) {
      errors.push(`${alias}: 兼容锚点必须唯一指向有效的 ${target}`);
    }
  }
  return { errors, resolvedIds };
}

export function validateSourceCatalog(markdown, { allowedAliases }) {
  return analyzeSourceCatalog(markdown, allowedAliases).errors;
}

export function extractSourceIds(markdown, { allowedAliases = new Map() } = {}) {
  return analyzeSourceCatalog(markdown, allowedAliases).resolvedIds;
}

export function validateSourceReferences({ ledger, caseMap, source, allowedAliases = new Map() }) {
  const errors = [];
  const ids = extractSourceIds(source, { allowedAliases });
  const references = [
    ...(Array.isArray(ledger?.claims)
      ? ledger.claims.flatMap((claim, index) => claim && typeof claim === "object"
        ? [[claim.claim_id ?? `claims[${index}]`, claim.source?.source_ref]] : [])
      : []),
    ...(Array.isArray(caseMap?.cases)
      ? caseMap.cases.flatMap((item, index) => item && typeof item === "object"
        ? [[item.case_id ?? `cases[${index}]`, item.source_ref]] : [])
      : []),
  ];
  for (const [owner, reference] of references) {
    if (typeof reference === "string" && !ids.has(reference)) {
      errors.push(`${owner}: source_ref ${reference} 不存在于有效的 canonical 来源目录`);
    }
  }
  return errors;
}

export function validatePublicCaseCountReferences(documents, expectedCount) {
  const errors = [];
  for (const [path, source] of documents) {
    let markerCount = 0;
    for (const match of source.matchAll(/<span data-public-case-count="(\d+)">(\d+)<\/span>/g)) {
      markerCount += 1;
      if (Number(match[1]) !== expectedCount || Number(match[2]) !== expectedCount) {
        errors.push(`${path}: 公开案例计数必须为 ${expectedCount}`);
      }
    }
    if (markerCount !== 1) errors.push(`${path}: 必须恰好包含一个公开案例计数标记`);
  }
  return errors;
}

export function validatePublicCaseMembership(source, caseMap) {
  const errors = [];
  const expected = new Set(caseMap.cases
    .filter((item) => item.included_in_public_count)
    .map((item) => item.case_id));
  const seen = new Set();
  const standard = /<span data-public-case-id="(case-[a-z0-9]+(?:-[a-z0-9]+)*)"><\/span>/g;
  for (const match of source.matchAll(standard)) {
    const id = match[1];
    if (seen.has(id)) errors.push(`${id}: 公开案例成员标记重复`);
    seen.add(id);
    if (!expected.has(id)) errors.push(`${id}: 未通过发布门，不得进入公开案例清单`);
  }
  for (const match of source.matchAll(/data-public-case-id="([^"]+)"/g)) {
    if (!seen.has(match[1])) errors.push(`${match[1]}: 非标准公开案例成员标记`);
  }
  for (const id of expected) {
    if (!seen.has(id)) errors.push(`缺少公开案例 ${id}`);
  }
  return errors;
}
```

- [ ] **步骤 6：运行测试确认绿灯并跑全量测试**

运行：

```bash
node --test --test-name-pattern="ClaimMarkers|ClaimReferences|SourceCatalog|SourceReferences|PublicCaseCount|PublicCaseMembership|normalizeSourceUrl" tests/content-utils.test.mjs
npm test
```

预期：新增匹配测试和原有 24 项测试全部 PASS。

- [ ] **步骤 7：提交正文关联规则**

```bash
git add scripts/content-utils.mjs tests/content-utils.test.mjs tests/fixtures/evidence/executive-summary-valid.md tests/fixtures/evidence/sources-valid-aliases.md
git commit -m "feat(内容校验): 关联正文主张与来源目录"
```

## 任务 4：用测试建立确定性证据页面生成器

**文件：**

- 创建：`scripts/generate-evidence-pages.mjs`
- 修改：`tests/content-validators.test.mjs`

- [ ] **步骤 1：编写失败的生成器集成测试**

在 `tests/content-validators.test.mjs` 添加：

```js
import { generateEvidencePages } from "../scripts/generate-evidence-pages.mjs";
import validCaseMap from "./fixtures/evidence/case-map-valid-32.mjs";

test("generateEvidencePages writes deterministic public appendices", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const ledgerPath = join(directory, "evidence-ledger.json");
  const caseMapPath = join(directory, "case-source-map.json");
  const evidenceOutputPath = join(directory, "evidence-ledger.md");
  const caseOutputPath = join(directory, "case-source-map.md");
  const ledger = JSON.parse(await readFile(new URL("fixtures/evidence/ledger-valid.json", import.meta.url), "utf8"));
  ledger.claims.push({
    ...structuredClone(ledger.claims[0]),
    claim_id: "claim-public-safe-lead-01",
    claim_text: "公开安全且不可反推主体身份的待核验线索。",
    content_path: null,
    content_anchor: null,
    is_key: false,
    summary_eligible: false,
    blocks_release: false,
    verification_status: "pending",
  });
  const caseMap = structuredClone(validCaseMap);
  Object.assign(caseMap.cases[0], {
    original_name: "公开案例 | 第一行\n第二行",
    verification_status: "limited",
    included_in_public_count: true,
    external_record_id: "external-case-record-001",
    deep_link: null,
    snapshot_path: "docs/public/evidence-snapshots/case-001.html",
    content_hash: `sha256:${"b".repeat(64)}`,
    artifact_links: ["https://artifact.example/demo-001"],
    limitations: ["样本和外推范围有限。"],
  });
  await writeFile(ledgerPath, JSON.stringify(ledger, null, 2), "utf8");
  await writeFile(caseMapPath, JSON.stringify(caseMap, null, 2), "utf8");

  assert.deepEqual(await generateEvidencePages({
    ledgerPath, caseMapPath, evidenceOutputPath, caseOutputPath, mode: "write", today: "2026-08-01",
  }), []);
  const first = [await readFile(evidenceOutputPath, "utf8"), await readFile(caseOutputPath, "utf8")];
  assert.match(first[0], /## 已发布主张[\s\S]*claim-workflow-core-01/);
  assert.match(first[0], /## 待核验线索（公开安全）[\s\S]*claim-public-safe-lead-01/);
  assert.ok(first[0].includes(
    "[docs/bluebook/executive-summary.md#claim-workflow-core-01](/bluebook/executive-summary#claim-workflow-core-01)",
  ));
  assert.match(first[1], /公开案例：1；待核验线索：31/);
  assert.ok(first[1].includes("公开案例 \\| 第一行<br>第二行"));
  assert.ok(first[1].includes(
    "[docs/public/evidence-snapshots/case-001.html](/evidence-snapshots/case-001.html)",
  ));
  assert.deepEqual(await generateEvidencePages({
    ledgerPath, caseMapPath, evidenceOutputPath, caseOutputPath, mode: "write", today: "2026-08-01",
  }), []);
  assert.deepEqual([await readFile(evidenceOutputPath, "utf8"), await readFile(caseOutputPath, "utf8")], first);
});

test("generateEvidencePages check mode reports stale generated pages without writing", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const ledgerPath = join(directory, "evidence-ledger.json");
  const caseMapPath = join(directory, "case-source-map.json");
  const evidenceOutputPath = join(directory, "evidence-ledger.md");
  const caseOutputPath = join(directory, "case-source-map.md");
  await writeFile(ledgerPath, await readFile(new URL("fixtures/evidence/ledger-valid.json", import.meta.url)), "utf8");
  await writeFile(caseMapPath, JSON.stringify(validCaseMap, null, 2), "utf8");
  await writeFile(evidenceOutputPath, "过期内容\n", "utf8");
  await writeFile(caseOutputPath, "过期内容\n", "utf8");
  const failures = await generateEvidencePages({
    ledgerPath, caseMapPath, evidenceOutputPath, caseOutputPath, mode: "check", today: "2026-08-01",
  });
  assert.equal(await readFile(evidenceOutputPath, "utf8"), "过期内容\n");
  assert.ok(failures.some((failure) => failure.includes("evidence-ledger.md")));
});

test("generateEvidencePages aggregates invalid JSON and schema errors without outputs", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const ledgerPath = join(directory, "evidence-ledger.json");
  const caseMapPath = join(directory, "case-source-map.json");
  const evidenceOutputPath = join(directory, "evidence-ledger.md");
  const caseOutputPath = join(directory, "case-source-map.md");
  await writeFile(ledgerPath, '{"schema_version":1,"claims":null}', "utf8");
  await writeFile(caseMapPath, '{invalid', "utf8");
  const failures = await generateEvidencePages({
    ledgerPath, caseMapPath, evidenceOutputPath, caseOutputPath, mode: "write", today: "2026-08-01",
  });
  assert.ok(failures.some((failure) => failure.includes("claims 必须为数组")));
  assert.ok(failures.some((failure) => failure.includes("case-source-map.json")));
  await assert.rejects(readFile(evidenceOutputPath, "utf8"));
  await assert.rejects(readFile(caseOutputPath, "utf8"));
});
```

- [ ] **步骤 2：运行测试确认红灯**

运行：

```bash
node --test --test-name-pattern="generateEvidencePages" tests/content-validators.test.mjs
```

预期：FAIL，报错说明生成器模块不存在。

- [ ] **步骤 3：实现渲染纯函数和写入/检查模式**

创建 `scripts/generate-evidence-pages.mjs`，导出 `renderEvidenceLedgerPage`、`renderCaseSourceMapPage` 和 `generateEvidencePages`。两页都包含完整 Frontmatter、自动生成警告和统计摘要；每个主张或案例使用独立小节加两列表格，避免 A4 页面出现 8–11 列宽表。所有 Markdown 表格单元格必须转义竖线和换行。核心接口：

```js
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validateCaseSourceMap, validateEvidenceLedger } from "./content-utils.mjs";

function cell(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

function snapshotLocation(path) {
  return path
    ? `[${cell(path)}](${path.replace(/^docs\/public/, "")})`
    : null;
}

export function renderEvidenceLedgerPage(ledger) {
  const published = ledger.claims.filter((claim) => !["pending", "stale"].includes(claim.verification_status));
  const pending = ledger.claims.filter((claim) => ["pending", "stale"].includes(claim.verification_status));
  const renderSections = (claims) => [...claims]
    .sort((a, b) => a.claim_id.localeCompare(b.claim_id))
    .map((claim) => {
      const locationLabel = claim.content_path ? `${claim.content_path}#${claim.content_anchor}` : "未发布";
      const location = claim.content_path
        ? `[${cell(locationLabel)}](/${claim.content_path
          .replace(/^docs\//, "")
          .replace(/\.md$/, "")}#${claim.content_anchor})`
        : locationLabel;
      const sourceLocation = claim.source.deep_link
        ? `[${claim.source.title}](${claim.source.deep_link})`
        : snapshotLocation(claim.source.snapshot_path) ??
          [claim.source.title, claim.source.excerpt, claim.source.content_hash].filter(Boolean).join("；");
      return `## ${cell(claim.claim_id)}\n\n${cell(claim.claim_text)}\n\n| 字段 | 内容 |\n|---|---|\n| 主张类型 | ${cell(claim.claim_type)} |\n| 来源类型 | ${cell(claim.source.source_type)} |\n| 来源定位 | ${cell(sourceLocation)} |\n| 核验状态 | ${cell(claim.verification_status)} |\n| 正文位置 | ${location} |\n| 统计口径 | ${cell(claim.measurement_basis)} |\n| 适用范围 | ${cell(claim.applicability)} |\n| 局限 | ${cell(claim.limitations.join("；"))} |\n| 核验日期 | ${cell(claim.last_verified_at)} |\n| 责任角色 | ${cell(claim.reviewer_role)} |`;
    })
    .join("\n\n");
  return `---\ntitle: 主张证据台账\ndescription: V2.0 关键主张的来源、状态与适用边界\nstatus: community-practice\nverifiedAt: 2026-08-01\nsources: []\n---\n\n# 主张证据台账\n\n> 本页由结构化数据自动生成，请修改 \`docs/bluebook/data/evidence-ledger.json\`。本文件及其 JSON 源均为公开内容。\n\n已发布主张：${published.length}；待核验线索：${pending.length}。\n\n## 已发布主张\n\n${renderSections(published)}\n\n## 待核验线索（公开安全）\n\n${renderSections(pending)}\n`;
}

export function renderCaseSourceMapPage(caseMap) {
  const published = caseMap.cases.filter((item) => item.included_in_public_count);
  const pending = caseMap.cases.filter((item) => !item.included_in_public_count);
  const renderSections = (items) => items.map((item) => {
    const location = item.deep_link
      ? `[${cell(item.deep_link)}](${item.deep_link})`
      : snapshotLocation(item.snapshot_path);
    return `### ${cell(item.case_id)}\n\n| 字段 | 内容 |\n|---|---|\n| 原始名称 | ${cell(item.original_name)} |\n| 原始标签 | ${cell(item.original_tags.join("、"))} |\n| 本书分类 | ${cell(item.book_category)} |\n| 核验状态 | ${cell(item.verification_status)} |\n| 外部记录 ID | ${cell(item.external_record_id)} |\n| 原始定位 | ${location ?? "—"} |\n| 局限 | ${cell(item.limitations.join("；"))} |`;
  }).join("\n\n");
  return `---\ntitle: 案例来源映射\ndescription: V2.0 案例候选的来源定位与公开状态\nstatus: community-practice\nverifiedAt: 2026-08-01\nsources: []\n---\n\n# 案例来源映射\n\n> 本页由结构化数据自动生成，请修改 \`docs/bluebook/data/case-source-map.json\`。\n\n公开案例：${published.length}；待核验线索：${pending.length}。\n\n## 计入公开案例\n\n${renderSections(published)}\n\n## 待核验线索\n\n${renderSections(pending)}\n`;
}

async function atomicWrite(path, content) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, path);
}

async function readJsonForGeneration(path, failures) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
    return undefined;
  }
}

export async function generateEvidencePages(options) {
  const failures = [];
  const ledger = await readJsonForGeneration(options.ledgerPath, failures);
  const caseMap = await readJsonForGeneration(options.caseMapPath, failures);
  const today = options.today ?? new Date().toISOString().slice(0, 10);
  if (ledger !== undefined) failures.push(...validateEvidenceLedger(ledger, { today }));
  if (caseMap !== undefined) failures.push(...validateCaseSourceMap(caseMap));
  if (failures.length > 0) return failures;
  const outputs = new Map([
    [options.evidenceOutputPath, renderEvidenceLedgerPage(ledger)],
    [options.caseOutputPath, renderCaseSourceMapPage(caseMap)],
  ]);
  for (const [path, expected] of outputs) {
    if (options.mode === "check") {
      const actual = await readFile(path, "utf8").catch(() => "");
      if (actual !== expected) failures.push(`${path}: 生成页面与 JSON 不一致`);
    } else {
      await atomicWrite(path, expected);
    }
  }
  return failures;
}
```

CLI 默认路径指向正式 JSON 和两个附录；`--check` 映射为 `mode: "check"`，失败时逐行输出并设置非零退出码。不要把日期写成运行时当前时间。

- [ ] **步骤 4：运行生成器测试确认绿灯**

运行：

```bash
node --test --test-name-pattern="generateEvidencePages" tests/content-validators.test.mjs
```

预期：3 项匹配测试 PASS。

- [ ] **步骤 5：提交生成器**

```bash
git add scripts/generate-evidence-pages.mjs tests/content-validators.test.mjs
git commit -m "feat(证据页面): 添加确定性公开附录生成器"
```

## 任务 5：接入仓库级 V2 内容校验

**文件：**

- 创建：`docs/bluebook/data/evidence-ledger.json`
- 创建：`docs/bluebook/data/case-source-map.json`
- 创建：`docs/bluebook/appendices/evidence-ledger.md`
- 创建：`docs/bluebook/appendices/case-source-map.md`
- 创建：`docs/bluebook/executive-summary.md`
- 修改：`docs/bluebook/appendices/sources.md`
- 修改：`scripts/validate-content.mjs`
- 可能创建：`docs/public/evidence-snapshots/*`（仅限确实用于发布证据的公开快照）
- 修改：`tests/content-validators.test.mjs`
- 修改：`package.json`

- [ ] **步骤 1：编写失败的临时仓库聚合测试**

在 `tests/content-validators.test.mjs` 添加一个临时仓库，写入合法 JSON、执行摘要、来源目录和公开计数标记；再分别破坏一个锚点和一个计数，验证错误被聚合：

```js
import { createHash } from "node:crypto";
import { validateEvidenceRepository } from "../scripts/validate-content.mjs";

test("validateEvidenceRepository aggregates structured and Markdown failures", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const contentRoot = join(directory, "docs");
  const dataRoot = join(contentRoot, "bluebook/data");
  await mkdir(dataRoot, { recursive: true });
  await mkdir(join(contentRoot, "bluebook/appendices"), { recursive: true });
  await mkdir(join(contentRoot, "cases"), { recursive: true });
  const ledger = JSON.parse(await readFile(
    new URL("fixtures/evidence/ledger-valid.json", import.meta.url), "utf8",
  ));
  const snapshotContent = "public source snapshot\n";
  const snapshotPath = "docs/public/evidence-snapshots/source.txt";
  ledger.claims[0].source.snapshot_path = snapshotPath;
  ledger.claims[0].source.content_hash =
    `sha256:${createHash("sha256").update(snapshotContent).digest("hex")}`;
  await mkdir(join(directory, "docs/public/evidence-snapshots"), { recursive: true });
  await writeFile(join(directory, snapshotPath), snapshotContent, "utf8");
  await writeFile(join(dataRoot, "evidence-ledger.json"), JSON.stringify(ledger, null, 2), "utf8");
  await writeFile(join(dataRoot, "case-source-map.json"),
    JSON.stringify(validCaseMap, null, 2), "utf8");
  await writeFile(join(contentRoot, "bluebook/executive-summary.md"),
    '---\ntitle: 摘要\nstatus: community-practice\n---\n\n# 摘要\n\n<span id="claim-workflow-core-01" data-claim-id="claim-workflow-core-01"></span>本书主张：企业采用 AI 应关注工作流。\n',
    "utf8");
  await writeFile(join(contentRoot, "bluebook/appendices/sources.md"),
    await readFile(new URL("fixtures/evidence/sources-valid-aliases.md", import.meta.url)));
  await writeFile(join(contentRoot, "cases/index.md"),
    '<span data-public-case-count="0">0</span> 个公开案例\n', "utf8");

  const options = {
    repositoryRoot: directory,
    evidenceLedgerPath: join(dataRoot, "evidence-ledger.json"),
    caseSourceMapPath: join(dataRoot, "case-source-map.json"),
    contentRoots: [contentRoot],
    executiveSummaryPath: join(contentRoot, "bluebook/executive-summary.md"),
    sourcesPath: join(contentRoot, "bluebook/appendices/sources.md"),
    publicCaseCountPaths: [join(contentRoot, "cases/index.md")],
    publicCaseMembershipPath: null,
    today: "2026-08-01",
  };
  assert.deepEqual(await validateEvidenceRepository(options), []);

  await writeFile(join(directory, snapshotPath), "tampered\n", "utf8");
  assert.ok((await validateEvidenceRepository(options))
    .some((failure) => failure.includes("snapshot hash 不匹配")));
  await writeFile(join(directory, snapshotPath), snapshotContent, "utf8");
  ledger.claims[0].source.snapshot_path = "docs/public/evidence-snapshots/missing.txt";
  await writeFile(join(dataRoot, "evidence-ledger.json"), JSON.stringify(ledger, null, 2), "utf8");
  assert.ok((await validateEvidenceRepository(options))
    .some((failure) => failure.includes("snapshot 文件不存在或不可读")));
  ledger.claims[0].source.snapshot_path = snapshotPath;
  await writeFile(join(dataRoot, "evidence-ledger.json"), JSON.stringify(ledger, null, 2), "utf8");

  await writeFile(join(contentRoot, "bluebook/executive-summary.md"),
    "---\ntitle: 摘要\nstatus: community-practice\n---\n\n# 摘要\n\n没有主张标记。\n", "utf8");
  await writeFile(join(contentRoot, "cases/index.md"),
    '<span data-public-case-count="1">1</span> 个公开案例\n', "utf8");
  const failures = await validateEvidenceRepository(options);
  assert.ok(failures.some((failure) => failure.includes("执行摘要未关联 claim_id")));
  assert.ok(failures.some((failure) => failure.includes("公开案例计数")));

  await writeFile(join(contentRoot, "bluebook/executive-summary.md"),
    "---\ntitle: 摘要\nstatus: community-practice\n\n# 未闭合 Frontmatter\n", "utf8");
  const parseFailures = await validateEvidenceRepository(options);
  assert.ok(parseFailures.some((failure) => failure.includes("Frontmatter 未闭合")));
  assert.ok(parseFailures.some((failure) => failure.includes("公开案例计数")));
});

test("validateEvidenceRepository aggregates invalid object shapes without throwing", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const contentRoot = join(directory, "docs");
  const dataRoot = join(contentRoot, "bluebook/data");
  await mkdir(dataRoot, { recursive: true });
  await mkdir(join(contentRoot, "bluebook/appendices"), { recursive: true });
  await writeFile(join(dataRoot, "evidence-ledger.json"),
    '{"schema_version":1,"claims":null}', "utf8");
  await writeFile(join(dataRoot, "case-source-map.json"),
    '{"schema_version":1,"cases":null}', "utf8");
  await writeFile(join(contentRoot, "bluebook/appendices/sources.md"),
    await readFile(new URL("fixtures/evidence/sources-valid-aliases.md", import.meta.url)));
  const options = {
    repositoryRoot: directory,
    evidenceLedgerPath: join(dataRoot, "evidence-ledger.json"),
    caseSourceMapPath: join(dataRoot, "case-source-map.json"),
    contentRoots: [contentRoot],
    executiveSummaryPath: join(contentRoot, "bluebook/executive-summary.md"),
    sourcesPath: join(contentRoot, "bluebook/appendices/sources.md"),
    publicCaseCountPaths: [],
    publicCaseMembershipPath: null,
    today: "2026-08-01",
  };
  const failures = await validateEvidenceRepository(options);
  assert.ok(failures.some((failure) => failure.includes("claims 必须为数组")));
  assert.ok(failures.some((failure) => failure.includes("cases 必须为数组")));

  const ledger = JSON.parse(await readFile(
    new URL("fixtures/evidence/ledger-valid.json", import.meta.url), "utf8",
  ));
  const caseMap = structuredClone(validCaseMap);
  ledger.claims[0] = null;
  caseMap.cases[0] = null;
  await writeFile(join(dataRoot, "evidence-ledger.json"), JSON.stringify(ledger), "utf8");
  await writeFile(join(dataRoot, "case-source-map.json"), JSON.stringify(caseMap), "utf8");
  const nestedFailures = await validateEvidenceRepository(options);
  assert.ok(nestedFailures.some((failure) => failure.includes("claims[0]: 必须为对象")));
  assert.ok(nestedFailures.some((failure) => failure.includes("cases[0]: 必须为对象")));
});
```

- [ ] **步骤 2：运行聚合测试确认红灯**

运行：

```bash
node --test --test-name-pattern="validateEvidenceRepository" tests/content-validators.test.mjs
```

预期：FAIL，报错说明 `validateEvidenceRepository` 尚未导出。

- [ ] **步骤 3：实现仓库级聚合接口**

在 `scripts/validate-content.mjs` 导出并由 CLI 调用：

```js
import { createHash } from "node:crypto";

async function readJsonForValidation(path, failures) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    failures.push(`${displayPath(path)}: ${error.message}`);
    return undefined;
  }
}

async function readTextForValidation(path, failures) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    failures.push(`${displayPath(path)}: ${error.message}`);
    return null;
  }
}

async function validateSnapshotReferences({ repositoryRoot, ledger, caseMap }) {
  const errors = [];
  const records = [
    ...(ledger?.claims ?? []).flatMap((claim) => claim.source.snapshot_path === null ? [] : [[
      claim.claim_id, claim.source.snapshot_path, claim.source.content_hash,
    ]]),
    ...(caseMap?.cases ?? []).flatMap((item) => item.snapshot_path === null ? [] : [[
      item.case_id, item.snapshot_path, item.content_hash,
    ]]),
  ];
  const allowedRoot = resolve(repositoryRoot, "docs/public/evidence-snapshots");
  for (const [owner, snapshotPath, expectedHash] of records) {
    const absolutePath = resolve(repositoryRoot, snapshotPath);
    const relativeToAllowed = relative(allowedRoot, absolutePath);
    if (relativeToAllowed === "" || relativeToAllowed === ".." ||
        relativeToAllowed.startsWith(`..${sep}`) || isAbsolute(relativeToAllowed)) {
      errors.push(`${owner}: snapshot_path 不在公开快照目录内`);
      continue;
    }
    let bytes;
    try {
      bytes = await readFile(absolutePath);
    } catch (error) {
      errors.push(`${owner}: snapshot 文件不存在或不可读：${error.message}`);
      continue;
    }
    const actualHash = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
    if (actualHash !== expectedHash) errors.push(`${owner}: snapshot hash 不匹配`);
  }
  return errors;
}

export async function validateEvidenceRepository({
  repositoryRoot,
  evidenceLedgerPath,
  caseSourceMapPath,
  contentRoots,
  executiveSummaryPath,
  sourcesPath,
  publicCaseCountPaths,
  publicCaseMembershipPath,
  today,
}) {
  const failures = [];
  const toRepositoryPath = (path) => {
    const relativePath = relative(resolve(repositoryRoot), resolve(path));
    if (relativePath === "" || relativePath === ".." || relativePath.startsWith(`..${sep}`) ||
        isAbsolute(relativePath)) {
      failures.push(`${displayPath(path)}: 路径不在 repositoryRoot 内`);
      return null;
    }
    return relativePath.split(sep).join("/");
  };
  const ledger = await readJsonForValidation(evidenceLedgerPath, failures);
  const caseMap = await readJsonForValidation(caseSourceMapPath, failures);
  const ledgerErrors = ledger === undefined ? [] : validateEvidenceLedger(ledger, { today });
  const caseMapErrors = caseMap === undefined ? [] : validateCaseSourceMap(caseMap);
  failures.push(...ledgerErrors, ...caseMapErrors);
  const ledgerUsable = ledger !== undefined && ledgerErrors.length === 0;
  const caseMapUsable = caseMap !== undefined && caseMapErrors.length === 0;
  const markdownFiles = [];
  for (const root of contentRoots) markdownFiles.push(...await findMarkdownFiles(root, failures));
  const documents = new Map();
  for (const file of markdownFiles) {
    const source = await readTextForValidation(file, failures);
    const repositoryPath = toRepositoryPath(file);
    if (source !== null && repositoryPath !== null) documents.set(repositoryPath, source);
  }
  if (ledgerUsable) {
    failures.push(...validateClaimReferences({
      ledger,
      documents,
      executiveSummaryPath: toRepositoryPath(executiveSummaryPath),
    }));
  }
  const sources = await readTextForValidation(sourcesPath, failures);
  if (sources !== null) {
    const allowedAliases = new Map([["R14", "R8"], ["R15", "R4"]]);
    failures.push(...validateSourceCatalog(sources, {
      allowedAliases,
    }));
    failures.push(...validateSourceReferences({
      ledger: ledgerUsable ? ledger : undefined,
      caseMap: caseMapUsable ? caseMap : undefined,
      source: sources,
      allowedAliases,
    }));
  }
  failures.push(...await validateSnapshotReferences({
    repositoryRoot,
    ledger: ledgerUsable ? ledger : undefined,
    caseMap: caseMapUsable ? caseMap : undefined,
  }));
  const countDocuments = new Map();
  for (const path of publicCaseCountPaths) {
    const source = await readTextForValidation(path, failures);
    const repositoryPath = toRepositoryPath(path);
    if (source !== null && repositoryPath !== null) countDocuments.set(repositoryPath, source);
  }
  if (caseMapUsable) {
    failures.push(...validatePublicCaseCountReferences(
      countDocuments,
      caseMap.cases.filter((item) => item.included_in_public_count).length,
    ));
  }
  if (publicCaseMembershipPath !== null && caseMapUsable) {
    const source = await readTextForValidation(publicCaseMembershipPath, failures);
    if (source !== null) failures.push(...validatePublicCaseMembership(source, caseMap));
  }
  return failures;
}
```

在文件顶部从 `node:path` 导入 `isAbsolute`、`relative`、`resolve` 和 `sep`，从 `node:crypto` 导入 `createHash`，并导入 `validatePublicCaseMembership`、`validateSourceReferences`。正式 CLI 显式传 `repositoryRoot: process.cwd()`；Map 键只使用相对于该根目录、统一为 `/` 的路径，绝不复用仅用于报错展示的 `displayPath()`。正式 `contentRoots` 必须覆盖 `docs/bluebook`、`docs/guides`、`docs/community` 和 `docs/cases`。任务 5 尚未发布第 9 章时，正式 `publicCaseCountPaths` 传空数组、`publicCaseMembershipPath` 传 `null`；任务 11 创建三个计数标记后，将第 9 章、案例库首页和公开图谱投稿页加入计数数组，并只把第 9 章设为成员清单路径。

读取、Frontmatter 解析、schema、来源目录和快照错误都必须聚合。`ledgerErrors` 或 `caseMapErrors` 非空时，只跳过依赖对应数据集的关联、快照、成员和计数校验；另一个合法数据集、来源目录和文件读取仍继续检查。不得仅凭 `claims`/`cases` 是数组就调用后续 `.map()` 或 `.filter()`，数组内 `null`、数组或标量元素也必须由 schema 校验返回错误而不抛异常。

- [ ] **步骤 4：把案例目录纳入证据扫描**

保持 `validateCaseDirectory(directory) => string[]` 现有契约不变；将 `docs/cases` 加入上一步证据仓库的 `contentRoots`，不把证据逻辑复制进 `validate-cases.mjs`，现有案例章节测试继续通过。

- [ ] **步骤 5：添加生成与检查命令**

将 `package.json` 的 `scripts` 更新为：

```json
{
  "dev": "vitepress dev docs",
  "build": "vitepress build docs",
  "preview": "vitepress preview docs",
  "test": "node --test",
  "generate:evidence": "node scripts/generate-evidence-pages.mjs",
  "check:evidence": "node scripts/generate-evidence-pages.mjs --check",
  "check:content": "node scripts/validate-content.mjs && node scripts/validate-cases.mjs && npm run check:evidence",
  "check": "npm run test && npm run check:content && npm run build"
}
```

- [ ] **步骤 6：接入真实 JSON、摘要骨架和来源别名**

正式 `case-source-map.json` 使用夹具中的 32 个稳定 ID 和旧案例图谱中的原始标签、分类、示例链接；初始状态全部为 `pending` 和 `included_in_public_count: false`。正式 `evidence-ledger.json` 初始只登记 `claim-workflow-core-01`；后续内容任务在写入正文标记的同一提交中增加对应记录。

创建不进入导航的最小执行摘要骨架，使仓库校验从接入时起保持绿色：

```markdown
---
title: 企业 AI 从功能竞赛走向工作流竞赛
description: 千问办公蓝皮书 V2.0 执行摘要
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# 企业 AI 从功能竞赛走向工作流竞赛

<span id="claim-workflow-core-01" data-claim-id="claim-workflow-core-01"></span>本书主张：企业采用 AI 时，应把关注点从单次模型问答延伸到可验证、可复用、可治理的业务工作流。
```

同时把 `sources.md` 的 R14/R15 重复 URL 改成任务 12 步骤 4 的兼容锚点形式，确保来源去重校验能在此任务正式启用。

运行：

```bash
npm run generate:evidence
```

预期：创建两份附录，第二次运行内容字节级不变。

- [ ] **步骤 7：运行聚合测试和正式校验**

运行：

```bash
node --test --test-name-pattern="validateEvidenceRepository|generateEvidencePages" tests/content-validators.test.mjs
npm test
npm run check:content
```

预期：测试全部 PASS；生成页检查无差异；正式内容校验退出码为 0。V2 规范路径和兼容页存在性规则在任务 14 接入，不能在此阶段提前要求尚未创建的路径。

- [ ] **步骤 8：提交结构化证据基础设施**

```bash
git add package.json scripts/content-utils.mjs scripts/validate-content.mjs scripts/generate-evidence-pages.mjs tests docs/bluebook/executive-summary.md docs/bluebook/data docs/bluebook/appendices/evidence-ledger.md docs/bluebook/appendices/case-source-map.md docs/bluebook/appendices/sources.md
git commit -m "feat(蓝皮书): 接入结构化证据与案例数据"
```

## 内容编辑基准

每个规范章节使用相同的六段结构，章节内只定义一个核心判断：

1. `## 30 秒结论`：一句核心判断，最多三个关键结论。
2. `## 为什么重要`：明确会影响哪一项业务决定。
3. `## 方法或模型`：只保留本章负责的唯一规范定义。
4. `## 案例与证据`：区分产品事实、客户结果、公开演示、研究结论、社区判断和实践建议，并关联台账。
5. `## 企业行动`：写清负责人、交付物、验收证据和停止信号。
6. `## 边界与下一步`：说明不可外推项。任务 6–13 暂不写下一规范章节链接，避免增量构建遇到尚不存在的前向路径；任务 14 再原子补齐链接。

最终“下一步”链固定为：执行摘要→第 1 章→第 2 章→第 3 章→第 4 章→第 5 章→第 6 章→第 7 章→第 8 章→第 9 章→第 10 章→第 11 章→第 12 章→第 13 章→结语；结语链接蓝皮书附录目录，不再定义新的正文阶段。该链只在任务 14 一次性写入并机器校验。

Frontmatter 使用以下稳定形状；以方法和判断为主的页面统一用 `community-practice`，只有全部关键主张都是已核验产品事实的页面才用 `verified`：

```yaml
---
title: 交付新标准：从回答问题到完成工作
description: 用可编辑、可验证、可流转判断 AI 是否完成业务交付
status: community-practice
verifiedAt: 2026-08-01
sources:
  - https://qwenwork.cn/docs/product-introduction
---
```

每个内容步骤完成后执行：

```bash
npm run generate:evidence
npm test
npm run check:content
npm run build
git diff --check
```

预期：测试、内容校验和构建全部通过，生成页没有未解释的手工差异。

## 任务 6：迁移第一篇并确立任务卡唯一来源

**文件：**

- 创建：`docs/bluebook/part-1/01-delivery-standard.md`
- 创建：`docs/bluebook/part-1/02-task-delivery-protocol.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：为第 1 章建立统一章节骨架**

创建第 1 章 Frontmatter 和六段标准标题。将旧 `part-1/01-from-answer-to-delivery.md` 的五层闭环迁入“方法或模型”，固定为 L1 回答、L2 产物、L3 操作、L4 流程、L5 系统；把“可编辑、可验证、可流转”作为完成业务交付的三个判据。

- [ ] **步骤 2：重写第 1 章的判断与比较边界**

在“30 秒结论”明确“生成内容不等于完成工作”。将旧“千问办公与普通 AI Chat”改成“纯问答用法与任务型工作流的差异”，只比较使用方式、交付物、复用和治理，不把比较写成整个产品类别的优劣结论。

- [ ] **步骤 3：补齐第 1 章企业行动和停止信号**

企业行动固定为：业务负责人选择一个可验收交付，使用者记录输入与产物，内容复核者检查三个判据。停止信号固定包括：产物无法编辑、关键数据无法追溯、结果无法进入下一环节、为补救错误而增加未记录人工步骤。

- [ ] **步骤 4：为第 2 章建立任务卡唯一规范定义**

合并旧 `part-2/04-first-task.md` 和 `part-2/13-task-delivery-protocol.md`。五段式任务卡只在本章完整定义，字段固定为：目标、输入、约束、交付、验收；保留一个经营周报快速示例，并把可复制空白模板移到提示词附录。

- [ ] **步骤 5：补齐第 2 章执行与验收协议**

保留“先定义完成”的主张；将任务拆分为澄清目标、检查输入、锁定约束、定义产物、写验收、运行与复盘。明确业务负责人负责结果和停止决定，使用者负责输入与运行记录，内容复核者负责事实与专业质量。

- [ ] **步骤 6：登记第一篇关键主张**

在台账新增至少以下稳定 ID，并把标准 span 放在对应句子紧邻位置：

```text
claim-delivery-not-generation-01
claim-delivery-criteria-01
claim-question-workflow-boundary-01
claim-task-card-fields-01
claim-define-done-first-01
```

产品事实使用 R3/R10 和可核验状态；本书方法使用 `community-judgment` 或 `practice-guidance`、`community-framework`、`editor-reviewed`，并写明反例和适用边界。

- [ ] **步骤 7：运行本任务验收命令**

运行“内容编辑基准”中的五条命令。预期全部退出码为 0，新页面可构建但尚未进入主导航。

- [ ] **步骤 8：提交第一篇**

```bash
git add docs/bluebook/part-1/01-delivery-standard.md docs/bluebook/part-1/02-task-delivery-protocol.md docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md
git commit -m "docs(蓝皮书): 迁移 V2 第一篇"
```

## 任务 7：迁移第二篇并统一资产与自动化边界

**文件：**

- 创建：`docs/bluebook/part-2/03-work-environment-architecture.md`
- 创建：`docs/bluebook/part-2/04-skills-connectors-expert-kits.md`
- 创建：`docs/bluebook/part-2/05-automation-boundaries.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：合并三端与六层为第 3 章**

将旧 `part-1/02-three-surfaces.md` 与 `part-1/03-capability-architecture.md` 合并。三端写作 Web、桌面、钉钉的任务上下文选择，不把某个入口写成默认最优；六层固定为智能基座、上下文、工具与连接、产物工作台、复用与自动化、治理。

- [ ] **步骤 2：为六层模型补齐诊断字段**

六层表每行固定包含“诊断问题、失败信号、责任人、验证证据”。删除“任务适配度 × 稳定性 × 可验证性 ÷ 成本”等无法量化的乘除表达，改成逐项比较清单；明确模型只是六层中的一层。

- [ ] **步骤 3：重写第 4 章的三个资产边界**

首次写 `Skill（技能）`，其后统一用 `Skill`。定义：Skill 封装可重复方法和工具步骤；连接器提供经授权的数据/动作边界；专家套件组合多个已发布工作流和岗位标准。每类都写适用条件、Owner、版本、输入输出、测试样本、权限和发布门。

- [ ] **步骤 4：把 Skill 发布与阶段门连接**

明确个人模板只有完成第 10 章 0–30 天阶段门后才成为候选；团队工作流完成 31–60 天阶段门后才可发布为团队 Skill；岗位专家套件只能组合通过 61–90 天阶段门的工作流。章节不复制样本数和阈值，只链接第 10 章。

- [ ] **步骤 5：统一第 5 章自动化术语**

将旧 `part-2/06-automation.md` 迁移为自动化边界。固定定义：自动校验检查机器可判定条件；人工复核判断内容正确；交付验收决定是否通过；动作确认授权发送、写入或发布。分别解释停用、人工接管、回退、撤销和恢复，不混作同一动作。

- [ ] **步骤 6：补齐第 5 章接管与恢复链**

按触发条件、停止执行、保护原件、通知责任人、人工完成、定位失败、修正版本、重新验证、批准恢复的顺序写最小运行链。G2/G3 的具体确认规则只链接第 11 章，不在本章重定义。

- [ ] **步骤 7：登记第二篇关键主张**

使用以下稳定 ID，并按 R3–R8、R10 的实际支撑范围登记产品事实；未能再次定位的动态产品事实降为 `limited` 或移出正文：

```text
claim-three-surfaces-choice-01
claim-six-layer-diagnosis-01
claim-skill-asset-boundary-01
claim-connector-authorization-01
claim-expert-kit-release-01
claim-automation-human-handoff-01
```

- [ ] **步骤 8：验收并提交第二篇**

运行“内容编辑基准”中的五条命令，预期全部通过，然后提交：

```bash
git add docs/bluebook/part-2/03-work-environment-architecture.md docs/bluebook/part-2/04-skills-connectors-expert-kits.md docs/bluebook/part-2/05-automation-boundaries.md docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md
git commit -m "docs(蓝皮书): 迁移 V2 可复用工作流章节"
```

## 任务 8：迁移办公、岗位和研究方法

**文件：**

- 创建：`docs/bluebook/part-3/06-office-delivery.md`
- 创建：`docs/bluebook/part-3/07-role-roadmaps.md`
- 创建：`docs/bluebook/part-3/08-research-evidence-chain.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：迁移第 6 章办公交付**

将旧 `part-3/07-office-delivery.md` 的会议、经营数据、研究、合同和网页任务改成文档、数据、汇报、网页四条工作流。每条只保留输入、处理、产物、验收、风险和人工确认，不复制完整提示词；模板统一链接提示词附录。

- [ ] **步骤 2：统一第 6 章验收表达**

文档检查结构、事实、版本和可编辑性；数据检查期间、单位、口径、勾稽和可复算；汇报检查结论与证据、受众和讲述顺序；网页检查内容、链接、移动端、可访问性和发布授权。合同只作为高后果文档示例，明确不能代替法务判断。

- [ ] **步骤 3：重写第 7 章五类岗位场景卡**

HR、销售与商务、产品与项目、财务与法务、内容与市场各保留一张相同字段的场景卡：业务问题、角色、输入、当前步骤、交付物、验收、禁做动作、指标、风险、基线。删除本章旧评分表和四级成熟度阈值，统一链接第 10 章。

- [ ] **步骤 4：迁移第 8 章证据方法**

保留问题树、证据卡、来源分层、人机七步流程、冲突登记和发布抽检。证据卡成为唯一规范定义，字段固定为主张、来源原文、来源类型、日期、统计口径、适用范围、限制、冲突和状态；提示词附录只保留调用模板。

- [ ] **步骤 5：对齐第 8 章与结构化台账**

说明证据卡是研究任务中的工作记录，`evidence-ledger.json` 是公开蓝皮书关键主张的发布记录；两者职责不同但类型、状态和来源边界一致。公开演示只能证明交付形态，不能推导客户效果。

- [ ] **步骤 6：登记第三篇方法主张**

使用以下稳定 ID：

```text
claim-office-delivery-acceptance-01
claim-role-scenario-card-01
claim-research-question-tree-01
claim-evidence-card-fields-01
claim-demo-boundary-01
```

- [ ] **步骤 7：验收并提交专业方法章节**

运行“内容编辑基准”中的五条命令，预期全部通过，然后提交：

```bash
git add docs/bluebook/part-3/06-office-delivery.md docs/bluebook/part-3/07-role-roadmaps.md docs/bluebook/part-3/08-research-evidence-chain.md docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md
git commit -m "docs(蓝皮书): 迁移 V2 专业场景方法"
```

## 任务 9：建立唯一试点阶段门和安全责任模型

**文件：**

- 创建：`docs/bluebook/part-4/10-pilot-roadmap.md`
- 创建：`docs/bluebook/part-4/11-security-governance.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：合并第 10 章场景选择来源**

从旧岗位路线、组织落地、案例图谱和两份价值度量章节迁移场景评分、基线和试点门。场景评分表固定比较频率、耗时、输入稳定性、验收清晰度、失败可逆性、数据风险和业务影响；评分只用于排序，不能绕过硬门。

- [ ] **步骤 2：写入唯一阈值登记表**

字段固定为：指标公式、适用阶段、默认值、依据、最小样本、观察周期、可调整人、例外理由、停止条件、批准人。法律、安全、未授权动作和关键错误为不可放宽硬门；效率、采用率和满意度为可调整实验阈值。

- [ ] **步骤 3：写入三阶段默认门**

逐字对齐设计规格：个人模板候选使用 5 个代表性正常样本和 2 个边界样本；团队工作流发布至少 10 个代表性样本并覆盖六类边界；规模化推广默认至少 20 个有效任务和一个完整业务周期，低频复杂任务改用 3 个完整案例、2 名独立专业复核者和一致通过结论。三个阶段关键错误和未授权数据/动作均为 0。

- [ ] **步骤 4：固定 30/60/90 天映射与停止规则**

0–30 天对应个人模板候选，31–60 天对应团队工作流发布，61–90 天对应规模化推广；日历时间不能替代阶段门。出现未授权外发、删除、付款、主数据修改、重大隐私问题或关键业务错误时立即停止、人工接管和复盘。

- [ ] **步骤 5：重写第 11 章 G0–G3**

G0 只读；G1 只新建隔离草稿或新文件且保留原件和恢复路径；G2 更新内部业务对象，默认逐批事前确认，只有正式发布且持续授权的有界工作流可以抽检；G3 对外发送、公开发布、付款、审批、删除和主数据修改，每次强制事前确认。

- [ ] **步骤 6：分离数据敏感度和专业后果**

另列公开、内部、机密/个人或客户信息、受监管或组织秘密四类数据；另列信息辅助、日常运营、高后果判断三类专业后果。机密数据或高后果判断控制不低于 G2；受监管数据、组织秘密或 G3 动作按 G3 控制。

- [ ] **步骤 7：写入角色和持续授权约束**

角色固定为业务负责人、流程维护者、数据/安全责任人、使用者、内容复核者、动作批准人。小团队可兼任，但 G3 执行者与批准人不得同一人。G2 持续授权记录对象、字段、单批上限、频率、有效期、日志、抽检、撤销人和撤销条件，默认不超过 90 天；G3 不允许持续授权免除单次确认。

- [ ] **步骤 8：登记治理主张并提交**

登记 `claim-pilot-stage-gates-01`、`claim-critical-error-hard-gate-01`、`claim-g0-g3-controls-01`、`claim-g2-continuous-authorization-01`、`claim-human-responsibility-01`。运行内容编辑验收命令，全部通过后提交：

```bash
git add docs/bluebook/part-4/10-pilot-roadmap.md docs/bluebook/part-4/11-security-governance.md docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md
git commit -m "docs(蓝皮书): 统一试点阶段门与安全治理"
```

## 任务 10：迁移团队运营、价值度量与结语

**文件：**

- 创建：`docs/bluebook/part-4/12-workflow-operations.md`
- 创建：`docs/bluebook/part-4/13-value-measurement.md`
- 创建：`docs/bluebook/conclusion-product-ecosystem.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：迁移第 12 章工作流运营**

将旧 `part-4/15-team-workflow-operations.md` 迁移为工作流卡唯一规范来源。工作流卡固定包含 Owner、流程维护者、版本、适用范围、输入输出、权限、测试样本、质量门、变更记录、失败案例、回退方式、运行日志和复盘节奏。

- [ ] **步骤 2：统一发布、变更和失败复盘**

团队发布引用第 10 章阶段门；字段、权限、模型、连接器或接收对象变化时重新验证。失败案例记录触发条件、影响、检测、接管、根因、修复和回归样本，不用“最佳实践”替代失败边界。

- [ ] **步骤 3：合并第 13 章价值度量**

合并旧 `part-4/11-value-measurement.md` 与 `part-4/16-value-measurement-playbook.md`。先写基线、有效任务样本、人工准备/复核/返工、质量和风险，再写现金化价值；DAU、对话数、Token 和产物数只能说明使用，不能单独证明业务价值。

- [ ] **步骤 4：写入唯一 ROI 公式**

第 13 章逐字采用以下规范，其他页面只链接或提供录入字段：

```text
已实现现金收益 = 已实际减少的支出
               + 有预算依据且可证明的支出避免
               + 可归因的增量毛利

增量总成本 = 订阅与积分 + 实施 + 培训 + 输入准备 + 人工复核
           + 返工 + 维护 + 治理 + 已实现的失败损失

现金净收益 = 已实现现金收益 − 增量总成本
现金 ROI = 现金净收益 ÷ 增量总成本

可释放产能 =（基线单任务总时长中位数 − 试点单任务总时长中位数）
             × 同口径有效任务量
```

- [ ] **步骤 5：补齐价值决策边界**

现金 ROI 与可释放产能分开报告；质量与风险单独报告，除非已经形成可核验实际损失或收益。记录周期、样本、归因假设和低/中/高敏感性区间；禁止无条件年化和重复计算。扩大、优化、保持试点、停止四种决定都引用第 10 章登记阈值。

- [ ] **步骤 6：把产品与生态建议移入结语**

将旧 `part-4/12-product-ecosystem.md` 改写为四栏：已公开能力、已实测组合、基于公开接口的可行推断、待验证路线假设。每条说明用户问题、最小方案、成功指标、依赖、权限、端侧、账号类型、验证状态、失败边界和优先级；不让产品建议打断企业采用主线。

- [ ] **步骤 7：登记运营、价值和路线主张**

使用以下稳定 ID：

```text
claim-workflow-card-fields-01
claim-workflow-change-gate-01
claim-usage-not-value-01
claim-cash-roi-formula-01
claim-capacity-separate-01
claim-ecosystem-status-columns-01
```

- [ ] **步骤 8：验收并提交运营价值章节与结语**

运行“内容编辑基准”中的五条命令，预期全部通过，然后提交：

```bash
git add docs/bluebook/part-4/12-workflow-operations.md docs/bluebook/part-4/13-value-measurement.md docs/bluebook/conclusion-product-ecosystem.md docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md
git commit -m "docs(蓝皮书): 迁移运营价值章节与结语"
```

## 任务 11：核验候选案例并发布第 9 章

**文件：**

- 创建：`docs/bluebook/part-3/09-public-case-atlas.md`
- 修改：`docs/bluebook/data/case-source-map.json`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 修改：`docs/cases/index.md`
- 修改：`docs/cases/submissions/qwenwork-public-case-atlas.md`
- 修改：`docs/cases/submissions/pisen-competitive-research-product-materials.md`
- 修改：`docs/cases/submissions/youkela-product-rd-payroll.md`
- 修改：`scripts/validate-content.mjs`
- 可能创建：`docs/public/evidence-snapshots/*`（仅限确实用于发布证据的公开快照）
- 生成：`docs/bluebook/appendices/case-source-map.md`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：逐条核对 32 个候选条目的原始记录**

对照 R11 原始案例库，逐条确认原始名称、原始标签、所属分类和访问日期。只有原始页面能定位该条目时才填写外部记录 ID；示例 `qwenwork.host` 产物只能写入 `artifact_links`，不能代替来源记录。无法稳定定位的条目保持 `pending` 和 `included_in_public_count: false`。若使用公开快照，文件放入 `docs/public/evidence-snapshots/`，以真实文件计算并登记 SHA-256；缺文件、路径越界或哈希不一致都阻断发布。

- [ ] **步骤 2：应用公开案例发布门**

对于能定位但样本、授权或外推范围有限的条目，写 `verification_status: "limited"`、同屏局限、非本书 `case_id` 的外部记录 ID，以及源页面深链或许可范围内的快照路径，才可设置 `included_in_public_count: true`。运行：

```bash
node --test --test-name-pattern="validateCaseSourceMap" tests/content-utils.test.mjs
npm run generate:evidence
```

预期：32 条 ID 唯一；公开数量等于 `included_in_public_count` 为真的条目数；未核验条目只出现在生成附录的“待核验线索”。

- [ ] **步骤 3：重写第 9 章统计摘要**

先运行：

```bash
node --input-type=module -e "import { readFile } from 'node:fs/promises'; const data = JSON.parse(await readFile('docs/bluebook/data/case-source-map.json', 'utf8')); console.log(data.cases.filter((item) => item.included_in_public_count).length)"
```

标题不写固定数量。将命令打印的整数同时写入计数 span 的属性和值；例如输出 7 时写 `<span data-public-case-count="7">7</span>`。统计摘要后放一份完整公开成员清单，每个 `included_in_public_count: true` 的条目恰好出现一次并紧邻标准标记，例如 `<span data-public-case-id="case-ecommerce-operations-dashboard"></span>`；任何 `pending`、`stale` 或未登记 ID 都不得出现。每个至少有一条公开记录的场景簇选择一个代表条目，扩写来源、真实或公开输入、任务链、产物、证据状态、适用边界和不可外推项完整案例卡；代表卡使用普通标题锚点并链接回成员清单，不重复 `data-public-case-id` 标记。

- [ ] **步骤 4：把未核验条目从公开图谱移出**

旧 32 条候选名称仍完整保留在 `case-source-map.json` 和生成附录，但不在第 9 章、案例库首页、投稿页标题或传播文案中展示为公开案例。公开演示只说明产物形态，不写实施成本、客户归属或效果结论。

- [ ] **步骤 5：处理两份具名客户案例的精确数字**

当前仓库没有客户授权范围、指标定义、分母、样本量、样本期、比较期、比较口径和人工准备/复核/返工记录的完整发布包，也没有可公开复核的原始材料定位。因此 V2.0 RC 从两份投稿的 Frontmatter 标题、H1、正文、摘要表和第 9 章移出客户名称与全部精确效果数字；文件路径保持不变以兼容旧 URL，页面设置 `robots: noindex,follow`、`search: false`，并改为不带客户归属的通用工作流线索。投稿页只保留非量化工作流、风险与复现字段，并明确“不计入当前公开案例总数”。

不得把原客户名称、归属、精确结果或可反推身份的摘记写入公开的 `evidence-ledger.json` 或生成附录，也不创建带客户名的 `claim_id`。版本说明只用不含名称和数字的概括说明“未达到最低证据包的具名客户结果已移出”；需要内部留存的审计材料由仓库外的授权系统管理。

- [ ] **步骤 6：更新案例入口和计数标记**

`docs/cases/index.md` 和公开图谱投稿页都使用与第 9 章相同的计数 span，两处填写步骤 3 命令输出的同一个整数；链接统一指向 `/bluebook/part-3/09-public-case-atlas` 和生成的案例来源附录。不得出现“32 个公开案例”或把两份具名投稿自动加入公开计数。

同步把以下三个路径加入 `validate-content.mjs` 正式调用的 `publicCaseCountPaths`：

```js
[
  "docs/bluebook/part-3/09-public-case-atlas.md",
  "docs/cases/index.md",
  "docs/cases/submissions/qwenwork-public-case-atlas.md",
]
```

同时设置：

```js
publicCaseMembershipPath: "docs/bluebook/part-3/09-public-case-atlas.md"
```

计数路径只验证三处可见数字一致；成员路径额外要求第 9 章的标准标记集合与 JSON 中 `included_in_public_count: true` 的 ID 集合完全相等。

- [ ] **步骤 7：登记第 9 章主张并验收**

登记 `claim-public-case-count-01`、`claim-public-demo-boundary-01` 和每个公开代表案例的独立 `claim_id`；不登记两条证据包不足的客户归属或结果。计数主张的正文数字、台账文本和 JSON 统计必须一致。运行：

```bash
npm run generate:evidence
npm test
npm run check:content
npm run build
rg -n "32 个公开案例|32 个场景案例|从 32 个场景" docs/cases docs/bluebook/part-3/09-public-case-atlas.md
rg -n "品胜|优可乐|Pisen|Youkela" docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md docs/bluebook/part-3/09-public-case-atlas.md docs/cases/submissions/pisen-competitive-research-product-materials.md docs/cases/submissions/youkela-product-rd-payroll.md
```

预期：前四项通过；两条 `rg` 命令均无输出。文件名用于旧 URL 兼容不计入内容扫描结果。

- [ ] **步骤 8：提交案例图谱**

```bash
git add docs/bluebook/part-3/09-public-case-atlas.md docs/bluebook/data docs/bluebook/appendices/evidence-ledger.md docs/bluebook/appendices/case-source-map.md docs/cases scripts/validate-content.mjs
git commit -m "docs(案例): 发布 V2 案例图谱与证据状态"
```

## 任务 12：统一附录、来源和快速开始

**文件：**

- 修改：`docs/bluebook/appendices/prompt-templates.md`
- 修改：`docs/bluebook/appendices/scenario-index.md`
- 修改：`docs/bluebook/appendices/launch-checklist.md`
- 修改：`docs/bluebook/appendices/sources.md`
- 修改：`docs/guides/quick-start.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：让提示词附录只提供调用模板**

保留文件、数据、汇报、会议、研究和任务审核模板。任务卡字段链接第 2 章，证据卡字段链接第 8 章，风险控制链接第 11 章；模板代码块中允许 `【字段】` 和空白下划线，正文不出现作者遗留标记。

- [ ] **步骤 2：让场景索引只提供填写副本**

场景卡字段对齐第 7 章，场景评分表字段和权重反向链接第 10 章。删除本附录中的独立门槛、样本数量、成熟度等级和自动升级规则，避免形成第二规范源。

- [ ] **步骤 3：把上线清单固定为硬门唯一位置**

按场景与责任、数据与权限、质量与证据、动作控制、接管与恢复、上线演练、运行观察七组复选项整理。法律、安全、未授权动作和关键错误门逐字对齐第 10/11 章；工作流卡只引用第 12 章。

- [ ] **步骤 4：修订 R1–R15 来源目录**

保持 R1–R13 编号和原始顺序。来源说明段之后、`## R1` 之前增加可实际点击的兼容入口：

```markdown
兼容编号入口：[R14](#r14)、[R15](#r15)。
```

删除 R14/R15 的重复 URL，末尾改为：

```markdown
<span id="r14"></span>**R14（兼容编号）**：见 [R8](#r8)。

<span id="r15"></span>**R15（兼容编号）**：见 [R4](#r4)。
```

运行来源目录校验，确保每个规范 section 唯一且至少包含一个有效 URL、规范化 URL 不重复、R14/R15 不能作为 `source_ref`，并且 `/bluebook/appendices/sources#r14` 和 `#r15` 均有真实入口链接且由构建产物保留。

- [ ] **步骤 5：改写快速开始的入口**

快速开始只教用户用第 2 章任务卡完成一个可验收任务，链接第 10 章的个人模板候选门。删除“连续稳定两次即可复用”一类与 5+2 样本门冲突的表达；发送、写入、删除或发布前链接第 11 章。

- [ ] **步骤 6：运行唯一来源冲突扫描**

运行：

```bash
rg -n "现金 ROI|可释放产能|5 个代表性正常样本|10 个代表性样本|20 个有效任务|G0|G1|G2|G3" docs/bluebook docs/guides --glob "*.md"
```

预期：公式定义只在第 13 章；样本门只在第 10 章，其他页面为链接或填写副本；G0–G3 定义只在第 11 章，其他页面只引用控制等级。

- [ ] **步骤 7：验收并提交附录与快速开始**

运行内容编辑验收命令，全部通过后提交：

```bash
git add docs/bluebook/appendices docs/bluebook/data/evidence-ledger.json docs/guides/quick-start.md
git commit -m "docs(蓝皮书): 统一附录模板与快速开始"
```

## 任务 13：完成执行摘要和 V2.0 版本说明

**文件：**

- 修改：`docs/bluebook/executive-summary.md`
- 创建：`docs/bluebook/releases/v2.0.md`
- 修改：`docs/bluebook/data/evidence-ledger.json`
- 生成：`docs/bluebook/appendices/evidence-ledger.md`

- [ ] **步骤 1：扩写唯一执行摘要**

标题固定为《企业 AI 从功能竞赛走向工作流竞赛》。按核心命题、三个支撑判断、从一次交付到组织能力的四步地图、30/60/90 天阶段门、角色与治理、价值判断、证据边界、阅读入口组织；方法细节一律链接章节，不复制完整表格或公式。

- [ ] **步骤 2：为执行摘要每个实质块关联主张**

除纯导航链接外，每个段落、列表项和表格数据行都在同一块放置标准 span。社区判断明确写“本书主张”或“本书建议”；产品事实、客户结果和案例计数不使用更强措辞。

- [ ] **步骤 3：应用执行摘要发布资格**

摘要引用的每条台账记录必须同时为 `is_key: true`、`summary_eligible: true`、`blocks_release: true`，状态只能是 `verified`、同屏披露局限的 `limited` 或限定类型的 `editor-reviewed`。任何 `pending` 或 `stale` 主张从摘要移出。

- [ ] **步骤 4：写 V2.0 版本说明**

`releases/v2.0.md` 写明：观点型重构；17 章收敛为 13 章加序章和结语；结构化证据与案例发布门；旧 URL 兼容；V1.2/V1.3 PDF 保留；V2.0 PDF 构建入口；本次只交付本地 RC；发布后读者测试和 30 天传播复盘不属于本地 RC 硬门。

- [ ] **步骤 5：运行摘要专项检查**

运行：

```bash
npm run generate:evidence
npm test
npm run check:content
npm run build
```

预期：执行摘要块覆盖、摘要资格和阻断发布规则全部通过；站点构建退出码为 0。

- [ ] **步骤 6：提交执行摘要和版本说明**

```bash
git add docs/bluebook/executive-summary.md docs/bluebook/releases/v2.0.md docs/bluebook/data/evidence-ledger.json docs/bluebook/appendices/evidence-ledger.md
git commit -m "docs(蓝皮书): 新增 V2 执行摘要与版本说明"
```

## 任务 14：原子切换导航并建立旧 URL 兼容校验

**文件：**

- 创建：`tests/fixtures/evidence/compatibility-page-valid.md`
- 修改：`tests/content-utils.test.mjs`
- 修改：`scripts/content-utils.mjs`
- 修改：`scripts/validate-content.mjs`
- 修改：`docs/.vitepress/config.mts`
- 修改：`docs/bluebook/index.md`
- 修改：`docs/index.md`
- 修改：`docs/reading-guide.md`
- 修改：`README.md`
- 修改：`docs/bluebook/executive-summary.md`、13 个规范章节和 `docs/bluebook/conclusion-product-ecosystem.md`
- 修改：前述 17 个旧章节文件

- [ ] **步骤 1：创建合法兼容页夹具**

创建：

```markdown
---
title: 旧章节已迁移
description: 本页保留旧链接并指向 V2.0 规范章节
status: community-practice
verifiedAt: 2026-08-01
sources: []
canonical: /bluebook/part-1/01-delivery-standard
robots: noindex,follow
search: false
prev: false
next: false
---

# 旧章节已迁移

本章已合并到[交付新标准：从回答问题到完成工作](/bluebook/part-1/01-delivery-standard)。
```

- [ ] **步骤 2：编写失败的结构、兼容和遗留标记测试**

在 `tests/content-utils.test.mjs` 添加：

```js
import {
  BLUEBOOK_V2_NEXT_CHAIN,
  BLUEBOOK_V2_PATHS,
  BLUEBOOK_V2_SIDEBAR_GROUPS,
  LEGACY_PAGE_MAP,
  findAuthorMarkers,
  flattenBluebookSidebar,
  validateBluebookNextChain,
  validateBluebookStructure,
  validateCompatibilityPage,
} from "../scripts/content-utils.mjs";

test("validateCompatibilityPage accepts canonical noindex stubs", async () => {
  const source = await readFile(new URL("compatibility-page-valid.md", evidenceFixtures), "utf8");
  assert.deepEqual(validateCompatibilityPage(source, "/bluebook/part-1/01-delivery-standard"), []);
  assert.ok(validateCompatibilityPage(source.replace("search: false", "search: true"),
    "/bluebook/part-1/01-delivery-standard").some((error) => error.includes("search: false")));
});

test("validateBluebookStructure requires the V2 canonical set and legacy map", () => {
  const documents = new Map([
    ["docs/bluebook/executive-summary.md", "---\ntitle: 摘要\n---\n"],
  ]);
  const errors = validateBluebookStructure(documents);
  assert.ok(errors.some((error) => error.includes("01-delivery-standard.md")));
  assert.ok(errors.some((error) => error.includes("兼容页")));
});

test("V2 sidebar has the exact 21-item order and excludes compatibility pages", () => {
  const links = flattenBluebookSidebar(BLUEBOOK_V2_SIDEBAR_GROUPS).map((item) => item.link);
  const expected = BLUEBOOK_V2_PATHS.map((path) => `/${path
    .replace(/^docs\//, "")
    .replace(/\.md$/, "")}`);
  assert.equal(links.length, 21);
  assert.deepEqual(links, expected);
  const legacyLinks = new Set([...LEGACY_PAGE_MAP.keys()].map((path) => `/${path
    .replace(/^docs\//, "")
    .replace(/\.md$/, "")}`));
  assert.equal(links.some((link) => legacyLinks.has(link)), false);
});

test("production VitePress config uses the exact V2 sidebar source", async () => {
  const docsRoot = fileURLToPath(new URL("../docs/", import.meta.url));
  const contentUtilsPath = fileURLToPath(
    new URL("../scripts/content-utils.mjs", import.meta.url),
  );
  const config = await resolveConfig(docsRoot, "build", "production");
  assert.deepEqual(
    config.site.themeConfig.sidebar["/bluebook/"],
    BLUEBOOK_V2_SIDEBAR_GROUPS,
  );
  assert.ok(config.configDeps.includes(contentUtilsPath));
});

test("V2 next links form the exact executive-summary to conclusion chain", () => {
  assert.deepEqual(BLUEBOOK_V2_NEXT_CHAIN, [
    ["docs/bluebook/executive-summary.md", "/bluebook/part-1/01-delivery-standard"],
    ["docs/bluebook/part-1/01-delivery-standard.md", "/bluebook/part-1/02-task-delivery-protocol"],
    ["docs/bluebook/part-1/02-task-delivery-protocol.md", "/bluebook/part-2/03-work-environment-architecture"],
    ["docs/bluebook/part-2/03-work-environment-architecture.md", "/bluebook/part-2/04-skills-connectors-expert-kits"],
    ["docs/bluebook/part-2/04-skills-connectors-expert-kits.md", "/bluebook/part-2/05-automation-boundaries"],
    ["docs/bluebook/part-2/05-automation-boundaries.md", "/bluebook/part-3/06-office-delivery"],
    ["docs/bluebook/part-3/06-office-delivery.md", "/bluebook/part-3/07-role-roadmaps"],
    ["docs/bluebook/part-3/07-role-roadmaps.md", "/bluebook/part-3/08-research-evidence-chain"],
    ["docs/bluebook/part-3/08-research-evidence-chain.md", "/bluebook/part-3/09-public-case-atlas"],
    ["docs/bluebook/part-3/09-public-case-atlas.md", "/bluebook/part-4/10-pilot-roadmap"],
    ["docs/bluebook/part-4/10-pilot-roadmap.md", "/bluebook/part-4/11-security-governance"],
    ["docs/bluebook/part-4/11-security-governance.md", "/bluebook/part-4/12-workflow-operations"],
    ["docs/bluebook/part-4/12-workflow-operations.md", "/bluebook/part-4/13-value-measurement"],
    ["docs/bluebook/part-4/13-value-measurement.md", "/bluebook/conclusion-product-ecosystem"],
    ["docs/bluebook/conclusion-product-ecosystem.md", "/bluebook/#附录"],
  ]);
  const documents = new Map(BLUEBOOK_V2_NEXT_CHAIN.map(([path, next]) => [
    path,
    `---\ntitle: 测试\n---\n\n## 边界与下一步\n\n[继续阅读](${next})\n`,
  ]));
  documents.set("docs/bluebook/index.md", "---\ntitle: 首页\n---\n\n## 附录\n");
  assert.deepEqual(validateBluebookNextChain(documents), []);
  documents.set("docs/bluebook/part-1/01-delivery-standard.md",
    documents.get("docs/bluebook/part-1/01-delivery-standard.md")
      .replace("/bluebook/part-1/02-task-delivery-protocol", "/bluebook/part-4/13-value-measurement"));
  assert.ok(validateBluebookNextChain(documents)
    .some((error) => error.includes("01-delivery-standard.md")));
});

const validPage = (body) =>
  `---\ntitle: 测试\ndescription: 测试页面\nstatus: community-practice\nverifiedAt: 2026-08-01\nsources: []\n---\n\n${body}\n`;

function createValidBluebookDocuments() {
  const documents = new Map(
    BLUEBOOK_V2_PATHS.map((path) => [path, validPage("# 测试页面")]),
  );
  documents.set(
    "docs/bluebook/index.md",
    validPage("# 千问办公蓝皮书\n\n## 附录"),
  );
  for (const [path, next] of BLUEBOOK_V2_NEXT_CHAIN) {
    documents.set(
      path,
      validPage(`# 测试页面\n\n## 边界与下一步\n\n[继续阅读](${next})`),
    );
  }
  for (const [path, canonical] of LEGACY_PAGE_MAP) {
    documents.set(path, `---
title: 旧章节已迁移
description: 旧链接兼容页
status: community-practice
verifiedAt: 2026-08-01
sources: []
canonical: ${canonical}
robots: noindex,follow
search: false
prev: false
next: false
---

# 旧章节已迁移

[前往规范页面](${canonical})
`);
  }
  return documents;
}

test("validateBluebookStructure enforces next chain and appendix target", () => {
  let documents = createValidBluebookDocuments();
  assert.deepEqual(validateBluebookStructure(documents), []);

  const chapter = "docs/bluebook/part-1/01-delivery-standard.md";
  documents.set(chapter, documents.get(chapter).replace(
    "/bluebook/part-1/02-task-delivery-protocol",
    "/bluebook/part-4/13-value-measurement",
  ));
  assert.ok(validateBluebookStructure(documents)
    .some((error) => error.includes(chapter)));

  documents = createValidBluebookDocuments();
  documents.set("docs/bluebook/index.md", validPage("# 千问办公蓝皮书"));
  assert.ok(validateBluebookStructure(documents)
    .some((error) => error.includes("/bluebook/#附录")));
});

test("findAuthorMarkers ignores reader template fields but catches author residue", () => {
  const authorResidue = ["TO", "DO"].join("");
  assert.deepEqual(findAuthorMarkers("```text\n【目标】______\n```"), []);
  assert.equal(findAuthorMarkers(`正文 ${authorResidue}`)[0].marker, authorResidue);
});
```

- [ ] **步骤 3：运行结构测试确认红灯**

运行：

```bash
node --test --test-name-pattern="CompatibilityPage|BluebookStructure|AuthorMarkers|V2 sidebar|V2 next|production VitePress" tests/content-utils.test.mjs
```

预期：FAIL，报错说明新增函数尚未导出。

- [ ] **步骤 4：实现规范路径和兼容映射常量**

在 `scripts/content-utils.mjs` 导出 `BLUEBOOK_V2_PATHS` 和 `LEGACY_PAGE_MAP`。规范集合必须包含执行摘要、13 章、结语和 6 个公开附录；映射必须与设计规格 8.1 完全相同。实现：

```js
export const BLUEBOOK_V2_PATHS = [
  "docs/bluebook/executive-summary.md",
  "docs/bluebook/part-1/01-delivery-standard.md",
  "docs/bluebook/part-1/02-task-delivery-protocol.md",
  "docs/bluebook/part-2/03-work-environment-architecture.md",
  "docs/bluebook/part-2/04-skills-connectors-expert-kits.md",
  "docs/bluebook/part-2/05-automation-boundaries.md",
  "docs/bluebook/part-3/06-office-delivery.md",
  "docs/bluebook/part-3/07-role-roadmaps.md",
  "docs/bluebook/part-3/08-research-evidence-chain.md",
  "docs/bluebook/part-3/09-public-case-atlas.md",
  "docs/bluebook/part-4/10-pilot-roadmap.md",
  "docs/bluebook/part-4/11-security-governance.md",
  "docs/bluebook/part-4/12-workflow-operations.md",
  "docs/bluebook/part-4/13-value-measurement.md",
  "docs/bluebook/conclusion-product-ecosystem.md",
  "docs/bluebook/appendices/prompt-templates.md",
  "docs/bluebook/appendices/scenario-index.md",
  "docs/bluebook/appendices/launch-checklist.md",
  "docs/bluebook/appendices/evidence-ledger.md",
  "docs/bluebook/appendices/case-source-map.md",
  "docs/bluebook/appendices/sources.md",
];

export const LEGACY_PAGE_MAP = new Map([
  ["docs/bluebook/part-1/01-from-answer-to-delivery.md", "/bluebook/part-1/01-delivery-standard"],
  ["docs/bluebook/part-1/02-three-surfaces.md", "/bluebook/part-2/03-work-environment-architecture"],
  ["docs/bluebook/part-1/03-capability-architecture.md", "/bluebook/part-2/03-work-environment-architecture"],
  ["docs/bluebook/part-2/04-first-task.md", "/bluebook/part-1/02-task-delivery-protocol"],
  ["docs/bluebook/part-2/05-skills-connectors-experts.md", "/bluebook/part-2/04-skills-connectors-expert-kits"],
  ["docs/bluebook/part-2/06-automation.md", "/bluebook/part-2/05-automation-boundaries"],
  ["docs/bluebook/part-2/13-task-delivery-protocol.md", "/bluebook/part-1/02-task-delivery-protocol"],
  ["docs/bluebook/part-3/07-office-delivery.md", "/bluebook/part-3/06-office-delivery"],
  ["docs/bluebook/part-3/08-role-roadmaps.md", "/bluebook/part-3/07-role-roadmaps"],
  ["docs/bluebook/part-3/14-research-evidence-chain.md", "/bluebook/part-3/08-research-evidence-chain"],
  ["docs/bluebook/part-3/17-public-case-atlas.md", "/bluebook/part-3/09-public-case-atlas"],
  ["docs/bluebook/part-4/09-organization-rollout.md", "/bluebook/part-4/10-pilot-roadmap"],
  ["docs/bluebook/part-4/10-security-governance.md", "/bluebook/part-4/11-security-governance"],
  ["docs/bluebook/part-4/11-value-measurement.md", "/bluebook/part-4/13-value-measurement"],
  ["docs/bluebook/part-4/12-product-ecosystem.md", "/bluebook/conclusion-product-ecosystem"],
  ["docs/bluebook/part-4/15-team-workflow-operations.md", "/bluebook/part-4/12-workflow-operations"],
  ["docs/bluebook/part-4/16-value-measurement-playbook.md", "/bluebook/part-4/13-value-measurement"],
]);

export const BLUEBOOK_V2_NEXT_CHAIN = [
  ["docs/bluebook/executive-summary.md", "/bluebook/part-1/01-delivery-standard"],
  ["docs/bluebook/part-1/01-delivery-standard.md", "/bluebook/part-1/02-task-delivery-protocol"],
  ["docs/bluebook/part-1/02-task-delivery-protocol.md", "/bluebook/part-2/03-work-environment-architecture"],
  ["docs/bluebook/part-2/03-work-environment-architecture.md", "/bluebook/part-2/04-skills-connectors-expert-kits"],
  ["docs/bluebook/part-2/04-skills-connectors-expert-kits.md", "/bluebook/part-2/05-automation-boundaries"],
  ["docs/bluebook/part-2/05-automation-boundaries.md", "/bluebook/part-3/06-office-delivery"],
  ["docs/bluebook/part-3/06-office-delivery.md", "/bluebook/part-3/07-role-roadmaps"],
  ["docs/bluebook/part-3/07-role-roadmaps.md", "/bluebook/part-3/08-research-evidence-chain"],
  ["docs/bluebook/part-3/08-research-evidence-chain.md", "/bluebook/part-3/09-public-case-atlas"],
  ["docs/bluebook/part-3/09-public-case-atlas.md", "/bluebook/part-4/10-pilot-roadmap"],
  ["docs/bluebook/part-4/10-pilot-roadmap.md", "/bluebook/part-4/11-security-governance"],
  ["docs/bluebook/part-4/11-security-governance.md", "/bluebook/part-4/12-workflow-operations"],
  ["docs/bluebook/part-4/12-workflow-operations.md", "/bluebook/part-4/13-value-measurement"],
  ["docs/bluebook/part-4/13-value-measurement.md", "/bluebook/conclusion-product-ecosystem"],
  ["docs/bluebook/conclusion-product-ecosystem.md", "/bluebook/#附录"],
];

export const BLUEBOOK_V2_SIDEBAR_GROUPS = [
  { text: "序章", items: [
    { text: "企业 AI 从功能竞赛走向工作流竞赛", link: "/bluebook/executive-summary" },
  ] },
  { text: "第一篇：完成一次交付", items: [
    { text: "第 1 章 交付新标准", link: "/bluebook/part-1/01-delivery-standard" },
    { text: "第 2 章 任务拆解与验收", link: "/bluebook/part-1/02-task-delivery-protocol" },
  ] },
  { text: "第二篇：沉淀一条工作流", items: [
    { text: "第 3 章 工作环境与能力架构", link: "/bluebook/part-2/03-work-environment-architecture" },
    { text: "第 4 章 Skill、连接器与专家套件", link: "/bluebook/part-2/04-skills-connectors-expert-kits" },
    { text: "第 5 章 自动化及其边界", link: "/bluebook/part-2/05-automation-boundaries" },
  ] },
  { text: "第三篇：应用于专业场景", items: [
    { text: "第 6 章 办公交付", link: "/bluebook/part-3/06-office-delivery" },
    { text: "第 7 章 岗位路线", link: "/bluebook/part-3/07-role-roadmaps" },
    { text: "第 8 章 研究与证据链", link: "/bluebook/part-3/08-research-evidence-chain" },
    { text: "第 9 章 公开案例图谱", link: "/bluebook/part-3/09-public-case-atlas" },
  ] },
  { text: "第四篇：扩展为组织能力", items: [
    { text: "第 10 章 场景选择与试点", link: "/bluebook/part-4/10-pilot-roadmap" },
    { text: "第 11 章 安全、权限与责任", link: "/bluebook/part-4/11-security-governance" },
    { text: "第 12 章 团队工作流运营", link: "/bluebook/part-4/12-workflow-operations" },
    { text: "第 13 章 价值度量", link: "/bluebook/part-4/13-value-measurement" },
  ] },
  { text: "结语", items: [
    { text: "产品与生态路线建议", link: "/bluebook/conclusion-product-ecosystem" },
  ] },
  { text: "附录", items: [
    { text: "常用指令模板", link: "/bluebook/appendices/prompt-templates" },
    { text: "场景速查与评分表", link: "/bluebook/appendices/scenario-index" },
    { text: "组织上线验收清单", link: "/bluebook/appendices/launch-checklist" },
    { text: "主张证据台账", link: "/bluebook/appendices/evidence-ledger" },
    { text: "案例来源映射", link: "/bluebook/appendices/case-source-map" },
    { text: "来源与延伸阅读", link: "/bluebook/appendices/sources" },
  ] },
];

export function flattenBluebookSidebar(groups) {
  return groups.flatMap((group) => group.items ?? [group]);
}

function hasAppendixTarget(source) {
  if (!source) return false;
  try {
    const { body } = parseFrontmatter(source);
    return /^#{1,6}[ \t]+附录(?:[ \t]+#+)?[ \t]*$/m.test(body);
  } catch {
    return false;
  }
}

export function validateBluebookNextChain(documents) {
  const errors = [];
  for (const [path, expectedNext] of BLUEBOOK_V2_NEXT_CHAIN) {
    const source = documents.get(path);
    if (!source) {
      errors.push(`${path}: 无法校验下一步链接，文件不存在`);
      continue;
    }
    let body;
    try {
      ({ body } = parseFrontmatter(source));
    } catch (error) {
      errors.push(`${path}: ${error.message}`);
      continue;
    }
    const section = body.match(
      /^## 边界与下一步[ \t]*\n([\s\S]*?)(?=^##[ \t]+|(?![\s\S]))/m,
    );
    if (!section) {
      errors.push(`${path}: 缺少“边界与下一步”区块`);
      continue;
    }
    const links = [...section[1].matchAll(/\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
      .map((match) => match[1]);
    if (links.length !== 1 || links[0] !== expectedNext) {
      errors.push(`${path}: 下一步必须且只能链接 ${expectedNext}`);
    }
  }
  if (!hasAppendixTarget(documents.get("docs/bluebook/index.md"))) {
    errors.push("docs/bluebook/index.md: 缺少 /bluebook/#附录 目标");
  }
  return errors;
}

export function validateCompatibilityPage(source, expectedCanonical) {
  const errors = [];
  const { attributes, body } = parseFrontmatter(source);
  if (attributes.canonical !== expectedCanonical) errors.push(`canonical 必须为 ${expectedCanonical}`);
  if (attributes.robots !== "noindex,follow") errors.push("robots 必须为 noindex,follow");
  if (attributes.search !== false) errors.push("兼容页必须设置 search: false");
  if (attributes.prev !== false || attributes.next !== false) errors.push("兼容页必须关闭前后章导航");
  const internalLinks = [...body.matchAll(/\]\((\/bluebook\/[^)]+)\)/g)].map((match) => match[1]);
  if (internalLinks.length !== 1 || internalLinks[0] !== expectedCanonical) {
    errors.push("兼容页必须只包含一个规范章节链接");
  }
  if (body.split(/\s+/).filter(Boolean).length > 60) errors.push("兼容页正文过长，疑似复制旧正文");
  return errors;
}
```

`validateBluebookStructure(documents)` 检查全部规范文件存在、Frontmatter 完整、17 个旧文件存在并逐个调用兼容页校验。它还把 `BLUEBOOK_V2_SIDEBAR_GROUPS` 展平后与 `BLUEBOOK_V2_PATHS` 转成的 21 个规范 URL 深比较，拒绝任何兼容页或额外页面；必须显式调用 `validateBluebookNextChain(documents)` 并合并错误，不能只复用同一组常量做孤立测试。链校验逐对检查每个源页面的 `## 边界与下一步` 必须且只能链接期望目标，并确认 `docs/bluebook/index.md` 确实存在可供结语链接的“附录”标题。`findAuthorMarkers` 检查正文、表格和代码中的设计规格 10.1 作者遗留标记。`【字段】` 和下划线表单不属于禁用集合，因此可在明确的读者模板中保留。

实现作者遗留标记扫描时用拼接字符串定义禁用词，避免测试和计划本身被当成残留内容；允许的读者模板字段不在该禁用集合中：

```js
const AUTHOR_MARKERS = [
  ["TO", "DO"].join(""),
  ["TB", "D"].join(""),
  ["FIX", "ME"].join(""),
  ["XX", "X"].join(""),
  ["待", "定"].join(""),
  ["待", "补"].join(""),
  ["待", "完善"].join(""),
];

export function findAuthorMarkers(source) {
  const { body } = parseFrontmatter(source);
  const matches = [];
  for (const marker of AUTHOR_MARKERS) {
    const pattern = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    for (const match of body.matchAll(pattern)) {
      matches.push({ marker: match[0], index: match.index });
    }
  }
  return matches;
}
```

- [ ] **步骤 5：运行结构测试确认绿灯**

运行：

```bash
node --test --test-name-pattern="CompatibilityPage|BluebookStructure|AuthorMarkers|V2 sidebar|V2 next" tests/content-utils.test.mjs
```

预期：6 项匹配测试 PASS；完整仓库夹具上的 next 链破坏和缺失“附录”目标都由 `validateBluebookStructure` 报错。此时生产配置尚未接线，因此暂不运行 `production VitePress` 测试。

- [ ] **步骤 6：让 VitePress 输出 canonical 和 noindex**

在 `docs/.vitepress/config.mts` 增加：

```ts
const canonicalOrigin = 'https://qwenworkguide.pages.dev'
```

在现有 `defineConfig({ ... })` 对象的 `head` 后插入完整属性：

```ts
transformPageData(pageData) {
  const { canonical, robots } = pageData.frontmatter
  if (!canonical && !robots) return
  const head = pageData.frontmatter.head ?? []
  if (canonical) {
    head.push(['link', { rel: 'canonical', href: new URL(canonical, canonicalOrigin).href }])
  }
  if (robots) head.push(['meta', { name: 'robots', content: robots }])
  pageData.frontmatter.head = head
},
```

现有 `lang`、`title`、`base`、`head`、`ignoreDeadLinks` 和 `themeConfig` 原样保留，不创建第二个默认导出。

- [ ] **步骤 7：原子改写 17 个旧页面**

按设计映射逐一使用合法兼容页模板。合并到同一新章的两个旧页面都指向同一 canonical；旧产品生态页指向结语。正文不复制旧内容，不使用 JavaScript 跳转。

- [ ] **步骤 8：一次性切换主入口、侧边栏和下一章链**

`docs/.vitepress/config.mts` 使用精确生产接线：

```ts
import { BLUEBOOK_V2_SIDEBAR_GROUPS } from '../../scripts/content-utils.mjs'

// themeConfig.sidebar 内
'/bluebook/': BLUEBOOK_V2_SIDEBAR_GROUPS,
```

这必须是 `/bluebook/` 的唯一 sidebar 数据源，并由步骤 2 的 `resolveConfig` 集成测试验证真实配置值和 `configDeps`，不能复制第二份数组。顺序固定为：执行摘要；第一篇第 1–2 章；第二篇第 3–5 章；第三篇第 6–9 章；第四篇第 10–13 章；结语；提示词、场景速查、上线验收、证据台账、案例来源映射、来源共 6 个附录。首页、阅读指南和 README 全部使用规范路径，兼容页不进入 nav/sidebar。

配置接线完成后立即运行：

```bash
node --test --test-name-pattern="production VitePress" tests/content-utils.test.mjs
```

预期：测试 PASS，实际解析出的生产 sidebar 与 21 项唯一常量源深比较一致，且 `configDeps` 包含 `scripts/content-utils.mjs`。

同一提交中按 `BLUEBOOK_V2_NEXT_CHAIN` 原子修改执行摘要、13 章和结语的 `## 边界与下一步`。不得在更早的内容任务写前向链接；每个区块只保留一个期望的下一目标，结语固定链接 `/bluebook/#附录`。

- [ ] **步骤 9：接入正式结构校验并运行断链扫描**

让 `validateContentRoots` 在完成现有元数据和敏感信息检查后调用 `validateBluebookStructure` 与 `findAuthorMarkers`。运行：

```bash
set -e
npm test
npm run check:content
npm run build

QWG_LEGACY_PATTERN="$(
  node --input-type=module -e '
    import { LEGACY_PAGE_MAP } from "./scripts/content-utils.mjs";
    const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    process.stdout.write([...LEGACY_PAGE_MAP.keys()]
      .map((path) => path.split("/").pop().replace(/\.md$/, ""))
      .map(escape)
      .join("|"));
  '
)"
test -n "$QWG_LEGACY_PATTERN"

set +e
QWG_LEGACY_HITS="$(
  rg -n "$QWG_LEGACY_PATTERN" README.md docs \
    --glob "*.md" \
    --glob "!docs/superpowers/**"
)"
QWG_RG_STATUS=$?
set -e
if [ "$QWG_RG_STATUS" -gt 1 ]; then
  exit "$QWG_RG_STATUS"
fi
if [ "$QWG_RG_STATUS" -eq 0 ]; then
  printf '%s\n' "$QWG_LEGACY_HITS" >&2
  exit 1
fi
```

预期：测试、校验和构建通过；侧边栏恰好 21 项且无兼容页，15 对“下一步”链接完全匹配固定链。旧 slug 模式从 `LEGACY_PAGE_MAP` 的 17 个键派生，扫描零输出且整段退出码为 0；任何正文命中都会显式退出 1，`rg` 自身错误也保留非零退出码。兼容页模板正文不包含旧 slug，因此不设置命中例外。

- [ ] **步骤 10：提交导航切换与兼容页**

```bash
git add README.md docs/.vitepress/config.mts docs/index.md docs/reading-guide.md docs/bluebook scripts/content-utils.mjs scripts/validate-content.mjs tests/content-utils.test.mjs tests/fixtures/evidence/compatibility-page-valid.md
git commit -m "docs(蓝皮书): 切换 V2 导航并保留旧链接"
```

## 任务 15：用测试建立 21 项打印清单和 HTML 构建器

**文件：**

- 创建：`scripts/bluebook-v2-manifest.json`
- 创建：`scripts/build-bluebook-print.mjs`
- 创建：`tests/fixtures/pdf/manifest-valid.json`
- 创建：`tests/fixtures/pdf/repo/docs/bluebook/chapter-a.md`
- 创建：`tests/fixtures/pdf/repo/docs/bluebook/chapter-b.md`
- 修改：`tests/content-validators.test.mjs`

- [ ] **步骤 1：创建固定 21 项正式 manifest**

创建 `scripts/bluebook-v2-manifest.json`：

```json
{
  "title": "千问办公蓝皮书 V2.0",
  "version": "V2.0",
  "publishedAt": "2026-08-01",
  "siteBaseUrl": "https://qwenworkguide.pages.dev/",
  "items": [
    { "id": "executive-summary", "path": "docs/bluebook/executive-summary.md", "title": "序章：企业 AI 从功能竞赛走向工作流竞赛", "kind": "executive-summary", "breakBefore": true },
    { "id": "chapter-01", "path": "docs/bluebook/part-1/01-delivery-standard.md", "title": "第 1 章 交付新标准", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-02", "path": "docs/bluebook/part-1/02-task-delivery-protocol.md", "title": "第 2 章 任务拆解与验收", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-03", "path": "docs/bluebook/part-2/03-work-environment-architecture.md", "title": "第 3 章 工作环境与能力架构", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-04", "path": "docs/bluebook/part-2/04-skills-connectors-expert-kits.md", "title": "第 4 章 Skill、连接器与专家套件", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-05", "path": "docs/bluebook/part-2/05-automation-boundaries.md", "title": "第 5 章 自动化及其边界", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-06", "path": "docs/bluebook/part-3/06-office-delivery.md", "title": "第 6 章 办公交付", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-07", "path": "docs/bluebook/part-3/07-role-roadmaps.md", "title": "第 7 章 岗位路线", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-08", "path": "docs/bluebook/part-3/08-research-evidence-chain.md", "title": "第 8 章 研究与证据链", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-09", "path": "docs/bluebook/part-3/09-public-case-atlas.md", "title": "第 9 章 公开案例图谱", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-10", "path": "docs/bluebook/part-4/10-pilot-roadmap.md", "title": "第 10 章 场景选择与 30/60/90 天试点", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-11", "path": "docs/bluebook/part-4/11-security-governance.md", "title": "第 11 章 安全、权限与人机责任", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-12", "path": "docs/bluebook/part-4/12-workflow-operations.md", "title": "第 12 章 团队工作流运营", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-13", "path": "docs/bluebook/part-4/13-value-measurement.md", "title": "第 13 章 价值度量", "kind": "chapter", "breakBefore": true },
    { "id": "conclusion", "path": "docs/bluebook/conclusion-product-ecosystem.md", "title": "结语：产品与生态路线建议", "kind": "conclusion", "breakBefore": true },
    { "id": "appendix-prompts", "path": "docs/bluebook/appendices/prompt-templates.md", "title": "附录：常用指令模板", "kind": "appendix", "breakBefore": true },
    { "id": "appendix-scenarios", "path": "docs/bluebook/appendices/scenario-index.md", "title": "附录：场景速查与评分表", "kind": "appendix", "breakBefore": true },
    { "id": "appendix-launch", "path": "docs/bluebook/appendices/launch-checklist.md", "title": "附录：组织上线验收清单", "kind": "appendix", "breakBefore": true },
    { "id": "appendix-sources", "path": "docs/bluebook/appendices/sources.md", "title": "附录：来源与延伸阅读", "kind": "appendix", "breakBefore": true },
    { "id": "appendix-evidence", "path": "docs/bluebook/appendices/evidence-ledger.md", "title": "附录：主张证据台账", "kind": "appendix", "breakBefore": true },
    { "id": "appendix-cases", "path": "docs/bluebook/appendices/case-source-map.md", "title": "附录：案例来源映射", "kind": "appendix", "breakBefore": true }
  ]
}
```

创建 `tests/fixtures/pdf/manifest-valid.json`：

```json
{
  "title": "千问办公蓝皮书 V2.0",
  "version": "V2.0",
  "publishedAt": "2026-08-01",
  "siteBaseUrl": "https://qwenworkguide.pages.dev/",
  "items": [
    { "id": "chapter-a", "path": "docs/bluebook/chapter-a.md", "title": "章节 A", "kind": "chapter", "breakBefore": true },
    { "id": "chapter-b", "path": "docs/bluebook/chapter-b.md", "title": "章节 B", "kind": "chapter", "breakBefore": true }
  ]
}
```

正式 manifest 的 21 项规则由独立断言覆盖。

- [ ] **步骤 2：创建 Markdown 打印夹具**

创建 `chapter-a.md`：

````markdown
---
title: 章节 A
description: 打印夹具 A
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# Same Heading

<span id="claim-print-a-01" data-claim-id="claim-print-a-01"></span>中文正文<br>第二行。

[同章标题](#local-heading)；[同章原始锚点](#claim-print-a-01)；[跨章标题](chapter-b.md#same-heading)；[跨章原始锚点](chapter-b.md#r14)。

## Local Heading

::: warning 打印提示
提示块正文。
:::

| 超长字段 | 值 |
|---|---|
| https://example.com/a/very/long/path/that/must/wrap | 中文、生僻标点：「」《》 |

```text
long_code_line_that_must_wrap_without_changing_the_layout_width
```
````

创建 `chapter-b.md`：

```markdown
---
title: 章节 B
description: 打印夹具 B
status: community-practice
verifiedAt: 2026-08-01
sources: []
---

# Same Heading

<span id="r14"></span>跨章原始锚点。

第二个章节使用相同标题，生成的 ID 必须带章节命名空间。
```

- [ ] **步骤 3：编写失败的 manifest、链接和渲染测试**

在 `tests/content-validators.test.mjs` 添加：

```js
import { fileURLToPath } from "node:url";
import {
  buildPrintDocument,
  resolveDocumentLink,
  validateManifest,
} from "../scripts/build-bluebook-print.mjs";

test("validateManifest accepts only ordered bluebook documents", async () => {
  const manifest = JSON.parse(await readFile(new URL("fixtures/pdf/manifest-valid.json", import.meta.url), "utf8"));
  const availablePaths = new Set(manifest.items.map((item) => item.path));
  assert.deepEqual(validateManifest(manifest, { availablePaths, expectedCount: 2 }), []);
  manifest.items[1].path = "../outside.md";
  assert.ok(validateManifest(manifest, { availablePaths, expectedCount: 2 })
    .some((error) => error.includes("docs/bluebook")));
});

test("Official Manifest contains the exact ordered 21-item sequence", async () => {
  const manifest = JSON.parse(await readFile(new URL("../scripts/bluebook-v2-manifest.json", import.meta.url), "utf8"));
  const actual = manifest.items.map(({ id, path, kind }) => ({ id, path, kind }));
  assert.deepEqual(actual, [
    { id: "executive-summary", path: "docs/bluebook/executive-summary.md", kind: "executive-summary" },
    { id: "chapter-01", path: "docs/bluebook/part-1/01-delivery-standard.md", kind: "chapter" },
    { id: "chapter-02", path: "docs/bluebook/part-1/02-task-delivery-protocol.md", kind: "chapter" },
    { id: "chapter-03", path: "docs/bluebook/part-2/03-work-environment-architecture.md", kind: "chapter" },
    { id: "chapter-04", path: "docs/bluebook/part-2/04-skills-connectors-expert-kits.md", kind: "chapter" },
    { id: "chapter-05", path: "docs/bluebook/part-2/05-automation-boundaries.md", kind: "chapter" },
    { id: "chapter-06", path: "docs/bluebook/part-3/06-office-delivery.md", kind: "chapter" },
    { id: "chapter-07", path: "docs/bluebook/part-3/07-role-roadmaps.md", kind: "chapter" },
    { id: "chapter-08", path: "docs/bluebook/part-3/08-research-evidence-chain.md", kind: "chapter" },
    { id: "chapter-09", path: "docs/bluebook/part-3/09-public-case-atlas.md", kind: "chapter" },
    { id: "chapter-10", path: "docs/bluebook/part-4/10-pilot-roadmap.md", kind: "chapter" },
    { id: "chapter-11", path: "docs/bluebook/part-4/11-security-governance.md", kind: "chapter" },
    { id: "chapter-12", path: "docs/bluebook/part-4/12-workflow-operations.md", kind: "chapter" },
    { id: "chapter-13", path: "docs/bluebook/part-4/13-value-measurement.md", kind: "chapter" },
    { id: "conclusion", path: "docs/bluebook/conclusion-product-ecosystem.md", kind: "conclusion" },
    { id: "appendix-prompts", path: "docs/bluebook/appendices/prompt-templates.md", kind: "appendix" },
    { id: "appendix-scenarios", path: "docs/bluebook/appendices/scenario-index.md", kind: "appendix" },
    { id: "appendix-launch", path: "docs/bluebook/appendices/launch-checklist.md", kind: "appendix" },
    { id: "appendix-sources", path: "docs/bluebook/appendices/sources.md", kind: "appendix" },
    { id: "appendix-evidence", path: "docs/bluebook/appendices/evidence-ledger.md", kind: "appendix" },
    { id: "appendix-cases", path: "docs/bluebook/appendices/case-source-map.md", kind: "appendix" },
  ]);
});

test("resolveDocumentLink namespaces headings but preserves globally unique raw IDs", () => {
  const context = {
    currentPath: "docs/bluebook/chapter-a.md",
    currentId: "chapter-a",
    documentsByPath: new Map([
      ["docs/bluebook/chapter-b.md", {
        id: "chapter-b",
        headingAnchors: new Set(["same-heading"]),
        rawAnchors: new Set(["r14"]),
      }],
      ["docs/bluebook/appendices/sources.md", {
        id: "appendix-sources",
        headingAnchors: new Set(),
        rawAnchors: new Set(["r15"]),
      }],
    ]),
    currentHeadingAnchors: new Set(["local-heading"]),
    currentRawAnchors: new Set(["claim-print-a-01"]),
    siteBaseUrl: "https://qwenworkguide.pages.dev/",
  };
  assert.equal(resolveDocumentLink("#local-heading", context), "#chapter-a--local-heading");
  assert.equal(resolveDocumentLink("#claim-print-a-01", context), "#claim-print-a-01");
  assert.equal(resolveDocumentLink("chapter-b.md#same-heading", context), "#chapter-b--same-heading");
  assert.equal(resolveDocumentLink("chapter-b.md#r14", context), "#r14");
  assert.equal(resolveDocumentLink("appendices/sources.md#r15", context), "#r15");
  assert.equal(resolveDocumentLink("https://example.com/x", context), "https://example.com/x");
});

test("buildPrintDocument strips frontmatter and renders VitePress Markdown", async () => {
  const manifest = JSON.parse(await readFile(new URL("fixtures/pdf/manifest-valid.json", import.meta.url), "utf8"));
  const html = await buildPrintDocument({
    repoRoot: fileURLToPath(new URL("fixtures/pdf/repo/", import.meta.url)),
    manifest,
    css: "@page { size: A4; }",
  });
  assert.match(html, /<title>千问办公蓝皮书 V2\.0<\/title>/);
  assert.match(html, /class="warning custom-block"/);
  assert.match(html, /id="chapter-a--same-heading"/);
  assert.match(html, /id="claim-print-a-01"/);
  assert.doesNotMatch(html, /id="chapter-a--claim-print-a-01"/);
  assert.match(html, /href="#chapter-b--same-heading"/);
  assert.match(html, /<a href="#claim-print-a-01">同章原始锚点<\/a>/);
  assert.match(html, /id="r14"/);
  assert.match(html, /<a href="#r14">跨章原始锚点<\/a>/);
  assert.doesNotMatch(html, /^---$/m);
});
```

- [ ] **步骤 4：运行打印构建测试确认红灯**

运行：

```bash
node --test --test-name-pattern="Manifest|DocumentLink|PrintDocument" tests/content-validators.test.mjs
```

预期：FAIL，报错说明打印构建器不存在。

- [ ] **步骤 5：实现 manifest 校验和链接解析纯函数**

`validateManifest` 检查顶层元数据、`expectedCount`、ID/path 唯一、`kind` 枚举、布尔 `breakBefore`、路径归一化后仍在 `docs/bluebook/`、文件存在，并拒绝 `data/*.json`、`releases/*`、蓝皮书首页和 17 个兼容页。`resolveDocumentLink` 按以下顺序处理：

```js
import { posix } from "node:path";

function documentPath(rawPath, currentPath) {
  if (rawPath.startsWith("/")) {
    const sitePath = decodeURIComponent(rawPath).replace(/^\//, "");
    const path = `docs/${sitePath}`;
    if (path.endsWith("/")) return `${path}index.md`;
    return path.endsWith(".md") ? posix.normalize(path) : posix.normalize(`${path}.md`);
  }
  const path = posix.normalize(posix.join(posix.dirname(currentPath), rawPath));
  return path.endsWith(".md") ? path : `${path}.md`;
}

function publicDocumentUrl(path, anchor, siteBaseUrl) {
  const sitePath = path
    .replace(/^docs\//, "")
    .replace(/index\.md$/, "")
    .replace(/\.md$/, "");
  return new URL(`/${sitePath}${anchor ? `#${anchor}` : ""}`, siteBaseUrl).href;
}

export function resolveDocumentLink(rawHref, context) {
  if (/^(?:https?:|mailto:|tel:)/i.test(rawHref)) return rawHref;
  if (rawHref.startsWith("#")) {
    const anchor = rawHref.slice(1);
    if (context.currentRawAnchors.has(anchor)) return `#${anchor}`;
    if (context.currentHeadingAnchors.has(anchor)) return `#${context.currentId}--${anchor}`;
    throw new Error(`同章锚点不存在：${rawHref}`);
  }
  const [rawPath, anchor = ""] = rawHref.split("#", 2);
  const targetPath = documentPath(rawPath, context.currentPath);
  const target = context.documentsByPath.get(targetPath);
  if (!target) return publicDocumentUrl(targetPath, anchor, context.siteBaseUrl);
  if (!anchor) return `#${target.id}`;
  if (target.rawAnchors.has(anchor)) return `#${anchor}`;
  if (target.headingAnchors.has(anchor)) return `#${target.id}--${anchor}`;
  throw new Error(`跨章锚点不存在：${rawHref}`);
}
```

- [ ] **步骤 6：实现 Markdown 两遍解析和 HTML 文档**

`buildPrintDocument` 使用 `await createMarkdownRenderer(join(repoRoot, "docs"))`。第一遍对每份去 Frontmatter 的正文调用 `renderer.parse`，并通过同一个深度优先 token walker 访问根 token 以及递归访问每一层 `token.children`；不得只遍历 `renderer.parse()` 返回的顶层数组。任意层级的 `heading_open` 收集标题 ID，任意层级的 `html_inline`/`html_block` 都扫描 `token.content` 中全部显式 `id`。标准 claim span 位于 `inline.children`，步骤 3 的同章 claim 链接和跨章 R14 链接必须在删除递归逻辑时失败。最小 walker 为：

```js
function walkTokens(tokens, visit) {
  for (const token of tokens) {
    visit(token);
    if (Array.isArray(token.children)) walkTokens(token.children, visit);
  }
}
```

标题 ID 在第二遍改为 `${documentId}--${originalId}`；`claim-*`、`r14`、`r15` 等原始 HTML ID 保持不变，但必须在 21 份文档中全局唯一，且不得与 section ID 或命名空间后的标题 ID 冲突。第二遍复用同一 walker 递归改写任意层级的 `heading_open`、`link_open` 和 `image`，调用 `resolveDocumentLink`，并把本地图片转成 `pathToFileURL` 的绝对 URL。然后用 `renderer.renderer.render(tokens, renderer.options, env)` 渲染，每份文档包进：

```html
<section id="chapter-08" class="print-section kind-chapter break-before">
  <div class="section-content">渲染后的章节 HTML</div>
</section>
```

最终 HTML 固定包含 UTF-8、`<title>`、打印元数据、内联 CSS、封面、按 manifest 顺序生成的可点击目录和 21 个 section。任何丢失文件、丢失锚点、路径穿越或无法解析的 manifest 内链接都抛错。

- [ ] **步骤 7：实现原子 CLI 输出**

CLI 接口固定为：

```bash
node scripts/build-bluebook-print.mjs --manifest scripts/bluebook-v2-manifest.json --output /absolute/path/print.html
```

脚本创建输出父目录，先在同目录写隐藏临时文件，再 `rename` 为目标；失败不留下正式半成品。默认读取 `docs/.vitepress/theme/print.css`。

- [ ] **步骤 8：运行打印构建测试确认绿灯**

运行：

```bash
node --test --test-name-pattern="Manifest|DocumentLink|PrintDocument" tests/content-validators.test.mjs
npm test
```

预期：新增测试和完整测试套件全部 PASS。

- [ ] **步骤 9：提交打印清单与构建器**

```bash
git add scripts/bluebook-v2-manifest.json scripts/build-bluebook-print.mjs tests/content-validators.test.mjs tests/fixtures/pdf
git commit -m "feat(PDF): 增加 V2 打印清单与 HTML 构建器"
```

## 任务 16：用测试建立 A4 打印样式

**文件：**

- 创建：`docs/.vitepress/theme/print.css`
- 修改：`tests/content-validators.test.mjs`

- [ ] **步骤 1：编写失败的打印样式契约测试**

添加：

```js
test("print stylesheet covers pagination and overflow contracts", async () => {
  const css = await readFile(new URL("../docs/.vitepress/theme/print.css", import.meta.url), "utf8");
  for (const pattern of [
    /@page\s*{[^}]*size:\s*A4/s,
    /print-color-adjust:\s*exact/,
    /break-before:\s*page/,
    /thead\s*{[^}]*table-header-group/s,
    /overflow-wrap:\s*anywhere/,
    /white-space:\s*pre-wrap/,
    /\.custom-block\.warning/,
    /img\s*{[^}]*max-height:\s*240mm/s,
    /counter\(page\)/,
  ]) assert.match(css, pattern);
  assert.doesNotMatch(css, /(?:tr|th|td)[^{]*{[^}]*break-inside:\s*avoid/s);
});
```

- [ ] **步骤 2：运行样式测试确认红灯**

运行：

```bash
node --test --test-name-pattern="print stylesheet" tests/content-validators.test.mjs
```

预期：FAIL，报错 `print.css` 不存在。

- [ ] **步骤 3：创建打印样式**

使用以下完整基础并根据真实打印结果只调整毫米边距、字号和断页规则：

```css
@page {
  size: A4;
  margin: 18mm 16mm 18mm;
  @top-left { content: "千问办公蓝皮书 V2.0"; color: #555; font-size: 8pt; }
  @bottom-right { content: counter(page); color: #555; font-size: 8pt; }
}
@page :first {
  @top-left { content: none; }
  @bottom-right { content: none; }
}
* { box-sizing: border-box; }
html { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
body {
  margin: 0;
  color: #1d2329;
  background: #fff;
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
  font-size: 10.5pt;
  line-height: 1.65;
}
.cover { min-height: 240mm; display: flex; flex-direction: column; justify-content: center; }
.cover h1 { font-size: 28pt; }
.toc, .print-section.break-before { break-before: page; }
.print-section > .section-content > h1:first-child { margin-top: 0; }
h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
p, li { orphans: 3; widows: 3; }
img { max-width: 100%; max-height: 240mm; height: auto; object-fit: contain; }
img, figure, .custom-block { break-inside: avoid; page-break-inside: avoid; }
table { width: 100%; border-collapse: collapse; font-size: 8.7pt; }
thead { display: table-header-group; }
th, td { border: 1px solid #aeb6bf; padding: 1.6mm; vertical-align: top; overflow-wrap: anywhere; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 8.5pt; }
code, a { overflow-wrap: anywhere; word-break: break-word; }
.custom-block { border: 1px solid #7b8794; border-left-width: 3px; padding: 3mm 4mm; margin: 4mm 0; }
.custom-block.info { border-left-color: #3578a8; }
.custom-block.tip { border-left-color: #2d7a4b; }
.custom-block.warning { border-left-color: #9b6a00; }
.custom-block.danger { border-left-color: #a33a3a; }
.custom-block.details { border-left-color: #666; }
[data-claim-id] { display: inline; font-size: 0; }
.status { border: 1px solid currentColor; padding: 0 1mm; font-weight: 600; }
@media print {
  nav, .no-print { display: none !important; }
  a { color: inherit; text-decoration: underline; }
}
```

宽表和高表格行允许跨页但保留表头；不得给 `table`、`tr`、`th` 或 `td` 设置 `break-inside: avoid`，否则超高行可能被裁切。图片用 `max-height` 限制在单页可打印区域。目录只承诺标题可点击和全书页码连续，不使用 Chromium 支持不稳定的自动目录页码特性。

- [ ] **步骤 4：运行样式与 HTML 测试确认绿灯**

运行：

```bash
node --test --test-name-pattern="print stylesheet|PrintDocument" tests/content-validators.test.mjs
```

预期：样式契约和 HTML 构建测试 PASS。

- [ ] **步骤 5：提交打印样式**

```bash
git add docs/.vitepress/theme/print.css tests/content-validators.test.mjs
git commit -m "style(PDF): 增加蓝皮书 A4 打印样式"
```

## 任务 17：用 fake Chrome 测试仓库自有 PDF 导出器

**文件：**

- 创建：`scripts/html-to-pdf.sh`
- 修改：`tests/content-validators.test.mjs`

- [ ] **步骤 1：编写成功、失败和原子替换测试**

在测试文件导入 `execFile` 和 `promisify`，然后添加：

```js
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function createFakeChrome(directory, exitCode = 0, writePdf = true, version = "150.0.0.0") {
  const chrome = join(directory, "Fake Chrome");
  const source = `#!/bin/sh
if [ "$1" = "--version" ]; then
  echo "Fake Chrome ${version}"
  exit 0
fi
output=""
for argument in "$@"; do
  case "$argument" in
    --print-to-pdf=*) output="\${argument#--print-to-pdf=}" ;;
  esac
done
${writePdf ? 'printf "%s" "%PDF-1.4 fake" > "$output"' : ':'}
exit ${exitCode}
`;
  await writeFile(chrome, source, "utf8");
  await chmod(chrome, 0o755);
  return chrome;
}

test("html-to-pdf prefers explicit Chrome and replaces output atomically", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory);
  const input = join(directory, "input file.html");
  const output = join(directory, "output file.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await writeFile(output, "old", "utf8");
  await execFileAsync("bash", ["scripts/html-to-pdf.sh", "--chrome", chrome, input, output]);
  assert.equal(await readFile(output, "utf8"), "%PDF-1.4 fake");
});

test("html-to-pdf preserves the previous PDF when Chrome fails", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory, 9, false);
  const input = join(directory, "input.html");
  const output = join(directory, "output.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await writeFile(output, "previous", "utf8");
  await assert.rejects(execFileAsync("bash", [
    "scripts/html-to-pdf.sh", "--chrome", chrome, input, output,
  ]));
  assert.equal(await readFile(output, "utf8"), "previous");
});

test("html-to-pdf rejects empty browser output", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory, 0, false);
  const input = join(directory, "input.html");
  const output = join(directory, "output.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await assert.rejects(execFileAsync("bash", [
    "scripts/html-to-pdf.sh", "--chrome", chrome, input, output,
  ]));
});

test("html-to-pdf uses QWG_CHROME_BIN when no explicit path is supplied", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory);
  const input = join(directory, "input.html");
  const output = join(directory, "output.pdf");
  await writeFile(input, "<!doctype html><title>V2.0</title>", "utf8");
  await execFileAsync("bash", ["scripts/html-to-pdf.sh", input, output], {
    env: { ...process.env, QWG_CHROME_BIN: chrome },
  });
  assert.equal(await readFile(output, "utf8"), "%PDF-1.4 fake");
});

test("html-to-pdf rejects an invalid explicit Chrome without fallback", async (t) => {
  const directory = await createTemporaryDirectory(t);
  await assert.rejects(execFileAsync("bash", [
    "scripts/html-to-pdf.sh", "--check", "--chrome", join(directory, "missing"),
  ], { env: { ...process.env, QWG_CHROME_BIN: "" } }));
});

test("html-to-pdf rejects an invalid QWG_CHROME_BIN without fallback", async (t) => {
  const directory = await createTemporaryDirectory(t);
  await assert.rejects(execFileAsync("bash", ["scripts/html-to-pdf.sh", "--check"], {
    env: { ...process.env, QWG_CHROME_BIN: join(directory, "missing") },
  }));
});

test("html-to-pdf requires Chrome major version 131 or newer", async (t) => {
  const directory = await createTemporaryDirectory(t);
  const chrome = await createFakeChrome(directory, 0, true, "130.0.0.0");
  await assert.rejects(execFileAsync("bash", [
    "scripts/html-to-pdf.sh", "--check", "--chrome", chrome,
  ]));
});
```

这组测试覆盖显式参数优先级、路径空格、任务专用环境变量、错误配置不回退、Chrome 最低版本、浏览器失败、空输出和旧文件保护。

- [ ] **步骤 2：运行导出器测试确认红灯**

运行：

```bash
node --test --test-name-pattern="html-to-pdf" tests/content-validators.test.mjs
```

预期：FAIL，报错说明 `scripts/html-to-pdf.sh` 不存在。

- [ ] **步骤 3：实现参数解析和 Chrome 探测**

创建可执行 shell 脚本，接口固定为：

```text
scripts/html-to-pdf.sh [--chrome PATH] [--wait-ms MILLISECONDS] INPUT_HTML OUTPUT_PDF
scripts/html-to-pdf.sh --check [--chrome PATH]
```

脚本实现使用以下完整控制流：

```bash
#!/usr/bin/env bash
set -euo pipefail

QWG_EXPLICIT_CHROME=""
QWG_WAIT_MS="3000"
QWG_CHECK_ONLY="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --chrome) QWG_EXPLICIT_CHROME="$2"; shift 2 ;;
    --wait-ms) QWG_WAIT_MS="$2"; shift 2 ;;
    --check) QWG_CHECK_ONLY="1"; shift ;;
    --) shift; break ;;
    -*) echo "未知参数：$1" >&2; exit 2 ;;
    *) break ;;
  esac
done

if ! [[ "$QWG_WAIT_MS" =~ ^[0-9]+$ ]]; then
  echo "--wait-ms 必须为非负整数" >&2
  exit 2
fi

resolve_chrome() {
  local candidate=""
  if [[ -n "$QWG_EXPLICIT_CHROME" ]]; then
    [[ -x "$QWG_EXPLICIT_CHROME" ]] || {
      echo "--chrome 指定的文件不可执行：$QWG_EXPLICIT_CHROME" >&2
      return 1
    }
    printf '%s\n' "$QWG_EXPLICIT_CHROME"
    return 0
  fi
  if [[ -n "${QWG_CHROME_BIN:-}" ]]; then
    [[ -x "$QWG_CHROME_BIN" ]] || {
      echo "QWG_CHROME_BIN 指定的文件不可执行：$QWG_CHROME_BIN" >&2
      return 1
    }
    printf '%s\n' "$QWG_CHROME_BIN"
    return 0
  fi
  for candidate in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"; do
    if [[ -n "$candidate" && -x "$candidate" ]]; then printf '%s\n' "$candidate"; return 0; fi
  done
  for candidate in google-chrome chromium chromium-browser microsoft-edge brave-browser; do
    if command -v "$candidate" >/dev/null 2>&1; then command -v "$candidate"; return 0; fi
  done
  return 1
}

QWG_CHROME_PATH="$(resolve_chrome)" || { echo "未找到可执行的 Chrome/Chromium" >&2; exit 1; }
QWG_CHROME_VERSION="$("$QWG_CHROME_PATH" --version)" || {
  echo "无法读取 Chrome/Chromium 版本" >&2
  exit 1
}
if [[ ! "$QWG_CHROME_VERSION" =~ ([0-9]+)\. ]]; then
  echo "无法解析 Chrome/Chromium 主版本：$QWG_CHROME_VERSION" >&2
  exit 1
fi
QWG_CHROME_MAJOR="${BASH_REMATCH[1]}"
if (( QWG_CHROME_MAJOR < 131 )); then
  echo "Chrome/Chromium 主版本必须 >=131：$QWG_CHROME_VERSION" >&2
  exit 1
fi
printf '%s\n' "$QWG_CHROME_VERSION"

if [[ "$QWG_CHECK_ONLY" = "1" ]]; then
  printf 'Chrome: %s\n' "$QWG_CHROME_PATH"
  exit 0
fi

if [[ $# -ne 2 ]]; then echo "必须提供 INPUT_HTML 和 OUTPUT_PDF" >&2; exit 2; fi
QWG_INPUT_HTML="$1"
QWG_OUTPUT_PDF="$2"
if [[ ! -f "$QWG_INPUT_HTML" ]]; then echo "输入 HTML 不是普通文件" >&2; exit 1; fi

QWG_INPUT_ABS="$(cd "$(dirname "$QWG_INPUT_HTML")" && pwd)/$(basename "$QWG_INPUT_HTML")"
QWG_OUTPUT_DIR="$(dirname "$QWG_OUTPUT_PDF")"
mkdir -p "$QWG_OUTPUT_DIR"
QWG_OUTPUT_ABS="$(cd "$QWG_OUTPUT_DIR" && pwd)/$(basename "$QWG_OUTPUT_PDF")"
QWG_WORK_DIR="$(mktemp -d)"
QWG_STAGE_PDF="$(mktemp "$QWG_OUTPUT_DIR/.qwg-pdf.XX""XX""XX")"
cleanup() { rm -rf "$QWG_WORK_DIR"; rm -f "$QWG_STAGE_PDF"; }
trap cleanup EXIT

QWG_INPUT_URL="$(node --input-type=module -e \
  'import { pathToFileURL } from "node:url"; console.log(pathToFileURL(process.argv[1]).href)' \
  "$QWG_INPUT_ABS")"

"$QWG_CHROME_PATH" \
  --headless=new \
  --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw \
  "--virtual-time-budget=$QWG_WAIT_MS" \
  --no-pdf-header-footer \
  "--print-to-pdf=$QWG_STAGE_PDF" \
  "$QWG_INPUT_URL"

if [[ ! -s "$QWG_STAGE_PDF" ]]; then echo "Chrome 未生成非空 PDF" >&2; exit 1; fi
mv -f "$QWG_STAGE_PDF" "$QWG_OUTPUT_ABS"
printf 'PDF: %s\n' "$QWG_OUTPUT_ABS"
```

脚本不得加入 `--no-sandbox`；横向、背景和缩放全部由打印 CSS 控制。

- [ ] **步骤 4：设置执行权限并运行测试确认绿灯**

运行：

```bash
chmod +x scripts/html-to-pdf.sh
node --test --test-name-pattern="html-to-pdf" tests/content-validators.test.mjs
bash -n scripts/html-to-pdf.sh
```

预期：fake Chrome 测试全部 PASS，shell 语法检查退出码为 0。

- [ ] **步骤 5：提交 Chrome 导出器**

```bash
git add scripts/html-to-pdf.sh tests/content-validators.test.mjs
git commit -m "feat(PDF): 增加确定性 Chrome PDF 导出器"
```

## 任务 18：用测试建立端到端 PDF 编排

**文件：**

- 创建：`scripts/build-bluebook-pdf.sh`
- 修改：`tests/content-validators.test.mjs`
- 修改：`package.json`

- [ ] **步骤 1：编写失败的 fake toolchain 编排集成测试**

测试不启动真实浏览器，但必须实际执行 `build-bluebook-pdf.sh`。`createFakePdfRepository` 在临时仓库复制待测编排脚本，并创建假的 `npm`、`node`、`pdfinfo`、`pdftoppm` 和 `scripts/html-to-pdf.sh`；把 fake `bin` 放在 `PATH` 最前面，并把 `TMPDIR` 设到测试临时目录，避免留下工作目录。fake `node` 在收到 `--output` 时写打印 HTML，fake HTML→PDF 写 `%PDF-1.4 new`，fake `pdfinfo` 默认返回 Title 含 V2.0、Pages 为 2，fake `pdftoppm` 默认写两张 PNG。

添加三个真实进程测试：

```js
async function runFakePdfBuild(t, {
  previous = "previous",
  pdfinfoMode = "valid",
  renderedPages = "2",
} = {}) {
  const fixture = await createFakePdfRepository(t);
  await writeFile(fixture.output, previous, "utf8");
  const execution = execFileAsync("bash", ["scripts/build-bluebook-pdf.sh"], {
    cwd: fixture.root,
    env: {
      ...process.env,
      PATH: `${fixture.bin}:${process.env.PATH}`,
      TMPDIR: fixture.tmp,
      QWG_FAKE_PDFINFO_MODE: pdfinfoMode,
      QWG_FAKE_RENDERED_PAGES: renderedPages,
    },
  });
  return { ...fixture, execution };
}

test("build-bluebook-pdf success replaces the previous output", async (t) => {
  const { output, execution } = await runFakePdfBuild(t);
  await execution;
  assert.equal(await readFile(output, "utf8"), "%PDF-1.4 new");
});

test("build-bluebook-pdf invalid pdfinfo preserves the previous output", async (t) => {
  const { output, execution } = await runFakePdfBuild(t, { pdfinfoMode: "invalid" });
  await assert.rejects(execution);
  assert.equal(await readFile(output, "utf8"), "previous");
});

test("build-bluebook-pdf page-count failure preserves the previous output", async (t) => {
  const { output, execution } = await runFakePdfBuild(t, { renderedPages: "1" });
  await assert.rejects(execution);
  assert.equal(await readFile(output, "utf8"), "previous");
});
```

`createFakePdfRepository` 不复制正式内容，只创建运行脚本所需的最小目录和可执行文件。每个 fake 工具必须区分版本调用与工作调用；`pdfinfoMode: "invalid"` 返回无法接受的页数或标题，`QWG_FAKE_RENDERED_PAGES` 控制实际 PNG 数。三个测试结束后还断言输出目录不存在 `.qwenwork-bluebook-v2.0.pdf.*` staging 文件。不得用读取脚本文本并比较 token 顺序的静态测试替代这些进程级断言。

- [ ] **步骤 2：运行编排测试确认红灯**

运行：

```bash
node --test --test-name-pattern="build-bluebook-pdf" tests/content-validators.test.mjs
```

预期：FAIL，报错说明编排脚本不存在。

- [ ] **步骤 3：实现工具预检和失败保护**

创建 `scripts/build-bluebook-pdf.sh`，使用 `set -euo pipefail`。先解析仓库根目录，再检查 Node 主版本为 20–24，输出 Node、npm、Chrome、`pdfinfo` 和 `pdftoppm` 的解析路径与版本；任一命令缺失或版本命令非零立即退出。正式输出只在所有检查成功后替换，失败时删除 staging 并保留已有 V2 PDF。

- [ ] **步骤 4：实现固定编排顺序**

主体按以下顺序实现，不增删步骤：

```bash
#!/usr/bin/env bash
set -euo pipefail

QWG_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QWG_REPO_ROOT="$(cd "$QWG_SCRIPT_DIR/.." && pwd)"
cd "$QWG_REPO_ROOT"

require_command() {
  command -v "$1" || { echo "缺少必需命令：$1" >&2; exit 1; }
}

QWG_NODE_PATH="$(require_command node)"
QWG_NPM_PATH="$(require_command npm)"
QWG_PDFINFO_PATH="$(require_command pdfinfo)"
QWG_PDFTOPPM_PATH="$(require_command pdftoppm)"
QWG_NODE_VERSION="$(node --version)"
QWG_NODE_MAJOR="${QWG_NODE_VERSION#v}"
QWG_NODE_MAJOR="${QWG_NODE_MAJOR%%.*}"
if (( QWG_NODE_MAJOR < 20 || QWG_NODE_MAJOR >= 25 )); then
  echo "Node.js 必须满足 >=20 <25" >&2
  exit 1
fi

printf 'Node: %s %s\n' "$QWG_NODE_PATH" "$QWG_NODE_VERSION"
printf 'npm: %s %s\n' "$QWG_NPM_PATH" "$(npm --version)"
printf 'pdfinfo: %s\n' "$QWG_PDFINFO_PATH"
pdfinfo -v
printf 'pdftoppm: %s\n' "$QWG_PDFTOPPM_PATH"
pdftoppm -v
QWG_CHROME_ARGS=()
if [[ -n "${QWG_CHROME_BIN:-}" ]]; then QWG_CHROME_ARGS=(--chrome "$QWG_CHROME_BIN"); fi
scripts/html-to-pdf.sh --check "${QWG_CHROME_ARGS[@]}"

QWG_WORK_DIR="$(mktemp -d)"
QWG_OUTPUT_DIR="docs/public/downloads"
mkdir -p "$QWG_OUTPUT_DIR"
QWG_STAGE_PDF="$(mktemp "$QWG_OUTPUT_DIR/.qwenwork-bluebook-v2.0.pdf.XX""XX""XX")"
QWG_SUCCESS="0"
cleanup() {
  rm -f "$QWG_STAGE_PDF"
  if [[ "$QWG_SUCCESS" != "1" ]]; then rm -rf "$QWG_WORK_DIR"; fi
}
trap cleanup EXIT

npm run generate:evidence
npm run build
node scripts/build-bluebook-print.mjs \
  --manifest scripts/bluebook-v2-manifest.json \
  --output "$QWG_WORK_DIR/print.html"
scripts/html-to-pdf.sh "${QWG_CHROME_ARGS[@]}" "$QWG_WORK_DIR/print.html" "$QWG_WORK_DIR/bluebook.pdf"
test -s "$QWG_WORK_DIR/bluebook.pdf"

QWG_PDF_INFO="$(pdfinfo "$QWG_WORK_DIR/bluebook.pdf")"
QWG_PAGES="$(printf '%s\n' "$QWG_PDF_INFO" | awk '/^Pages:/ { print $2 }')"
QWG_TITLE="$(printf '%s\n' "$QWG_PDF_INFO" | sed -n 's/^Title:[[:space:]]*//p')"
if ! [[ "$QWG_PAGES" =~ ^[1-9][0-9]*$ ]]; then echo "PDF 页数无效" >&2; exit 1; fi
if [[ "$QWG_TITLE" != *"V2.0"* ]]; then echo "PDF 标题缺少 V2.0" >&2; exit 1; fi

mkdir -p "$QWG_WORK_DIR/pages"
pdftoppm -png -r 150 "$QWG_WORK_DIR/bluebook.pdf" "$QWG_WORK_DIR/pages/page"
QWG_RENDERED_PAGES="$(find "$QWG_WORK_DIR/pages" -type f -name 'page-*.png' | wc -l | tr -d ' ')"
if [[ "$QWG_RENDERED_PAGES" != "$QWG_PAGES" ]]; then echo "PNG 页数与 PDF 不一致" >&2; exit 1; fi

cp "$QWG_WORK_DIR/bluebook.pdf" "$QWG_STAGE_PDF"
mv -f "$QWG_STAGE_PDF" "$QWG_OUTPUT_DIR/qwenwork-bluebook-v2.0.pdf"
QWG_SUCCESS="1"
printf 'PDF: %s\n' "$QWG_REPO_ROOT/$QWG_OUTPUT_DIR/qwenwork-bluebook-v2.0.pdf"
printf 'QA pages: %s\n' "$QWG_WORK_DIR/pages"
```

- [ ] **步骤 5：添加唯一 npm 入口**

在 `package.json` 的 `scripts` 增加：

```json
{
  "build:bluebook-pdf": "bash scripts/build-bluebook-pdf.sh"
}
```

- [ ] **步骤 6：设置权限并运行脚本测试**

运行：

```bash
chmod +x scripts/build-bluebook-pdf.sh
bash -n scripts/build-bluebook-pdf.sh
node --test --test-name-pattern="build-bluebook-pdf|html-to-pdf|PrintDocument" tests/content-validators.test.mjs
npm test
```

预期：shell 语法检查、PDF 管道测试和完整测试套件全部 PASS；此步骤不生成正式 PDF。

- [ ] **步骤 7：提交一键构建入口**

```bash
git add package.json scripts/build-bluebook-pdf.sh tests/content-validators.test.mjs
git commit -m "build(PDF): 增加 V2 一键构建流程"
```

## 任务 19：生成 V2.0 PDF 并完成逐页视觉 QA

**文件：**

- 创建：`docs/public/downloads/qwenwork-bluebook-v2.0.pdf`
- 创建：`docs/bluebook/releases/v2.0-pdf-qa.md`
- 修改：`docs/bluebook/index.md`
- 修改：`docs/index.md`
- 修改：`docs/bluebook/releases/v2.0.md`
- 修改：`README.md`
- 可能修改：本计划范围内的规范 Markdown、证据 JSON 与生成附录、`scripts/bluebook-v2-manifest.json`、`docs/.vitepress/theme/print.css`、三个 PDF 构建脚本及对应测试；仅用于修复真实 PDF QA 发现的问题

- [ ] **步骤 1：先运行发布候选硬校验**

运行：

```bash
npm test
npm run check:content
npm run build
```

预期：全部退出码为 0；不带着内容或构建失败进入 PDF 生成。

- [ ] **步骤 2：先增加 V2 下载入口并保留历史版本**

在第一次 PDF 构建和 QA 之前，蓝皮书首页、站点首页、V2.0 版本说明和 README 的首选下载链接指向 `/downloads/qwenwork-bluebook-v2.0.pdf`；V1.2 `/downloads/qwenwork-bluebook-v1.pdf` 和 V1.3 `/downloads/qwenwork-bluebook-v1.3.pdf` 明确标为历史存档，URL 不变。这样首次正式 QA 覆盖的就是最终下载入口状态。

- [ ] **步骤 3：记录正式 RC 的 macOS、字体和 Chrome 环境**

正式 RC PDF 必须在记录过的 macOS 环境生成；浏览器无关的 Node、JSON、内容和 fake toolchain 测试仍允许跨平台运行。执行：

```bash
test "$(uname -s)" = "Darwin"
sw_vers
uname -m
QWG_PINGFANG_PATH="/System/Library/PrivateFrameworks/FontServices.framework/Resources/Reserved/PingFangUI.ttc"
test -r "$QWG_PINGFANG_PATH"
ls -l "$QWG_PINGFANG_PATH"
scripts/html-to-pdf.sh --check
```

预期：系统为 macOS，记录系统版本和架构；苹方字体文件可读；Chrome/Chromium 主版本不低于 131。把完整版本字符串、浏览器解析路径和字体路径写入 QA 记录，不把本机当前版本硬编码进脚本。

- [ ] **步骤 4：运行唯一 PDF 构建入口**

运行：

```bash
npm run build:bluebook-pdf
```

预期：输出 Node、npm、Chrome、`pdfinfo`、`pdftoppm` 版本，生成非空 `docs/public/downloads/qwenwork-bluebook-v2.0.pdf`，并打印包含全部 150 DPI PNG 的绝对 QA 目录。

- [ ] **步骤 5：核对 PDF 机器属性、内部目标和外链清单**

运行：

```bash
pdfinfo docs/public/downloads/qwenwork-bluebook-v2.0.pdf
pdfinfo -dests docs/public/downloads/qwenwork-bluebook-v2.0.pdf
pdfinfo -url docs/public/downloads/qwenwork-bluebook-v2.0.pdf
shasum -a 256 docs/public/downloads/qwenwork-bluebook-v2.0.pdf
```

预期：四条命令均退出 0；Title 包含 `V2.0`，Pages 为正整数，SHA-256 输出一行非空哈希。把 `-dests` 的命名目标清单和 `-url` 的外链清单保存到 QA 记录；若 Chromium 把内部跳转编码为直接 GoTo 而非 named destination，明确记录该结果，并以步骤 6 的逐链接点击作为内部跳转硬验收。外链清单必须至少包含正文中选定用于点击复验的公开 URL。

- [ ] **步骤 6：在最终 PDF 中逐个点击链接**

用本机 PDF 阅读器打开正式文件，逐个点击目录的全部 21 个条目，确认落到对应 section；再点击至少一个正文跨章节链接、来源附录开头真实存在的 `[R14](#r14)` 与 `[R15](#r15)` 兼容入口、一条证据台账到 `#claim-*` 的正文位置链接，以及一条外部 HTTPS 链接。逐项记录“链接文字、来源页、预期目标、实际目标、结果”；任何无响应、跳错章节或打开错误 URL 都阻断 RC。不得只检查打印 HTML 来替代最终 PDF 点击，也不得把孤立目标锚点当作已完成点击验收。

- [ ] **步骤 7：逐页查看全部 PNG**

使用本地图片查看工具按页码顺序打开构建脚本输出目录里的每一张 `page-*.png`，不得抽样。逐页检查：封面标题与版本；目录标题、顺序和链接文字；执行摘要→13 章→结语→6 附录顺序；章起始分页；空白、重复、截断；孤行标题；宽表溢出和续页表头；代码裁切；custom block；中文字体与标点；长链接；页眉页脚与页码；V1.x 残留；证据台账和案例映射是否实际进入 PDF。

- [ ] **步骤 8：创建逐页、链接和环境 QA 记录**

`v2.0-pdf-qa.md` 使用完整 Frontmatter，正文先写检查人角色、日期、`sw_vers`、CPU 架构、苹方字体路径、Node/npm/Chrome/pdfinfo/pdftoppm 版本、PDF SHA-256、总页数、PNG 目录，以及 `pdfinfo -dests`/`-url` 结果摘要。随后写步骤 6 的完整链接点击表，再创建一页一行的视觉表：

```markdown
| 页码 | 预期内容/章节 | 结果 | 问题 | 修订 |
|---:|---|---|---|---|
| 1 | 封面 | 通过 | 无 | 无 |
```

实际表必须从 1 写到 `pdfinfo` 返回的最后一页，每页都有明确章节、结果、问题和修订；不保留空白单元格。

逐页表后增加构建轮次记录：

```markdown
| 轮次 | 日期 | PDF SHA-256 | 发现的问题 | 修订文件 | 复验结果 |
|---:|---|---|---|---|---|
```

表中使用本轮真实哈希和真实修订路径；如果只有一轮，仍保留一行以证明检查对应哪个二进制文件。

- [ ] **步骤 9：修复所有链接或视觉问题并从头复验**

只要任一页不是“通过”，修改对应 Markdown、JSON、manifest、打印 CSS 或脚本，重新运行：

```bash
npm run build:bluebook-pdf
```

废弃上一轮机器属性、链接点击和逐页结论，从步骤 5 开始重新执行：更新 PDF 哈希、页数、目标/URL 清单、全部 21 个目录点击、专项链接点击、PNG 目录和逐页记录。循环直到所有链接和每一页通过。修订范围只能落在本任务“可能修改”列表；不得顺手修改站点视觉或发布工作流。

- [ ] **步骤 10：重新构建站点并核对下载文件**

运行：

```bash
npm run check
test -s docs/.vitepress/dist/downloads/qwenwork-bluebook-v2.0.pdf
git diff --exit-code ab31328 -- docs/public/downloads/qwenwork-bluebook-v1.pdf docs/public/downloads/qwenwork-bluebook-v1.3.pdf
```

预期：完整检查通过；构建目录存在非空 V2 PDF；两份历史 PDF 相对 V2 设计基线无差异。

- [ ] **步骤 11：提交 PDF、QA 记录和条件性修订**

最终提交必须包含视觉或链接 QA 实际修改过的内容和构建文件，不能只提交 PDF。`git add` 对未修改路径无副作用；提交前用 `git diff --cached --name-only` 确认只有计划允许的文件：

```bash
git add README.md docs/index.md docs/bluebook/index.md docs/bluebook/releases/v2.0.md docs/bluebook/releases/v2.0-pdf-qa.md docs/public/downloads/qwenwork-bluebook-v2.0.pdf docs/bluebook/executive-summary.md docs/bluebook/part-1 docs/bluebook/part-2 docs/bluebook/part-3 docs/bluebook/part-4 docs/bluebook/conclusion-product-ecosystem.md docs/bluebook/appendices docs/bluebook/data docs/.vitepress/theme/print.css scripts/bluebook-v2-manifest.json scripts/build-bluebook-print.mjs scripts/html-to-pdf.sh scripts/build-bluebook-pdf.sh tests/content-validators.test.mjs tests/fixtures/pdf package.json
git diff --cached --name-only
git commit -m "docs(发布): 提交 V2 PDF 候选与逐页 QA"
```

## 任务 20：完成本地 V2.0 发布候选验收

**文件：** 无新增；只修复本计划范围内的验收失败。

- [ ] **步骤 1：验证生成页幂等**

运行：

```bash
npm run generate:evidence
git diff --exit-code -- docs/bluebook/appendices/evidence-ledger.md docs/bluebook/appendices/case-source-map.md
```

预期：生成器不产生差异，证明 JSON 是唯一规范源。

- [ ] **步骤 2：运行最终测试、内容校验和构建**

运行：

```bash
npm test
npm run check:content
npm run build
npm run check
git diff --check
```

预期：全部命令退出码为 0；测试数量高于基线 24 项；无空白错误。

- [ ] **步骤 3：验证规范页和兼容页构建产物**

运行：

```bash
test -f docs/.vitepress/dist/bluebook/executive-summary.html
test -f docs/.vitepress/dist/bluebook/part-4/13-value-measurement.html
test -f docs/.vitepress/dist/bluebook/conclusion-product-ecosystem.html
rg -n "canonical|noindex,follow" docs/.vitepress/dist/bluebook/part-1/01-from-answer-to-delivery.html
```

预期：三个代表规范页存在；旧页面 HTML 同时包含 canonical 和 `noindex,follow`。再对 17 个旧路径执行同样检查，全部通过。

- [ ] **步骤 4：验证历史链接与 PDF 保护**

运行：

```bash
git diff --exit-code ab31328 -- docs/public/downloads/qwenwork-bluebook-v1.pdf docs/public/downloads/qwenwork-bluebook-v1.3.pdf
pdfinfo docs/public/downloads/qwenwork-bluebook-v2.0.pdf
pdfinfo -dests docs/public/downloads/qwenwork-bluebook-v2.0.pdf
pdfinfo -url docs/public/downloads/qwenwork-bluebook-v2.0.pdf
shasum -a 256 docs/public/downloads/qwenwork-bluebook-v2.0.pdf
```

预期：两份历史 PDF 无差异；V2 PDF 标题、页数、目标/URL 清单和哈希与 QA 记录完全一致。

- [ ] **步骤 5：核对实施 diff 边界**

运行：

```bash
set -e
QWG_PLAN_PATH="docs/superpowers/plans/2026-08-01-qwenworkguide-v2-content-implementation.md"
QWG_IMPLEMENTATION_BASE="$(
  git log --diff-filter=A -1 --format=%H -- "$QWG_PLAN_PATH"
)"
test -n "$QWG_IMPLEMENTATION_BASE"
git diff --quiet "$QWG_IMPLEMENTATION_BASE" -- "$QWG_PLAN_PATH"
git diff --name-only "$QWG_IMPLEMENTATION_BASE"..HEAD
```

逐项确认输出只包含本计划“文件结构与职责”列出的内容、脚本、测试、入口和 PDF；不得包含站点视觉重构、工作流部署文件、远端发布配置或无关清理。

- [ ] **步骤 6：核对核心论证与唯一规范位置**

逐章阅读执行摘要、13 章和结语，确认核心论证按“完成一次交付→沉淀一条工作流→应用于专业场景→扩展为组织能力”连续推进。确认任务卡只在第 2 章定义、证据卡只在第 8 章定义、评分与阶段门只在第 10 章定义、工作流卡只在第 12 章定义、ROI 公式只在第 13 章定义、上线硬门只在上线验收附录定义。

- [ ] **步骤 7：确认本地候选状态**

运行：

```bash
git status --short --branch
git log --oneline --decorate -20
```

预期：位于 `codex/qwenworkguide-v2-content`；工作树干净；提交历史能按证据基础设施、正文迁移、兼容导航、打印管道、PDF QA 顺序审阅。到此停止，不执行 `git push`、GitHub Release 或生产部署。

## 规格覆盖自检

- 核心命题、三个支撑判断和四步论证：任务 6–13。
- 序章、13 个规范章节、结语和六段章节模板：任务 6–13。
- 主张类型、来源类型、核验状态、摘要资格和发布阻断：任务 1、3、5、13。
- 32 条候选映射、动态公开计数、代表案例卡和客户证据包：任务 2、5、11。
- 唯一 ROI、阈值登记表、30/60/90 天映射、G0–G3 和六角色：任务 9–10。
- 唯一规范位置、附录反链、快速开始：任务 8–12、20。
- 17 个旧 URL、R14/R15、导航、搜索和前后章排除：任务 12、14。
- V1.2/V1.3 PDF 保护：任务 0、19、20。
- 21 项 PDF 清单、HTML、CSS、Chrome、Poppler 和逐页 QA：任务 15–19。
- 本地 RC 边界、无推送、无 Release、无部署：任务 13、20。

## 标识符一致性自检

- 主张字段统一使用 `claim_id`、`claim_type`、`content_path`、`content_anchor`、`verification_status`、`is_key`、`summary_eligible`、`blocks_release`。
- 正文 span 的 `id` 和 `data-claim-id` 均等于台账 `claim_id`；锚点不加 `#` 存储。
- 案例字段统一使用 `case_id`、`book_category`、`external_record_id`、`verification_status`、`included_in_public_count`。
- 公开计数只使用 `<span data-public-case-count="数字">数字</span>`，属性和可见数字一致。
- 生成器写入模式为 `write`，只检查模式为 `check`；npm 入口为 `generate:evidence` 和 `check:evidence`。
- PDF 版本统一写 `V2.0`，文件名统一为 `qwenwork-bluebook-v2.0.pdf`。

计划执行完成时，不以未采样的 10–15 分钟阅读目标代替硬验收。真实读者测试和发布后 30 天传播复盘只记录在后续版本复盘中。
