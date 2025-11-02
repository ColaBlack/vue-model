<!--
  单条消息组件（重构版）
  
  功能：
  - 显示用户或AI的消息
  - 显示头像
  - 显示时间
  - 显示流式输入光标
  - 支持复制消息内容
  - 支持思考过程展示
  
  重构优化：
  - 拆分为多个子组件，提高可维护性
  - 提取工具函数到独立文件，提高可复用性
  - 提取样式到独立文件，便于统一管理
-->
<template>
  <div class="message-wrapper" :class="`message-${message.role}`">
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
        <!-- 消息头部：角色名称 + 复制按钮 -->
        <MessageHeader :role="message.role" @copy="handleCopy" />

        <!-- 思考过程（仅AI消息且包含<think>标签时显示） -->
        <ThinkingSection 
          v-if="message.role === 'ai' && parsedContent.thinkingProcess"
          :thinking-process="parsedContent.thinkingProcess"
        />

        <!-- 正常消息内容（Markdown渲染） -->
        <MarkdownContent
          v-if="parsedContent.normalContent || message.isStreaming"
          :content="parsedContent.normalContent"
          :is-user-message="message.role === 'user'"
          :is-streaming="message.isStreaming"
        />
        
        <!-- 如果没有正常内容且不在流式输出，显示提示 -->
        <div v-else-if="message.role === 'ai' && parsedContent.thinkingProcess" class="empty-content-tip">
          <icon-info-circle style="margin-right: 4px;" />
          <span>AI正在深度思考中，请展开上方查看思考过程</span>
        </div>

        <!-- 时间戳 -->
        <div class="message-time">
          {{ formattedTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconUser, IconRobot, IconInfoCircle } from '@arco-design/web-vue/es/icon'
import MessageHeader from './message/MessageHeader.vue'
import ThinkingSection from './message/ThinkingSection.vue'
import MarkdownContent from './message/MarkdownContent.vue'
import { parseMessageContent } from '../utils/markdown'
import { copyMessageContent } from '../utils/clipboard'
import { formatTime } from '../utils/time'
import type { ChatMessage } from '../types/message.types'

/**
 * 组件属性定义
 */
interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

/**
 * 解析后的消息内容
 * 分离思考过程和正常内容
 */
const parsedContent = computed(() => {
  return parseMessageContent(props.message.content)
})

/**
 * 格式化后的时间
 */
const formattedTime = computed(() => {
  return formatTime(props.message.timestamp)
})

/**
 * 处理复制消息
 */
const handleCopy = async () => {
  await copyMessageContent(
    parsedContent.value.thinkingProcess,
    parsedContent.value.normalContent
  )
}
</script>

<style scoped lang="less">
@import '../styles/message.less';
@import '../styles/thinking.less';

// 鼠标悬停在消息气泡上时显示复制按钮
.message-bubble:hover :deep(.copy-button) {
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
  }
}

// 用户消息的复制按钮样式（白色图标）
.message-user :deep(.copy-button) {
  color: #ffffff;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
