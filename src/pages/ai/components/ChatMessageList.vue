<template>
  <div class="message-list">
    <div v-for="(message, index) in messages" :key="index" :class="['message-item', message.role]">
      <div class="avatar">
        <a-avatar v-if="message.role === 'user'">
          <img alt="avatar" :src="userAvatar" />
        </a-avatar>
        <a-avatar v-else>
          <img alt="avatar" :src="aiAvatar" />
        </a-avatar>
      </div>
      <div class="bubble">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, watch, nextTick } from 'vue'
import { Avatar as AAvatar } from '@arco-design/web-vue'
import { useUserStore } from '@/store/user'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

const props = defineProps({
  messages: {
    type: Array as () => ChatMessage[],
    default: () => []
  }
})

const userStore = useUserStore()

const aiAvatar = computed(
  () => 'https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727918660793_头像.png'
)

const userAvatar = computed(
  () =>
    userStore.loginUser?.userAvatar ||
    'https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727918660793_头像.png'
)

const scrollToBottom = () => {
  const messageList = document.querySelector('.message-list')
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight
  }
}

watch(
  () => props.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true }
)
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 0 20px;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
}

.message-item.user {
  justify-content: flex-end;
}

.message-item.ai {
  justify-content: flex-start;
}

.message-item .avatar {
  flex-shrink: 0;
  margin: 0 10px;
}

.message-item.user .avatar {
  order: 2;
}

.message-item .bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 10px;
  word-wrap: break-word;
}

.message-item.user .bubble {
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 2px;
}

.message-item.ai .bubble {
  background-color: #e5e6eb;
  color: #333;
  border-bottom-left-radius: 2px;
}
</style>
