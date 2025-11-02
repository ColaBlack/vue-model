<!--
  用户资料页面
  
  功能：
  - 查看和编辑个人信息
  - 上传头像
  - 修改密码
-->
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

        <!-- 头像上传 -->
        <AvatarUpload 
          :avatar="userInfo.userAvatar" 
              @success="handleAvatarSuccess"
        />

        <a-divider />

        <!-- 基本信息表单 -->
        <ProfileForm
          :form-data="userInfo"
          :is-editing="isEditing"
          :saving="saving"
          @edit="handleEdit"
          @save="handleSave"
          @cancel="handleCancel"
        />

        <a-divider />

        <!-- 密码管理区域 -->
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
    <PasswordModal
      v-model:visible="showPasswordModal"
      @submit="handlePasswordChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon'
import { useUserStore } from '@/store/user'
import { getLoginUser, updateMyProfile, updateMyPassword } from '@/api/userController'
import AvatarUpload from './components/AvatarUpload.vue'
import ProfileForm from './components/ProfileForm.vue'
import PasswordModal from './components/PasswordModal.vue'

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

/**
 * 加载用户信息
 */
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

/**
 * 开始编辑
 */
const handleEdit = () => {
  isEditing.value = true
  originalUserInfo.value = { ...userInfo }
}

/**
 * 保存修改
 */
const handleSave = async () => {
  if (!userInfo.userName?.trim()) {
    Message.warning('用户名不能为空')
    return
  }

  saving.value = true
  try {
    const res = await updateMyProfile({
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

/**
 * 取消编辑
 */
const handleCancel = () => {
  Object.assign(userInfo, originalUserInfo.value)
  isEditing.value = false
}

/**
 * 头像上传成功
 */
const handleAvatarSuccess = (url: string) => {
  userInfo.userAvatar = url
    userStore.fetchLoginUser()
}

/**
 * 修改密码
 */
const handlePasswordChange = async (data: { oldPassword: string; newPassword: string }) => {
  if (!data.oldPassword || !data.newPassword) {
    Message.warning('请填写完整的密码信息')
    return
  }

  try {
    const res = await updateMyPassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    })
    
    if (res.data.code === 200) {
      Message.success('密码修改成功')
      showPasswordModal.value = false
    } else {
      Message.error(res.data.message || '密码修改失败')
    }
  } catch (error) {
    Message.error('密码修改失败，请检查当前密码是否正确')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped lang="less">
.user-profile-page {
  min-height: calc(100vh - 64px);
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

:deep(.arco-divider) {
  margin: 32px 0;
  border-color: #e5e6eb;
}

@media (max-width: 768px) {
  .user-profile-page {
    padding: 16px;
  }

  .profile-card {
    :deep(.arco-card-body) {
      padding: 24px 20px;
    }
  }

  .password-section {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
