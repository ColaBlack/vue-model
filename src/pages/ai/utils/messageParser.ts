/**
 * 消息内容解析工具
 */

import type { ParsedContent } from '../types'

/**
 * 解析消息内容，分离思考过程和正常内容
 * 深度推理模型会输出 <think>...</think> 包裹的思考过程
 * 
 * @param content 原始消息内容
 * @returns 解析后的内容对象
 */
export function parseMessageContent(content: string): ParsedContent {
  // 匹配完整的 <think>...</think> 标签
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g
  const matches = content.match(thinkRegex)
  
  if (matches && matches.length > 0) {
    let thinkingProcess = ''
    let normalContent = content
    
    matches.forEach((match) => {
      const innerMatch = match.match(/<think>([\s\S]*?)<\/think>/)
      if (innerMatch) {
        const extracted = innerMatch[1].trim()
        thinkingProcess += (thinkingProcess ? '\n\n' : '') + extracted
      }
      // 从正常内容中移除思考标签
      normalContent = normalContent.replace(match, '')
    })
    
    normalContent = normalContent.trim()
    
    return {
      thinkingProcess,
      normalContent: normalContent || ''
    }
  }
  
  // 没有完整的思考过程标签，直接返回原内容
  return {
    thinkingProcess: '',
    normalContent: content
  }
}

/**
 * 检查消息是否包含思考过程
 * 
 * @param content 消息内容
 * @returns 是否包含思考过程
 */
export function hasThinkingProcess(content: string): boolean {
  return /<think>[\s\S]*?<\/think>/.test(content)
}

