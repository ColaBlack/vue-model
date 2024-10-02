import { useUserStore } from '@/store/user'
import roleEnums from '@/access/roleEnums'
import checkAccess from '@/access/checkAccess'
import router from '@/router'

router.beforeEach(async (to, _, next) => {
    // 获取当前用户信息
    const userStore = useUserStore()
    let loginUser = userStore.loginUser
    const neededRoles = to.meta.access ?? roleEnums.PUBLIC

    // 如果用户信息未加载，则加载用户信息
    if (!loginUser || !loginUser.userRole) {
      await userStore.fetchLoginUser()
      loginUser = userStore.loginUser
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
      if (!checkAccess(loginUser, neededRoles as string)) {
        next('/403')
      }
    }
    next()
  }
)