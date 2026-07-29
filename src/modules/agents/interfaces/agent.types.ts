export interface AgentGoal {
  goal: string;
  context?: Record<string, unknown>;
}

export interface AgentStep {
  thought: string;
  action: { type: "tool" | "workflow" | "provider"; name: string; input?: Record<string, unknown> };
  result?: unknown;
}

export interface AgentResult {
  status: "success" | "failed";
  finalAnswer: string;
  steps: AgentStep[];
  startedAt: string;
  completedAt: string;
}