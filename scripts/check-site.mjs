import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesUnder(resolve(directory, entry.name)) : [resolve(directory, entry.name)]))
  return nested.flat()
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

// Inspect the rendered site: Markdown-only checks miss raw HTML and Vue links.
export function checkSiteLinks(documents, assets, base) {
  if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('base must start and end with /')
  const failures = []
  const origin = 'https://site.invalid'
  for (const [file, html] of documents) {
    const pageUrl = new URL(base + file.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''), origin)
    for (const match of html.matchAll(/<a\b[^>]*?\bhref=(?:"([^"]*)"|'([^']*)')/g)) {
      const href = decodeEntities(match[1] ?? match[2])
      if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue
      let url, pathname, hash
      try {
        url = new URL(href, pageUrl)
        pathname = decodeURIComponent(url.pathname)
        hash = decodeURIComponent(url.hash.slice(1))
      } catch {
        failures.push(`${file}: invalid URL ${href}`)
        continue
      }
      if (!pathname.startsWith(base)) {
        failures.push(`${file}: link escapes deployment base ${href}`)
        continue
      }
      const target = pathname.slice(base.length)
      const candidates = target.endsWith('/') || !target
        ? [target + 'index.html']
        : [target, target + '.html', target + '/index.html']
      const found = candidates.find(candidate => assets.has(candidate))
      if (!found) {
        failures.push(`${file}: missing target ${href}`)
        continue
      }
      if (hash && documents.has(found)) {
        const ids = [...documents.get(found).matchAll(/\bid="([^"]+)"/g)].map(item => decodeEntities(item[1]))
        if (!ids.includes(hash)) failures.push(`${file}: missing anchor ${href}`)
      }
    }
  }
  return [...new Set(failures)]
}

async function main() {
  const directory = resolve(process.argv[2] ?? 'docs/.vitepress/dist')
  const base = process.argv[3] ?? (process.env.CF_PAGES === '1' ? '/' : '/QwenWorkGuide/')
  const files = await filesUnder(directory)
  const assets = new Set(files.map(file => relative(directory, file).split('\\').join('/')))
  const documents = new Map(await Promise.all(files.filter(file => file.endsWith('.html')).map(async file => [relative(directory, file).split('\\').join('/'), await readFile(file, 'utf8')])))
  if (!documents.has('index.html')) throw new Error('Missing built index.html')
  const failures = checkSiteLinks(documents, assets, base)
  if (failures.length) {
    console.error(failures.join('\n'))
    process.exitCode = 1
  } else console.log(`站点链接与锚点检查通过：${documents.size} 页，部署路径 ${base}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}
