<!--
  单条消息组件
  
  功能：
  - 显示用户或AI的消息
  - 显示头像和时间
  - 支持流式输出
  - 支持深度思考过程展示
  - 支持 Markdown 渲染
  - 支持复制消息
-->
<template>
  <div class="message-wrapper" :class="message.role === 'USER' ? 'message-user' : 'message-ai'">
    <div class="message-content">
      <!-- 头像 -->
      <a-avatar :size="40" class="message-avatar">
        <template v-if="message.role === 'USER'">
          <icon-user />
        </template>
        <template v-else>
          <icon-robot />
        </template>
      </a-avatar>

      <!-- 消息气泡 -->
      <div class="message-bubble">
        <!-- 顶部栏：角色名称 + 操作按钮 -->
        <div class="message-header">
        <div class="message-role">
            {{ message.role === 'USER' ? '我' : 'AI助手' }}
        </div>
          
          <!-- 复制按钮 -->
          <CopyButton :text="copyText" />
        </div>

        <!-- 思考过程（仅AI消息且包含<think>标签时显示） -->
        <ThinkingSection 
          v-if="isAiMessage && parsedContent.thinkingProcess" 
          :content="parsedContent.thinkingProcess"
        />

        <!-- 正常消息内容 -->
        <MessageContent 
          :content="parsedContent.normalContent"
          :is-streaming="message.isStreaming"
          :is-ai="isAiMessage"
          :has-thinking-process="!!parsedContent.thinkingProcess"
        />

        <!-- 时间戳 -->
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconUser, IconRobot } from '@arco-design/web-vue/es/icon'
import { marked } from 'marked'
import CopyButton from './message/CopyButton.vue'
import ThinkingSection from './message/ThinkingSection.vue'
import MessageContent from './message/MessageContent.vue'
import { parseMessageContent } from '../utils/messageParser'
import { formatTime } from '../utils/timeFormat'
import type { ChatMessage } from '../types'

// 配置 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true,
})

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

/**
 * 判断是否为AI消息
 */
const isAiMessage = computed(() => {
  return props.message.role === 'AI' || props.message.role === 'ASSISTANT'
})

/**
 * 解析消息内容，分离思考过程和正常内容
 */
const parsedContent = computed(() => {
  return parseMessageContent(props.message.content)
})

/**
 * 复制按钮要复制的文本
 * 只复制正常内容，不包括思考过程
 */
const copyText = computed(() => {
  return parsedContent.value.normalContent || props.message.content || ''
})
</script>

<style scoped lang="less">
@import '../styles/index.less';

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

// 消息头部（角色名称 + 操作按钮）
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: 8px;
}

.message-role {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 600;
  flex: 1;
}

// 时间戳
.message-time {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
}

// 复制按钮显示控制
:deep(.copy-button) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-bubble:hover {
  :deep(.copy-button) {
    opacity: 0.6;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>
