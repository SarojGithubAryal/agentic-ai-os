import { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import { knowledgeRoutes } from "./routes/knowledge.routes.js";

export const registerKnowledgeModule = async (app: FastifyInstance) => {
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  await app.register(knowledgeRoutes, { prefix: "/api/v1/knowledge" });
};