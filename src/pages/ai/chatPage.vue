<template>
  <div class="chat-page">
    <a-layout style="height: 100%">
      <ChatSidebar
        ref="chatSidebarRef"
        @selectChatRoom="selectChatRoom"
        :currentChatRoom="currentChatRoom"
      />
      <a-layout>
        <a-layout-content>
          <div class="chat-content">
            <ChatMessageList :messages="currentMessages" />
            <ChatMessageInput v-model:modelValue="userMessage" @sendMessage="sendMessage" :disabled="isSendButtonDisabled" />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Message as ArcoMessage } from '@arco-design/web-vue'
import ChatSidebar from './components/ChatSidebar.vue'
import ChatMessageList from './components/ChatMessageList.vue'
import ChatMessageInput from './components/ChatMessageInput.vue'
import api from '@/api'
import { useRoute, useRouter } from 'vue-router'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

interface ChatRoom extends API.ChatRoomVO {
  messages: ChatMessage[]
}

const chatSidebarRef = ref()
const userMessage = ref('')
const route = useRoute()
const router = useRouter()

const currentChatRoom = ref<ChatRoom | null>(null)

const isSendButtonDisabled = computed(() => {
  return !route.params.chatId
})

const currentMessages = computed(() => {
  return currentChatRoom.value ? currentChatRoom.value.messages : []
})

const selectChatRoom = async (room: ChatRoom) => {
  currentChatRoom.value = room
  if (room.chatroom && room.messages.length === 0) {
    try {
      const res = await api.aiController.getChatRoom({ chatroomId: room.chatroom })
      if (res.data.code === 200 && res.data.data) {
        // Check if the welcome message already exists before adding
        const welcomeMessageContent = `欢迎来到聊天室 ${room.title || room.chatroom}！`
        const hasWelcomeMessage = currentChatRoom.value.messages.some(
          (msg) => msg.role === 'ai' && msg.content === welcomeMessageContent
        )
        if (!hasWelcomeMessage) {
          currentChatRoom.value.messages.push({
            role: 'ai',
            content: welcomeMessageContent
          })
        }
      }
    } catch (error) {
      console.error('Error fetching chat room details:', error)
      ArcoMessage.error('获取聊天室详情失败')
    }
  }
  await nextTick()
  scrollToBottom()
}

const sendMessage = async () => {
  if (!userMessage.value.trim()) {
    ArcoMessage.warning('内容不能为空')
    return
  }

  if (!currentChatRoom.value || !currentChatRoom.value.chatroom) {
    try {
      const res = await api.aiController.createChatRoom({})
      if (res.data.code === 200 && res.data.data) {
        const newRoom = res.data.data
        if (chatSidebarRef.value) {
          await chatSidebarRef.value.fetchChatRooms()
        }
        console.log('newRoom:', newRoom)
        router.push({ path: `/ai/chat/${newRoom.chatroom}` })
      } else {
        ArcoMessage.error('创建聊天室失败')
        return
      }
    } catch (error) {
      console.error('Error creating chat room:', error)
      ArcoMessage.error('创建聊天室失败')
      return
    }
  }

  const userMsg: ChatMessage = { role: 'user', content: userMessage.value }
  currentChatRoom.value?.messages.push(userMsg)

  const aiMessage: ChatMessage = { role: 'ai', content: '' }
  currentChatRoom.value?.messages.push(aiMessage)
  
  // 发送sse请求
  const eventSource = new EventSource(
    `/api/ai/chat?userPrompt=${encodeURIComponent(userMessage.value)}&chatId=${currentChatRoom.value?.chatroom}`,
  )
  // 监听sse消息
  eventSource.onmessage = (event) => {
    //取data:后的内容为message
    const message = event.data.split('data: ')[1]
    if (message) {
      aiMessage.content += message
    }
  }
  eventSource.onerror = (event) => {
    if (event.eventPhase === EventSource.CLOSED) {
      eventSource.close()
      ArcoMessage.success('生成结束')
    } else {
      eventSource.close()
      ArcoMessage.error('生成失败，事件流已关闭')
    }
  }
}

const scrollToBottom = () => {
  const chatList = document.querySelector('.chat-message-list')
  if (chatList) {
    chatList.scrollTop = chatList.scrollHeight
  }
}

const selectChatRoomFromRoute = async () => {
  const chatId = route.params.chatId
  if (chatId && chatSidebarRef.value?.chatRooms.length > 0) {
    const room = chatSidebarRef.value.chatRooms.find((r: ChatRoom) => r.chatroom === chatId)
    if (room) {
      await selectChatRoom(room)
    } else {
      console.warn('Chat room not found for chatId in sidebar:', chatId)
    }
  } else if (!chatId && chatSidebarRef.value?.chatRooms.length > 0 && !currentChatRoom.value) {
    // If no chatId in route, select the first chat room from sidebar if available
    await selectChatRoom(chatSidebarRef.value.chatRooms[0])
  }
}

onMounted(() => {
  // Initial fetch of chat rooms is handled by ChatSidebar itself
  // We need to wait for chatRooms to be populated in ChatSidebar
  watch(
    () => chatSidebarRef.value?.chatRooms,
    (newChatRooms) => {
      if (newChatRooms && newChatRooms.length > 0) {
        selectChatRoomFromRoute()
      }
    },
    { immediate: true }
  )
})

watch(
  () => route.params.chatId,
  async (newChatId) => {
    if (newChatId) {
      selectChatRoomFromRoute()
    }
  }
)
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100%;
}

.chat-sidebar {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid #e5e6eb;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 20px; /* Added top padding */
  background-color: #f0f2f5;
  box-sizing: border-box;
}
</style>
