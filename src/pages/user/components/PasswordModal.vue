<!--
  修改密码模态框组件
  
  功能：
  - 密码修改表单
  - 表单验证
-->
<template>
  <a-modal
    :visible="visible"
    title="修改密码"
    :mask-closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :model="formData" layout="vertical">
      <a-form-item
        label="当前密码"
        field="oldPassword"
        :rules="[{ required: true, message: '请输入当前密码' }]"
      >
        <a-input-password
          v-model="formData.oldPassword"
          placeholder="请输入当前密码"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        field="newPassword"
        :rules="[
          { required: true, message: '请输入新密码' },
          { minLength: 6, message: '密码长度至少6位' }
        ]"
      >
        <a-input-password
          v-model="formData.newPassword"
          placeholder="请输入新密码"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="确认新密码"
        field="confirmPassword"
        :rules="[
          { required: true, message: '请再次输入新密码' },
          {
            validator: (value, cb) => {
              if (value !== formData.newPassword) {
                cb('两次输入的密码不一致')
              } else {
                cb()
              }
            }
          }
        ]"
      >
        <a-input-password
          v-model="formData.confirmPassword"
          placeholder="请再次输入新密码"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: { oldPassword: string; newPassword: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleOk = () => {
  emit('submit', {
    oldPassword: formData.oldPassword,
    newPassword: formData.newPassword
  })
}

const handleCancel = () => {
  // 重置表单
  formData.oldPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
  emit('update:visible', false)
}

// 监听 visible 变化，关闭时重置表单
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    formData.oldPassword = ''
    formData.newPassword = ''
    formData.confirmPassword = ''
  }
})
</script>

