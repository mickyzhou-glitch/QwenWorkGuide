import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec=promisify(execFile);
test('PDF release gate rejects edited source and changed PDF bytes',async t=>{
 const root=await mkdtemp(resolve(tmpdir(),'qwg-pdf-sync-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const release=JSON.parse(await readFile(new URL('../docs/bluebook/releases/v2.1-pdf.json',import.meta.url),'utf8'));
 const paths=['scripts/check-bluebook-pdf.mjs','docs/bluebook/releases/v2.1-pdf.json',release.pdf,...Object.keys(release.sources)];
 for(const path of paths){await mkdir(dirname(resolve(root,path)),{recursive:true});await copyFile(new URL('../'+path,import.meta.url),resolve(root,path));}
 const check=()=>exec(process.execPath,[resolve(root,'scripts/check-bluebook-pdf.mjs')]);
 assert.match((await check()).stdout,/同步/);
 const sourcePath=Object.keys(release.sources).find(p=>p.endsWith('executive-summary.md'));
 const source=await readFile(resolve(root,sourcePath),'utf8');
 await writeFile(resolve(root,sourcePath),source+'\nChanged source\n');
 await assert.rejects(check(),/需重新导出/);
 await writeFile(resolve(root,sourcePath),source);
 await writeFile(resolve(root,release.pdf),'%PDF-1.4 altered');
 await assert.rejects(check(),/PDF 与发布摘要不一致/);
});
