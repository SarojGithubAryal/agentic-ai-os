import apiClient from '../api-client'
import type { WorkflowRunResponse } from '../../types/workflow'

export async function startWorkflow(name: string, input?: Record<string, unknown>): Promise<WorkflowRunResponse> {
  const response = await apiClient.post<WorkflowRunResponse>(`/workflows/${name}/run`, { input: input ?? {} })
  return response.data
}

export async function getWorkflowRun(runId: string): Promise<WorkflowRunResponse> {
  const response = await apiClient.get<WorkflowRunResponse>(`/workflows/runs/${runId}`)
  return response.data
}