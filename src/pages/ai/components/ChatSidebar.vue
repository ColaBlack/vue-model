<!--
  左侧历史记录侧边栏组件（重构版）
  
  功能：
  - 显示历史聊天室列表
  - 新建聊天
  - 刷新列表
  - 切换聊天室
  - 支持折叠/展开
  
  架构：
  本组件作为容器，将功能拆分为三个子组件：
  - SidebarHeader: 头部（标题、刷新、新建按钮）
  - ChatRoomList: 聊天室列表（包含加载和空状态）
  - ChatRoomItem: 单个聊天室项（在 ChatRoomList 中使用）
  
  使用示例：
  <ChatSidebar
    v-model:collapsed="isCollapsed"
    :chat-room-list="rooms"
    :current-chat-id="currentId"
    :loading="isLoading"
    @refresh="loadRooms"
    @create="createNew"
    @switch="switchRoom"
  />
-->
<template>
  <a-layout-sider
    :width="280"
    :collapsed="collapsed"
    :collapsible="false"
    :collapsed-width="0"
    class="chat-sider"
    @collapse="handleCollapseChange"
  >
    <!-- 折叠按钮（在展开状态显示，固定在侧边栏右侧边缘） -->
    <div 
      v-if="!collapsed" 
      class="collapse-btn" 
      @click="handleCollapseChange(true)"
      title="折叠侧边栏"
    >
      <icon-double-left />
    </div>

    <!-- 侧边栏头部组件 -->
    <SidebarHeader
      :loading="loading"
      @refresh="handleRefresh"
      @create="handleCreate"
    />

    <!-- 分隔线 -->
    <a-divider :margin="0" />

    <!-- 聊天室列表组件 -->
    <ChatRoomList
      :rooms="chatRoomList"
      :current-chat-id="currentChatId"
      :loading="loading"
      @switch="handleSwitch"
    />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { IconDoubleLeft } from '@arco-design/web-vue/es/icon'
import SidebarHeader from './sidebar/SidebarHeader.vue'
import ChatRoomList from './sidebar/ChatRoomList.vue'

/**
 * 组件属性类型定义
 */
interface Props {
  /** 聊天室列表数据 */
  chatRoomList: API.ChatRoomVO[]
  /** 当前激活的聊天室ID */
  currentChatId: string
  /** 是否正在加载数据 */
  loading: boolean
  /** 是否折叠侧边栏（支持 v-model） */
  collapsed?: boolean
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 刷新列表事件 */
  (e: 'refresh'): void
  /** 创建新聊天事件 */
  (e: 'create'): void
  /** 切换聊天室事件，传递目标聊天室ID */
  (e: 'switch', chatId: string): void
  /** 更新折叠状态事件（v-model:collapsed） */
  (e: 'update:collapsed', value: boolean): void
}

// 接收属性（使用 withDefaults 设置默认值）
const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 处理折叠状态变化
 * 触发 update:collapsed 事件，实现 v-model 双向绑定
 * 
 * @param value 新的折叠状态（true=折叠, false=展开）
 */
const handleCollapseChange = (value: boolean) => {
  emit('update:collapsed', value)
}

/**
 * 处理刷新按钮点击
 * 触发 refresh 事件，由父组件重新加载聊天室列表
 */
const handleRefresh = () => {
  emit('refresh')
}

/**
 * 处理新建聊天按钮点击
 * 触发 create 事件，由父组件创建新的聊天会话
 */
const handleCreate = () => {
  emit('create')
}

/**
 * 处理聊天室切换
 * 只在聊天室ID有效且与当前ID不同时才触发切换
 * 
 * @param chatId 目标聊天室ID
 */
const handleSwitch = (chatId: string) => {
  // 避免重复切换到当前聊天室
  if (chatId && chatId !== props.currentChatId) {
    emit('switch', chatId)
  }
}
</script>

<style scoped lang="less">
/**
 * 侧边栏容器样式
 * 包含背景、边框、阴影和过渡动画
 */
.chat-sider {
  position: relative;
  background: #f7f8fa; // 浅灰色背景
  border-right: 1px solid #e5e6eb; // 右侧边框
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); // 平滑过渡动画（折叠/展开时使用）
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05); // 轻微阴影，增加层次感
}

/**
 * 折叠按钮样式
 * 固定在侧边栏右侧边缘，用于折叠侧边栏
 */
.collapse-btn {
  position: absolute;
  top: 50%; // 垂直居中
  right: -12px; // 向右突出，部分在侧边栏外
  transform: translateY(-50%); // 精确垂直居中
  width: 24px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #e5e6eb;
  border-radius: 0 8px 8px 0; // 右侧圆角
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4e5969;
  transition: all 0.2s ease;
  z-index: 10; // 确保在其他元素之上
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);

  /**
   * 悬停效果
   * 变为蓝色，并向右移动一点，提供交互反馈
   */
  &:hover {
    background: #165dff;
    color: #ffffff;
    border-color: #165dff;
    right: -14px; // 悬停时向右移动
  }
}
</style>

