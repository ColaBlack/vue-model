/**
 * Markdown 渲染工具
 * 提供 Markdown 到 HTML 的转换功能
 */

import { marked } from 'marked'

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持GFM换行，将单个换行符转换为<br>
  gfm: true, // 启用GitHub风格的Markdown
  pedantic: false, // 不使用严格模式
})

/**
 * 渲染 Markdown 内容为 HTML
 * 确保换行符被正确处理
 * 
 * @param content - Markdown 格式的文本内容
 * @returns HTML 字符串
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''
  
  try {
    // marked的breaks选项会将单个\n转换为<br>
    // 这确保了AI回复中的换行符被正确显示
    return marked(content) as string
  } catch (error) {
    console.error('Markdown渲染错误:', error)
    // 如果渲染失败，至少保留换行符
    return content.replace(/\n/g, '<br>')
  }
}

/**
 * 解析消息内容，分离思考过程和正常内容
 * 深度推理模型会输出 <think>...</think> 包裹的思考过程
 * 
 * @param content - 原始消息内容
 * @returns 解析后的内容对象
 */
export function parseMessageContent(content: string): {
  thinkingProcess: string
  normalContent: string
} {
  if (!content) {
    return {
      thinkingProcess: '',
      normalContent: ''
    }
  }

  // 匹配完整的 <think>...</think> 标签
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g
  const matches = content.match(thinkRegex)
  
  if (matches && matches.length > 0) {
    // 提取所有思考过程
    let thinkingProcess = ''
    let normalContent = content
    
    matches.forEach(match => {
      const innerMatch = match.match(/<think>([\s\S]*?)<\/think>/)
      if (innerMatch) {
        thinkingProcess += (thinkingProcess ? '\n\n' : '') + innerMatch[1].trim()
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

