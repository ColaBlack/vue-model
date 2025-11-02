<!--
  AI聊天室主页面（重构版）
  
  功能：
  - 管理聊天会话
  - 协调各子组件
  - 处理SSE流式通信
  - 管理历史记录
  
  重构优化：
  - 使用 composables 管理业务逻辑，提高可维护性
  - 使用统一的类型定义
  - 简化组件逻辑，提高可读性
-->
<template>
  <div class="chat-container">
    <!-- 浮动展开按钮（在侧边栏折叠时显示） -->
    <div v-if="sidebarCollapsed" class="expand-btn" @click="sidebarCollapsed = false">
      <icon-double-right />
      <span class="expand-text">历史记录</span>
    </div>

    <a-layout class="chat-layout">
      <!-- 左侧历史记录栏 -->
      <ChatSidebar
        v-model:collapsed="sidebarCollapsed"
        :chat-room-list="chatRoomList"
        :current-chat-id="chatId"
        :loading="loadingHistory"
        @refresh="loadChatRoomList"
        @create="handleCreateNewChat"
        @switch="handleSwitchChatRoom"
      />

      <!-- 右侧主内容区 -->
      <a-layout>
        <a-layout-content class="chat-content">
          <!-- 聊天头部 -->
          <ChatHeader :chat-id="chatId" />

          <a-divider />

          <!-- 消息列表 -->
          <MessageList
            ref="messageListRef"
            :messages="messages"
            :is-loading="isLoading"
            @use-sample="handleUseSample"
          />
        </a-layout-content>

        <!-- 输入框区域 -->
        <ChatInput
          v-model="userInput"
          :is-connecting="isConnecting"
          :chat-id="chatId"
          @send="handleSendMessage"
        />
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconDoubleRight } from '@arco-design/web-vue/es/icon'

// 导入子组件
import ChatSidebar from './components/ChatSidebar.vue'
import ChatHeader from './components/ChatHeader.vue'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'

// 导入 composables
import { useChatRoom } from './composables/useChatRoom'
import { useChatMessages, type ModelConfig } from './composables/useChatMessages'

// ==================== 路由相关 ====================
const route = useRoute()

// ==================== 状态管理 ====================

/** 侧边栏折叠状态 */
const sidebarCollapsed = ref<boolean>(false)

/** 消息列表组件引用 */
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)

// ==================== 聊天室管理 ====================

const {
  chatId,
  chatRoomList,
  loadingHistory,
  initChatRoom,
  createNewChat,
  switchChatRoom,
  loadChatRoomList,
  createChatRoom
} = useChatRoom()

// ==================== 消息管理 ====================

const {
  messages,
  userInput,
  isConnecting,
  isLoading,
  sendMessage,
  loadHistoryMessages,
  closeConnection,
  clearMessages
} = useChatMessages(chatId, handleFirstMessage)

// ==================== 业务逻辑 ====================

/**
 * 处理第一条消息发送
 * 在后端创建聊天室记录
 * 
 * @param prompt 用户的第一条消息
 * @returns Promise<string | null> 后端创建的聊天室ID
 */
async function handleFirstMessage(prompt: string): Promise<string | null> {
  return await createChatRoom(prompt)
}

/**
 * 处理创建新聊天
 */
function handleCreateNewChat() {
  // 关闭当前的SSE连接
  closeConnection()
  
  // 清空消息列表
  clearMessages()
  
  // 创建新聊天
  createNewChat()
}

/**
 * 处理切换聊天室
 * 
 * @param roomId 目标聊天室ID
 */
async function handleSwitchChatRoom(roomId: string) {
  if (!roomId || roomId === chatId.value) {
    return
  }

  // 关闭当前的SSE连接
  closeConnection()

  // 重置状态
  isConnecting.value = false
  isLoading.value = false

  // 切换到新聊天室
  await switchChatRoom(roomId)

  // 清空并加载新的消息列表
  clearMessages()
  await loadHistoryMessages()
}

/**
 * 处理使用示例问题
 * 
 * @param question 示例问题文本
 */
function handleUseSample(question: string) {
  userInput.value = question
  
  // 使用默认配置发送消息
  const defaultConfig: ModelConfig = {
    model: 'glm-4.5-flash',
    isVision: false,
    useWebSearch: false,
    useRAG: false,
    useToolCalling: false
  }
  
  // 延迟一帧再发送，确保输入框已更新
  setTimeout(() => {
    handleSendMessage(defaultConfig)
  }, 0)
}

/**
 * 处理发送消息
 * 
 * @param config 模型配置
 */
async function handleSendMessage(config: ModelConfig) {
  await sendMessage(config)
}

// ==================== 生命周期 ====================

/**
 * 组件挂载
 * 初始化聊天室并加载历史记录
 */
onMounted(async () => {
  // 初始化聊天室
  const routeChatId = route.params.chatId as string
  initChatRoom(routeChatId)
  
  // 加载历史记录
  await loadChatRoomList()
  await loadHistoryMessages()
})

/**
 * 组件卸载
 * 关闭SSE连接，防止内存泄漏
 */
onUnmounted(() => {
  closeConnection()
})

/**
 * 监听路由变化
 * 当URL中的chatId变化时，自动切换会话
 */
watch(
  () => route.params.chatId,
  async (newChatId) => {
    if (newChatId && newChatId !== chatId.value) {
      await handleSwitchChatRoom(newChatId as string)
    }
  }
)
</script>

<style scoped lang="less">
// 容器样式
.chat-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px); // 减去顶部导航栏高度
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 浮动展开按钮（侧边栏折叠时显示）
.expand-btn {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 12px 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 4px 0 16px rgba(102, 126, 234, 0.4);
  
  &:hover {
    width: 56px;
    box-shadow: 4px 0 24px rgba(102, 126, 234, 0.6);
    background: linear-gradient(135deg, #7b8ef0 0%, #8a5fb5 100%);
    
    .expand-text {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  // 图标
  :deep(.arco-icon) {
    font-size: 20px;
  }

  // 文字
  .expand-text {
    font-size: 12px;
    writing-mode: vertical-rl;
    letter-spacing: 2px;
    opacity: 0.9;
    transition: opacity 0.2s;
  }
}

// 布局样式
.chat-layout {
  height: 100%;
  background: #ffffff;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.08);
  border-radius: 0;
  overflow: hidden;
}

// 内容区域样式
.chat-content {
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
  background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);

  :deep(.arco-divider) {
    margin: 16px 0;
    border-color: #e5e6eb;
  }

  // 美化滚动条
  :deep(*::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }

  :deep(*::-webkit-scrollbar-track) {
    background: #f5f6f7;
    border-radius: 4px;
  }

  :deep(*::-webkit-scrollbar-thumb) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    
    &:hover {
      background: linear-gradient(135deg, #7b8ef0 0%, #8a5fb5 100%);
    }
  }
}

// 响应式优化
@media (max-width: 768px) {
  .chat-content {
    padding: 16px;
  }
  
  .expand-btn {
    width: 40px;
    height: 100px;
    
    &:hover {
      width: 44px;
    }
    
    .expand-text {
      font-size: 11px;
    }
  }
}
</style>
