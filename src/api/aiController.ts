// @ts-ignore
/* eslint-disable */
import request from '@/config/request'

/** 此处后端没有提供注释 POST /ai/chat */
export async function chat(body: API.AIQuestionRequest, options?: { [key: string]: any }) {
  return request<API.SseEmitter>('/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 此处后端没有提供注释 GET /ai/chatroom/${param0} */
export async function getChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatRoomParams,
  options?: { [key: string]: any }
) {
  const { chatroomId: param0, ...queryParams } = params
  return request<API.BaseResponseChatRoomVO>(`/ai/chatroom/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {})
  })
}

/** 此处后端没有提供注释 POST /ai/chatroom/create */
export async function createChatRoom(
  body: API.ChatRoomAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseChatRoomVO>('/ai/chatroom/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 此处后端没有提供注释 GET /ai/chatroom/list */
export async function listChatRooms(options?: { [key: string]: any }) {
  return request<API.BaseResponseListChatRoomVO>('/ai/chatroom/list', {
    method: 'GET',
    ...(options || {})
  })
}
