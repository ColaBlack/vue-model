<!--
  功能选项配置组件
  
  功能：
  - 联网搜索开关
  - RAG 知识库检索开关
  - 工具调用开关
  - 视觉模型提示
  
  使用示例：
  <FeatureOptions 
    :is-text-model="true"
    v-model:web-search="useWebSearch"
    v-model:rag="useRAG"
    v-model:tool-calling="useToolCalling"
  />
-->
<template>
  <div class="feature-options">
    <!-- 文本模型功能选项 -->
    <template v-if="isTextModel">
      <a-divider direction="vertical" style="height: 24px; margin: 0" />
      
      <a-checkbox 
        :model-value="webSearch" 
        @update:model-value="$emit('update:webSearch', $event)"
      >
        <span class="option-label">联网搜索</span>
      </a-checkbox>
      
      <a-checkbox 
        :model-value="rag" 
        @update:model-value="$emit('update:rag', $event)"
      >
        <span class="option-label">知识库检索（RAG）</span>
      </a-checkbox>
      
      <a-checkbox 
        :model-value="toolCalling" 
        @update:model-value="$emit('update:toolCalling', $event)"
      >
        <span class="option-label">水产品数据库检索</span>
      </a-checkbox>
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
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle, IconExclamationCircle } from '@arco-design/web-vue/es/icon'

interface Props {
  /** 是否为文本模型 */
  isTextModel: boolean
  /** 是否启用联网搜索 */
  webSearch: boolean
  /** 是否启用 RAG */
  rag: boolean
  /** 是否启用工具调用 */
  toolCalling: boolean
}

interface Emits {
  (e: 'update:webSearch', value: boolean): void
  (e: 'update:rag', value: boolean): void
  (e: 'update:toolCalling', value: boolean): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped lang="less">
.feature-options {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.option-label {
  font-size: 14px;
  user-select: none;
}
</style>

