<!--
  导航菜单组件
  显示应用的主导航菜单，根据用户权限过滤可见的路由项
-->
<template>
  <a-menu 
    mode="horizontal" 
    :selected-keys="selectedKeys" 
    @menu-item-click="handleMenuClick"
  >
    <!-- Logo 和标题 -->
    <a-menu-item 
      key="0" 
      :style="{ padding: 0, marginRight: '38px' }" 
      disabled
    >
      <img src="../../assets/logo.png" alt="logo" class="logo" />
      <p class="title">AI</p>
    </a-menu-item>
    
    <!-- 动态路由菜单项 -->
    <a-menu-item 
      v-for="item in visibleRoutes" 
      :key="item.path"
    >
      {{ item.name }}
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts">
import { type RouteRecordRaw } from 'vue-router'

/**
 * Props 定义
 */
interface Props {
  /** 当前选中的菜单项 key 数组 */
  selectedKeys: string[]
  /** 可见的路由列表（已根据权限过滤） */
  visibleRoutes: RouteRecordRaw[]
}

defineProps<Props>()

/**
 * Emits 定义
 */
interface Emits {
  /** 菜单项点击事件 */
  (e: 'menu-click', key: string): void
}

const emit = defineEmits<Emits>()

/**
 * 处理菜单项点击
 * @param key - 被点击的菜单项的 key（路由路径）
 */
const handleMenuClick = (key: string) => {
  emit('menu-click', key)
}
</script>

<style scoped lang="less">
:deep(.arco-menu) {
  background: transparent;
  border-bottom: none;
}

:deep(.arco-menu-horizontal .arco-menu-item) {
  font-weight: 500;
  color: #4e5969;
  transition: all 0.3s;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  &.arco-menu-selected {
    color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    
    &::after {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      height: 3px;
    }
  }
}

.logo {
  height: 36px;
  margin: auto 12px auto 0;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
}

.title {
  font-size: 20px;
  margin: 0;
  padding: 0;
  line-height: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>

