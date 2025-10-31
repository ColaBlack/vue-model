<!--
  全局顶部导航栏组件
  包含导航菜单和用户信息/操作区域
  自动根据路由变化更新选中状态，根据用户权限过滤菜单项
-->
<template>
  <div id="header">
    <a-row align="center" :wrap="false">
      <!-- 左侧导航菜单 -->
      <a-col flex="auto">
        <NavigationMenu
          :selected-keys="selectedKeys"
          :visible-routes="visibleRoutes"
          @menu-click="handleMenuClick"
        />
      </a-col>
      
      <!-- 右侧用户区域 -->
      <a-col flex="64px" style="justify-content: center;">
        <UserDropdown
          :login-user="userStore.loginUser"
          @logout="handleLogout"
        />
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
import roleEnums from '@/access/roleEnums'
import { userLogout } from '@/api/userController'
import NavigationMenu from './components/NavigationMenu.vue'
import UserDropdown from './components/UserDropdown.vue'

// ==================== 状态管理 ====================

/** 用户状态管理 */
const userStore = useUserStore()

/** 路由实例 */
const router = useRouter()

/** 当前选中的菜单项 key 数组 */
const selectedKeys = ref([
  router.currentRoute.value.path.startsWith('/ai/chat') 
    ? '/ai/chat/:chatId?' 
    : router.currentRoute.value.path
])

/** 路由列表 */
const routerList = ref<RouteRecordRaw[]>([])

// ==================== 生命周期 ====================

/**
 * 组件挂载时加载路由列表
 */
onMounted(async () => {
  const importedRouterList = await import('../router/routerList')
  routerList.value = importedRouterList.default
})

// ==================== 路由监听 ====================

/**
 * 路由跳转后自动更新选中的菜单项
 * 确保菜单高亮状态与当前路由保持同步
 */
router.afterEach((to) => {
  // 特殊处理：如果是 AI 聊天页面，统一选中 /ai/chat/:chatId? 路由
  if (to.path.startsWith('/ai/chat')) {
    selectedKeys.value = ['/ai/chat/:chatId?']
  } else {
    selectedKeys.value = [to.path]
  }
})

// ==================== 计算属性 ====================

/**
 * 可见的路由列表
 * 根据用户权限和菜单配置过滤路由
 * 只显示有权限且未隐藏的菜单项
 */
const visibleRoutes = computed(() => {
  return routerList.value.filter((item: RouteRecordRaw) => {
    return (
      item.meta?.hideInMenu !== true &&
      CheckAccess(userStore.loginUser, item.meta?.access as string)
    )
  })
})

// ==================== 事件处理 ====================

/**
 * 处理菜单点击事件
 * 特殊处理 AI 聊天路由，其他路由直接跳转
 * @param key - 被点击的菜单项 key（路由路径）
 */
const handleMenuClick = (key: string) => {
  if (key.startsWith('/ai/chat')) {
    // AI 聊天路由特殊处理，跳转到基础路径
    router.push({ path: '/ai/chat' })
  } else {
    router.push({ path: key })
  }
}

/**
 * 处理用户注销
 * 调用注销接口，清除用户状态，跳转到登录页
 */
const handleLogout = async () => {
  const res = await userLogout()
  if (res.data.code === 200) {
    // 清除用户登录状态
    userStore.setLoginUser({ userName: '未登录', userRole: roleEnums.PUBLIC })
    Message.success('注销成功')
    await router.push('/user/login')
  } else {
    Message.error('注销失败')
  }
}
</script>

<style scoped lang="less">
/* 全局顶部导航栏容器样式 */
#header {
  background: white;
  border-bottom: 1px solid #e5e6eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  overflow: hidden;

  :deep(.arco-row) {
    width: 100%;
    height: 64px;
  }
  
  :deep(.arco-col) {
    height: 64px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
}
</style>
