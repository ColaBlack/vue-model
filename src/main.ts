import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './router/index'

import ArcoVue from '@arco-design/web-vue'
import '@arco-themes/vue-taolu-publishing-platform/css/arco.css'

import '@/access'

const app = createApp(App)

app.use(createPinia())
app.use(ArcoVue)
app.use(router)
app.mount('#app')
