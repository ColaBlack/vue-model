/**
 * 聊天室 ID 相关工具函数
 */

/**
 * 生成唯一的聊天室ID
 * @returns 聊天室ID字符串
 */
export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 验证聊天室ID格式
 * @param chatId 聊天室ID
 * @returns 是否有效
 */
export function isValidChatId(chatId: string): boolean {
  return /^chat_\d+_[a-z0-9]+$/.test(chatId)
}

