import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

export function validatePublicCases(data) {
  const errors = [], ids = new Set(), identities = new Set();
  if (!Array.isArray(data.cases) || !data.sources) return ['缺少 cases 或 sources'];
  for (const [key, s] of Object.entries(data.sources)) {
    if (!s.title || !s.publisher || !/^https:\/\//.test(s.url)) errors.push(`${key}: 来源信息不完整`);
    if (s.publishedAt !== null && !/^\d{4}-\d{2}-\d{2}$/.test(s.publishedAt)) errors.push(`${key}: 发布日期无效`);
  }
  for (const c of data.cases) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id) || ids.has(c.id)) errors.push(`${c.id}: ID 无效或重复`);
    ids.add(c.id);
    if (!['企业实践报道','第三方实测','官方场景演示'].includes(c.type)) errors.push(`${c.id}: 类型无效`);
    const source = data.sources[c.sourceId];
    if (!source) errors.push(`${c.id}: 来源不存在`);
    for (const field of ['title','category','locator','reportedFacts','audience','inputs','outputs','workflow','acceptance','limitations']) {
      if (typeof c[field] !== 'string' || !c[field].trim()) errors.push(`${c.id}: 缺少 ${field}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.accessedAt) || c.accessedAt > data.version || (source?.publishedAt && source.publishedAt > c.accessedAt)) errors.push(`${c.id}: 核验日期无效`);
    const identity = `${source?.url}#${c.locator}`;
    if (identities.has(identity)) errors.push(`${c.id}: 同一来源位置重复计数`);
    identities.add(identity);
  }
  return errors;
}
const meta = (title, description, urls, date) => `---\ntitle: ${title}\ndescription: ${description}\nstatus: community-practice\nverifiedAt: ${date}\nsources:\n${[...new Set(urls)].map(u=>`  - ${u}`).join('\n')}\n---\n\n`;
function caseBody(c,s) {
  return `**${c.type} · ${c.category}**\n\n### 原文说了什么\n\n${c.reportedFacts}\n\n来源：[${s.title}](${s.url})（${s.publisher}）。发布日期：${s.publishedAt ?? '页面未标注'}；查阅日期：${c.accessedAt}。原文定位：${c.locator}。\n\n### 证据边界\n\n${c.limitations}\n\n### 可以怎样试做\n\n以下是本站编写的复现建议，不是对原客户内部流程的转述，也不表示本站已经实测该组织环境。\n\n- **适合谁：** ${c.audience}\n- **准备输入：** ${c.inputs}\n- **预期交付：** ${c.outputs}\n\n${c.workflow}\n\n### 怎么验收\n\n${c.acceptance}\n`;
}
export function generatePublicPages(data) {
  const urls=Object.values(data.sources).map(s=>s.url), out=new Map();
  const types=['企业实践报道','第三方实测','官方场景演示'];
  let catalog=meta('公开案例与实测','按行业、来源类型与验收重点阅读公开实践。',urls,data.version)+'# 公开案例与实测\n\n';
  catalog+=`**本次收录 ${data.cases.length} 条：${types.map(t=>`${data.cases.filter(c=>c.type===t).length} 条${t}`).join('、')}。** 查阅日：${data.version}。这是来源条目数，不是经独立审计的成功客户数。多场景归于同一企业时合并为一条，不把新闻转载当作多个案例。\n\n按下面的类型浏览，也可使用网站搜索查找企业或行业。每页将原文事实与本站试做建议分开。\n\n`;
  for(const type of types){
    catalog+=`## ${type}\n\n| 案例 | 行业 / 任务 | 来源日期 |\n| --- | --- | --- |\n`;
    for(const c of data.cases.filter(c=>c.type===type)) catalog+=`| [${c.title}](/cases/public/${c.id}) | ${c.category} | ${data.sources[c.sourceId].publishedAt??'未标注'} |\n`;
    catalog+='\n';
  }
  catalog+='## 如何使用\n\n先选相近任务，核对原始报道，再用你获授权的材料验证。企业报道是公开陈述，官方演示是教学示例，第三方测试受样本与版本限制；三者都不能直接替代自己的验收。\n\n[返回完整案例库](/cases/) · [蓝皮书案例图谱](/bluebook/part-3/09-public-case-atlas) · [离线案例附录](/bluebook/appendices/public-case-notes)\n';
  out.set('docs/cases/public/index.md',catalog);
  let appendix=meta('V2.1 公开案例阅读札记','13 条公开来源的事实摘要、证据边界与试做建议。',urls,data.version)+'# V2.1 公开案例阅读札记\n\n本附录与在线案例页由同一份来源登记生成。下列企业实践均为媒体报道中的陈述，未经本站独立审计；演示与测试单独标注。试做步骤是本站建议，不是对客户内部细节的推断。历史 32 条候选记录的发布门不因本次收录自动改变。\n\n';
  for(const c of data.cases){
    const s=data.sources[c.sourceId];
    out.set(`docs/cases/public/${c.id}.md`,meta(c.title,c.reportedFacts,[s.url],c.accessedAt)+`# ${c.title}\n\n`+caseBody(c,s)+'\n[返回公开案例目录](/cases/public/) · [完整案例库](/cases/)\n');
    appendix+=`## ${c.title}\n\n`+caseBody(c,s)+'\n';
  }
  out.set('docs/bluebook/appendices/public-case-notes.md',appendix);
  return out;
}
export async function main(check=false) {
  const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
  const data=JSON.parse(await readFile(resolve(root,'docs/cases/data/public-cases.json'),'utf8'));
  const errors=validatePublicCases(data);
  if(errors.length) throw new Error(errors.join('\n'));
  const pages=generatePublicPages(data);
  for(const [path,content] of pages){
    const target=resolve(root,path);
    if(check){if(await readFile(target,'utf8').catch(()=>null)!==content)throw new Error(`生成页不同步：${path}`);}
    else{await mkdir(dirname(target),{recursive:true});await writeFile(target,content);}
  }
  for(const name of await readdir(resolve(root,'docs/cases/public'))){
    if(name.endsWith('.md')&&!pages.has(`docs/cases/public/${name}`))throw new Error(`案例目录有未登记页面：${name}`);
  }
  console.log(`${check?'已检查':'已生成'} ${data.cases.length} 条案例与 PDF 附录`);
}
if(process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url) await main(process.argv.includes('--check'));
