<template>
  <div class="message-input">
    <a-input-group>
      <a-textarea
        :model-value="modelValue"
        placeholder="和AI聊点什么吧..."
        @press-enter="sendMessage"
        @update:modelValue="updateModelValue"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
      <a-button type="primary" :disabled="disabled" @click="handleSendMessage">发送</a-button>
    </a-input-group>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import {
  InputGroup as AInputGroup,
  Button as AButton,
  Textarea as ATextarea
} from '@arco-design/web-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'sendMessage'])

const handleSendMessage = () => {
  if (props.modelValue.trim() && !props.disabled) {
    emit('sendMessage')
  }
}

const updateModelValue = (value: string) => {
  emit('update:modelValue', value)
}

const sendMessage = () => {
  emit('sendMessage')
}
</script>

<style scoped>
.message-input {
  padding: 15px 20px 20px 20px; /* Adjusted padding */
  border-top: 1px solid #e5e6eb;
  background-color: #fff;
  display: flex;
  align-items: flex-end;
  /* Removed position: absolute, bottom, left, right, z-index */
}

.message-input .arco-input-group {
  display: flex;
  width: 100%;
}

.message-input .arco-input-group .arco-btn {
  margin-left: 10px;
}

.message-input .arco-textarea {
  flex: 1;
}
</style>
