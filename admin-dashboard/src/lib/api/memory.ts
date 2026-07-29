import apiClient from '../api-client'
import type { MemoryListResponse, MemorySearchParams } from '../../types/memory'

export async function searchMemories(params: MemorySearchParams): Promise<MemoryListResponse> {
  const response = await apiClient.get<MemoryListResponse>('/memory', { params })
  return response.data
}

export async function deleteMemory(id: string): Promise<{ success: boolean; message?: string }> {
  const response = await apiClient.delete<{ success: boolean; message?: string }>(`/memory/${id}`)
  return response.data
}