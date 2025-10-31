/**
 * 聊天室管理 Composable
 * 
 * 功能：
 * - 聊天室ID生成和管理
 * - 聊天室创建
 * - 聊天室切换
 * - 聊天室列表加载
 * 
 * 使用示例：
 * const {
 *   chatId,
 *   chatRoomList,
 *   loadingHistory,
 *   loadChatRoomList,
 *   createNewChat,
 *   switchChatRoom
 * } = useChatRoom()
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { listChatRooms, createChatRoom as apiCreateChatRoom } from '@/api/aiController'
import { API_CONSTANTS, TIME_CONSTANTS } from '../constants/chat'

/**
 * 生成唯一的聊天室ID
 * 
 * 格式：chat_{时间戳}_{随机字符串}
 * 示例：chat_1704067200000_abc123xyz
 * 
 * @returns 唯一的聊天室ID
 */
export function generateChatId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `chat_${timestamp}_${random}`
}

/**
 * 聊天室管理 Hook
 */
export function useChatRoom() {
  const router = useRouter()
  
  // ==================== 状态管理 ====================
  
  /** 当前聊天室ID */
  const chatId = ref<string>('')
  
  /** 历史聊天室列表 */
  const chatRoomList = ref<API.ChatRoomVO[]>([])
  
  /** 是否正在加载历史记录 */
  const loadingHistory = ref<boolean>(false)
  
  /** 是否为新建的聊天室（用于判断是否需要刷新列表） */
  const isNewChatRoom = ref<boolean>(true)
  
  // ==================== 计算属性 ====================
  
  /** 当前聊天室是否存在于历史列表中 */
  const currentRoomExists = computed(() => {
    return chatRoomList.value.some(room => room.chatroom === chatId.value)
  })
  
  // ==================== 方法 ====================
  
  /**
   * 初始化聊天室
   * 从路由参数获取 chatId，如果没有则生成新的
   * 
   * @param routeChatId 路由参数中的聊天室ID
   */
  const initChatRoom = (routeChatId?: string) => {
    if (routeChatId) {
      chatId.value = routeChatId
      isNewChatRoom.value = false
      console.log('📂 加载现有聊天室:', routeChatId)
    } else {
      const newChatId = generateChatId()
      chatId.value = newChatId
      isNewChatRoom.value = true
      router.replace(`/ai/chat/${newChatId}`)
      console.log('🆕 创建新聊天室:', newChatId)
    }
  }
  
  /**
   * 创建新聊天
   * 生成新的 chatId 并跳转到新页面
   */
  const createNewChat = () => {
    const newChatId = generateChatId()
    console.log('🆕 创建新聊天，ID:', newChatId)
    
    router.push(`/ai/chat/${newChatId}`)
    chatId.value = newChatId
    isNewChatRoom.value = true
    
    console.log('  - isNewChatRoom 设置为 true')
  }
  
  /**
   * 切换聊天室
   * 跳转到指定的聊天室
   * 
   * @param roomId 目标聊天室ID
   * @returns Promise，切换完成后resolve
   */
  const switchChatRoom = async (roomId: string): Promise<void> => {
    if (!roomId || roomId === chatId.value) {
      console.log('⚠️ 尝试切换到当前聊天室或无效ID，已忽略')
      return
    }
    
    console.log('🔄 切换聊天室:', roomId)
    
    router.push(`/ai/chat/${roomId}`)
    chatId.value = roomId
    isNewChatRoom.value = false // 切换到历史聊天室，不是新的
  }
  
  /**
   * 加载历史聊天室列表
   * 从后端API获取所有历史会话
   * 
   * @returns Promise，加载完成后resolve
   */
  const loadChatRoomList = async (): Promise<void> => {
    loadingHistory.value = true
    
    try {
      const response = await listChatRooms()
      console.log('📋 历史聊天室列表响应:', response)

      // 检查HTTP状态码200表示成功
      if (response.status === API_CONSTANTS.SUCCESS_STATUS) {
        const data = response.data.data || response.data

        if (Array.isArray(data)) {
          chatRoomList.value = data
          console.log(`✅ 成功加载历史聊天室: ${chatRoomList.value.length} 个`)

          if (chatRoomList.value.length === 0) {
            console.log('💡 提示：暂无历史聊天记录，发送第一条消息后会自动创建')
          }
          
          // 重新检查当前聊天室是否为新建
          checkIfNewChatRoom()
        } else {
          console.warn('⚠️ 返回的数据格式不是数组:', data)
          chatRoomList.value = []
        }
      } else {
        console.error('❌ 加载聊天记录失败，状态码:', response.status)
        Message.error(`加载聊天记录失败: HTTP ${response.status}`)
      }
    } catch (error: any) {
      console.error('❌ 加载聊天记录失败:', error)
      Message.error('加载聊天记录失败，请检查网络连接')
    } finally {
      loadingHistory.value = false
    }
  }
  
  /**
   * 创建聊天室记录（在后端）
   * 当用户发送第一条消息时调用
   * 
   * @param userPrompt 用户的第一条消息
   * @returns Promise<string | null> 返回后端创建的聊天室ID，失败返回 null
   */
  const createChatRoom = async (userPrompt: string): Promise<string | null> => {
    try {
      console.log('🔨 正在创建聊天室...')
      const response = await apiCreateChatRoom({ userPrompt })
      console.log('✅ 创建聊天室响应:', response)

      // 检查HTTP状态码200表示成功
      if (response.status === API_CONSTANTS.SUCCESS_STATUS) {
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
          
          // 延迟刷新聊天室列表，确保后端已经保存
          setTimeout(() => {
            console.log('🔄 聊天室创建成功，刷新历史记录列表')
            loadChatRoomList()
          }, TIME_CONSTANTS.REFRESH_DELAY)
          
          return backendChatId
        } else {
          console.warn('⚠️ 后端未返回聊天室ID，使用前端生成的ID')
          return null
        }
      } else {
        console.error('❌ 创建聊天室失败，状态码:', response.status)
        Message.warning('聊天室创建失败，但可以继续对话')
        return null
      }
    } catch (error: any) {
      console.error('❌ 创建聊天室失败:', error)
      Message.warning('聊天室创建失败，但可以继续对话')
      return null
    }
  }
  
  /**
   * 检查当前聊天室是否在历史记录列表中
   * 更新 isNewChatRoom 状态
   */
  const checkIfNewChatRoom = () => {
    const exists = currentRoomExists.value
    isNewChatRoom.value = !exists
    
    console.log('🔍 检查聊天室状态:')
    console.log('  - chatId:', chatId.value)
    console.log('  - 列表中的聊天室数量:', chatRoomList.value.length)
    console.log('  - 是否存在于列表中:', exists)
    console.log('  - isNewChatRoom:', isNewChatRoom.value)
    console.log('  - 列表:', chatRoomList.value.map(r => r.chatroom))
  }
  
  // ==================== 返回 ====================
  
  return {
    // 状态
    chatId,
    chatRoomList,
    loadingHistory,
    isNewChatRoom,
    currentRoomExists,
    
    // 方法
    initChatRoom,
    createNewChat,
    switchChatRoom,
    loadChatRoomList,
    createChatRoom,
    checkIfNewChatRoom,
    generateChatId
  }
}

