import apiClient from '../api-client'
import type {
  DocumentListResponse,
  DocumentSingleResponse,
  DocumentUploadResponse,
  SearchResponse,
} from '../../types/knowledge'

export async function listDocuments(limit = 20, offset = 0): Promise<DocumentListResponse> {
  const response = await apiClient.get<DocumentListResponse>('/knowledge', { params: { limit, offset } })
  return response.data
}

export async function getDocument(id: string): Promise<DocumentSingleResponse> {
  const response = await apiClient.get<DocumentSingleResponse>(`/knowledge/${id}`)
  return response.data
}

export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<DocumentUploadResponse>('/knowledge/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function deleteDocument(id: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(`/knowledge/${id}`)
  return response.data
}

export async function searchKnowledge(query: string, limit = 10): Promise<SearchResponse> {
  const response = await apiClient.post<SearchResponse>('/knowledge/search', { query, limit })
  return response.data
}