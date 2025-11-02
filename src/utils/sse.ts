import { BASE_URL } from '@/config/request'

/**
 * SSE 流式请求工具（支持POST请求）
 * @param endpoint API端点路径（如 '/ai/chat' 或 '/ai/vision-chat'）
 * @param requestData 请求数据对象
 * @param onMessage 接收消息回调
 * @param onError 错误回调
 * @param onComplete 完成回调
 * @returns 包含abort方法的对象，可用于取消请求
 */
export function createSSEConnection(
  endpoint: string,
  requestData: any,
  onMessage: (data: string) => void,
  onError?: (error: Event) => void,
  onComplete?: () => void
): EventSource {
  const url = `${BASE_URL}${endpoint}`
  const abortController = new AbortController()
  
  // 使用fetch进行POST请求并处理流式响应
  const fetchSSE = async () => {
    try {
      // 获取token（如果有）
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
        signal: abortController.signal,
        credentials: 'include' // 发送cookie
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      // 创建一个reader来读取流式数据
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      // 持续读取数据流
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          if (onComplete) {
            onComplete()
          }
          break
        }

        // 解码接收到的数据
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        // 处理SSE格式：data:token1data:token2...data:tokenN\n\n
        // 多个 data: 标记组成一个事件，\n\n 是事件分隔符
        
        // 按照 \n\n 分割出完整的事件
        const events = buffer.split('\n\n')
        
        // 保留最后一个片段（可能不完整）
        buffer = events.pop() || ''
        
        // 处理所有完整的事件
        for (const event of events) {
          if (!event) continue
          
          // 将事件按 data: 分割，提取所有token
          const tokens = event.split('data:')
          
          // 拼接所有非空token（第一个token通常是空的，因为字符串以data:开头）
          let eventContent = ''
          for (const token of tokens) {
            if (token !== '') {
              eventContent += token
            }
          }
          
          // 检查是否是结束标记
          if (eventContent.trim() === '[DONE]') {
            if (onComplete) {
              onComplete()
            }
            reader.cancel()
            return
          }
          
          // 发送内容
          if (eventContent !== '') {
            onMessage(eventContent)
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return
      }
      if (onError) {
        const errorEvent = new Event('error')
        onError(errorEvent)
      }
    }
  }

  // 启动fetch
  fetchSSE()

  // 返回一个模拟的EventSource对象，提供close方法
  const mockEventSource = {
    close: () => {
      abortController.abort()
    },
    readyState: 1, // OPEN
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2
  } as EventSource

  return mockEventSource
}
