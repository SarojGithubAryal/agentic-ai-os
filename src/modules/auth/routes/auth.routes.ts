import { FastifyInstance } from "fastify";
import {
  registerController,
  loginController,
  refreshController,
  meController,
} from "../controller/auth.controller.js";
import { requireAuth } from "../../../shared/auth/index.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", { schema: { tags: ["Auth"] } }, registerController);
  app.post("/login", { schema: { tags: ["Auth"] } }, loginController);
  app.post("/refresh", { schema: { tags: ["Auth"] } }, refreshController);
  app.get("/me", {
    preHandler: [requireAuth],
    schema: { tags: ["Auth"] },
  }, meController);
}