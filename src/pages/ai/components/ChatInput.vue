<!--
  聊天输入框组件
  功能：
  - 输入消息
  - 显示字符计数
  - 支持快捷键（Ctrl+Enter发送）
  - 发送按钮
-->
<template>
  <a-layout-footer class="chat-footer">
    <div class="input-container">
      <!-- 多行文本输入框 -->
      <a-textarea
        v-model="inputText"
        :placeholder="
          isConnecting ? '连接中...' : '请输入您的问题（Enter换行，Ctrl+Enter发送，最多1000字）'
        "
        :max-length="1000"
        :auto-size="{ minRows: 2, maxRows: 4 }"
        :disabled="isConnecting || !chatId"
        @keydown="handleKeyDown"
        class="chat-input"
        allow-clear
      />

      <!-- 底部操作栏 -->
      <div class="input-actions">
        <a-space>
          <!-- 字符计数 -->
          <span class="char-count">{{ inputText.length }}/1000</span>
          <!-- 发送按钮 -->
          <a-button
            type="primary"
            :loading="isConnecting"
            :disabled="!inputText.trim() || isConnecting || !chatId"
            @click="handleSend"
          >
            <template #icon>
              <icon-send />
            </template>
            发送
          </a-button>
        </a-space>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconSend } from '@arco-design/web-vue/es/icon'

/**
 * 组件属性定义
 */
interface Props {
  modelValue: string // v-model 绑定的输入值
  isConnecting: boolean // 是否正在连接（发送中）
  chatId: string // 当前聊天室ID
}

/**
 * 组件事件定义
 */
interface Emits {
  (e: 'update:modelValue', value: string): void // 更新输入值
  (e: 'send'): void // 发送消息
}

// 接收属性
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<Emits>()

// 本地输入文本
const inputText = ref(props.modelValue)

/**
 * 监听输入值变化，同步到父组件
 */
watch(inputText, (newValue) => {
  emit('update:modelValue', newValue)
})

/**
 * 监听父组件传入的值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    inputText.value = newValue
  }
)

/**
 * 处理键盘事件
 * Enter: 换行
 * Ctrl+Enter 或 Cmd+Enter: 发送消息
 * @param event 键盘事件
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    handleSend()
  }
}

/**
 * 发送消息
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

// 输入框
.chat-input {
  width: 100%;
  margin-bottom: 12px;
}

// 操作栏
.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 字符计数
.char-count {
  font-size: 12px;
  color: #86909c;
}
</style>

