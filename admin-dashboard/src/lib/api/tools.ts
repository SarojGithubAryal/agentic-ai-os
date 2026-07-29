import apiClient from '../api-client'
import type { ToolsListResponse, ToolExecuteResponse } from '../../types/tool'

export async function listTools(): Promise<ToolsListResponse> {
  const response = await apiClient.get<ToolsListResponse>('/tools')
  return response.data
}

export async function executeTool(name: string, input: Record<string, unknown>): Promise<ToolExecuteResponse> {
  const response = await apiClient.post<ToolExecuteResponse>(`/tools/${name}/execute`, { input })
  return response.data
}