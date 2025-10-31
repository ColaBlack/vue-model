<template>
  <div id="loginPage">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>

    <!-- 登录卡片容器 -->
    <div class="login-container">
      <a-card class="login-card" :bordered="false">
        <!-- 头部 -->
        <div class="login-header">
          <div class="logo-container">
            <icon-safe class="logo-icon" :size="48" />
          </div>
          <h2 class="login-title">欢迎登录</h2>
          <p class="login-subtitle">水产品食品安全监测智能问答平台</p>
        </div>

        <!-- 登录表单 -->
        <a-form :model="form" class="login-form" layout="vertical">
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
              @press-enter="handleLogin"
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
              @press-enter="handleLogin"
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
            <template #extra>
              <div class="input-tip">密码由字母、数字组成，长度6-20位</div>
            </template>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              size="large"
              long
              class="login-btn"
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </a-button>
          </a-form-item>

          <a-form-item class="register-link-item">
            <div class="register-link">
              还没有账号？
              <a-link @click="toRegister" :hoverable="false">
                立即注册
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
import { userLogin } from '@/api/userController'
import { useUserStore } from '@/store/user'
import { Message } from '@arco-design/web-vue'
import { IconSafe, IconUser, IconLock } from '@arco-design/web-vue/es/icon'
import router from '@/router'
import { useRoute } from 'vue-router'

const form = reactive({
  userAccount: '',
  userPassword: ''
} as API.UserLoginRequest)

const userStore = useUserStore()
const loading = ref(false)

const handleLogin = async () => {
  // 基础验证
  if (!form.userAccount || !form.userPassword) {
    Message.warning('请填写完整的登录信息')
    return
  }

  loading.value = true
  try {
    const res = await userLogin(form)
    if (res.data.code === 200) {
      await userStore.fetchLoginUser()
      Message.success('登录成功！即将跳转')
      await router.push({
        path: redirect || '/',
        replace: true
      })
    } else {
      Message.error('登录失败！' + res.data.message)
    }
  } catch (error) {
    Message.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const route = useRoute()
const redirect = route.query.redirect as string | undefined

const toRegister = () => {
  router.push({
    path: '/user/register',
    query: { redirect: redirect ?? '' }
  })
}
</script>

<style scoped lang="less">
#loginPage {
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

// ========== 登录容器 ==========
.login-container {
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

// ========== 登录卡片 ==========
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  :deep(.arco-card-body) {
    padding: 40px 32px;
  }
}

// ========== 登录头部 ==========
.login-header {
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

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
  line-height: 1.5;
}

// ========== 登录表单 ==========
.login-form {
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

// ========== 登录按钮 ==========
.login-btn {
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

// ========== 注册链接 ==========
.register-link-item {
  margin-bottom: 0 !important;

  :deep(.arco-form-item-content-wrapper) {
    text-align: center;
  }
}

.register-link {
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
  .login-container {
    max-width: 100%;
    padding: 16px;
  }

  .login-card {
    :deep(.arco-card-body) {
      padding: 32px 24px;
    }
  }

  .login-title {
    font-size: 24px;
  }

  .login-subtitle {
    font-size: 13px;
  }
}
</style>
