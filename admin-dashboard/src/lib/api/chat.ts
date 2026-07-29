import apiClient from '../api-client'
import type { ChatRequest, ChatResponse } from '../../types/chat'

export async function sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>('/chat', data)
  return response.data
}