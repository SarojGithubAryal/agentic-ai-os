import { FastifyInstance } from "fastify";
import { runWorkflowController, getWorkflowRunController } from "../controller/workflow.controller.js";

export async function workflowRoutes(app: FastifyInstance) {
  app.post("/:name/run", { schema: { tags: ["Workflows"] } }, runWorkflowController);
  app.get("/runs/:id", { schema: { tags: ["Workflows"] } }, getWorkflowRunController);
}