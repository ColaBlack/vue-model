# AI 聊天室模块 - 开发文档

> 一个基于 Vue 3 + TypeScript + Arco Design 的 AI 聊天室应用，采用组件化架构，代码结构清晰，易于维护和扩展。

## 📁 项目结构

```
src/pages/ai/
├── chatPage.vue                    # 主页面：聊天室容器
├── components/                     # 组件目录
│   ├── ChatHeader.vue             # 聊天头部（标题、会话ID）
│   ├── ChatInput.vue              # 消息输入框（带字符计数和快捷键）
│   ├── ChatSidebar.vue            # 侧边栏容器（可折叠）
│   ├── MessageItem.vue            # 单条消息组件
│   ├── MessageList.vue            # 消息列表容器
│   ├── sidebar/                   # 侧边栏子组件
│   │   ├── SidebarHeader.vue     # 侧边栏头部（新建、刷新）
│   │   ├── ChatRoomList.vue      # 聊天室列表
│   │   └── ChatRoomItem.vue      # 单个聊天室项
│   └── message/                   # 消息相关子组件
│       ├── SampleQuestions.vue   # 示例问题卡片
│       └── ThinkingIndicator.vue # AI思考动画指示器
├── composables/                   # 组合式API（业务逻辑）
│   ├── useChatRoom.ts            # 聊天室管理
│   └── useChatMessages.ts        # 消息管理
├── constants/                     # 常量配置
│   └── chat.ts                   # 聊天相关常量
└── utils/                        # 工具函数
    └── timeFormat.ts             # 时间格式化工具
```

## 🎯 核心功能

### 1. 聊天室管理
- ✅ 自动生成唯一聊天室ID
- ✅ 创建新聊天会话
- ✅ 切换历史聊天室
- ✅ 加载聊天室列表
- ✅ 聊天记录本地持久化

### 2. 消息交互
- ✅ 实时流式消息（SSE）
- ✅ 消息发送与接收
- ✅ AI思考状态指示
- ✅ 示例问题快速开始
- ✅ 快捷键支持（Enter发送，Shift+Enter换行）

### 3. UI/UX
- ✅ 响应式布局
- ✅ 侧边栏折叠/展开
- ✅ 自动滚动到最新消息
- ✅ 加载状态动画
- ✅ 字符计数提示

## 🧩 组件说明

### 主组件

#### `chatPage.vue` - 聊天室主页面
**职责**：协调各子组件，管理页面级状态
- 管理聊天室ID和消息列表
- 处理SSE连接
- 协调侧边栏和消息区域

### 布局组件

#### `ChatHeader.vue` - 聊天头部
**Props**:
- `chatId`: 当前聊天室ID

**功能**:
- 显示页面标题
- 展示会话ID（长ID自动截断）

#### `ChatSidebar.vue` - 左侧边栏
**Props**:
- `chatRoomList`: 历史聊天室列表
- `currentChatId`: 当前激活的聊天室ID
- `loading`: 加载状态
- `collapsed`: 折叠状态（v-model）

**Events**:
- `refresh`: 刷新列表
- `create`: 创建新聊天
- `switch`: 切换聊天室

**子组件**:
- `SidebarHeader`: 头部操作区
- `ChatRoomList`: 聊天室列表
  - `ChatRoomItem`: 单个聊天室项

#### `MessageList.vue` - 消息列表
**Props**:
- `messages`: 消息数组
- `isLoading`: AI思考状态

**Events**:
- `use-sample`: 使用示例问题

**子组件**:
- `MessageItem`: 单条消息
- `SampleQuestions`: 空状态示例问题
- `ThinkingIndicator`: AI思考指示器

#### `ChatInput.vue` - 消息输入框
**Props**:
- `modelValue`: 输入文本（v-model）
- `isConnecting`: 发送中状态
- `chatId`: 聊天室ID

**Events**:
- `send`: 发送消息

**功能**:
- 多行文本输入
- 字符计数（最多1000字）
- 快捷键支持
- 输入验证

## 🔧 Composables 使用指南

### `useChatRoom()` - 聊天室管理

```typescript
import { useChatRoom } from '@/pages/ai/composables/useChatRoom'

const {
  chatId,              // 当前聊天室ID
  chatRoomList,        // 历史聊天室列表
  loadingHistory,      // 加载状态
  isNewChatRoom,       // 是否为新聊天室
  
  initChatRoom,        // 初始化聊天室
  createNewChat,       // 创建新聊天
  switchChatRoom,      // 切换聊天室
  loadChatRoomList,    // 加载列表
  createChatRoom,      // 创建聊天室记录
} = useChatRoom()
```

### `useChatMessages()` - 消息管理

```typescript
import { useChatMessages } from '@/pages/ai/composables/useChatMessages'

const {
  messages,            // 消息列表
  userInput,           // 用户输入
  isConnecting,        // 发送中
  isLoading,           // AI思考中
  
  sendMessage,         // 发送消息
  useSampleQuestion,   // 使用示例问题
  loadHistoryMessages, // 加载历史消息
  saveHistoryMessages, // 保存历史消息
  closeConnection,     // 关闭SSE连接
} = useChatMessages(chatId, onFirstMessage)
```

## 📦 工具函数

### 时间格式化 (`utils/timeFormat.ts`)

```typescript
import { formatRelativeTime, formatDate, formatDateTime } from '@/pages/ai/utils/timeFormat'

// 相对时间："刚刚"、"5分钟前"、"2天前"
const relativeTime = formatRelativeTime('2024-01-01T10:00:00Z')

// 标准日期："2024-01-01"
const date = formatDate('2024-01-01T10:00:00Z')

// 完整时间："2024-01-01 10:00:00"
const dateTime = formatDateTime('2024-01-01T10:00:00Z')
```

## 🎨 设计理念

### 1. 组件化
- **单一职责**：每个组件只负责一个功能
- **可复用**：组件设计为独立、可复用的单元
- **可组合**：大组件由小组件组合而成

### 2. 逻辑分离
- **视图层**：组件只负责UI展示
- **逻辑层**：业务逻辑提取到 composables
- **数据层**：API调用和状态管理独立

### 3. 类型安全
- **完整的 TypeScript 类型定义**
- **Props 和 Events 类型化**
- **避免 any 类型滥用**

### 4. 代码注释
- **每个文件都有头部说明**
- **每个函数都有 JSDoc 注释**
- **关键逻辑都有行内注释**

## 🚀 快速开始

### 1. 创建新的聊天功能组件

```vue
<!-- components/NewFeature.vue -->
<template>
  <div class="new-feature">
    <!-- 你的UI -->
  </div>
</template>

<script setup lang="ts">
/**
 * 新功能组件
 * 
 * 功能：
 * - 功能1描述
 * - 功能2描述
 */

// Props 定义
interface Props {
  /** prop 描述 */
  propName: string
}

defineProps<Props>()
</script>

<style scoped lang="less">
// 样式
</style>
```

### 2. 创建新的 Composable

```typescript
// composables/useNewFeature.ts
/**
 * 新功能管理 Composable
 * 
 * 功能：
 * - 功能描述
 */

import { ref } from 'vue'

export function useNewFeature() {
  const state = ref('')
  
  const doSomething = () => {
    // 实现
  }
  
  return {
    state,
    doSomething
  }
}
```

## 📝 开发规范

### 1. 命名规范
- **组件文件**：PascalCase（如 `ChatInput.vue`）
- **组件名称**：PascalCase（如 `ChatInput`）
- **函数**：camelCase（如 `sendMessage`）
- **常量**：UPPER_SNAKE_CASE（如 `MAX_LENGTH`）

### 2. 文件组织
- **一个文件一个组件**
- **相关组件放在同一目录**
- **大组件拆分为子组件**

### 3. 注释规范
- **文件头部**：说明文件功能和使用方式
- **函数头部**：JSDoc 格式，说明参数和返回值
- **复杂逻辑**：添加行内注释解释

### 4. 样式规范
- **使用 scoped 样式**
- **使用 Less 预处理器**
- **添加样式注释说明**

## 🔍 性能优化

### 已实现的优化
- ✅ 组件按需加载
- ✅ 消息虚拟滚动（通过限制渲染数量）
- ✅ 防抖和节流（输入框）
- ✅ 本地存储缓存
- ✅ SSE 流式传输减少等待时间

### 可进一步优化
- 🔄 虚拟列表（大量消息时）
- 🔄 图片懒加载
- 🔄 离线消息队列

## 🐛 调试技巧

### 1. 查看控制台日志
代码中添加了详细的 console.log，使用 emoji 区分不同类型：
- 🆕 创建操作
- 🔄 更新操作
- ❌ 错误信息
- ✅ 成功信息
- 📝 一般信息

### 2. 使用 Vue DevTools
- 查看组件树
- 检查 Props 传递
- 追踪事件触发

### 3. 检查网络请求
- SSE 连接状态
- API 响应数据
- 错误信息

## 📚 相关资源

- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)
- [Arco Design Vue 文档](https://arco.design/vue/docs/start)
- [SSE 规范](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

请确保：
- ✅ 代码符合规范
- ✅ 添加必要的注释
- ✅ 测试功能正常
- ✅ 更新相关文档
