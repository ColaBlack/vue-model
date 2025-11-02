<!--
  AI聊天室主页面
  
  功能：
  - 管理聊天会话
  - 协调各子组件
  - 处理SSE流式通信
  - 管理历史记录
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
            @use-sample="handleUseSampleQuestion"
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
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconDoubleRight } from '@arco-design/web-vue/es/icon'

// 导入子组件
import ChatSidebar from './components/ChatSidebar.vue'
import ChatHeader from './components/ChatHeader.vue'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'

// 导入 Composables
import { useChatHistory } from './composables/useChatHistory'
import { useChatRoomManagement } from './composables/useChatRoomManagement'
import { useSSEConnection } from './composables/useSSEConnection'

// 导入工具函数和类型
import { generateChatId } from './utils/chatId'
import type { ModelConfig } from './types'
import { DEFAULT_MODEL } from './constants/models'

// ==================== 路由相关 ====================
const route = useRoute()
const router = useRouter()

// ==================== 状态管理 ====================
const chatId = ref<string>('')
const userInput = ref<string>('')
const sidebarCollapsed = ref<boolean>(false)
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null)

// 使用 Composables
const {
  messages,
  loadHistoryMessages,
  saveHistoryMessages,
  addUserMessage,
  addAIMessage,
  updateLastAIMessage,
  completeLastAIMessage,
  clearMessages
} = useChatHistory()

const {
  chatRoomList,
  loadingHistory,
  isNewChatRoom,
  loadChatRoomList,
  createChatRoomRecord,
  checkIfNewChatRoom
} = useChatRoomManagement()

const {
  isConnecting,
  isLoading,
  connectSSE,
  closeSSE
} = useSSEConnection()

// ==================== 会话管理 ====================

/**
 * 初始化聊天室
 * 从路由参数获取 chatId，如果没有则生成新的
 */
const initChatRoom = async () => {
  const routeChatId = route.params.chatId as string
  if (routeChatId) {
    chatId.value = routeChatId
  } else {
    const newChatId = generateChatId()
    chatId.value = newChatId
    router.replace(`/ai/chat/${newChatId}`)
  }

  // 加载历史消息
  await loadHistoryMessages(chatId.value)
  
  // 检查当前聊天室是否在历史记录列表中
  checkIfNewChatRoom(chatId.value)
}

/**
 * 创建新聊天
 */
const handleCreateNewChat = () => {
  const newChatId = generateChatId()
  router.push(`/ai/chat/${newChatId}`)
  clearMessages()
  chatId.value = newChatId
  isNewChatRoom.value = true
}

/**
 * 切换聊天室
 */
const handleSwitchChatRoom = async (roomId: string) => {
  if (!roomId || roomId === chatId.value) {
    return
  }

  // 关闭当前的 SSE 连接
  closeSSE()

  // 更新路由和 chatId
  router.push(`/ai/chat/${roomId}`)
  chatId.value = roomId
  isNewChatRoom.value = false

  // 加载新会话的历史消息
  clearMessages()
  await loadHistoryMessages(roomId)
}

// ==================== 消息管理 ====================

/**
 * 使用示例问题
 */
const handleUseSampleQuestion = (question: string) => {
  userInput.value = question
  
  // 使用默认配置
  const defaultConfig: ModelConfig = {
    model: DEFAULT_MODEL,
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
 * 处理发送消息事件
 */
const handleSendMessage = async (config: ModelConfig) => {
  const prompt = userInput.value.trim()

  // 验证输入
  if (!prompt || isConnecting.value) {
    return
  }

  if (prompt.length > 1000) {
    Message.error('提问长度不能超过1000字')
    return
  }

  // 如果是第一条消息，先在后端创建聊天室记录
  const isFirstMessage = messages.value.length === 0
  
  if (isFirstMessage) {
    const backendChatId = await createChatRoomRecord(prompt)
    
    if (backendChatId && backendChatId !== chatId.value) {
            chatId.value = backendChatId
            router.replace(`/ai/chat/${backendChatId}`)
          }
  }

  // 添加用户消息到界面
  addUserMessage(prompt)

  // 清空输入框
  userInput.value = ''

  // 立即保存到 localStorage
  saveHistoryMessages(chatId.value)

  // 添加一个空的 AI 消息用于流式显示
  addAIMessage()

  // 建立 SSE 连接获取 AI 回复
  await connectSSE(config, chatId.value, prompt, {
    onMessage: (data: string) => {
      updateLastAIMessage(data)
    },
    onComplete: () => {
      completeLastAIMessage()
      saveHistoryMessages(chatId.value)
      
      // 如果是新聊天室的首条消息，刷新列表并更新状态
      if (isNewChatRoom.value && isFirstMessage) {
        loadChatRoomList()
        isNewChatRoom.value = false
      }
    },
    onError: (error: Error) => {
      Message.error('获取回复失败，请重试')
      completeLastAIMessage()
    }
  })

  // 自动滚动到底部
  setTimeout(() => {
    messageListRef.value?.scrollToBottom()
  }, 100)
}

// ==================== 生命周期钩子 ====================

onMounted(async () => {
  // 初始化聊天室
  await initChatRoom()
  
  // 加载历史聊天室列表
  await loadChatRoomList()
  
  // 检查当前聊天室状态
  checkIfNewChatRoom(chatId.value)
})

// 监听路由变化
watch(
  () => route.params.chatId,
  async (newChatId) => {
    if (newChatId && newChatId !== chatId.value) {
      chatId.value = newChatId as string
      clearMessages()
      await loadHistoryMessages(chatId.value)
      checkIfNewChatRoom(chatId.value)
    }
  }
)

// 组件卸载时关闭 SSE 连接
onUnmounted(() => {
  closeSSE()
})
</script>

<style scoped lang="less">
@import './styles/index.less';

// 聊天容器（全屏高度）
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

// 浮动展开按钮
.expand-btn {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background: #165dff;
  color: white;
  padding: 12px 8px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 2px 0 8px rgba(22, 93, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: #4080ff;
    padding-left: 12px;
    box-shadow: 2px 0 12px rgba(22, 93, 255, 0.5);
  }

  .expand-text {
    font-size: 12px;
    writing-mode: vertical-lr;
    letter-spacing: 2px;
  }
}

// 布局容器
.chat-layout {
  flex: 1;
  overflow: hidden;
}

// 聊天内容区
.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  padding: 20px;
  overflow-y: auto;
  .custom-scrollbar();
}
</style>
