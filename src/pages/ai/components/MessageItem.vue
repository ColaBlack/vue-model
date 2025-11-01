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

        <!-- 思考过程（仅AI消息且包含<think>标签时显示） -->
        <div v-if="message.role === 'ai' && parsedContent.thinkingProcess" class="thinking-section">
          <div class="thinking-header" @click="toggleThinking">
            <icon-bulb class="thinking-icon" />
            <span class="thinking-title">深度思考过程</span>
            <icon-down v-if="!showThinking" class="toggle-icon" />
            <icon-up v-else class="toggle-icon" />
          </div>
          <a-collapse-transition>
            <div v-show="showThinking" class="thinking-content">
              {{ parsedContent.thinkingProcess }}
            </div>
          </a-collapse-transition>
        </div>

        <!-- 正常消息内容 -->
        <div class="message-text" v-if="parsedContent.normalContent || message.isStreaming">
          {{ parsedContent.normalContent }}
          <!-- 流式输入光标 -->
          <span v-if="message.isStreaming" class="typing-cursor">|</span>
        </div>
        
        <!-- 如果没有正常内容且不在流式输出，显示提示 -->
        <div v-else-if="message.role === 'ai' && parsedContent.thinkingProcess" class="empty-content-tip">
          <icon-info-circle style="margin-right: 4px;" />
          <span>AI正在深度思考中，请展开上方查看思考过程</span>
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
import { ref, computed } from 'vue'
import { IconUser, IconRobot, IconBulb, IconDown, IconUp, IconInfoCircle } from '@arco-design/web-vue/es/icon'

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
const props = defineProps<Props>()

// 控制思考过程的展开/折叠状态
const showThinking = ref(false)

/**
 * 切换思考过程的显示状态
 */
const toggleThinking = () => {
  showThinking.value = !showThinking.value
}

/**
 * 解析消息内容，分离思考过程和正常内容
 * 深度推理模型会输出 <think>...</think> 包裹的思考过程
 */
const parsedContent = computed(() => {
  const content = props.message.content
  
  // 匹配完整的 <think>...</think> 标签
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g
  const matches = content.match(thinkRegex)
  
  if (matches && matches.length > 0) {
    // 提取所有思考过程
    let thinkingProcess = ''
    let normalContent = content
    
    matches.forEach(match => {
      const innerMatch = match.match(/<think>([\s\S]*?)<\/think>/)
      if (innerMatch) {
        thinkingProcess += (thinkingProcess ? '\n\n' : '') + innerMatch[1].trim()
      }
      // 从正常内容中移除思考标签
      normalContent = normalContent.replace(match, '')
    })
    
    normalContent = normalContent.trim()
    
    return {
      thinkingProcess,
      normalContent: normalContent || '' // 如果没有正常内容，返回空字符串而不是占位文本
    }
  }
  
  // 没有完整的思考过程标签，直接返回原内容
  // 这样在流式输出时，未完成的标签也会正常显示
  return {
    thinkingProcess: '',
    normalContent: content
  }
})

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

// ==================== 思考过程样式 ====================

// 思考过程区域
.thinking-section {
  margin-bottom: 12px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #fff9e6 0%, #fff5d9 100%);
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffb84d;
    box-shadow: 0 2px 8px rgba(255, 184, 77, 0.15);
  }
}

// 思考过程头部（可点击展开/折叠）
.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 184, 77, 0.1);
  }

  &:active {
    background: rgba(255, 184, 77, 0.15);
  }
}

// 灯泡图标
.thinking-icon {
  color: #ff9a2e;
  font-size: 16px;
  animation: pulse 2s ease-in-out infinite;
}

// 脉冲动画
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

// 思考标题
.thinking-title {
  font-size: 13px;
  font-weight: 600;
  color: #e68a00;
  flex: 1;
}

// 展开/折叠图标
.toggle-icon {
  font-size: 14px;
  color: #86909c;
  transition: transform 0.3s ease;
}

// 思考内容
.thinking-content {
  padding: 12px;
  font-size: 13px;
  line-height: 1.7;
  color: #4e5969;
  background: #fffbf0;
  border-top: 1px dashed #ffe7ba;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
  
  // 美化滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #fff5e6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ffb84d;
    border-radius: 3px;
    
    &:hover {
      background: #ff9a2e;
    }
  }
}

// 用户消息中的思考区域（不应该出现，但做兼容处理）
.message-user .thinking-section {
  background: linear-gradient(135deg, #e8f3ff 0%, #d4e8ff 100%);
  
  .thinking-icon {
    color: #165dff;
  }
  
  .thinking-title {
    color: #0e42d2;
  }
  
  .thinking-content {
    background: #f0f8ff;
    border-top-color: #bedaff;
    color: #1d2129;
  }
}

// 空内容提示（仅有思考过程，没有正常输出时）
.empty-content-tip {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f0f8ff;
  border-radius: 6px;
  border: 1px dashed #bedaff;
  color: #4e5969;
  font-size: 13px;
  font-style: italic;
  margin-bottom: 8px;
}
</style>

