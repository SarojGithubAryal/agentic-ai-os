import { FastifyInstance } from "fastify";
import { runAgentController } from "../controller/agent.controller.js";

export async function agentRoutes(app: FastifyInstance) {
  app.post("/:name/run", { schema: { tags: ["Agents"] } }, runAgentController);
}