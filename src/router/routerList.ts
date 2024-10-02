import type { RouteRecordRaw } from 'vue-router'
import WelcomePage from '@/pages/common/welcomePage.vue'
import LoginPage from '@/pages/common/loginPage.vue'
import RegisterPage from '@/pages/common/registerPage.vue'
import roleEnums from '@/access/roleEnums'
import NoAuthPage from '@/pages/common/noAuthPage.vue'
import UserPage from '@/pages/admin/userPage.vue'
import userAnswerPage from '@/pages/admin/userAnswerPage.vue'
import bankPage from '@/pages/admin/bankPage.vue'
import questionPage from '@/pages/admin/questionPage.vue'
import scoringResultPage from '@/pages/admin/scoringResultPage.vue'
import NotFoundPage from '@/pages/common/notFoundPage.vue'

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
    path: '/admin/bank',
    name: '应用管理',
    component: bankPage,
    meta: {
      access: roleEnums.ADMIN,
      hideInMenu: false
    }
  },
  {
    path: '/admin/question',
    name: '题目管理',
    component: questionPage,
    meta: {
      access: roleEnums.ADMIN,
      hideInMenu: false
    }
  },
  {
    path: '/admin/scoring_result',
    name: '评分管理',
    component: scoringResultPage,
    meta: {
      access: roleEnums.ADMIN,
      hideInMenu: false
    }
  },
  {
    path: '/admin/user_answer',
    name: '回答管理',
    component: userAnswerPage,
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
