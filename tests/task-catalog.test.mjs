import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { categories, filterTasks, tasks } from '../docs/.vitepress/data/tasks.mjs'

test('task search supports Chinese, case-insensitive English and combined terms', () => {
  assert.deepEqual(filterTasks(' 会议 ').map(task => task.id), ['meeting-notes'])
  assert.deepEqual(filterTasks(' EXCEL 数据 ').map(task => task.id), ['data-analysis'])
  assert.deepEqual(filterTasks('PpT').map(task => task.id), ['presentation'])
  assert.deepEqual(filterTasks('数据库').map(task => task.id), ['team-workspace'])
})

test('category and query intersect; reset restores every task', () => {
  assert.equal(filterTasks('Excel', '日常办公').length, 0)
  assert.equal(filterTasks('不存在的任务').length, 0)
  for (const category of categories.slice(1)) assert.ok(filterTasks('', category).every(task => task.category === category))
  assert.deepEqual(filterTasks('', '全部'), tasks)
})

test('every task leads to a distinct, complete practical guide', async () => {
  assert.equal(new Set(tasks.map(task => task.link)).size, tasks.length)
  for (const task of tasks) {
    const source = await readFile(new URL(`../docs${task.link}.md`, import.meta.url), 'utf8')
    assert.ok(source.includes('```text'), `${task.id} must have a reusable prompt`)
    assert.match(source, /检查|验证/, `${task.id} must explain acceptance`)
    assert.ok(source.includes(task.title), `${task.id} title must match the destination`)
  }
})
