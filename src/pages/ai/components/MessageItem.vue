<!--
  单条消息组件
  功能：
  - 显示用户或AI的消息
  - 显示头像
  - 显示时间
  - 显示流式输入光标
-->
<template>
  <div class="message-wrapper" :class="message.role === 'user' ? 'message-user' : 'message-ai'">
    <div class="message-content">
      <!-- 头像 -->
      <a-avatar :size="40" class="message-avatar">
        <template v-if="message.role === 'user'">
          <icon-user />
        </template>
        <template v-else>
          <icon-robot />
        </template>
      </a-avatar>

      <!-- 消息气泡 -->
      <div class="message-bubble">
        <!-- 角色名称 -->
        <div class="message-role">
          {{ message.role === 'user' ? '我' : 'AI助手' }}
        </div>
        <!-- 消息内容 -->
        <div class="message-text">
          {{ message.content }}
          <!-- 流式输入光标 -->
          <span v-if="message.isStreaming" class="typing-cursor">|</span>
        </div>
        <!-- 时间戳 -->
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUser, IconRobot } from '@arco-design/web-vue/es/icon'

/**
 * 消息接口定义
 */
export interface ChatMessage {
  role: 'user' | 'ai' // 消息角色
  content: string // 消息内容
  timestamp: number // 时间戳
  isStreaming?: boolean // 是否正在流式输出
}

/**
 * 组件属性定义
 */
interface Props {
  message: ChatMessage // 消息对象
}

// 接收属性
defineProps<Props>()

/**
 * 格式化时间（HH:MM 格式）
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped lang="less">
// 消息容器
.message-wrapper {
  margin-bottom: 24px;
  display: flex;

  // 用户消息样式（右侧，蓝色）
  &.message-user {
    justify-content: flex-end;

    .message-content {
      flex-direction: row-reverse;
    }

    .message-avatar {
      margin-left: 12px;
      margin-right: 0;
      background: #165dff;
    }

    .message-bubble {
      background: #165dff;
      color: #ffffff;
      align-items: flex-end;
    }

    .message-role {
      text-align: right;
    }
  }

  // AI消息样式（左侧，绿色）
  &.message-ai {
    justify-content: flex-start;

    .message-avatar {
      background: #00b42a;
    }

    .message-bubble {
      background: #f2f3f5;
      color: #1d2129;
    }
  }
}

// 消息内容区域
.message-content {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

// 头像
.message-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

// 消息气泡
.message-bubble {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 8px;
  word-break: break-word;
}

// 角色名称
.message-role {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
  font-weight: 600;
}

// 消息文本
.message-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  position: relative;
}

// 流式输入光标（闪烁动画）
.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 2px;
}

// 闪烁动画
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

// 时间戳
.message-time {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
}
</style>

