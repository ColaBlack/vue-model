<!--
  消息头部组件
  显示角色名称和操作按钮（如复制按钮）
-->
<template>
  <div class="message-header">
    <div class="message-role">
      {{ roleName }}
    </div>
    <!-- 复制按钮 -->
    <a-tooltip content="复制消息" position="top">
      <div class="copy-button" @click="handleCopy">
        <icon-copy />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCopy } from '@arco-design/web-vue/es/icon'
import type { MessageRole } from '../../types/message.types'

/**
 * 组件属性
 */
interface Props {
  /** 消息角色 */
  role: MessageRole
}

/**
 * 组件事件
 */
interface Emits {
  /** 复制按钮点击事件 */
  (e: 'copy'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * 角色显示名称
 */
const roleName = computed(() => {
  return props.role === 'user' ? '我' : 'AI助手'
})

/**
 * 处理复制按钮点击
 */
const handleCopy = () => {
  emit('copy')
}
</script>

<style scoped lang="less">
// 引入通用消息样式（仅包含header相关样式）
.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 8px;
}

.message-role {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 600;
  flex: 1;
}

.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  font-size: 14px;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  
  &:active {
    transform: scale(0.9);
  }
}
</style>

