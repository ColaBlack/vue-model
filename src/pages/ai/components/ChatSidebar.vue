<template>
  <a-layout-sider breakpoint="lg" :collapsed="collapsed" @collapse="onCollapse" :width="280">
    <div class="logo">AI Chat</div>
    <a-menu
      :default-selected-keys="[currentChatRoom?.chatroom || '']"
      :collapsed="collapsed"
      :auto-open-selected="true"
      @menu-item-click="handleMenuItemClick"
    >
      <a-menu-item key="new-chat">
        <template #icon>
          <icon-plus />
        </template>
        新建聊天
      </a-menu-item>
      <a-sub-menu key="chat-history">
        <template #icon>
          <icon-message />
        </template>
        <template #title>聊天历史</template>
        <a-menu-item v-for="room in chatRooms" :key="room.chatroom" @click="selectChatRoom(room)">
          {{ room.title || room.chatroom }}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, defineProps, defineEmits, defineExpose } from 'vue'
import {
  LayoutSider as ALayoutSider,
  Menu as AMenu,
  MenuItem as AMenuItem,
  SubMenu as ASubMenu,
  Message as ArcoMessage
} from '@arco-design/web-vue'
import { IconPlus, IconMessage } from '@arco-design/web-vue/es/icon'
import api from '@/api'
import { useRouter } from 'vue-router'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

interface ChatRoom extends API.ChatRoomVO {
  messages: ChatMessage[]
}

const props = defineProps({
  currentChatRoom: {
    type: Object as () => ChatRoom | null,
    default: null
  }
})

const collapsed = ref(false)
const chatRooms = ref<ChatRoom[]>([])
const router = useRouter()

const emit = defineEmits(['selectChatRoom', 'createNewChat'])

const onCollapse = (val: boolean, type: string) => {
  console.log(val, type)
  collapsed.value = val
}

const fetchChatRooms = async () => {
  try {
    const res = await api.aiController.listChatRooms()
    if (res.data.code === 200 && res.data.data) {
      chatRooms.value = res.data.data.map((room) => ({
        chatroom: room.chatroom!,
        title: room.title,
        createTime: room.createTime,
        messages: []
      }))
      if (chatRooms.value.length > 0 && !props.currentChatRoom) {
        emit('selectChatRoom', chatRooms.value[0])
      }
    } else {
      ArcoMessage.error('获取聊天室列表失败')
    }
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    ArcoMessage.error('获取聊天室列表失败')
  }
}

const createNewChat = async () => {
  try {
    const res = await api.aiController.createChatRoom({ userPrompt: '新聊天' })
    if (res.data.code === 200 && res.data.data) {
      const newRoomId = res.data.data.chatroom // Store the ID of the newly created room
      ArcoMessage.success('新聊天室创建成功')
      await fetchChatRooms() // Refresh the list of chat rooms

      // Find and select the newly created room
      const newlyCreatedRoom = chatRooms.value.find(room => room.chatroom === newRoomId)
      if (newlyCreatedRoom) {
        emit('selectChatRoom', newlyCreatedRoom)
      }
    } else {
      ArcoMessage.error('创建聊天室失败')
    }
  } catch (error) {
    console.error('Error creating chat room:', error)
    ArcoMessage.error('创建聊天室失败')
  }
}

const selectChatRoom = (room: ChatRoom) => {
  router.push({ path: `/ai/chat/${room.chatroom}` })
}

const handleMenuItemClick = (key: string) => {
  if (key === 'new-chat') {
    createNewChat()
  }
}

onMounted(() => {
  fetchChatRooms()
})

defineExpose({ fetchChatRooms, chatRooms })
</script>

<style lang="less" scoped>
.arco-layout-sider {
  background-color: #f7f8fa;
  border-right: 1px solid #e5e6eb;
  height: 100%; /* Ensure sidebar takes full height */
}

.logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.arco-menu {
  height: calc(100% - 56px);
  overflow-y: auto;
}
</style>
