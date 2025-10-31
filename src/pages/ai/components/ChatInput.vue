<!--
  聊天输入框组件
  
  功能：
  - 多行文本输入，支持自动调整高度
  - 实时字符计数（最多1000字）
  - 快捷键支持（Enter发送，Shift+Enter换行）
  - 发送按钮，带加载状态
  - 输入验证和禁用状态管理
  
  使用示例：
  <ChatInput
    v-model="userInput"
    :is-connecting="isSending"
    :chat-id="currentChatId"
    @send="handleSendMessage"
  />
-->
<template>
  <a-layout-footer class="chat-footer">
    <div class="input-container">
      <div class="input-wrapper">
        <!-- 多行文本输入框 -->
        <a-textarea
          v-model="inputText"
          :placeholder="placeholderText"
          :max-length="1000"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :disabled="isInputDisabled"
          @keydown="handleKeyDown"
          class="chat-input"
          allow-clear
        />

        <!-- 右侧操作区：发送按钮和字符计数 -->
        <div class="input-actions">
          <!-- 发送按钮：位于右上方 -->
          <a-button
            type="primary"
            :loading="isConnecting"
            :disabled="isSendDisabled"
            @click="handleSend"
            size="large"
            title="发送消息（Enter）"
          >
            <template #icon>
              <icon-send />
            </template>
            发送
          </a-button>
          
          <!-- 字符计数：位于发送按钮下方，居中显示 -->
          <span class="char-count">{{ inputText.length }}/1000</span>
        </div>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { IconSend } from '@arco-design/web-vue/es/icon'

/**
 * 组件属性类型定义
 */
interface Props {
  /** v-model 绑定的输入值 */
  modelValue: string
  /** 是否正在连接（发送消息中） */
  isConnecting: boolean
  /** 当前聊天室ID（用于验证是否可以发送） */
  chatId: string
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 更新输入值事件（v-model 双向绑定） */
  (e: 'update:modelValue', value: string): void
  /** 发送消息事件 */
  (e: 'send'): void
}

// 接收属性
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 本地输入文本状态
 * 用于实现 v-model 双向绑定
 */
const inputText = ref(props.modelValue)

/**
 * 输入框占位符文本
 * 根据连接状态动态显示不同提示
 */
const placeholderText = computed(() => {
  if (props.isConnecting) {
    return '连接中...'
  }
  return '请输入您的问题（Enter发送，Shift+Enter换行，最多1000字）'
})

/**
 * 输入框是否禁用
 * 正在发送或没有聊天室ID时禁用
 */
const isInputDisabled = computed(() => {
  return props.isConnecting || !props.chatId
})

/**
 * 发送按钮是否禁用
 * 输入为空、正在发送或没有聊天室ID时禁用
 */
const isSendDisabled = computed(() => {
  return !inputText.value.trim() || props.isConnecting || !props.chatId
})

/**
 * 监听本地输入值变化，同步到父组件
 * 实现 v-model 的 update 部分
 */
watch(inputText, (newValue) => {
  emit('update:modelValue', newValue)
})

/**
 * 监听父组件传入的值变化，同步到本地
 * 实现 v-model 的 receive 部分
 */
watch(
  () => props.modelValue,
  (newValue) => {
    inputText.value = newValue
  }
)

/**
 * 处理键盘事件
 * 实现快捷键功能：
 * - Enter: 发送消息（单独按）
 * - Shift+Enter: 换行（浏览器默认行为）
 * 
 * @param event 键盘事件对象
 */
const handleKeyDown = (event: KeyboardEvent) => {
  // Enter 键发送消息（不按 Shift）
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault() // 阻止默认的换行行为
    handleSend()
  }
  // Shift+Enter 允许换行（默认行为，不需要特殊处理）
}

/**
 * 发送消息处理函数
 * 验证输入后触发 send 事件
 * 
 * 验证条件：
 * 1. 输入不为空（去除空格后）
 * 2. 不在发送中
 * 3. 有有效的聊天室ID
 */
const handleSend = () => {
  if (inputText.value.trim() && !props.isConnecting && props.chatId) {
    emit('send')
  }
}
</script>

<style scoped lang="less">
// 底部输入区域
.chat-footer {
  background: #ffffff;
  border-top: 1px solid #e5e6eb;
  padding: 16px 20px;
}

// 输入容器
.input-container {
  max-width: 1200px;
  margin: 0 auto;
}

// 输入包装器（横向布局）
.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

// 输入框
.chat-input {
  flex: 1;
  min-width: 0; // 防止 flex 子元素溢出
}

// 操作栏
.input-actions {
  flex-shrink: 0; // 不压缩
  display: flex;
  flex-direction: column;
  align-items: center; // 居中对齐
  gap: 8px;
}

// 字符计数
.char-count {
  font-size: 12px;
  color: #86909c;
  white-space: nowrap;
}
</style>

