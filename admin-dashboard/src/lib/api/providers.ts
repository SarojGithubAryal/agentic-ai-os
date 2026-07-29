import apiClient from '../api-client'
import type { ProvidersHealthResponse } from '../../types/provider'

export async function getProvidersHealth(): Promise<ProvidersHealthResponse> {
  const response = await apiClient.get<ProvidersHealthResponse>('/providers/health')
  return response.data
}