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
        @create="createNewChat"
        @switch="switchChatRoom"
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
            @use-sample="useSampleQuestion"
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
import { createSSEConnection } from '@/utils/sse'
import { listChatRooms, createChatRoom, getChatRoomMessages } from '@/api/aiController'

// 导入子组件
import ChatSidebar from './components/ChatSidebar.vue'
import ChatHeader from './components/ChatHeader.vue'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'
import type { ChatMessage } from './components/MessageItem.vue'
import type { ModelConfig } from './components/ChatInput.vue'

// ==================== 路由相关 ====================
const route = useRoute()
const router = useRouter()

// ==================== 状态管理 ====================
const chatId = ref<string>('') // 当前聊天室ID
const messages = ref<ChatMessage[]>([]) // 消息列表
const userInput = ref<string>('') // 用户输入
const isConnecting = ref<boolean>(false) // 是否正在连接（发送中）
const isLoading = ref<boolean>(false) // 是否正在加载（AI思考中）
const chatRoomList = ref<API.ChatRoomVO[]>([]) // 历史聊天室列表
const loadingHistory = ref<boolean>(false) // 历史记录加载状态
const sidebarCollapsed = ref<boolean>(false) // 侧边栏折叠状态
const isNewChatRoom = ref<boolean>(true) // 是否是新建的聊天室（用于判断是否需要刷新列表）
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null) // 消息列表组件引用
let eventSource: EventSource | null = null // SSE连接对象

// ==================== 会话管理 ====================

/**
 * 生成唯一的聊天室ID
 * @returns 聊天室ID字符串
 */
const generateChatId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 初始化聊天室
 * 从路由参数获取chatId，如果没有则生成新的
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

  // 加载历史消息（优先从后端加载）
  await loadHistoryMessages()
  
  // 检查当前聊天室是否在历史记录列表中
  checkIfNewChatRoom()
}

/**
 * 创建新聊天
 * 生成新的chatId并跳转
 */
const createNewChat = () => {
  const newChatId = generateChatId()
  console.log('🆕 创建新聊天，ID:', newChatId)
  router.push(`/ai/chat/${newChatId}`)
  messages.value = []
  chatId.value = newChatId
  isNewChatRoom.value = true // 标记为新聊天室
  console.log('  - isNewChatRoom 设置为 true')
}

/**
 * 检查当前聊天室是否在历史记录列表中
 */
const checkIfNewChatRoom = () => {
  const exists = chatRoomList.value.some(room => room.chatroom === chatId.value)
  isNewChatRoom.value = !exists
  console.log('🔍 检查聊天室状态:')
  console.log('  - chatId:', chatId.value)
  console.log('  - 列表中的聊天室数量:', chatRoomList.value.length)
  console.log('  - 是否存在于列表中:', exists)
  console.log('  - isNewChatRoom:', isNewChatRoom.value)
  console.log('  - 列表:', chatRoomList.value.map(r => r.chatroom))
}

/**
 * 切换聊天室
 * @param roomId 目标聊天室ID
 */
const switchChatRoom = async (roomId: string) => {
  if (!roomId || roomId === chatId.value) {
    return
  }

  // 关闭当前的SSE连接
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }

  // 重置状态
  isConnecting.value = false
  isLoading.value = false

  // 更新路由和chatId
  router.push(`/ai/chat/${roomId}`)
  chatId.value = roomId
  isNewChatRoom.value = false // 切换到历史聊天室，不是新的

  // 加载新会话的历史消息
  messages.value = []
  await loadHistoryMessages()
}

// ==================== 消息管理 ====================

/**
 * 从后端加载历史消息
 * 优先从后端加载，如果失败则从localStorage加载
 */
const loadHistoryMessages = async () => {
  try {
    console.log('📖 开始加载聊天室历史消息:', chatId.value)
    
    // 尝试从后端加载
    const response = await getChatRoomMessages({ chatroomId: chatId.value })
    
    console.log('📡 后端响应:', response)
    
    if (response.status === 200 && response.data.code === 0) {
      const messageList = response.data.data || []
      console.log('✅ 从后端加载了', messageList.length, '条历史消息')
      
      // 转换后端消息格式为前端消息格式
      // ChatMemoryVO: { id, content, type: 'user'|'ai', timestamp }
      messages.value = messageList.map((msg: API.ChatMemoryVO) => ({
        role: msg.type as 'user' | 'ai',
        content: msg.content || '',
        timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
        isStreaming: false
      }))
      
      console.log('📝 转换后的消息列表:', messages.value)
      
      // 同时保存到localStorage作为缓存
      saveHistoryMessages()
      return
    } else {
      console.warn('⚠️ 后端返回非成功状态:', response.data)
    }
  } catch (error) {
    console.warn('⚠️ 从后端加载历史消息失败，尝试从本地缓存加载:', error)
  }
  
  // 如果后端加载失败，从localStorage加载
  try {
    const historyKey = `chat_history_${chatId.value}`
    const historyData = localStorage.getItem(historyKey)
    if (historyData) {
      messages.value = JSON.parse(historyData)
      console.log('📦 从localStorage加载了', messages.value.length, '条缓存消息')
    } else {
      console.log('ℹ️ 没有找到历史消息')
      messages.value = []
    }
  } catch (error) {
    console.error('❌ 加载历史消息失败:', error)
    messages.value = []
  }
}

/**
 * 保存历史消息到localStorage
 */
const saveHistoryMessages = () => {
  try {
    const historyKey = `chat_history_${chatId.value}`
    localStorage.setItem(historyKey, JSON.stringify(messages.value))
  } catch (error) {
    console.error('保存历史消息失败:', error)
  }
}

/**
 * 使用示例问题
 * @param question 问题文本
 */
const useSampleQuestion = (question: string) => {
  userInput.value = question
  // 使用默认配置（标准文本模型，不开启额外功能）
  const defaultConfig: ModelConfig = {
    model: 'glm-4.5-flash',
    isVision: false,
    useWebSearch: false,
    useRAG: false,
    useToolCalling: false
  }
  // 延迟一帧再发送，确保输入框已更新
  setTimeout(() => {
    sendMessage(defaultConfig)
  }, 0)
}

/**
 * 处理发送消息事件（接收来自ChatInput的模型配置）
 */
const handleSendMessage = (config: ModelConfig) => {
  sendMessage(config)
}

/**
 * 发送消息
 * 主要流程：
 * 1. 验证输入
 * 2. 首次消息时创建聊天室
 * 3. 添加用户消息
 * 4. 根据模型类型建立SSE连接获取AI回复
 * 5. 保存消息到localStorage
 * 
 * @param config 模型配置参数
 */
const sendMessage = async (config: ModelConfig) => {
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
  console.log('📝 发送消息 - isFirstMessage:', isFirstMessage, 'isNewChatRoom:', isNewChatRoom.value)
  
  if (isFirstMessage) {
    try {
      console.log('🔨 正在创建聊天室...')
      const response = await createChatRoom({
        userPrompt: prompt
      })

      console.log('✅ 创建聊天室响应:', response)

      // 检查HTTP状态码200表示成功
      if (response.status === 200) {
        const data: any = response.data.data || response.data
        const backendChatId = data?.chatroom || data?.chatroomId || data?.id

        if (backendChatId) {
          console.log('✅ 聊天室创建成功，ID:', backendChatId)

          // 更新为后端返回的chatId
          if (backendChatId !== chatId.value) {
            console.log('🔄 更新 chatId 从', chatId.value, '到', backendChatId)
            chatId.value = backendChatId
            router.replace(`/ai/chat/${backendChatId}`)
          }
          
          // 立即刷新聊天室列表
          console.log('🔄 聊天室创建成功，立即刷新历史记录列表')
          setTimeout(() => {
            loadChatRoomList()
          }, 500) // 延迟500ms确保后端已经保存
          
        } else {
          console.warn('⚠️ 后端未返回聊天室ID，使用前端生成的ID')
        }
      } else {
        console.error('❌ 创建聊天室失败，状态码:', response.status)
        Message.warning('聊天室创建失败，但可以继续对话')
      }
    } catch (error: any) {
      console.error('❌ 创建聊天室失败:', error)
      Message.warning('聊天室创建失败，但可以继续对话')
    }
  }

  // 添加用户消息
  const userMessage: ChatMessage = {
    role: 'user',
    content: prompt,
    timestamp: Date.now()
  }
  messages.value.push(userMessage)

  // 清空输入框
  userInput.value = ''

  // 创建AI消息占位符（用于接收流式回复）
  const aiMessage: ChatMessage = {
    role: 'ai',
    content: '',
    timestamp: Date.now(),
    isStreaming: true
  }
  messages.value.push(aiMessage)
  const aiMessageIndex = messages.value.length - 1

  // 开始SSE连接
  isConnecting.value = true
  isLoading.value = true

  try {
    // 根据模型类型构建请求参数
    let requestData: any
    let endpoint: string
    
    if (config.isVision) {
      // 视觉模型请求
      endpoint = '/ai/vision-chat'
      requestData = {
        userPrompt: prompt,
        chatId: chatId.value,
        imageUrls: [], // 暂时为空，后续可以添加图片上传功能
        visionModelType: config.model === 'vision' ? 'vision' : 'vision_reasoning'
      }
    } else {
      // 文本模型请求
      endpoint = '/ai/chat'
      requestData = {
        userPrompt: prompt,
        chatId: chatId.value,
        modelName: config.model,
        useWebSearch: config.useWebSearch || false,
        useToolCalling: config.useToolCalling || false,
        useRAG: config.useRAG || false
      }
    }

    console.log('📤 发送请求到:', endpoint)
    console.log('📦 请求参数:', requestData)

    eventSource = createSSEConnection(
      endpoint,
      requestData,
      // onMessage: 接收到数据流
      (data: string) => {
        isLoading.value = false
        messages.value[aiMessageIndex].content += data
      },
      // onError: 发生错误（只有真正的错误才会触发）
      (error: Event) => {
        console.error('❌ SSE连接错误:', error)
        isConnecting.value = false
        isLoading.value = false
        messages.value[aiMessageIndex].isStreaming = false
        
        // 只有在没有接收到任何内容时才显示错误信息
        if (messages.value[aiMessageIndex].content === '') {
          messages.value[aiMessageIndex].content = '抱歉，连接出现问题，请稍后重试。'
          Message.error('连接失败，请稍后重试')
        } else {
          // 如果已经有内容了，说明部分成功，不显示错误
          console.log('⚠️ 连接中断，但已接收到部分内容')
        }
        
        saveHistoryMessages()
      },
      // onComplete: 完成
      () => {
        console.log('✅ SSE 连接完成')
        isConnecting.value = false
        isLoading.value = false
        messages.value[aiMessageIndex].isStreaming = false
        saveHistoryMessages()
        
        console.log('当前 isNewChatRoom 状态:', isNewChatRoom.value)
      }
    )
  } catch (error) {
    console.error('创建SSE连接失败:', error)
    isConnecting.value = false
    isLoading.value = false
    messages.value[aiMessageIndex].isStreaming = false
    messages.value[aiMessageIndex].content = '抱歉，发送失败，请稍后重试。'
    Message.error('发送失败，请稍后重试')
  }
}

// ==================== 历史记录管理 ====================

/**
 * 加载历史聊天室列表
 * 从后端API获取所有历史会话
 */
const loadChatRoomList = async () => {
  loadingHistory.value = true
  try {
    const response = await listChatRooms()
    console.log('历史聊天室列表响应:', response)

    // 检查HTTP状态码200表示成功
    if (response.status === 200) {
      const data = response.data.data || response.data

      if (Array.isArray(data)) {
        chatRoomList.value = data
        console.log('成功加载历史聊天室:', chatRoomList.value.length, '个')

        if (chatRoomList.value.length === 0) {
          console.log('提示：暂无历史聊天记录，发送第一条消息后会自动创建')
        }
        
        // 重新检查当前聊天室是否为新建
        checkIfNewChatRoom()
      } else {
        console.warn('返回的数据格式不是数组:', data)
        chatRoomList.value = []
      }
    } else {
      console.error('加载聊天记录失败，状态码:', response.status)
      Message.error(`加载聊天记录失败: HTTP ${response.status}`)
    }
  } catch (error: any) {
    console.error('加载聊天记录失败:', error)
    Message.error('加载聊天记录失败，请检查网络连接')
  } finally {
    loadingHistory.value = false
  }
}

// ==================== 生命周期 ====================

/**
 * 组件挂载
 * 初始化聊天室并加载历史记录
 */
onMounted(async () => {
  await initChatRoom()
  await loadChatRoomList()
})

/**
 * 组件卸载
 * 关闭SSE连接，防止内存泄漏
 */
onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})

/**
 * 监听路由变化
 * 当URL中的chatId变化时，自动切换会话
 */
watch(
  () => route.params.chatId,
  async (newChatId) => {
    if (newChatId && newChatId !== chatId.value) {
      chatId.value = newChatId as string
      messages.value = []
      await loadHistoryMessages()
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
