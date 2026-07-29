import { FastifyInstance } from "fastify";
import { agentRoutes } from "./routes/agent.routes.js";
import { SimpleAssistant } from "./adapters/simple-assistant.agent.js";
import { agentRegistry } from "./registry/agent-registry.js";

export const registerAgentsModule = async (app: FastifyInstance) => {
  // Register built-in agents
  agentRegistry.register(new SimpleAssistant());

  // Register routes
  await app.register(agentRoutes, { prefix: "/api/v1/agents" });
};

export { agentRegistry };