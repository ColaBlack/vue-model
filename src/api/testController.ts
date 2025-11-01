// @ts-ignore
/* eslint-disable */
import request from '@/config/request'

/** 心跳检测 检测服务是否正常运行，返回'It's OK!'表示服务正常 GET /test/hello */
export async function heartbeat(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/test/hello', {
    method: 'GET',
    ...(options || {})
  })
}
