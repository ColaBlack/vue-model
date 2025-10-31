<template>
  <div id="registerPage">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>

    <!-- 注册卡片容器 -->
    <div class="register-container">
      <a-card class="register-card" :bordered="false">
        <!-- 头部 -->
        <div class="register-header">
          <div class="logo-container">
            <icon-user-add class="logo-icon" :size="48" />
          </div>
          <h2 class="register-title">创建账号</h2>
          <p class="register-subtitle">加入水产品食品安全监测智能问答平台</p>
        </div>

        <!-- 注册表单 -->
        <a-form :model="form" class="register-form" layout="vertical">
          <a-form-item
            field="userAccount"
            label="账号"
            :rules="[{ required: true, message: '请输入账号' }]"
            validate-trigger="blur"
            hide-label
          >
            <a-input
              v-model="form.userAccount"
              placeholder="请输入账号"
              size="large"
              allow-clear
              @press-enter="handleRegister"
            >
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
            <template #extra>
              <div class="input-tip">账号由字母、数字组成，长度4-20位</div>
            </template>
          </a-form-item>

          <a-form-item
            field="userPassword"
            label="密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            validate-trigger="blur"
            hide-label
          >
            <a-input-password
              v-model="form.userPassword"
              placeholder="请输入密码"
              size="large"
              allow-clear
              @press-enter="handleRegister"
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
            <template #extra>
              <div class="input-tip">密码由字母、数字组成，长度6-20位，不能是纯数字或纯字母</div>
            </template>
          </a-form-item>

          <a-form-item
            field="checkPassword"
            label="确认密码"
            :rules="[{ required: true, message: '请再次输入密码' }]"
            validate-trigger="blur"
            hide-label
          >
            <a-input-password
              v-model="form.checkPassword"
              placeholder="请再次输入密码"
              size="large"
              allow-clear
              @press-enter="handleRegister"
            >
              <template #prefix>
                <icon-check-circle />
              </template>
            </a-input-password>
            <template #extra>
              <div class="input-tip">两次输入的密码必须一致</div>
            </template>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              size="large"
              long
              class="register-btn"
              @click="handleRegister"
              :loading="loading"
            >
              注册
            </a-button>
          </a-form-item>

          <a-form-item class="login-link-item">
            <div class="login-link">
              已有账号？
              <a-link @click="toLogin" :hoverable="false">
                立即登录
              </a-link>
            </div>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { Message } from '@arco-design/web-vue'
import { IconUserAdd, IconUser, IconLock, IconCheckCircle } from '@arco-design/web-vue/es/icon'
import router from '@/router'
import { userRegister } from '@/api/userController'
import { useRoute } from 'vue-router'

const form = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
} as API.UserRegisterRequest)

const userStore = useUserStore()
const loading = ref(false)

const route = useRoute()
const redirect = route.query.redirect as string | undefined

const handleRegister = async () => {
  // 基础验证
  if (!form.userAccount || !form.userPassword || !form.checkPassword) {
    Message.warning('请填写完整的注册信息')
    return
  }

  if (form.userPassword !== form.checkPassword) {
    Message.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    const res = await userRegister(form)
    if (res.data.code === 200) {
      await userStore.fetchLoginUser()
      Message.success('注册成功！')
      setTimeout(() => {
        router.push({ path: redirect || '/' })
      }, 1000)
    } else {
      Message.error('注册失败！' + res.data.message)
    }
  } catch (error) {
    Message.error('注册失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const toLogin = () => {
  router.push({ path: '/user/login', query: { redirect: redirect ?? '' } })
}
</script>

<style scoped lang="less">
#registerPage {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

// ========== 背景装饰 ==========
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  opacity: 0.1;
  border-radius: 40%;
}

.wave1 {
  top: -150%;
  left: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: wave1 25s infinite linear;
}

.wave2 {
  top: -140%;
  right: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
  animation: wave2 20s infinite linear;
}

.wave3 {
  bottom: -150%;
  left: -30%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  animation: wave3 30s infinite linear;
}

@keyframes wave1 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes wave2 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

@keyframes wave3 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// ========== 注册容器 ==========
.register-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 20px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ========== 注册卡片 ==========
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  :deep(.arco-card-body) {
    padding: 40px 32px;
  }
}

// ========== 注册头部 ==========
.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  
  .logo-icon {
    color: white;
  }
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.register-subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
  line-height: 1.5;
}

// ========== 注册表单 ==========
.register-form {
  :deep(.arco-form-item) {
    margin-bottom: 20px;
  }

  :deep(.arco-input-wrapper),
  :deep(.arco-input-password) {
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
    font-size: 16px;
  }

  .input-tip {
    font-size: 12px;
    color: #86909c;
    margin-top: 4px;
  }
}

// ========== 注册按钮 ==========
.register-btn {
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-top: 8px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// ========== 登录链接 ==========
.login-link-item {
  margin-bottom: 0 !important;

  :deep(.arco-form-item-content-wrapper) {
    text-align: center;
  }
}

.login-link {
  font-size: 14px;
  color: #86909c;

  :deep(.arco-link) {
    color: #667eea;
    font-weight: 500;
    
    &:hover {
      color: #764ba2;
    }
  }
}

// ========== 响应式设计 ==========
@media (max-width: 768px) {
  .register-container {
    max-width: 100%;
    padding: 16px;
  }

  .register-card {
    :deep(.arco-card-body) {
      padding: 32px 24px;
    }
  }

  .register-title {
    font-size: 24px;
  }

  .register-subtitle {
    font-size: 13px;
  }
}
</style>
