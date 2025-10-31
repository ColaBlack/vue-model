<!--
  左侧历史记录侧边栏组件
  功能：
  - 显示历史聊天室列表
  - 新建聊天
  - 刷新列表
  - 切换聊天室
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
    <!-- 折叠按钮（在展开状态显示） -->
    <div v-if="!collapsed" class="collapse-btn" @click="handleCollapseChange(true)">
      <icon-double-left />
    </div>

    <!-- 侧边栏头部 -->
    <div class="sider-header">
      <div class="sider-title">
        <h3>聊天记录</h3>
        <!-- 刷新按钮 -->
        <a-button type="text" size="small" @click="handleRefresh" :loading="loading">
          <template #icon>
            <icon-refresh />
          </template>
        </a-button>
      </div>
      <!-- 新建聊天按钮 -->
      <a-button type="primary" size="small" @click="handleCreate">
        <template #icon>
          <icon-plus />
        </template>
        新建聊天
      </a-button>
    </div>

    <a-divider :margin="0" />

    <!-- 聊天室列表 -->
    <div class="chat-list">
      <a-spin :loading="loading" style="width: 100%">
        <!-- 空状态 -->
        <div v-if="chatRoomList.length === 0" class="empty-history">
          <a-empty description="暂无历史记录" />
        </div>

        <!-- 聊天室列表项 -->
        <div
          v-for="room in chatRoomList"
          :key="room.chatroom"
          class="chat-item"
          :class="{ active: room.chatroom === currentChatId }"
          @click="handleSwitch(room.chatroom)"
        >
          <div class="chat-item-content">
            <div class="chat-item-title">
              {{ room.title || '未命名对话' }}
            </div>
            <div class="chat-item-time">
              {{ formatTime(room.createTime) }}
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { IconPlus, IconRefresh, IconDoubleLeft } from '@arco-design/web-vue/es/icon'

/**
 * 组件属性定义
 */
interface Props {
  chatRoomList: API.ChatRoomVO[] // 聊天室列表
  currentChatId: string // 当前聊天室ID
  loading: boolean // 加载状态
  collapsed?: boolean // 是否折叠
}

/**
 * 组件事件定义
 */
interface Emits {
  (e: 'refresh'): void // 刷新列表
  (e: 'create'): void // 创建新聊天
  (e: 'switch', chatId: string): void // 切换聊天室
  (e: 'update:collapsed', value: boolean): void // 更新折叠状态（v-model）
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 处理折叠状态变化
 * @param value 新的折叠状态
 */
const handleCollapseChange = (value: boolean) => {
  emit('update:collapsed', value)
}

/**
 * 刷新列表
 */
const handleRefresh = () => {
  emit('refresh')
}

/**
 * 创建新聊天
 */
const handleCreate = () => {
  emit('create')
}

/**
 * 切换聊天室
 * @param chatId 聊天室ID
 */
const handleSwitch = (chatId: string | undefined) => {
  if (chatId && chatId !== props.currentChatId) {
    emit('switch', chatId)
  }
}

/**
 * 格式化聊天时间（智能相对时间显示）
 * @param timeStr 时间字符串
 * @returns 格式化后的时间文本
 */
const formatTime = (timeStr: string | undefined): string => {
  if (!timeStr) return ''

  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }

  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  }

  // 小于1天
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  }

  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  }

  // 显示具体日期
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  // 同年省略年份
  if (year === now.getFullYear()) {
    return `${month}-${day}`
  }

  return `${year}-${month}-${day}`
}
</script>

<style scoped lang="less">
// 侧边栏样式
.chat-sider {
  position: relative;
  background: #f7f8fa;
  border-right: 1px solid #e5e6eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); // 平滑过渡动画
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

// 折叠按钮（在侧边栏展开时显示）
.collapse-btn {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #e5e6eb;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4e5969;
  transition: all 0.2s;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #165dff;
    color: #ffffff;
    border-color: #165dff;
    right: -14px;
  }
}

// 侧边栏头部
.sider-header {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// 标题区域
.sider-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

// 聊天室列表容器
.chat-list {
  height: calc(100% - 100px);
  overflow-y: auto;
  padding: 8px;

  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c9cdd4;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0a4a8;
  }
}

// 空状态
.empty-history {
  padding: 40px 20px;
  text-align: center;
}

// 聊天室列表项
.chat-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #ffffff;
  border: 1px solid transparent;

  // 悬停效果
  &:hover {
    background: #f2f3f5;
    border-color: #e5e6eb;
  }

  // 活动状态（当前选中）
  &.active {
    background: #e8f3ff;
    border-color: #165dff;
  }
}

// 聊天室项内容
.chat-item-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

// 聊天室标题
.chat-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 聊天室时间
.chat-item-time {
  font-size: 12px;
  color: #86909c;
}
</style>

