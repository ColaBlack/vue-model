/**
 * 聊天室管理 Composable
 * 
 * 功能：
 * - 聊天室列表管理
 * - 聊天室创建
 * - 聊天室切换
 */

import { ref } from 'vue'
import { listChatRooms, createChatRoom } from '@/api/aiController'
import { Message } from '@arco-design/web-vue'

export function useChatRoomManagement() {
  const chatRoomList = ref<API.ChatRoomVO[]>([])
  const loadingHistory = ref<boolean>(false)
  const isNewChatRoom = ref<boolean>(true)

  /**
   * 加载聊天室列表
   */
  const loadChatRoomList = async (): Promise<void> => {
    loadingHistory.value = true
    try {
      const response = await listChatRooms()
      
      if (response.status === 200 && response.data.code === 200) {
        chatRoomList.value = response.data.data || []
      } else if (response.data.code === 200) {
        chatRoomList.value = response.data.data || []
      }
    } catch (error) {
      Message.error('加载历史记录失败')
    } finally {
      loadingHistory.value = false
    }
  }

  /**
   * 创建聊天室
   */
  const createChatRoomRecord = async (prompt: string): Promise<string | null> => {
    try {
      const response = await createChatRoom({
        userPrompt: prompt
      })

      if (response.status === 200) {
        const data: any = response.data.data || response.data
        const backendChatId = data?.chatroom || data?.chatroomId || data?.id

        if (backendChatId) {
          return backendChatId
        }
      }
    } catch (error) {
      // 静默处理失败
    }
    return null
  }

  /**
   * 检查当前聊天室是否在历史记录列表中
   */
  const checkIfNewChatRoom = (chatId: string): void => {
    const exists = chatRoomList.value.some(room => room.chatroom === chatId)
    isNewChatRoom.value = !exists
  }

  return {
    chatRoomList,
    loadingHistory,
    isNewChatRoom,
    loadChatRoomList,
    createChatRoomRecord,
    checkIfNewChatRoom
  }
}

