<!--
  思考过程展示组件
  
  功能：
  - 展示AI的深度思考过程
  - 可折叠/展开
  - Markdown 渲染
-->
<template>
  <div v-if="content" class="thinking-section">
    <div class="thinking-header" @click="toggleCollapse">
      <icon-bulb class="thinking-icon" />
      <span class="thinking-title">深度思考过程</span>
      <icon-down v-if="!isExpanded" class="toggle-icon" />
      <icon-up v-else class="toggle-icon" />
    </div>
    
    <a-collapse-transition>
      <div 
        v-show="isExpanded" 
        class="thinking-content markdown-body-compact custom-scrollbar-orange" 
        v-html="renderedContent"
      ></div>
    </a-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconBulb, IconDown, IconUp } from '@arco-design/web-vue/es/icon'
import { marked } from 'marked'

interface Props {
  /** 思考过程内容 */
  content: string
}

const props = defineProps<Props>()

/** 是否展开 */
const isExpanded = ref(false)

/**
 * 切换展开/折叠状态
 */
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

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
  background: #fffbf0;
  border-top: 1px dashed #ffe7ba;
  color: #4e5969;
  font-size: 13px;
  line-height: 1.7;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
