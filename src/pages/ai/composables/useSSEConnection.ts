/**
 * SSE 连接管理 Composable
 * 
 * 功能：
 * - SSE 连接建立和管理
 * - 消息接收处理
 * - 连接状态管理
 */

import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { createSSEConnection } from '@/utils/sse'
import type { ModelConfig, SSECallbacks } from '../types'

export function useSSEConnection() {
  const isConnecting = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  let eventSource: EventSource | null = null

  /**
   * 建立 SSE 连接
   */
  const connectSSE = async (
    config: ModelConfig,
    chatId: string,
    prompt: string,
    callbacks: SSECallbacks
  ): Promise<void> => {
    isConnecting.value = true
    isLoading.value = true

    // 根据模型类型确定端点和请求数据
    let endpoint = ''
    let requestData: any = {}

    if (config.isVision) {
      // 视觉模型端点
      endpoint = `/api/ai/vision/${chatId}`
      requestData = {
        model: config.model,
        userPrompt: prompt
      }
    } else {
      // 文本模型端点
      endpoint = `/api/ai/chat/${chatId}`
      requestData = {
        model: config.model,
        userPrompt: prompt,
        webSearch: config.useWebSearch || false,
        rag: config.useRAG || false,
        toolCalling: config.useToolCalling || false
      }
    }

    try {
      // 建立 SSE 连接
      eventSource = await createSSEConnection(endpoint, requestData, {
        onMessage: (data: string) => {
          callbacks.onMessage(data)
        },
        onComplete: () => {
          isConnecting.value = false
          isLoading.value = false
          callbacks.onComplete()
        },
        onError: (error: Error) => {
          isConnecting.value = false
          isLoading.value = false
          callbacks.onError(error)
        }
      })
    } catch (error) {
      isConnecting.value = false
      isLoading.value = false
      Message.error('连接服务器失败')
    }
  }

  /**
   * 关闭 SSE 连接
   */
  const closeSSE = (): void => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
    isConnecting.value = false
    isLoading.value = false
  }

  return {
    isConnecting,
    isLoading,
    connectSSE,
    closeSSE
  }
}

