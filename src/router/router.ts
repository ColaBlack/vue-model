import type { RouteRecordRaw } from 'vue-router'
import WelcomePage from '@/pages/welcomePage.vue'

import roleEnums from '@/access/roleEnums'
import LoginPage from '@/pages/common/loginPage.vue'
import RegisterPage from '@/pages/common/registerPage.vue'
import NoAuthPage from '@/pages/common/noAuthPage.vue'

const routerList: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '欢迎',
    component: WelcomePage,
    meta: {
      access: roleEnums.PUBLIC,
      hideInMenu: false
    }
  },
  {
    path: '/user/login',
    name: '登录',
    component: LoginPage,
    meta: {
      access: roleEnums.PUBLIC,
      hideInMenu: true
    }
  },
  {
    path: '/user/register',
    name: '注册',
    component: RegisterPage,
    meta: {
      access: roleEnums.PUBLIC,
      hideInMenu: true
    }
  },
  {
    path: '/403',
    name: '无权限',
    component: NoAuthPage,
    meta: {
      access: roleEnums.PUBLIC,
      hideInMenu: true
    }
  }
]
export default routerList
