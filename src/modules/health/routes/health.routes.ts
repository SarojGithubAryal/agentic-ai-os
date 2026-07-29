import { FastifyInstance } from "fastify";
import { healthController } from "../controller/health.controller.js";
import { healthResponseSchema } from "../schema/health.schema.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    { schema: healthResponseSchema },
    healthController
  );
}