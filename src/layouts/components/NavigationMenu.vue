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

<style scoped>
.logo {
  height: 32px;
  margin: auto auto;
}

.title {
  font-size: 16px;
  margin: 0;
  padding: 0;
  line-height: 16px;
  color: #000000;
  text-align: center;
  font-family: '楷体', 'Times New Roman', sans-serif;
}
</style>

