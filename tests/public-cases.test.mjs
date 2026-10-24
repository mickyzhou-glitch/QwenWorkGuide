import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validatePublicCases, generatePublicPages } from '../scripts/generate-public-cases.mjs';
const data=JSON.parse(await readFile(new URL('../docs/cases/data/public-cases.json',import.meta.url),'utf8'));
test('public cases distinguish 7 reported practices, 1 test and 5 demos with locatable sources',()=>{
 assert.deepEqual(validatePublicCases(data),[]);
 assert.equal(data.cases.length,13);
 for(const [type,count] of [['企业实践报道',7],['第三方实测',1],['官方场景演示',5]]) assert.equal(data.cases.filter(c=>c.type===type).length,count);
 const duplicate=structuredClone(data); duplicate.cases.push({...duplicate.cases[0],id:'another-id'});
 assert.ok(validatePublicCases(duplicate).some(e=>e.includes('重复计数')));
 const missing=structuredClone(data); missing.cases[0].sourceId='unknown';
 assert.ok(validatePublicCases(missing).some(e=>e.includes('来源不存在')));
 const impossible=structuredClone(data); impossible.cases[0].accessedAt='2026-01-01';
 assert.ok(validatePublicCases(impossible).some(e=>e.includes('日期无效')));
});
test('web and PDF appendix are generated from the same case evidence and retain missing publication dates',async()=>{
 const pages=generatePublicPages(data), appendix=pages.get('docs/bluebook/appendices/public-case-notes.md');
 for(const c of data.cases){
  const page=pages.get(`docs/cases/public/${c.id}.md`);
  for(const statement of [c.reportedFacts,c.limitations,c.locator,c.acceptance]) {assert.ok(page.includes(statement));assert.ok(appendix.includes(statement));}
  assert.match(page,/本站编写的复现建议/);
  if(data.sources[c.sourceId].publishedAt===null) assert.match(page,/发布日期：页面未标注/);
 }
 for(const [path,content] of pages) assert.equal(await readFile(new URL('../'+path,import.meta.url),'utf8'),content);
 const manifest=JSON.parse(await readFile(new URL('../scripts/bluebook-v21-manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.version,'V2.1');
 assert.equal(manifest.items.filter(i=>i.kind==='chapter').length,13);
 assert.ok(manifest.items.some(i=>i.path==='docs/bluebook/appendices/public-case-notes.md'));
});
