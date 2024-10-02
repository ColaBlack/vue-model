import { createRouter, createWebHistory } from 'vue-router'
import routerList from '@/router/routerList'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerList
})

export default router