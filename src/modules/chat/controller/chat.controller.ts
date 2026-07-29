import { FastifyRequest, FastifyReply } from "fastify";
import { chatRequestSchema } from "../schema/chat.schema.js";
import { generateChatResponse } from "../service/chat.service.js";
import { BadRequestError } from "../../../shared/errors/index.js";

export const chatController = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = chatRequestSchema.parse(req.body);

  try {
    const result = await generateChatResponse(
      body.message,
      req.user?.sub,           // userId from JWT (if authenticated)
      body.provider,
      body.model,
      body.maxTokens,
      body.temperature
    );
    return reply.send({ success: true, data: result });
  } catch (err: any) {
    throw new BadRequestError(err.message);
  }
};