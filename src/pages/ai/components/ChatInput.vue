<!--
  聊天输入框组件
  
  功能：
  - 多行文本输入，支持自动调整高度
  - 实时字符计数（最多1000字）
  - 快捷键支持（Enter发送，Shift+Enter换行）
  - 发送按钮，带加载状态
  - 模型选择（文本模型/视觉模型）
  - 功能选项配置（联网搜索、RAG、工具调用）
-->
<template>
  <a-layout-footer class="chat-footer">
    <div class="input-container">
      <!-- 模型选择和功能配置区域 -->
      <div class="model-config">
        <a-space size="medium" wrap>
          <!-- 模型选择器 -->
          <ModelSelector 
            v-model="selectedModel" 
            @change="handleModelChange"
          />

          <!-- 功能选项配置 -->
          <FeatureOptions 
            :is-text-model="isTextModel"
            v-model:web-search="useWebSearch"
            v-model:rag="useRAG"
            v-model:tool-calling="useToolCalling"
          />
        </a-space>
      </div>

      <a-divider style="margin: 12px 0" />

      <!-- 输入框区域 -->
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
          <!-- 发送按钮 -->
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
          
          <!-- 字符计数 -->
          <span class="char-count">{{ inputText.length }}/1000</span>
        </div>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { IconSend } from '@arco-design/web-vue/es/icon'
import ModelSelector from './input/ModelSelector.vue'
import FeatureOptions from './input/FeatureOptions.vue'
import { TEXT_MODELS, DEFAULT_MODEL } from '../constants/models'
import type { ModelConfig } from '../types'

interface Props {
  /** v-model 绑定的输入值 */
  modelValue: string
  /** 是否正在连接（发送消息中） */
  isConnecting: boolean
  /** 当前聊天室ID */
  chatId: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'send', config: ModelConfig): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * 本地输入文本状态
 */
const inputText = ref(props.modelValue)

// ==================== 模型配置状态 ====================
/**
 * 选择的模型
 */
const selectedModel = ref<string>(DEFAULT_MODEL)

/**
 * 文本模型功能选项
 */
const useWebSearch = ref<boolean>(false)
const useRAG = ref<boolean>(false)
const useToolCalling = ref<boolean>(false)

/**
 * 判断当前选择的是否为文本模型
 */
const isTextModel = computed(() => {
  return TEXT_MODELS.includes(selectedModel.value as any)
})

/**
 * 处理模型切换
 * 切换到视觉模型时，清空功能选项
 */
const handleModelChange = () => {
  if (!isTextModel.value) {
    useWebSearch.value = false
    useRAG.value = false
    useToolCalling.value = false
  }
}

/**
 * 输入框占位符文本
 */
const placeholderText = computed(() => {
  if (props.isConnecting) {
    return '连接中...'
  }
  if (!isTextModel.value) {
    return '请输入您的问题（视觉模型暂不支持图片上传，Enter发送，Shift+Enter换行）'
  }
  return '请输入您的问题（Enter发送，Shift+Enter换行，最多1000字）'
})

/**
 * 输入框是否禁用
 */
const isInputDisabled = computed(() => {
  return props.isConnecting || !props.chatId
})

/**
 * 发送按钮是否禁用
 */
const isSendDisabled = computed(() => {
  return !inputText.value.trim() || props.isConnecting || !props.chatId
})

/**
 * 监听本地输入值变化，同步到父组件
 */
watch(inputText, (newValue) => {
  emit('update:modelValue', newValue)
})

/**
 * 监听父组件传入的值变化，同步到本地
 */
watch(
  () => props.modelValue,
  (newValue) => {
    inputText.value = newValue
  }
)

/**
 * 处理键盘事件
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

/**
 * 发送消息处理函数
 */
const handleSend = () => {
  if (inputText.value.trim() && !props.isConnecting && props.chatId) {
    const config: ModelConfig = {
      model: selectedModel.value,
      isVision: !isTextModel.value,
      useWebSearch: isTextModel.value ? useWebSearch.value : undefined,
      useRAG: isTextModel.value ? useRAG.value : undefined,
      useToolCalling: isTextModel.value ? useToolCalling.value : undefined
    }
    emit('send', config)
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

// 模型配置区域
.model-config {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%);
  border-radius: 8px;
  border: 1px solid #e5e6eb;

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
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
  min-width: 0;
}

// 操作栏
.input-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

// 字符计数
.char-count {
  font-size: 12px;
  color: #86909c;
  white-space: nowrap;
}
</style>
