<!--
  聊天头部组件
  
  功能：
  - 显示聊天室标题
  - 显示当前会话ID（便于调试和用户识别）
  - 预留扩展位置（可添加更多功能按钮）
  
  使用示例：
  <ChatHeader :chat-id="currentChatId" />
-->
<template>
  <div class="chat-header">
    <!-- 标题 -->
    <h2>AI 聊天室</h2>
    
    <!-- 右侧信息区域 -->
    <a-space>
      <!-- 会话ID标签：显示当前聊天室的唯一标识 -->
      <a-tag color="blue" :title="`当前会话ID: ${chatId}`">
        会话ID: {{ displayChatId }}
      </a-tag>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * 组件属性类型定义
 */
interface Props {
  /** 当前聊天室ID */
  chatId: string
}

// 接收属性
const props = defineProps<Props>()

/**
 * 显示用的聊天室ID
 * 如果ID过长，进行截断显示，避免影响布局
 */
const displayChatId = computed(() => {
  const id = props.chatId
  // 如果ID长度超过20个字符，显示前8个字符 + ... + 后8个字符
  if (id.length > 20) {
    return `${id.slice(0, 8)}...${id.slice(-8)}`
  }
  return id
})
</script>

<style scoped lang="less">
/**
 * 聊天头部容器
 * 使用 flex 布局，标题在左，信息在右
 */
.chat-header {
  display: flex;
  justify-content: space-between; // 两端对齐
  align-items: center; // 垂直居中
  margin-bottom: 0;

  /**
   * 标题样式
   * 大号粗体文字，作为页面主标题
   */
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1d2129;
    user-select: none; // 禁止选中文字
  }
}
</style>

