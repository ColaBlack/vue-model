<!--
  复制按钮组件
  
  功能：
  - 复制文本内容到剪贴板
  - 带 Tooltip 提示
  - 悬停显示效果
  
  使用示例：
  <CopyButton :text="contentToCopy" />
-->
<template>
  <a-tooltip :content="tooltipText">
    <a-button 
      class="copy-button" 
      type="text" 
      size="mini"
      @click="handleCopy"
    >
      <template #icon>
        <icon-copy />
      </template>
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCopy } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'

interface Props {
  /** 要复制的文本内容 */
  text: string
  /** Tooltip 提示文本 */
  tooltipText?: string
}

const props = withDefaults(defineProps<Props>(), {
  tooltipText: '复制消息'
})

/**
 * 处理复制操作
 */
const handleCopy = async () => {
  try {
    if (!props.text || !props.text.trim()) {
      Message.warning('暂无可复制的内容')
      return
    }
    
    await navigator.clipboard.writeText(props.text)
    Message.success('已复制到剪贴板')
  } catch (error) {
    Message.error('复制失败，请重试')
  }
}
</script>

<style scoped lang="less">
.copy-button {
  color: currentColor;
  padding: 4px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}
</style>

