<template>
  <div id="header">
    <a-row align="center" :wrap="false">
      <a-col flex="auto">
        <a-menu mode="horizontal" :selected-keys="selectedKeys" @menu-item-click="handleClick">
          <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
            <img src="../../assets/logo.png" alt="logo" class="logo" />
            <p class="title">茶AI</p>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">{{ item.name }}</a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="64px">
        <div v-if="userStore.loginUser.id">
          <a-dropdown v-if="userStore.loginUser.id">
            <a-avatar :image-url="userStore.loginUser.userAvatar"
                      auto-fix-font-size class="avatar" />
            <template #content>
              <a-doption @click="logout">注销</a-doption>
            </template>
          </a-dropdown>
        </div>
        <a-button v-else type="primary" href="/user/login">登录</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { type RouteRecordRaw, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'
import CheckAccess from '@/access/checkAccess'
import { Message } from '@arco-design/web-vue'
import { userLogoutUsingPost } from '@/api/userController'
import roleEnums from '@/access/roleEnums'

const userStore = useUserStore()

const router = useRouter()

const selectedKeys = ref([router.currentRoute.value.path])

// 路由跳转时，自动更新选中的菜单项
router.afterEach((to) => {
  selectedKeys.value = [to.path]
})

const handleClick = (key: string) => {
  router.push({ path: key })
}

const routerList = ref<RouteRecordRaw[]>([])

onMounted(async () => {
  const importedRouterList = await import('../../router/routerList')
  routerList.value = importedRouterList.default
})

// 计算属性，基于 routerList 计算可见路由
const visibleRoutes = computed(() => {
  return routerList.value.filter((item: RouteRecordRaw) => {
    // 只显示有权限的没隐藏的菜单
    return item.meta?.hideInMenu !== true && CheckAccess(userStore.loginUser, item.meta?.access as string)
  })
})

const logout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 200) {
    userStore.setLoginUser({ userName: '未登录', userRole: roleEnums.PUBLIC })
    Message.success('注销成功')
    await router.push('/user/login')
  } else {
    Message.error('注销失败')
  }
}
</script>

<style scoped>
#header .logo {
  height: 32px;
  margin: auto auto;
}

#header .title {
  font-size: 16px;
  margin: 0;
  padding: 0;
  line-height: 16px;
  color: #000000;
  text-align: center;
  font-family: '楷体', 'Times New Roman', sans-serif;
}

#header .avatar {
  cursor: pointer;
}
</style>
