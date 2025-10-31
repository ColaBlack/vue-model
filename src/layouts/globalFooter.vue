<template>
  <footer id="footer">
    <div class="footer-content">
      <!-- 主要内容区域 -->
      <div class="footer-main">
        <div class="footer-section">
          <div class="footer-logo">
            <icon-safe :size="32" />
            <span class="footer-logo-text">水产品安全监测</span>
          </div>
          <p class="footer-description">
            基于人工智能技术的水产品食品安全监测智能问答平台
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">快速链接</h4>
          <div class="footer-links">
            <a-link href="/" :hoverable="false">首页</a-link>
            <a-link href="/ai/chat" :hoverable="false">AI问答</a-link>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">关于项目</h4>
          <div class="footer-links">
            <a-link href="https://github.com/colablack" target="_blank" :hoverable="false">
              <template #icon>
                <icon-github />
              </template>
              GitHub
            </a-link>
            <a-link href="https://gitee.com/colablack" target="_blank" :hoverable="false">
              <template #icon>
                <icon-code />
              </template>
              Gitee
            </a-link>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-bottom">
        <a-divider />
        <p class="copyright">
          © {{ currentYear }} 水产品食品安全监测智能问答平台. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconSafe, IconGithub, IconCode } from '@arco-design/web-vue/es/icon'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="less">
#footer {
  background: linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%);
  border-top: 1px solid #e5e6eb;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.footer-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 32px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #667eea;
  margin-bottom: 8px;
}

.footer-logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  font-size: 14px;
  color: #86909c;
  line-height: 1.6;
  margin: 0;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.arco-link) {
    color: #4e5969;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
      color: #667eea;
      transform: translateX(4px);
    }
  }

  :deep(.arco-icon) {
    margin-right: 6px;
  }
}

.footer-bottom {
  :deep(.arco-divider) {
    margin: 24px 0;
    border-color: #e5e6eb;
  }
}

.copyright {
  text-align: center;
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    padding: 32px 20px 20px;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .copyright {
    font-size: 12px;
  }
}
</style>
