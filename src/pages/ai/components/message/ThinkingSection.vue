<!--
  AI 思考过程展示组件
  用于显示推理模型的深度思考内容
-->
<template>
  <div class="thinking-section">
    <div class="thinking-header" @click="toggleThinking">
      <icon-bulb class="thinking-icon" />
      <span class="thinking-title">深度思考过程</span>
      <icon-down v-if="!isExpanded" class="toggle-icon" />
      <icon-up v-else class="toggle-icon" />
    </div>
    <a-collapse-transition>
      <div v-show="isExpanded" class="thinking-content">
        {{ thinkingProcess }}
      </div>
    </a-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconBulb, IconDown, IconUp } from '@arco-design/web-vue/es/icon'

/**
 * 组件属性
 */
interface Props {
  /** 思考过程内容 */
  thinkingProcess: string
}

defineProps<Props>()

/**
 * 控制思考过程的展开/折叠状态
 */
const isExpanded = ref(false)

/**
 * 切换思考过程的显示状态
 */
const toggleThinking = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped lang="less">
@import '../../styles/thinking.less';
</style>

