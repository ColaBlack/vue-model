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

<style scoped lang="less">
.user-dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar {
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    border-color: #667eea;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

:deep(.arco-btn-primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 500;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

:deep(.arco-dropdown) {
  :deep(.arco-dropdown-option) {
    transition: all 0.3s;
    
    &:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }
  }
}
</style>

