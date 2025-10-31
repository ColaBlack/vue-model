import { BASE_URL } from '@/config/request'

/**
 * SSE 流式请求工具
 * @param userPrompt 用户提问
 * @param chatId 聊天室ID
 * @param onMessage 接收消息回调
 * @param onError 错误回调
 * @param onComplete 完成回调
 * @returns EventSource 实例，可用于关闭连接
 */
export function createSSEConnection(
  userPrompt: string,
  chatId: string,
  onMessage: (data: string) => void,
  onError?: (error: Event) => void,
  onComplete?: () => void
): EventSource {
  // 构建 GET 请求 URL，包含查询参数
  const params = new URLSearchParams({
    userPrompt,
    chatId
  })
  
  const url = `${BASE_URL}/ai/chat?${params.toString()}`
  
  // EventSource 不支持 withCredentials 选项，但同源请求会自动发送 cookie
  // 如果是跨域，需要后端配置 CORS 允许 credentials
  const eventSource = new EventSource(url)

  eventSource.onmessage = (event) => {
    try {
      const data = event.data
      if (data) {
        onMessage(data)
      }
    } catch (error) {
      console.error('解析 SSE 消息失败:', error)
      if (onError) {
        onError(event)
      }
    }
  }

  eventSource.onerror = (error) => {
    // 检查连接状态：0 = CONNECTING, 1 = OPEN, 2 = CLOSED
    // 如果连接已关闭，可能是正常完成，不应视为错误
    if (eventSource.readyState === EventSource.CLOSED) {
      // 连接已关闭，可能是正常完成
      if (onComplete) {
        onComplete()
      }
      return
    }
    
    // 真正的错误情况
    console.error('SSE 连接错误:', error)
    if (onError) {
      onError(error)
    }
    // 错误时关闭连接
    eventSource.close()
  }

  // 监听自定义的 complete 事件（如果后端发送的话）
  eventSource.addEventListener('complete', () => {
    if (onComplete) {
      onComplete()
    }
    eventSource.close()
  })

  // 监听 close 事件
  eventSource.addEventListener('close', () => {
    eventSource.close()
    if (onComplete) {
      onComplete()
    }
  })

  return eventSource
}
