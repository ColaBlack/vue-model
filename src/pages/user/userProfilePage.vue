<template>
  <div class="user-profile-page">
    <div class="profile-container">
      <a-card class="profile-card" :bordered="false">
        <!-- 头部标题 -->
        <div class="profile-header">
          <h2 class="profile-title">
            <icon-user />
            个人信息
          </h2>
          <p class="profile-subtitle">管理您的个人信息和账户设置</p>
        </div>

        <a-divider />

        <!-- 头像区域 -->
        <div class="avatar-section">
          <div class="avatar-container">
            <a-avatar :size="120" :image-url="userInfo.userAvatar">
              <icon-user v-if="!userInfo.userAvatar" />
            </a-avatar>
            <a-upload
              action="/api/user/upload/avatar"
              :show-file-list="false"
              accept="image/*"
              @success="handleAvatarSuccess"
              @error="handleAvatarError"
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

        <a-divider />

        <!-- 基本信息表单 -->
        <a-form :model="userInfo" layout="vertical" class="profile-form">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="用户名" field="userName">
                <a-input
                  v-model="userInfo.userName"
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
                  v-model="userInfo.userAccount"
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
              v-model="userInfo.userProfile"
              placeholder="介绍一下自己吧~"
              :disabled="!isEditing"
              :max-length="200"
              show-word-limit
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-item>

          <a-form-item label="注册时间">
            <a-input
              :model-value="formatTime(userInfo.createTime)"
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
                @click="handleEdit"
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
                  @click="handleSave"
                >
                  <template #icon>
                    <icon-check />
                  </template>
                  保存修改
                </a-button>
                <a-button size="large" @click="handleCancel">
                  <template #icon>
                    <icon-close />
                  </template>
                  取消
                </a-button>
              </template>
            </a-space>
          </a-form-item>
        </a-form>

        <a-divider />

        <!-- 密码修改区域 -->
        <div class="password-section">
          <h3 class="section-title">
            <icon-lock />
            密码管理
          </h3>
          <a-button type="outline" @click="showPasswordModal = true">
            <template #icon>
              <icon-lock />
            </template>
            修改密码
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- 修改密码模态框 -->
    <a-modal
      v-model:visible="showPasswordModal"
      title="修改密码"
      :mask-closable="false"
      @ok="handlePasswordChange"
      @cancel="resetPasswordForm"
    >
      <a-form :model="passwordForm" layout="vertical">
        <a-form-item
          label="当前密码"
          field="oldPassword"
          :rules="[{ required: true, message: '请输入当前密码' }]"
        >
          <a-input-password
            v-model="passwordForm.oldPassword"
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
            v-model="passwordForm.newPassword"
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
                if (value !== passwordForm.newPassword) {
                  cb('两次输入的密码不一致')
                } else {
                  cb()
                }
              }
            }
          ]"
        >
          <a-input-password
            v-model="passwordForm.confirmPassword"
            placeholder="请再次输入新密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconUser,
  IconCamera,
  IconAt,
  IconClockCircle,
  IconEdit,
  IconCheck,
  IconClose,
  IconLock
} from '@arco-design/web-vue/es/icon'
import { useUserStore } from '@/store/user'
import { getLoginUser, updateUserProfile, updatePassword } from '@/api/userController'

const userStore = useUserStore()

// 用户信息
const userInfo = reactive<API.LoginUserVO & { userAccount?: string }>({
  id: 0,
  userName: '',
  userAccount: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  createTime: '',
  updateTime: ''
})

// 原始用户信息（用于取消编辑时恢复）
const originalUserInfo = ref<API.LoginUserVO & { userAccount?: string }>({})

// 编辑状态
const isEditing = ref(false)
const saving = ref(false)

// 密码修改相关
const showPasswordModal = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res = await getLoginUser()
    if (res.data.code === 200 && res.data.data) {
      Object.assign(userInfo, res.data.data)
      originalUserInfo.value = { ...res.data.data }
    }
  } catch (error) {
    Message.error('加载用户信息失败')
  }
}

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

// 开始编辑
const handleEdit = () => {
  isEditing.value = true
  originalUserInfo.value = { ...userInfo }
}

// 保存修改
const handleSave = async () => {
  if (!userInfo.userName?.trim()) {
    Message.warning('用户名不能为空')
    return
  }

  saving.value = true
  try {
    const res = await updateUserProfile({
      userName: userInfo.userName,
      userProfile: userInfo.userProfile,
      userAvatar: userInfo.userAvatar
    })
    
    if (res.data.code === 200) {
      Message.success('保存成功')
      isEditing.value = false
      
      // 更新 store 中的用户信息
      await userStore.fetchLoginUser()
    } else {
      Message.error(res.data.message || '保存失败')
    }
  } catch (error) {
    Message.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

// 取消编辑
const handleCancel = () => {
  Object.assign(userInfo, originalUserInfo.value)
  isEditing.value = false
}

// 头像上传成功
const handleAvatarSuccess = (response: any) => {
  if (response.code === 200) {
    userInfo.userAvatar = response.data
    Message.success('头像上传成功')
    userStore.fetchLoginUser()
  } else {
    Message.error(response.message || '头像上传失败')
  }
}

// 头像上传失败
const handleAvatarError = () => {
  Message.error('头像上传失败，请重试')
}

// 修改密码
const handlePasswordChange = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    Message.warning('请填写完整的密码信息')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    Message.error('两次输入的密码不一致')
    return
  }

  try {
    const res = await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (res.data.code === 200) {
      Message.success('密码修改成功')
      showPasswordModal.value = false
      resetPasswordForm()
    } else {
      Message.error(res.data.message || '密码修改失败')
    }
  } catch (error) {
    Message.error('密码修改失败，请检查当前密码是否正确')
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped lang="less">
.user-profile-page {
  min-height: calc(100vh - 64px); // 减去头部高度
  padding: 32px;
  background: #f7f8fa;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);

  :deep(.arco-card-body) {
    padding: 40px;
  }
}

// ========== 头部 ==========
.profile-header {
  text-align: center;
  margin-bottom: 24px;
}

.profile-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  :deep(.arco-icon) {
    font-size: 32px;
    color: #667eea;
  }
}

.profile-subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

// ========== 头像区域 ==========
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

// ========== 表单 ==========
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

// ========== 密码管理区域 ==========
.password-section {
  padding: 24px;
  background: #f7f8fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.arco-icon) {
    color: #667eea;
  }
}

// ========== 分割线 ==========
:deep(.arco-divider) {
  margin: 32px 0;
  border-color: #e5e6eb;
}

// ========== 响应式 ==========
@media (max-width: 768px) {
  .user-profile-page {
    padding: 16px;
  }

  .profile-card {
    :deep(.arco-card-body) {
      padding: 24px 20px;
    }
  }

  .profile-form {
    :deep(.arco-row) {
      flex-direction: column;
      
      .arco-col {
        max-width: 100%;
        flex: 0 0 100%;
      }
    }
  }

  .password-section {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>

