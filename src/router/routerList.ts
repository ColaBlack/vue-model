import type { RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/common/loginPage.vue'
import RegisterPage from '@/pages/common/registerPage.vue'
import roleEnums from '@/access/roleEnums'
import NoAuthPage from '@/pages/common/noAuthPage.vue'
import UserPage from '@/pages/admin/userPage.vue'
import NotFoundPage from '@/pages/common/notFoundPage.vue'
import WelcomePage from '@/pages/welcomePage.vue'

export const routerList: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '主页',
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
  },
  {
    path: '/admin/user',
    name: '用户管理',
    component: UserPage,
    meta: {
      access: roleEnums.ADMIN,
      hideInMenu: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      access: roleEnums.PUBLIC,
      hideInMenu: true
    }
  }
]
export default routerList
