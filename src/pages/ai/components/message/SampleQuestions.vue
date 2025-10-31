<!--
  示例问题组件
  
  功能：
  - 在没有聊天记录时显示示例问题
  - 用户点击示例问题可快速开始对话
  - 提供友好的空状态提示
  
  使用示例：
  <SampleQuestions @select="handleQuestionSelect" />
-->
<template>
  <div class="sample-questions">
    <a-empty description="暂无聊天记录，开始对话吧！">
      <template #extra>
        <a-space direction="vertical" size="large" :style="{ marginTop: '20px' }">
          <!-- 提示文字 -->
          <div class="hint-text">试试这些问题：</div>
          
          <!-- 示例问题标签列表 -->
          <a-space wrap>
            <a-tag
              v-for="(question, index) in questions"
              :key="index"
              color="arcoblue"
              class="question-tag"
              @click="handleSelect(question)"
            >
              {{ question }}
            </a-tag>
          </a-space>
        </a-space>
      </template>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
/**
 * 组件属性类型定义
 */
interface Props {
  /** 
   * 示例问题列表
   * 如果不传入，则使用默认问题列表
   */
  questions?: string[]
}

/**
 * 组件事件类型定义
 */
interface Emits {
  /** 选择示例问题事件，传递问题文本 */
  (e: 'select', question: string): void
}

// 接收属性（使用 withDefaults 设置默认值）
const props = withDefaults(defineProps<Props>(), {
  questions: () => [
    '什么是人工智能？',
    '如何学习编程？',
    '请介绍一下 Vue 3',
    '今天天气怎么样？'
  ]
})

// 定义事件
const emit = defineEmits<Emits>()

/**
 * 处理示例问题选择
 * 当用户点击某个示例问题标签时触发
 * 
 * @param question 被选中的问题文本
 */
const handleSelect = (question: string) => {
  emit('select', question)
}
</script>

<style scoped lang="less">
/**
 * 示例问题容器
 * 居中显示，提供舒适的视觉体验
 */
.sample-questions {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}

/**
 * 提示文字样式
 * 灰色小字，温和提示用户
 */
.hint-text {
  color: #86909c;
  font-size: 14px;
  text-align: center;
}

/**
 * 问题标签样式
 * 可点击，有悬停效果
 */
.question-tag {
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.2s ease;

  /**
   * 悬停效果
   * 鼠标移上时放大并增加阴影，提供交互反馈
   */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
  }

  /**
   * 点击效果
   * 点击时稍微缩小，提供按下的感觉
   */
  &:active {
    transform: translateY(0);
  }
}
</style>

