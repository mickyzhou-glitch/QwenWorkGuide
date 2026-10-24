<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { categories, filterTasks } from '../../data/tasks.mjs'

const query = ref('')
const category = ref('全部')
const matches = computed(() => filterTasks(query.value, category.value))
function reset() { query.value = ''; category.value = '全部' }
</script>

<template>
  <section class="task-explorer" aria-label="按任务找方法">
    <div class="task-toolbar">
      <label class="task-search">查找任务
        <input v-model="query" type="search" placeholder="试试：会议、Excel、PPT、电商" autocomplete="off" />
      </label>
      <div class="task-filters" role="group" aria-label="任务分类">
        <button v-for="item in categories" :key="item" type="button" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
      </div>
    </div>
    <p class="task-count" role="status" aria-live="polite">找到 {{ matches.length }} 个任务 · 每个都有步骤、指令和检查方法</p>
    <div v-if="matches.length" class="task-grid">
      <a v-for="task in matches" :key="task.id" :href="withBase(task.link)" class="task-card">
        <div class="task-card-meta"><span>{{ task.number }} / {{ task.category }}</span><span aria-hidden="true">↗</span></div>
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <span class="task-format">{{ task.format }}</span>
      </a>
    </div>
    <div v-else class="task-empty">
      <p>没有找到匹配的任务。换个关键词，或查看全部任务。</p>
      <button type="button" @click="reset">清除筛选</button>
    </div>
  </section>
</template>
