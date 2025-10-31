<!--
  聊天头部组件
  功能：
  - 显示标题
  - 显示当前会话ID
-->
<template>
  <div class="chat-header">
    <h2>AI 聊天室</h2>
    <a-space>
      <!-- 显示会话ID -->
      <a-tag color="blue">会话ID: {{ chatId }}</a-tag>
    </a-space>
  </div>
</template>

<script setup lang="ts">
/**
 * 组件属性定义
 */
interface Props {
  chatId: string // 当前会话ID
}

// 接收属性
defineProps<Props>()
</script>

<style scoped lang="less">
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>

