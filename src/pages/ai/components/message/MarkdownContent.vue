<!--
  Markdown 内容渲染组件
  负责将 Markdown 格式的文本渲染为 HTML
-->
<template>
  <div 
    class="message-text"
    :class="[
      'markdown-content',
      { 'markdown-content-user': isUserMessage }
    ]"
  >
    <div v-if="content" v-html="renderedContent"></div>
    <!-- 流式输入光标 -->
    <span v-if="isStreaming" class="typing-cursor">|</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../../utils/markdown'

/**
 * 组件属性
 */
interface Props {
  /** Markdown 内容 */
  content: string
  /** 是否为用户消息（用于应用不同的样式） */
  isUserMessage?: boolean
  /** 是否正在流式输出 */
  isStreaming?: boolean
}

const props = defineProps<Props>()

/**
 * 渲染后的 HTML 内容
 */
const renderedContent = computed(() => {
  return renderMarkdown(props.content)
})
</script>

<style scoped lang="less">
@import '../../styles/markdown.less';

.message-text {
  position: relative;
}

// 流式输入光标（闪烁动画）
.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 2px;
}

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
</style>

