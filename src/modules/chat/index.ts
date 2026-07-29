import { FastifyInstance } from "fastify";
import { chatRoutes } from "./routes/chat.routes.js";

export const registerChatModule = async (app: FastifyInstance) => {
  await app.register(chatRoutes, { prefix: "/api/v1/chat" });
};