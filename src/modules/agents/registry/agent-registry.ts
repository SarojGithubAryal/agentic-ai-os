import { IAgent } from "../interfaces/agent.interface.js";

class AgentRegistry {
  private agents: Map<string, IAgent> = new Map();

  register(agent: IAgent): void {
    if (this.agents.has(agent.name)) {
      throw new Error(`Agent "${agent.name}" is already registered.`);
    }
    this.agents.set(agent.name, agent);
  }

  get(name: string): IAgent | undefined {
    return this.agents.get(name);
  }

  list(): string[] {
    return Array.from(this.agents.keys());
  }

  clear(): void {
    this.agents.clear();
  }
}

export const agentRegistry = new AgentRegistry();