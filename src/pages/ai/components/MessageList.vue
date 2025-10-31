<!--
  消息列表组件（重构版）
  
  功能：
  - 显示所有聊天消息
  - 显示空状态和示例问题
  - 显示AI思考指示器
  - 自动滚动到最新消息
  
  架构：
  本组件作为容器，负责消息列表的管理和滚动控制
  将视觉展示拆分为独立的子组件：
  - MessageItem: 单条消息展示
  - SampleQuestions: 空状态的示例问题
  - ThinkingIndicator: AI思考动画指示器
  
  使用示例：
  <MessageList
    :messages="chatMessages"
    :is-loading="isAiThinking"
    @use-sample="handleSampleQuestion"
  />
-->
<template>
  <div ref="messageContainer" class="message-list">
    <!-- 空状态：无消息时显示示例问题 -->
    <SampleQuestions 
      v-if="messages.length === 0"
      @select="handleSampleQuestion"
    />

    <!-- 消息列表：循环渲染每条消息 -->
    <MessageItem 
      v-for="(message, index) in messages" 
      :key="index" 
      :message="message" 
    />

    <!-- AI思考指示器：AI生成回复时显示 -->
    <ThinkingIndicator v-if="isLoading && messages.length > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import MessageItem, { type ChatMessage } from './MessageItem.vue'
import SampleQuestions from './message/SampleQuestions.vue'
import ThinkingIndicator from './message/ThinkingIndicator.vue'

/**
 * 组件属性类型定义
 */
interface Props {
  /** 聊天消息列表 */
  messages: ChatMessage[]
  /** 是否正在加载（AI思考中） */
  isLoading: boolean
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 使用示例问题事件，传递问题文本 */
  (e: 'use-sample', question: string): void
}

// 接收属性
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 消息容器DOM引用
 * 用于实现自动滚动功能
 */
const messageContainer = ref<HTMLElement | null>(null)

/**
 * 处理示例问题选择
 * 将用户选择的示例问题发送给父组件
 * 
 * @param question 用户选择的问题文本
 */
const handleSampleQuestion = (question: string) => {
  emit('use-sample', question)
}

/**
 * 滚动到消息列表底部
 * 在新消息添加时调用，确保用户看到最新内容
 */
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

/**
 * 监听消息列表变化
 * 当有新消息时，自动滚动到底部
 * 使用 nextTick 确保 DOM 更新完成后再滚动
 */
watch(
  () => props.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true } // 深度监听数组内部变化
)

/**
 * 暴露方法给父组件
 * 允许父组件手动触发滚动到底部
 */
defineExpose({
  scrollToBottom
})
</script>

<style scoped lang="less">
/**
 * 消息列表容器
 * 占据剩余空间，支持垂直滚动
 */
.message-list {
  flex: 1; // 占据父容器剩余空间
  overflow-y: auto; // 垂直滚动
  padding: 20px 0;

  /**
   * 自定义滚动条样式
   * 使用细窄的滚动条，更美观
   */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c9cdd4;
    border-radius: 3px;

    &:hover {
      background: #a0a4a8; // 悬停时颜色加深
    }
  }
}
</style>

