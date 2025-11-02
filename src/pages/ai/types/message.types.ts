/**
 * 消息相关类型定义
 * 统一管理聊天消息的类型接口
 */

/**
 * 消息角色类型
 */
export type MessageRole = 'user' | 'ai'

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  /** 消息角色：用户或AI */
  role: MessageRole
  /** 消息内容（可能包含Markdown和<think>标签） */
  content: string
  /** 消息时间戳 */
  timestamp: number
  /** 是否正在流式输出 */
  isStreaming?: boolean
}

/**
 * 解析后的消息内容
 * 分离思考过程和正常内容
 */
export interface ParsedMessageContent {
  /** 思考过程内容（从<think>标签中提取） */
  thinkingProcess: string
  /** 正常消息内容（移除<think>标签后的内容） */
  normalContent: string
}

/**
 * 消息组件属性
 */
export interface MessageItemProps {
  /** 消息对象 */
  message: ChatMessage
}

