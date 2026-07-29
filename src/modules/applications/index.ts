import { FastifyInstance } from "fastify";
import { applicationsRoutes } from "./routes/applications.routes.js";

export const registerApplicationsModule = async (app: FastifyInstance) => {
  await app.register(applicationsRoutes, { prefix: "/api/v1/applications" });
};