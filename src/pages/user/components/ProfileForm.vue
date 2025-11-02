<!--
  用户资料表单组件
  
  功能：
  - 展示和编辑用户基本信息
  - 表单验证
-->
<template>
  <a-form :model="formData" layout="vertical" class="profile-form">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="用户名" field="userName">
          <a-input
            v-model="formData.userName"
            placeholder="请输入用户名"
            :disabled="!isEditing"
            size="large"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="账号" field="userAccount">
          <a-input
            :model-value="formData.userAccount"
            placeholder="账号"
            disabled
            size="large"
          >
            <template #prefix>
              <icon-at />
            </template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="个人简介" field="userProfile">
      <a-textarea
        v-model="formData.userProfile"
        placeholder="介绍一下自己吧~"
        :disabled="!isEditing"
        :max-length="200"
        show-word-limit
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </a-form-item>

    <a-form-item label="注册时间">
      <a-input
        :model-value="formatTime(formData.createTime)"
        disabled
        size="large"
      >
        <template #prefix>
          <icon-clock-circle />
        </template>
      </a-input>
    </a-form-item>

    <!-- 操作按钮 -->
    <a-form-item>
      <a-space size="medium">
        <a-button
          v-if="!isEditing"
          type="primary"
          size="large"
          @click="$emit('edit')"
        >
          <template #icon>
            <icon-edit />
          </template>
          编辑信息
        </a-button>
        <template v-else>
          <a-button
            type="primary"
            size="large"
            :loading="saving"
            @click="$emit('save')"
          >
            <template #icon>
              <icon-check />
            </template>
            保存修改
          </a-button>
          <a-button size="large" @click="$emit('cancel')">
            <template #icon>
              <icon-close />
            </template>
            取消
          </a-button>
        </template>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import {
  IconUser,
  IconAt,
  IconClockCircle,
  IconEdit,
  IconCheck,
  IconClose
} from '@arco-design/web-vue/es/icon'

interface Props {
  formData: API.LoginUserVO & { userAccount?: string }
  isEditing: boolean
  saving?: boolean
}

interface Emits {
  (e: 'edit'): void
  (e: 'save'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}
</script>

<style scoped lang="less">
.profile-form {
  :deep(.arco-form-item-label-col) {
    font-weight: 600;
    color: #4e5969;
  }

  :deep(.arco-input-wrapper),
  :deep(.arco-textarea-wrapper) {
    border-radius: 8px;
    transition: all 0.3s;

    &:hover,
    &:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
  }

  :deep(.arco-input-prefix) {
    color: #86909c;
  }

  :deep(.arco-btn-primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }

  :deep(.arco-btn:not(.arco-btn-primary)) {
    border-radius: 8px;
  }
}

// 响应式
@media (max-width: 768px) {
  .profile-form {
    :deep(.arco-row) {
      flex-direction: column;
      
      .arco-col {
        max-width: 100%;
        flex: 0 0 100%;
      }
    }
  }
}
</style>

