export type StepType = "tool" | "provider" | "condition" | "parallel";

export interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  config: Record<string, unknown>;
  retryCount?: number;
  onFailure?: "stop" | "skip" | "retry";
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowRun {
  id: string;
  workflowName: string;
  status: "running" | "completed" | "failed";
  currentStepIndex: number;
  results: Record<string, unknown>[];
  startedAt: string;
  completedAt?: string;
}