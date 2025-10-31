<!--
  用户下拉菜单组件
  显示用户头像和下拉菜单，提供注销功能
  如果用户未登录，则显示登录按钮
-->
<template>
  <div class="user-dropdown">
    <!-- 已登录用户 - 显示头像和下拉菜单 -->
    <a-dropdown v-if="loginUser.id">
      <a-avatar
        :image-url="loginUser.userAvatar"
        auto-fix-font-size
        class="avatar"
      />
      <template #content>
        <a-doption @click="handleLogout">注销</a-doption>
      </template>
    </a-dropdown>
    
    <!-- 未登录用户 - 显示登录按钮 -->
    <a-button v-else type="primary" href="/user/login">登录</a-button>
  </div>
</template>

<script setup lang="ts">
/**
 * Props 定义
 */
interface Props {
  /** 当前登录用户信息 */
  loginUser: API.LoginUserVO
}

defineProps<Props>()

/**
 * Emits 定义
 */
interface Emits {
  /** 注销事件 */
  (e: 'logout'): void
}

const emit = defineEmits<Emits>()

/**
 * 处理注销操作
 * 触发父组件的注销事件
 */
const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.user-dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  cursor: pointer;
}
</style>

