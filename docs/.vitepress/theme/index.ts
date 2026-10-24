import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePage from './components/HomePage.vue'
import TaskExplorer from './components/TaskExplorer.vue'
import PageContext from './components/PageContext.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(PageContext) }),
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('TaskExplorer', TaskExplorer)
  }
}
