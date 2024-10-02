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
          {{ userStore.loginUser.userName ?? '无昵称' }}
        </div>
        <a-button v-else type="primary" href="/user/login">登录</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { type RouteRecordRaw, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'
import CheckAccess from '@/access/checkAccess'

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

const visibleRoutes = ref<RouteRecordRaw[]>([])

onMounted(async () => {
  const routerList = await import('../../router/routerList')
  visibleRoutes.value = routerList.default.filter((item: RouteRecordRaw) => {
    // 只显示有权限的没隐藏的菜单
    return item.meta?.hideInMenu !== true && CheckAccess(userStore.loginUser, item.meta?.access as string)
  })
})
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
</style>
