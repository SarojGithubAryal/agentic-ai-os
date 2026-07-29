import { AgentGoal, AgentResult } from "./agent.types.js";

export interface IAgent {
  readonly name: string;
  run(goal: AgentGoal): Promise<AgentResult>;
}