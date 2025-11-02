/**
 * 统一导出 AI 聊天相关组件
 */

// 主要组件
export { default as ChatHeader } from './ChatHeader.vue'
export { default as ChatInput } from './ChatInput.vue'
export { default as ChatSidebar } from './ChatSidebar.vue'
export { default as MessageItem } from './MessageItem.vue'
export { default as MessageList } from './MessageList.vue'

// 输入相关子组件
export { default as ModelSelector } from './input/ModelSelector.vue'
export { default as FeatureOptions } from './input/FeatureOptions.vue'

// 消息相关子组件
export { default as CopyButton } from './message/CopyButton.vue'
export { default as MessageContent } from './message/MessageContent.vue'
export { default as SampleQuestions } from './message/SampleQuestions.vue'
export { default as ThinkingIndicator } from './message/ThinkingIndicator.vue'
export { default as ThinkingSection } from './message/ThinkingSection.vue'

// 侧边栏相关子组件
export { default as ChatRoomItem } from './sidebar/ChatRoomItem.vue'
export { default as ChatRoomList } from './sidebar/ChatRoomList.vue'
export { default as SidebarHeader } from './sidebar/SidebarHeader.vue'

