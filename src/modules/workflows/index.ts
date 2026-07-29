import { FastifyInstance } from "fastify";
import { workflowRoutes } from "./routes/workflow.routes.js";
import { DemoWorkflow } from "./adapters/demo-workflow.js";
import { workflowRegistry } from "./registry/workflow-registry.js";

export const registerWorkflowsModule = async (app: FastifyInstance) => {
  // Register built-in demo workflow
  workflowRegistry.register(new DemoWorkflow());

  await app.register(workflowRoutes, { prefix: "/api/v1/workflows" });
};

export { workflowRegistry };