import { FastifyInstance } from "fastify";
import { authRoutes } from "./routes/auth.routes.js";

export const registerAuthModule = async (app: FastifyInstance) => {
  await app.register(authRoutes, { prefix: "/api/v1/auth" });
};