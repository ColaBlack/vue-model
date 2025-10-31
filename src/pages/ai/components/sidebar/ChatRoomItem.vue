<!--
  聊天室列表项组件
  
  功能：
  - 显示单个聊天室的信息（标题和创建时间）
  - 支持激活状态（当前选中）的视觉反馈
  - 提供点击交互，触发切换聊天室事件
  
  使用示例：
  <ChatRoomItem
    :room="chatRoom"
    :is-active="isCurrentRoom"
    @click="handleSwitch"
  />
-->
<template>
  <div 
    class="chat-room-item"
    :class="{ active: isActive }"
    @click="handleClick"
  >
    <div class="item-content">
      <!-- 聊天室标题：显示对话名称，如果为空则显示默认文本 -->
      <div class="item-title" :title="room.title || '未命名对话'">
        {{ room.title || '未命名对话' }}
      </div>
      
      <!-- 创建时间：使用相对时间格式化（如"5分钟前"） -->
      <div class="item-time">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatRelativeTime } from '@/pages/ai/utils/timeFormat'

/**
 * 组件属性类型定义
 */
interface Props {
  /** 聊天室数据对象 */
  room: API.ChatRoomVO
  /** 是否为当前激活（选中）的聊天室 */
  isActive?: boolean
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 点击聊天室项时触发，传递聊天室ID */
  (e: 'click', chatroomId: string): void
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  isActive: false
})

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 格式化后的时间
 * 将创建时间转换为相对时间格式（如"刚刚"、"5分钟前"、"2天前"等）
 */
const formattedTime = computed(() => {
  return formatRelativeTime(props.room.createTime)
})

/**
 * 处理点击事件
 * 如果聊天室有ID，则触发点击事件
 */
const handleClick = () => {
  if (props.room.chatroom) {
    emit('click', props.room.chatroom)
  }
}
</script>

<style scoped lang="less">
/**
 * 聊天室列表项容器
 * 默认白色背景，鼠标悬停和激活时有不同的视觉效果
 */
.chat-room-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease; // 平滑过渡动画
  background: #ffffff;
  border: 1px solid transparent;

  /**
   * 悬停效果
   * 鼠标移上时显示浅灰色背景和边框
   */
  &:hover {
    background: #f2f3f5;
    border-color: #e5e6eb;
  }

  /**
   * 激活状态（当前选中的聊天室）
   * 蓝色背景和边框，突出显示
   */
  &.active {
    background: #e8f3ff;
    border-color: #165dff;
  }
}

/**
 * 聊天室项内容容器
 * 垂直布局，标题在上，时间在下
 */
.item-content {
  display: flex;
  flex-direction: column;
  gap: 6px; // 标题和时间之间的间距
}

/**
 * 聊天室标题
 * 超出部分用省略号显示
 */
.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
  overflow: hidden;
  text-overflow: ellipsis; // 超出显示省略号
  white-space: nowrap; // 不换行
}

/**
 * 聊天室创建时间
 * 小字号灰色文字
 */
.item-time {
  font-size: 12px;
  color: #86909c;
}
</style>

