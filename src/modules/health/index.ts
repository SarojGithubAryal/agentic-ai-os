import { FastifyInstance } from "fastify";
import { healthRoutes } from "./routes/health.routes.js";

export const registerHealthModule = async (app: FastifyInstance) => {
  await app.register(healthRoutes, { prefix: "/api/v1" });
};