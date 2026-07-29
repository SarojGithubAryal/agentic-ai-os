import { FastifyInstance } from "fastify";
import { listToolsController, executeToolController } from "../controller/tool.controller.js";

export async function toolRoutes(app: FastifyInstance) {
  app.get("/", { schema: { tags: ["Tools"] } }, listToolsController);
  app.post("/:name/execute", { schema: { tags: ["Tools"] } }, executeToolController);
}