import { FastifyInstance } from "fastify";
import {
  listProvidersController,
  healthCheckController,
} from "../controller/provider.controller.js";

export async function providerRoutes(app: FastifyInstance) {
  app.get("/", { schema: { tags: ["Providers"] } }, listProvidersController);
  app.get("/health", { schema: { tags: ["Providers"] } }, healthCheckController);
}