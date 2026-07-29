import apiClient from '../api-client'
import type {
  ApplicationListResponse,
  ApplicationSingleResponse,
  ApplicationCreateResponse,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
} from '../../types/application'

export async function listApplications(limit = 20, offset = 0): Promise<ApplicationListResponse> {
  const response = await apiClient.get<ApplicationListResponse>('/applications', {
    params: { limit, offset },
  })
  return response.data
}

export async function getApplication(id: string): Promise<ApplicationSingleResponse> {
  const response = await apiClient.get<ApplicationSingleResponse>(`/applications/${id}`)
  return response.data
}

export async function createApplication(data: ApplicationCreateRequest): Promise<ApplicationCreateResponse> {
  const response = await apiClient.post<ApplicationCreateResponse>('/applications', data)
  return response.data
}

export async function updateApplication(id: string, data: ApplicationUpdateRequest): Promise<ApplicationSingleResponse> {
  const response = await apiClient.put<ApplicationSingleResponse>(`/applications/${id}`, data)
  return response.data
}

export async function deleteApplication(id: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(`/applications/${id}`)
  return response.data
}