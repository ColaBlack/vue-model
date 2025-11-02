/**
 * AI 聊天相关的类型定义
 */

/**
 * 消息角色类型
 */
export type MessageRole = 'USER' | 'AI' | 'ASSISTANT'

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  /** 消息角色 */
  role: MessageRole | string
  /** 消息内容 */
  content: string
  /** 时间戳 */
  timestamp: number
  /** 是否正在流式输出 */
  isStreaming?: boolean
}

/**
 * 模型配置接口
 */
export interface ModelConfig {
  /** 选择的模型 */
  model: string
  /** 是否为视觉模型 */
  isVision: boolean
  /** 是否启用联网搜索（仅文本模型） */
  useWebSearch?: boolean
  /** 是否启用RAG（仅文本模型） */
  useRAG?: boolean
  /** 是否启用工具调用（仅文本模型） */
  useToolCalling?: boolean
}

/**
 * 解析后的消息内容接口
 */
export interface ParsedContent {
  /** 思考过程 */
  thinkingProcess: string
  /** 正常内容 */
  normalContent: string
}

/**
 * SSE 连接回调接口
 */
export interface SSECallbacks {
  /** 接收到数据时的回调 */
  onMessage: (data: string) => void
  /** 连接完成时的回调 */
  onComplete: () => void
  /** 发生错误时的回调 */
  onError: (error: Error) => void
}

