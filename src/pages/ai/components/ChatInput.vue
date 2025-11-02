<!--
  聊天输入框组件
  
  功能：
  - 多行文本输入，支持自动调整高度
  - 实时字符计数（最多1000字）
  - 快捷键支持（Enter发送，Shift+Enter换行）
  - 发送按钮，带加载状态
  - 输入验证和禁用状态管理
  - 模型选择（文本模型/视觉模型）
  - 文本模型功能选项（联网搜索、RAG、工具调用）
  
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
      <!-- 模型选择和功能配置区域 -->
      <div class="model-config">
        <a-space size="medium" wrap>
          <!-- 模型选择 -->
          <div class="config-item">
            <span class="config-label">模型选择：</span>
            <a-select v-model="selectedModel" style="width: 220px" @change="handleModelChange">
              <a-optgroup label="文本模型">
                <a-option value="glm-z1-flash">GLM-Z1-Flash（深度推理）</a-option>
                <a-option value="glm-4.5-flash">GLM-4.5-Flash（标准）</a-option>
                <a-option value="glm-4-flash">GLM-4-Flash（普通）</a-option>
              </a-optgroup>
              <a-optgroup label="视觉模型">
                <a-option value="vision">GLM-4V-Flash（快速识别）</a-option>
                <a-option value="vision_reasoning">GLM-4.1V-Thinking-Flash（深度思考）</a-option>
              </a-optgroup>
            </a-select>
          </div>

          <!-- 文本模型功能选项（仅在选择文本模型时显示） -->
          <template v-if="isTextModel">
            <a-divider direction="vertical" style="height: 24px; margin: 0" />
            
            <div class="config-item">
              <a-checkbox v-model="useWebSearch">
                <span class="checkbox-label">联网搜索</span>
              </a-checkbox>
            </div>
            
            <div class="config-item">
              <a-checkbox v-model="useRAG">
                <span class="checkbox-label">知识库检索（RAG）</span>
              </a-checkbox>
            </div>
            
            <div class="config-item">
              <a-checkbox v-model="useToolCalling">
                <span class="checkbox-label">水产品数据库检索</span>
              </a-checkbox>
            </div>
          </template>

          <!-- 视觉模型提示 -->
          <template v-else>
            <a-divider direction="vertical" style="height: 24px; margin: 0" />
            <a-tag color="orange">
              <template #icon>
                <icon-info-circle />
              </template>
              视觉模型暂不支持联网搜索和知识库功能
            </a-tag>
            <a-tag color="red">
              <template #icon>
                <icon-exclamation-circle />
              </template>
              注意：图片上传功能开发中，当前仅支持文本输入
            </a-tag>
          </template>
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
import { IconSend, IconInfoCircle, IconExclamationCircle } from '@arco-design/web-vue/es/icon'

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
  /** 发送消息事件，携带模型配置参数 */
  (e: 'send', config: ModelConfig): void
}

/**
 * 模型配置类型
 */
export interface ModelConfig {
  /** 选择的模型 */
  model: string
  /** 是否为视觉模型 */
  isVision: boolean
  /** 是否启用联网搜索（仅文本模型） */
  useWebSearch?: boolean
  /** 是否启用RAG（仅文本模型） */
  useRAG?: boolean
  /** 是否启用工具调用（仅文本模型） */
  useToolCalling?: boolean
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

// ==================== 模型配置状态 ====================
/**
 * 选择的模型
 * 默认选择 glm-4.5-flash（标准文本模型）
 */
const selectedModel = ref<string>('glm-4.5-flash')

/**
 * 文本模型功能选项
 */
const useWebSearch = ref<boolean>(false) // 联网搜索
const useRAG = ref<boolean>(false) // 知识库检索
const useToolCalling = ref<boolean>(false) // 工具调用

/**
 * 判断当前选择的是否为文本模型
 */
const isTextModel = computed(() => {
  const textModels = ['glm-z1-flash', 'glm-4.5-flash', 'glm-4-flash']
  return textModels.includes(selectedModel.value)
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
 * 根据连接状态和模型类型动态显示不同提示
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
 * 验证输入后触发 send 事件，并携带模型配置参数
 * 
 * 验证条件：
 * 1. 输入不为空（去除空格后）
 * 2. 不在发送中
 * 3. 有有效的聊天室ID
 */
const handleSend = () => {
  if (inputText.value.trim() && !props.isConnecting && props.chatId) {
    // 构建模型配置对象
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

  .config-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .config-label {
    font-size: 14px;
    color: #4e5969;
    font-weight: 500;
  }

  .checkbox-label {
    font-size: 14px;
    color: #1d2129;
    user-select: none;
  }

  // 响应式：小屏幕上垂直排列
  @media (max-width: 768px) {
    padding: 10px 12px;

    .config-item {
      font-size: 13px;
    }
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

