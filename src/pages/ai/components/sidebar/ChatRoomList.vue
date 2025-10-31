<!--
  聊天室列表组件
  
  功能：
  - 显示聊天室列表
  - 显示加载状态（Spin加载动画）
  - 显示空状态（无历史记录时）
  - 处理列表项的点击事件
  
  使用示例：
  <ChatRoomList
    :rooms="chatRoomList"
    :current-chat-id="activeChatId"
    :loading="isLoading"
    @switch="handleSwitchRoom"
  />
-->
<template>
  <div class="chat-room-list">
    <!-- 加载状态包装器 -->
    <a-spin :loading="loading" style="width: 100%">
      <!-- 空状态：当列表为空时显示 -->
      <div v-if="rooms.length === 0" class="empty-state">
        <a-empty description="暂无历史记录">
          <template #image>
            <icon-folder />
          </template>
        </a-empty>
      </div>

      <!-- 聊天室列表：循环渲染每个聊天室项 -->
      <div v-else class="list-container">
        <ChatRoomItem
          v-for="room in rooms"
          :key="room.chatroom"
          :room="room"
          :is-active="room.chatroom === currentChatId"
          @click="handleSwitch"
        />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { IconFolder } from '@arco-design/web-vue/es/icon'
import ChatRoomItem from './ChatRoomItem.vue'

/**
 * 组件属性类型定义
 */
interface Props {
  /** 聊天室列表数据 */
  rooms: API.ChatRoomVO[]
  /** 当前激活的聊天室ID（用于高亮显示） */
  currentChatId: string
  /** 是否正在加载数据 */
  loading?: boolean
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 切换聊天室事件，传递目标聊天室ID */
  (e: 'switch', chatroomId: string): void
}

// 接收属性（使用 withDefaults 设置默认值）
withDefaults(defineProps<Props>(), {
  loading: false
})

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 处理聊天室切换
 * 当用户点击某个聊天室项时触发
 * 
 * @param chatroomId 目标聊天室ID
 */
const handleSwitch = (chatroomId: string) => {
  emit('switch', chatroomId)
}
</script>

<style scoped lang="less">
/**
 * 聊天室列表容器
 * 固定高度，支持滚动
 */
.chat-room-list {
  height: calc(100% - 100px); // 减去头部高度
  overflow-y: auto; // 垂直滚动
  padding: 8px;

  /**
   * 自定义滚动条样式
   * 使用细窄的滚动条，不占用太多空间
   */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c9cdd4;
    border-radius: 2px;

    &:hover {
      background: #a0a4a8;
    }
  }
}

/**
 * 空状态容器
 * 居中显示，提供足够的内边距
 */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

/**
 * 列表容器
 * 包裹所有聊天室项
 */
.list-container {
  width: 100%;
}
</style>

