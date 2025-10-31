<template>
  <div class="welcome-container">
    <!-- 头部横幅 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <icon-safe />
        </div>
        <h1 class="hero-title">水产品食品安全监测</h1>
        <h2 class="hero-subtitle">智能问答平台</h2>
        <p class="hero-description">
          基于人工智能技术，通过对话式交互，为你解答水产品食品安全相关问题
        </p>
        <div class="hero-actions">
          <a-button type="primary" size="large" @click="handleStartChat">
            <template #icon>
              <icon-robot />
            </template>
            开始问答
          </a-button>
          <a-button size="large" @click="scrollToFeatures">
            <template #icon>
              <icon-info-circle />
            </template>
            了解更多
          </a-button>
        </div>
      </div>
      
      <!-- 背景装饰 -->
      <div class="hero-bg">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
      </div>
    </div>

    <!-- 功能特色区域 -->
    <div class="features-section" ref="featuresRef">
      <div class="section-header">
        <h3 class="section-title">核心功能</h3>
        <p class="section-subtitle">简单、快速、智能的水产品食品安全知识咨询服务</p>
      </div>

      <div class="features-grid">
        <a-card
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
          :hoverable="true"
        >
          <div class="feature-icon" :style="{ background: feature.color }">
            <component :is="feature.icon" :size="32" />
          </div>
          <h4 class="feature-title">{{ feature.title }}</h4>
          <p class="feature-description">{{ feature.description }}</p>
        </a-card>
      </div>
    </div>

    <!-- 应用场景区域 -->
    <div class="scenarios-section">
      <div class="section-header">
        <h3 class="section-title">应用场景</h3>
        <p class="section-subtitle">解答你关心的水产品食品安全检测问题</p>
      </div>

      <div class="scenarios-grid">
        <div
          v-for="scenario in scenarios"
          :key="scenario.title"
          class="scenario-item"
        >
          <div class="scenario-icon">
            <component :is="scenario.icon" :size="28" />
          </div>
          <div class="scenario-content">
            <h5 class="scenario-title">{{ scenario.title }}</h5>
            <p class="scenario-description">{{ scenario.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 开始使用区域 -->
    <div class="cta-section">
      <div class="cta-content">
        <h3 class="cta-title">准备好开始了吗？</h3>
        <p class="cta-description">
          立即体验智能问答平台，快速获取水产品食品安全专业知识和解答
        </p>
        <a-button type="primary" size="large" @click="handleStartChat">
          <template #icon>
            <icon-send />
          </template>
          立即开始
        </a-button>
      </div>
    </div>

    <!-- 页脚统计信息 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IconSafe,
  IconRobot,
  IconInfoCircle,
  IconSend,
  IconSearch,
  IconFile,
  IconBarChart,
  IconNotification,
  IconCheckCircle,
  IconEye,
  IconCustomerService,
  IconClockCircle
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const featuresRef = ref<HTMLElement | null>(null)

// 功能特色
const features = [
  {
    icon: IconRobot,
    title: '智能问答',
    description: '基于AI技术，理解自然语言提问，快速回答水产品食品安全相关问题',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: IconCustomerService,
    title: '专业解答',
    description: '提供水产品安全检测知识、标准规范等专业内容的智能咨询服务',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: IconSearch,
    title: '知识检索',
    description: '快速查找水产品食品安全相关的知识、标准和常见问题解答',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    icon: IconClockCircle,
    title: '对话记录',
    description: '自动保存对话历史，方便随时查看和回顾之前的咨询内容',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
]

// 应用场景
const scenarios = [
  {
    icon: IconCheckCircle,
    title: '标准规范咨询',
    description: '了解水产品食品安全相关的国家标准和规范要求'
  },
  {
    icon: IconEye,
    title: '指标知识解答',
    description: '询问各项检测指标的含义、作用和判断标准'
  },
  {
    icon: IconNotification,
    title: '安全问题咨询',
    description: '咨询水产品食品安全相关的常见问题和注意事项'
  },
  {
    icon: IconSearch,
    title: '检测知识查询',
    description: '了解水产品检测方法、流程和相关专业知识'
  },
  {
    icon: IconFile,
    title: '法规政策解读',
    description: '查询和理解水产品食品安全相关的法律法规'
  },
  {
    icon: IconInfoCircle,
    title: '行业信息咨询',
    description: '获取水产品食品安全监测行业的相关信息'
  }
]

// 统计数据
const stats = [
  { value: 'AI驱动', label: '智能问答引擎' },
  { value: '即时响应', label: '快速获取答案' },
  { value: '对话式', label: '自然语言交互' },
  { value: '24/7', label: '随时随地访问' }
]

// 开始聊天
const handleStartChat = () => {
  router.push('/ai/chat')
}

// 滚动到功能区域
const scrollToFeatures = () => {
  if (featuresRef.value) {
    featuresRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="less">
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
}

// ========== 头部横幅区域 ==========
.hero-section {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  
  :deep(.arco-icon) {
    font-size: 50px;
  }
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 20px 0;
  opacity: 0.95;
}

.hero-description {
  font-size: 18px;
  line-height: 1.8;
  margin: 0 0 40px 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  
  :deep(.arco-btn) {
    height: 48px;
    padding: 0 32px;
    font-size: 16px;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }
  
  :deep(.arco-btn-primary) {
    background: #ffffff;
    color: #667eea;
    border: none;
    
    &:hover {
      background: #f0f0f0;
    }
  }
  
  :deep(.arco-btn:not(.arco-btn-primary)) {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.8);
    }
  }
}

// 背景波浪动画
.hero-bg {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat-x;
  animation: wave 20s linear infinite;
}

.wave1 {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation-duration: 25s;
}

.wave2 {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation-duration: 20s;
  animation-delay: -5s;
}

.wave3 {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation-duration: 30s;
  animation-delay: -10s;
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

// ========== 功能特色区域 ==========
.features-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 16px 0;
}

.section-subtitle {
  font-size: 16px;
  color: #86909c;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  border-radius: 12px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.arco-card-body) {
    padding: 32px 24px;
  }
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  margin-bottom: 20px;
  color: white;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 12px 0;
}

.feature-description {
  font-size: 14px;
  color: #86909c;
  line-height: 1.6;
  margin: 0;
}

// ========== 应用场景区域 ==========
.scenarios-section {
  padding: 80px 20px;
  background: #f7f8fa;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 24px;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.scenario-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    transform: translateX(4px);
  }
}

.scenario-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.scenario-content {
  flex: 1;
}

.scenario-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.scenario-description {
  font-size: 14px;
  color: #86909c;
  line-height: 1.6;
  margin: 0;
}

// ========== 行动号召区域 ==========
.cta-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 80px 0;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  color: white;
}

.cta-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.cta-description {
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.cta-section :deep(.arco-btn-primary) {
  height: 48px;
  padding: 0 40px;
  font-size: 16px;
  border-radius: 24px;
  background: white;
  color: #667eea;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
}

// ========== 统计信息区域 ==========
.stats-section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #86909c;
}

// ========== 响应式设计 ==========
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 24px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .features-grid,
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .stat-value {
    font-size: 36px;
  }
}
</style>
