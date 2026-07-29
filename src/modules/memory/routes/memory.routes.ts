import { FastifyInstance } from "fastify";
import {
  createMemoryController,
  searchMemoriesController,
  deleteMemoryController,
} from "../controller/memory.controller.js";

export async function memoryRoutes(app: FastifyInstance) {
  app.post("/", { schema: { tags: ["Memory"] } }, createMemoryController);
  app.get("/", { schema: { tags: ["Memory"] } }, searchMemoriesController);
  app.delete("/:id", { schema: { tags: ["Memory"] } }, deleteMemoryController);
}