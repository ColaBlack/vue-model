/**
 * 聊天消息管理 Composable
 * 
 * 功能：
 * - 消息列表管理
 * - 发送消息
 * - SSE 流式响应处理
 * - 消息本地持久化
 * 
 * 使用示例：
 * const {
 *   messages,
 *   userInput,
 *   isConnecting,
 *   isLoading,
 *   sendMessage,
 *   loadHistoryMessages
 * } = useChatMessages(chatId)
 */

import { ref, Ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { createSSEConnection } from '@/utils/sse'
import type { ChatMessage } from '../components/MessageItem.vue'
import { MESSAGE_CONSTANTS, STORAGE_KEYS } from '../constants/chat'

/**
 * 聊天消息管理 Hook
 * 
 * @param chatId 当前聊天室ID的响应式引用
 * @param onFirstMessage 第一条消息发送时的回调（用于创建聊天室）
 */
export function useChatMessages(
  chatId: Ref<string>,
  onFirstMessage?: (prompt: string) => Promise<string | null>
) {
  // ==================== 状态管理 ====================
  
  /** 消息列表 */
  const messages = ref<ChatMessage[]>([])
  
  /** 用户输入文本 */
  const userInput = ref<string>('')
  
  /** 是否正在连接（发送消息中） */
  const isConnecting = ref<boolean>(false)
  
  /** 是否正在加载（AI思考中） */
  const isLoading = ref<boolean>(false)
  
  /** SSE 连接对象 */
  let eventSource: EventSource | null = null
  
  // ==================== 本地存储 ====================
  
  /**
   * 从 localStorage 加载历史消息
   * 根据当前聊天室ID加载对应的消息记录
   */
  const loadHistoryMessages = () => {
    if (!chatId.value) {
      console.warn('⚠️ 聊天室ID为空，无法加载历史消息')
      return
    }
    
    try {
      const historyKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${chatId.value}`
      const historyStr = localStorage.getItem(historyKey)
      
      if (historyStr) {
        const loadedMessages = JSON.parse(historyStr)
        messages.value = loadedMessages
        console.log(`📦 从本地存储加载了 ${loadedMessages.length} 条消息`)
      } else {
        messages.value = []
        console.log('📭 本地存储中没有历史消息')
      }
    } catch (error) {
      console.error('❌ 加载历史消息失败:', error)
      messages.value = []
    }
  }
  
  /**
   * 保存消息到 localStorage
   * 将当前聊天室的所有消息持久化到本地
   */
  const saveHistoryMessages = () => {
    if (!chatId.value) {
      console.warn('⚠️ 聊天室ID为空，无法保存消息')
      return
    }
    
    try {
      const historyKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${chatId.value}`
      localStorage.setItem(historyKey, JSON.stringify(messages.value))
      console.log(`💾 已保存 ${messages.value.length} 条消息到本地存储`)
    } catch (error) {
      console.error('❌ 保存历史消息失败:', error)
    }
  }
  
  // ==================== 消息发送 ====================
  
  /**
   * 发送消息
   * 主要流程：
   * 1. 验证输入
   * 2. 首次消息时调用 onFirstMessage 回调（创建聊天室）
   * 3. 添加用户消息
   * 4. 建立 SSE 连接获取 AI 回复
   * 5. 保存消息到 localStorage
   */
  const sendMessage = async () => {
    const prompt = userInput.value.trim()

    // 1. 验证输入
    if (!prompt || isConnecting.value) {
      console.log('⚠️ 输入为空或正在发送中，已忽略')
      return
    }

    if (prompt.length > MESSAGE_CONSTANTS.MAX_LENGTH) {
      Message.error(`提问长度不能超过 ${MESSAGE_CONSTANTS.MAX_LENGTH} 字`)
      return
    }

    if (!chatId.value) {
      Message.error('聊天室ID无效，请刷新页面重试')
      return
    }

    // 2. 如果是第一条消息，先创建聊天室记录
    const isFirstMessage = messages.value.length === 0
    console.log('📝 发送消息 - isFirstMessage:', isFirstMessage)
    
    if (isFirstMessage && onFirstMessage) {
      await onFirstMessage(prompt)
    }

    // 3. 添加用户消息到列表
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    }
    messages.value.push(userMessage)

    // 清空输入框
    userInput.value = ''

    // 4. 创建 AI 消息占位符（用于接收流式回复）
    const aiMessage: ChatMessage = {
      role: 'ai',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    }
    messages.value.push(aiMessage)
    const aiMessageIndex = messages.value.length - 1

    // 5. 开始 SSE 连接
    isConnecting.value = true
    isLoading.value = true

    try {
      eventSource = createSSEConnection(
        prompt,
        chatId.value,
        
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
        }
      )
    } catch (error) {
      console.error('❌ 创建SSE连接失败:', error)
      isConnecting.value = false
      isLoading.value = false
      messages.value[aiMessageIndex].isStreaming = false
      messages.value[aiMessageIndex].content = '抱歉，发送失败，请稍后重试。'
      Message.error('发送失败，请稍后重试')
    }
  }
  
  /**
   * 使用示例问题
   * 将示例问题填充到输入框并发送
   * 
   * @param question 示例问题文本
   */
  const useSampleQuestion = (question: string) => {
    userInput.value = question
    // 延迟一帧再发送，确保输入框已更新
    setTimeout(() => {
      sendMessage()
    }, 0)
  }
  
  /**
   * 关闭 SSE 连接
   * 在组件卸载或切换聊天室时调用
   */
  const closeConnection = () => {
    if (eventSource) {
      console.log('🔌 关闭 SSE 连接')
      eventSource.close()
      eventSource = null
    }
  }
  
  /**
   * 清空消息列表
   * 通常在切换聊天室时使用
   */
  const clearMessages = () => {
    messages.value = []
    console.log('🗑️ 清空消息列表')
  }
  
  // ==================== 返回 ====================
  
  return {
    // 状态
    messages,
    userInput,
    isConnecting,
    isLoading,
    
    // 方法
    sendMessage,
    useSampleQuestion,
    loadHistoryMessages,
    saveHistoryMessages,
    closeConnection,
    clearMessages
  }
}

