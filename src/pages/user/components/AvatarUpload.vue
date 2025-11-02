<!--
  头像上传组件
  
  功能：
  - 展示当前头像
  - 上传新头像
-->
<template>
  <div class="avatar-section">
    <div class="avatar-container">
      <a-avatar :size="120" :image-url="avatar">
        <icon-user v-if="!avatar" />
      </a-avatar>
      <a-upload
        action="/api/user/upload/avatar"
        :show-file-list="false"
        accept="image/*"
        @success="handleSuccess"
        @error="handleError"
      >
        <template #upload-button>
          <a-button type="outline" class="upload-btn">
            <template #icon>
              <icon-camera />
            </template>
            更换头像
          </a-button>
        </template>
      </a-upload>
    </div>
    <div class="avatar-tips">
      <p>支持 JPG、PNG 格式，文件小于 2MB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUser, IconCamera } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'

interface Props {
  avatar?: string
}

interface Emits {
  (e: 'success', url: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSuccess = (response: any) => {
  if (response.code === 200) {
    emit('success', response.data)
    Message.success('头像上传成功')
  } else {
    Message.error(response.message || '头像上传失败')
  }
}

const handleError = () => {
  Message.error('头像上传失败，请重试')
}
</script>

<style scoped lang="less">
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  :deep(.arco-avatar) {
    border: 4px solid #f5f6f7;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.upload-btn {
  border-radius: 20px;
  padding: 0 24px;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
  }
}

.avatar-tips {
  margin-top: 12px;
  text-align: center;

  p {
    font-size: 12px;
    color: #86909c;
    margin: 0;
  }
}
</style>

