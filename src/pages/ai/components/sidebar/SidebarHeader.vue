<!--
  侧边栏头部组件
  
  功能：
  - 显示"聊天记录"标题
  - 提供刷新按钮，用于重新加载聊天室列表
  - 提供新建聊天按钮，用于创建新的聊天会话
  
  使用示例：
  <SidebarHeader 
    :loading="isLoading"
    @refresh="handleRefresh"
    @create="handleCreate"
  />
-->
<template>
  <div class="sidebar-header">
    <!-- 标题行：包含标题文字和刷新按钮 -->
    <div class="header-title">
      <h3>聊天记录</h3>
      <!-- 刷新按钮：点击重新加载聊天室列表 -->
      <a-button 
        type="text" 
        size="small" 
        :loading="loading"
        @click="handleRefresh"
        title="刷新列表"
      >
        <template #icon>
          <icon-refresh />
        </template>
      </a-button>
    </div>
    
    <!-- 新建聊天按钮：创建新的聊天会话 -->
    <a-button 
      type="primary" 
      size="small" 
      @click="handleCreate"
    >
      <template #icon>
        <icon-plus />
      </template>
      新建聊天
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconRefresh } from '@arco-design/web-vue/es/icon'

/**
 * 组件属性类型定义
 */
interface Props {
  /** 是否正在加载中（用于刷新按钮的loading状态） */
  loading?: boolean
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 刷新列表事件 */
  (e: 'refresh'): void
  /** 创建新聊天事件 */
  (e: 'create'): void
}

// 接收属性（使用 withDefaults 设置默认值）
withDefaults(defineProps<Props>(), {
  loading: false
})

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 处理刷新按钮点击
 * 触发 refresh 事件通知父组件重新加载数据
 */
const handleRefresh = () => {
  emit('refresh')
}

/**
 * 处理新建聊天按钮点击
 * 触发 create 事件通知父组件创建新会话
 */
const handleCreate = () => {
  emit('create')
}
</script>

<style scoped lang="less">
/**
 * 侧边栏头部容器
 * 使用 flex 布局垂直排列标题和按钮
 */
.sidebar-header {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px; // 子元素之间的间距
}

/**
 * 标题行容器
 * 标题文字和刷新按钮水平排列，两端对齐
 */
.header-title {
  display: flex;
  justify-content: space-between; // 两端对齐
  align-items: center; // 垂直居中

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
  }
}
</style>

