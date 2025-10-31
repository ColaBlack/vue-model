<!--
  消息列表组件
  功能：
  - 显示所有聊天消息
  - 显示空状态和示例问题
  - 显示加载状态
  - 自动滚动
-->
<template>
  <div ref="messageContainer" class="message-list">
    <!-- 空状态（无消息时显示） -->
    <div v-if="messages.length === 0" class="empty-messages">
      <a-empty description="暂无聊天记录，开始对话吧！">
        <template #extra>
          <a-space direction="vertical" size="large" style="margin-top: 20px">
            <div style="color: #86909c; font-size: 14px">试试这些问题：</div>
            <!-- 示例问题标签 -->
            <a-space wrap>
              <a-tag
                v-for="(question, index) in sampleQuestions"
                :key="index"
                color="arcoblue"
                style="cursor: pointer; padding: 8px 16px"
                @click="handleSampleQuestion(question)"
              >
                {{ question }}
              </a-tag>
            </a-space>
          </a-space>
        </template>
      </a-empty>
    </div>

    <!-- 消息列表 -->
    <MessageItem v-for="(message, index) in messages" :key="index" :message="message" />

    <!-- 加载状态（AI思考中） -->
    <div v-if="isLoading" class="message-wrapper message-ai">
      <div class="message-content">
        <a-avatar :size="40" class="message-avatar">
          <icon-robot />
        </a-avatar>
        <div class="message-bubble">
          <div class="message-role">AI助手</div>
          <div class="message-text">
            <a-spin :size="16" />
            <span :style="{ marginLeft: '8px' }">正在思考中...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { IconRobot } from '@arco-design/web-vue/es/icon'
import MessageItem, { type ChatMessage } from './MessageItem.vue'

/**
 * 组件属性定义
 */
interface Props {
  messages: ChatMessage[] // 消息列表
  isLoading: boolean // 是否正在加载（AI思考中）
}

/**
 * 组件事件定义
 */
interface Emits {
  (e: 'use-sample', question: string): void // 使用示例问题
}

// 接收属性
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<Emits>()

// 消息容器引用
const messageContainer = ref<HTMLElement | null>(null)

// 示例问题列表
const sampleQuestions = [
  '什么是人工智能？',
  '如何学习编程？',
  '请介绍一下 Vue 3',
  '今天天气怎么样？'
]

/**
 * 使用示例问题
 * @param question 问题文本
 */
const handleSampleQuestion = (question: string) => {
  emit('use-sample', question)
}

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

/**
 * 监听消息变化，自动滚动到底部
 */
watch(
  () => props.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true }
)

// 暴露方法给父组件
defineExpose({
  scrollToBottom
})
</script>

<style scoped lang="less">
// 消息列表容器
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;

  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c9cdd4;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0a4a8;
  }
}

// 空状态
.empty-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}

// 加载状态消息样式
.message-wrapper {
  margin-bottom: 24px;
  display: flex;

  &.message-ai {
    justify-content: flex-start;
  }
}

.message-content {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

.message-avatar {
  margin-right: 12px;
  flex-shrink: 0;
  background: #00b42a;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 8px;
  word-break: break-word;
  background: #f2f3f5;
  color: #1d2129;
}

.message-role {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
  font-weight: 600;
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  position: relative;
}
</style>

