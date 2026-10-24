import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifestPath='scripts/bluebook-v21-manifest.json';
const releasePath='docs/bluebook/releases/v2.1-pdf.json';
const pdfPath='docs/public/downloads/qwenwork-bluebook-v2.1.pdf';
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const manifest=JSON.parse(await readFile(resolve(root,manifestPath),'utf8'));
const inputs=[manifestPath,'scripts/build-bluebook-print.mjs','docs/.vitepress/theme/print.css',...manifest.items.map(i=>i.path)];
const sources=Object.fromEntries(await Promise.all(inputs.map(async p=>[p,hash(await readFile(resolve(root,p)))])));
if(process.argv[2]==='--snapshot') {
 await writeFile(process.argv[3],JSON.stringify(sources,null,2)+'\n');
} else if(process.argv[2]==='--capture') {
 const snapshot=JSON.parse(await readFile(process.argv[3],'utf8'));
 if(JSON.stringify(snapshot)!==JSON.stringify(sources)) throw new Error('导出期间正文已改变，请重新导出 PDF');
 const pdf=await readFile(resolve(root,pdfPath));
 if(!pdf.subarray(0,5).equals(Buffer.from('%PDF-')))throw new Error('不是有效 PDF 文件');
 await writeFile(resolve(root,releasePath),JSON.stringify({version:manifest.version,publishedAt:manifest.publishedAt,pdf:pdfPath,sha256:hash(pdf),sources},null,2)+'\n');
 console.log('已记录 V2.1 PDF 与源文档摘要');
} else {
 const release=JSON.parse(await readFile(resolve(root,releasePath),'utf8'));
 if(release.version!==manifest.version || release.publishedAt!==manifest.publishedAt || release.pdf!==pdfPath || JSON.stringify(release.sources)!==JSON.stringify(sources)) throw new Error('蓝皮书正文或打印配置有修改，需重新导出 V2.1 PDF');
 if(release.sha256!==hash(await readFile(resolve(root,pdfPath)))) throw new Error('PDF 与发布摘要不一致');
 console.log('V2.1 PDF 与全部源文档同步');
}
