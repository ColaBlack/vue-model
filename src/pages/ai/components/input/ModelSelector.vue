<!--
  模型选择器组件
  
  功能：
  - 选择文本模型或视觉模型
  - 分组显示
-->
<template>
  <div class="model-selector">
    <span class="selector-label">模型选择：</span>
    <a-select 
      :model-value="modelValue" 
      @update:model-value="handleChange"
      style="width: 220px"
    >
      <a-optgroup label="文本模型">
        <a-option 
          v-for="model in TEXT_MODELS" 
          :key="model" 
          :value="model"
        >
          {{ MODEL_NAMES[model] }}
        </a-option>
      </a-optgroup>
      <a-optgroup label="视觉模型">
        <a-option 
          v-for="model in VISION_MODELS" 
          :key="model" 
          :value="model"
        >
          {{ MODEL_NAMES[model] }}
        </a-option>
      </a-optgroup>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { TEXT_MODELS, VISION_MODELS, MODEL_NAMES } from '../../constants/models'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleChange = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="less">
.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selector-label {
  font-size: 14px;
  color: var(--color-text-2);
  font-weight: 500;
  white-space: nowrap;
}
</style>
