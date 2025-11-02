/**
 * 聊天历史管理 Composable
 * 
 * 功能：
 * - 从后端加载历史消息
 * - 保存消息到 localStorage
 * - 消息格式转换
 */

import { ref } from 'vue'
import { getChatRoomMessages } from '@/api/aiController'
import type { ChatMessage } from '../types'

export function useChatHistory() {
  const messages = ref<ChatMessage[]>([])

  /**
   * 从后端加载历史消息
   * 优先从后端加载，如果失败则从 localStorage 加载
   */
  const loadHistoryMessages = async (chatId: string): Promise<void> => {
    try {
      // 尝试从后端加载
      const response = await getChatRoomMessages({ chatroomId: chatId })
      
      if (response.status === 200 && response.data.code === 200) {
        const messageList = response.data.data || []
        
        // 转换后端消息格式为前端消息格式
        messages.value = messageList.map((msg: API.ChatMemoryVO) => ({
          role: msg.type || 'AI',
          content: msg.content || '',
          timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
          isStreaming: false
        }))
        
        // 同时保存到 localStorage 作为缓存
        saveHistoryMessages(chatId)
        return
      }
    } catch (error) {
      // 后端加载失败时静默处理
    }
    
    // 如果后端加载失败，从 localStorage 加载
    try {
      const historyKey = `chat_history_${chatId}`
      const historyData = localStorage.getItem(historyKey)
      if (historyData) {
        messages.value = JSON.parse(historyData)
      } else {
        messages.value = []
      }
    } catch (error) {
      messages.value = []
    }
  }

  /**
   * 保存历史消息到 localStorage
   */
  const saveHistoryMessages = (chatId: string): void => {
    try {
      const historyKey = `chat_history_${chatId}`
      localStorage.setItem(historyKey, JSON.stringify(messages.value))
    } catch (error) {
      // 静默处理保存失败
    }
  }

  /**
   * 添加用户消息
   */
  const addUserMessage = (content: string): void => {
    messages.value.push({
      role: 'USER',
      content,
      timestamp: Date.now(),
      isStreaming: false
    })
  }

  /**
   * 添加AI消息（流式输出）
   */
  const addAIMessage = (): void => {
    messages.value.push({
      role: 'AI',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    })
  }

  /**
   * 更新最后一条AI消息的内容
   */
  const updateLastAIMessage = (content: string): void => {
    if (messages.value.length > 0) {
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage.role === 'AI') {
        lastMessage.content += content
      }
    }
  }

  /**
   * 完成最后一条AI消息的流式输出
   */
  const completeLastAIMessage = (): void => {
    if (messages.value.length > 0) {
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage.role === 'AI') {
        lastMessage.isStreaming = false
      }
    }
  }

  /**
   * 清空消息列表
   */
  const clearMessages = (): void => {
    messages.value = []
  }

  return {
    messages,
    loadHistoryMessages,
    saveHistoryMessages,
    addUserMessage,
    addAIMessage,
    updateLastAIMessage,
    completeLastAIMessage,
    clearMessages
  }
}

