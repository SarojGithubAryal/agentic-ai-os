import { FastifyInstance } from "fastify";
import { memoryRoutes } from "./routes/memory.routes.js";

export const registerMemoryModule = async (app: FastifyInstance) => {
  await app.register(memoryRoutes, { prefix: "/api/v1/memory" });
};