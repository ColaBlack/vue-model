<!--
  AI思考指示器组件
  
  功能：
  - 在AI生成回复时显示思考动画
  - 使用跳动的圆点动画，视觉效果友好
  - 提供明确的文字提示"AI 正在思考"
  
  设计理念：
  - 不像传统的消息气泡，避免用户误以为是两条消息
  - 使用渐变背景和左侧边框，区别于普通消息
  - 圆点跳动动画提供动态反馈
  
  使用示例：
  <ThinkingIndicator v-if="isAiThinking" />
-->
<template>
  <div class="thinking-indicator">
    <!-- 跳动的圆点动画 -->
    <div class="thinking-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    
    <!-- 思考文字提示 -->
    <span class="thinking-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * 组件属性类型定义
 */
interface Props {
  /** 
   * 显示的提示文字
   * 默认为 "AI 正在思考"
   */
  text?: string
}

// 接收属性（使用 withDefaults 设置默认值）
withDefaults(defineProps<Props>(), {
  text: 'AI 正在思考'
})
</script>

<style scoped lang="less">
/**
 * 思考指示器容器
 * 使用渐变背景和左侧边框，区别于普通消息
 */
.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 12px; // 圆点和文字之间的间距
  padding: 16px 20px;
  margin-bottom: 24px;
  background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%); // 蓝色渐变背景
  border-radius: 12px;
  border-left: 3px solid #0ea5e9; // 左侧蓝色边框，突出显示
  animation: fadeIn 0.3s ease-in; // 淡入动画
}

/**
 * 淡入动画
 * 组件出现时从上方轻微下移并淡入
 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * 思考圆点容器
 * 横向排列三个圆点
 */
.thinking-dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

/**
 * 单个圆点样式
 * 蓝色圆形，带有跳动动画
 */
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%; // 圆形
  background: #0ea5e9; // 蓝色
  animation: bounce 1.4s infinite ease-in-out; // 无限循环的跳动动画

  /**
   * 为三个圆点设置不同的动画延迟
   * 创建波浪式的跳动效果
   */
  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0s;
  }
}

/**
 * 跳动动画
 * 圆点在缩放和透明度之间循环变化
 */
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8); // 缩小
    opacity: 0.5; // 半透明
  }
  40% {
    transform: scale(1.2); // 放大
    opacity: 1; // 完全不透明
  }
}

/**
 * 思考文字样式
 * 蓝色文字，中等粗细
 */
.thinking-text {
  font-size: 14px;
  color: #0284c7; // 深蓝色
  font-weight: 500; // 中等粗细
}
</style>

