import { agentRegistry } from "../registry/agent-registry.js";

export const runAgent = async (agentName: string, goal: string, context?: Record<string, unknown>) => {
  const agent = agentRegistry.get(agentName);
  if (!agent) {
    throw new Error(`Agent "${agentName}" not found`);
  }
  return agent.run({ goal, context });
};