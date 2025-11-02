/**
 * 剪贴板操作工具
 * 提供复制文本到剪贴板的功能
 */

import { Message } from '@arco-design/web-vue'

/**
 * 复制文本到剪贴板
 * 使用现代的 Clipboard API
 * 
 * @param text - 要复制的文本内容
 * @param successMessage - 成功提示消息（默认：已复制到剪贴板）
 * @param errorMessage - 失败提示消息（默认：复制失败，请重试）
 * @returns Promise<boolean> - 是否复制成功
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = '已复制到剪贴板',
  errorMessage: string = '复制失败，请重试'
): Promise<boolean> {
  if (!text || !text.trim()) {
    Message.warning('暂无内容可复制')
    return false
  }

  try {
    await navigator.clipboard.writeText(text)
    Message.success(successMessage)
    return true
  } catch (error) {
    console.error('复制失败:', error)
    Message.error(errorMessage)
    return false
  }
}

/**
 * 复制消息内容到剪贴板
 * 包含思考过程和正常内容
 * 
 * @param thinkingProcess - 思考过程内容（可选）
 * @param normalContent - 正常消息内容
 * @returns Promise<boolean> - 是否复制成功
 */
export async function copyMessageContent(
  thinkingProcess: string,
  normalContent: string
): Promise<boolean> {
  let textToCopy = ''
  
  // 如果有思考过程，也包含进去
  if (thinkingProcess) {
    textToCopy += '【思考过程】\n' + thinkingProcess + '\n\n'
  }
  
  // 添加正常内容
  if (normalContent) {
    textToCopy += normalContent
  }
  
  return copyToClipboard(textToCopy)
}

