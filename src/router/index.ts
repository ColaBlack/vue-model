import { createRouter, createWebHistory } from 'vue-router'
import routerList from '@/router/router'
import { userStore } from '@/store/user'
import roleEnums from '@/access/roleEnums'
import checkAccess from '@/access/checkAccess'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerList
})

export default router


router.beforeEach(async (to, _, next) => {
    // 获取当前用户信息
    let loginUser = userStore().loginUser
    const neededRoles = to.meta.access ?? roleEnums.PUBLIC

    // 如果用户信息未加载，则加载用户信息
    if (!loginUser || !loginUser.userRole) {
      await userStore().fetchLoginUser()
      loginUser = userStore().loginUser
    }

    // 如果用户访问的是需要登录的页面
    if (neededRoles !== roleEnums.PUBLIC) {
      // 并且用户没有登录
      if (!loginUser || !loginUser.userRole || loginUser.userRole === roleEnums.PUBLIC) {
        // 跳转到登录页面
        next('/user/login?redirect=' + to.fullPath)
        return
      }
      // 如果用户登录了，但是没有权限访问该页面
      if (checkAccess(loginUser.userRole, neededRoles as string)) {
        next('/403')
      }
    }
    next()
  }
)