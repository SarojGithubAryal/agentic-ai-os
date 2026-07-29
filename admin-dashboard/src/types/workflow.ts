export interface WorkflowStep {
  stepId: string
  result: unknown
}

export interface WorkflowRun {
  id: string
  workflowName: string
  status: 'completed' | 'failed'
  currentStepIndex: number
  results: WorkflowStep[]
  startedAt: string
  completedAt: string
}

export interface WorkflowRunResponse {
  success: boolean
  data: WorkflowRun
}

export interface WorkflowStartRequest {
  input?: Record<string, unknown>
}