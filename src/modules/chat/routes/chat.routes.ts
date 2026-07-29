import { FastifyInstance } from "fastify";
import { chatController } from "../controller/chat.controller.js";

export async function chatRoutes(app: FastifyInstance) {
  app.post("/", { schema: { tags: ["Chat"] } }, chatController);
}