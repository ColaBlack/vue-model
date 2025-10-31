<template>
  <div class="no-auth-page">
    <div class="no-auth-container">
      <!-- 403图标 -->
      <div class="error-icon-wrapper">
        <icon-lock class="error-icon" />
        <div class="error-code">403</div>
      </div>

      <!-- 错误信息 -->
      <h2 class="error-title">访问受限</h2>
      <p class="error-description">
        抱歉，您没有权限访问此页面<br />
        请联系管理员获取相应权限
      </p>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <a-button type="primary" size="large" @click="router.push('/')">
          <template #icon>
            <icon-home />
          </template>
          返回首页
        </a-button>
        <a-button size="large" @click="router.go(-1)">
          <template #icon>
            <icon-left />
          </template>
          返回上一页
        </a-button>
      </div>

      <!-- 装饰元素 -->
      <div class="decoration-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IconLock, IconHome, IconLeft } from '@arco-design/web-vue/es/icon'

const router = useRouter()
</script>

<style scoped lang="less">
.no-auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: moveBackground 20s linear infinite;
  }
}

@keyframes moveBackground {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.no-auth-container {
  position: relative;
  z-index: 1;
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
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

.error-icon-wrapper {
  position: relative;
  margin-bottom: 32px;
  display: inline-block;
}

.error-icon {
  font-size: 120px;
  color: #ff6b6b;
  opacity: 0.3;
}

.error-code {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 72px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 16px;
  color: #86909c;
  margin: 0 0 32px 0;
  line-height: 1.8;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;

  :deep(.arco-btn) {
    height: 44px;
    padding: 0 24px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }

  :deep(.arco-btn-primary) {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    border: none;
  }
}

.decoration-dots {
  margin-top: 40px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff6b6b;
  animation: bounce 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .no-auth-container {
    padding: 40px 24px;
  }

  .error-code {
    font-size: 56px;
  }

  .error-icon {
    font-size: 90px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;

    :deep(.arco-btn) {
      width: 100%;
    }
  }
}
</style>
