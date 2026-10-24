import test from 'node:test'
import assert from 'node:assert/strict'
import { checkSiteLinks } from '../scripts/check-site.mjs'

test('detects raw HTML links that escape GitHub Pages base', () => {
  const documents = new Map([['index.html', '<a href="/tasks/">Tasks</a>'], ['tasks/index.html', '<h1 id="all">All</h1>']])
  assert.match(checkSiteLinks(documents, new Set(documents.keys()), '/QwenWorkGuide/')[0], /escapes/)
  assert.deepEqual(checkSiteLinks(documents, new Set(documents.keys()), '/'), [])
})

test('resolves clean URLs, relative links, encoded anchors, query strings and downloads', () => {
  const documents = new Map([
    ['index.html', '<a href="/QwenWorkGuide/tasks/report?q=one&amp;t=two#%E6%A3%80%E6%9F%A5">Report</a><a href="downloads/book.pdf">PDF</a>'],
    ['tasks/report.html', '<h2 id="检查">检查</h2><a href="../">Home</a><a href="https://example.com/a">External</a>'],
  ])
  assert.deepEqual(checkSiteLinks(documents, new Set([...documents.keys(), 'downloads/book.pdf']), '/QwenWorkGuide/'), [])
})

test('missing destinations and anchors fail separately', () => {
  const documents = new Map([['index.html', '<a href="/missing">Missing</a><a href="#unknown">Anchor</a>']])
  const failures = checkSiteLinks(documents, new Set(documents.keys()), '/')
  assert.equal(failures.length, 2)
  assert.match(failures[0], /missing target/)
  assert.match(failures[1], /missing anchor/)
})

test('historical routes with dots or an index suffix retain their own anchors', () => {
  const documents = new Map([
    ['index.html', '<a href="/releases/v2.0#release">Release</a><a href="/scenario-index#scenarios">Scenarios</a>'],
    ['releases/v2.0.html', '<h1 id="release">Release</h1><a href="#release">On this page</a>'],
    ['scenario-index.html', '<h1 id="scenarios">Scenarios</h1><a href="#scenarios">On this page</a>'],
  ])
  assert.deepEqual(checkSiteLinks(documents, new Set(documents.keys()), '/'), [])
})
