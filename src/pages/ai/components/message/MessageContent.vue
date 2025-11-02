<!--
  消息内容展示组件
  
  功能：
  - Markdown 渲染
  - 流式输出支持
  - 空内容提示
-->
<template>
  <div>
    <!-- 正常消息内容 -->
    <div class="message-text markdown-body" v-if="content || isStreaming">
      <!-- 非流式：渲染 Markdown -->
      <div v-if="!isStreaming" v-html="renderedContent"></div>
      
      <!-- 流式：显示原始文本 + 光标 -->
      <template v-else>
        {{ content }}
        <span class="typing-cursor">|</span>
      </template>
    </div>
    
    <!-- 空内容提示（仅在有思考过程但无正常内容时显示） -->
    <div v-else-if="isAi && hasThinkingProcess" class="empty-content-tip">
      <icon-info-circle style="margin-right: 4px;" />
      <span>AI正在深度思考中，请展开上方查看思考过程</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconInfoCircle } from '@arco-design/web-vue/es/icon'
import { marked } from 'marked'

interface Props {
  /** 消息内容 */
  content: string
  /** 是否正在流式输出 */
  isStreaming?: boolean
  /** 是否为AI消息 */
  isAi?: boolean
  /** 是否有思考过程 */
  hasThinkingProcess?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isStreaming: false,
  isAi: false,
  hasThinkingProcess: false
})

/**
 * 渲染 Markdown 内容
 */
const renderedContent = computed(() => {
  if (!props.content) return ''
  
  try {
    return marked.parse(props.content)
  } catch (error) {
    return props.content
  }
})
</script>

<style scoped lang="less">
@import '../../styles/index.less';

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

// 空内容提示
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
