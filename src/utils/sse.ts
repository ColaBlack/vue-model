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
  console.log('🔗 创建SSE连接:', url)
  console.log('📦 请求数据:', requestData)

  // 创建一个AbortController用于取消请求
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
          console.log('✅ SSE流读取完成')
          if (onComplete) {
            onComplete()
          }
          break
        }

        // 解码接收到的数据
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        
        console.log('📥 收到数据块:', chunk)

        // 处理SSE格式的数据（以 data: 开头，以 \n\n 结束）
        // SSE标准格式：data: 内容\n\n
        // 注意：内容本身可能包含 \n，所以不能简单地用 \n 分割
        while (true) {
          // 查找 \n\n 作为消息分隔符
          const separatorIndex = buffer.indexOf('\n\n')
          if (separatorIndex === -1) {
            // 没有找到完整的消息，继续读取
            break
          }

          // 提取一条完整的消息
          const message = buffer.substring(0, separatorIndex)
          buffer = buffer.substring(separatorIndex + 2) // 移除已处理的消息和分隔符

          // 解析消息内容
          const lines = message.split('\n')
          for (const line of lines) {
            const trimmedLine = line.trim()
            
            // 跳过空行和注释行
            if (!trimmedLine || trimmedLine.startsWith(':')) {
              continue
            }
            
            // 检查是否是标准SSE格式 (data: xxx)
            if (trimmedLine.startsWith('data:')) {
              // 移除 "data:" 前缀（注意可能是 "data: " 或 "data:"）
              let data = trimmedLine.substring(5)
              if (data.startsWith(' ')) {
                data = data.substring(1) // 移除可选的空格
              }
              
              if (data.trim() === '[DONE]') {
                // 流结束标记
                console.log('✅ 收到结束标记 [DONE]')
                if (onComplete) {
                  onComplete()
                }
                reader.cancel()
                return
              }
              if (data) {
                console.log('📨 发送消息:', data)
                onMessage(data)
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('🛑 SSE连接已被用户取消')
        return
      }
      console.error('❌ SSE连接错误:', error)
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
      console.log('🛑 关闭SSE连接')
      abortController.abort()
    },
    readyState: 1, // OPEN
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2
  } as EventSource

  return mockEventSource
}
