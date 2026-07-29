import { FastifyRequest, FastifyReply } from "fastify";
import { executeToolSchema } from "../schema/tool.schema.js";
import { listTools, executeTool } from "../service/tool.service.js";
import { BadRequestError, NotFoundError } from "../../../shared/errors/index.js";

export const listToolsController = async (_req: FastifyRequest, reply: FastifyReply) => {
  const tools = listTools();
  return reply.send({ success: true, data: tools });
};

export const executeToolController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name } = req.params as { name: string };
  const body = executeToolSchema.parse(req.body);

  try {
    const result = await executeTool(name, body.input, req.user?.sub);
    return reply.send({ success: true, data: result });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      throw new NotFoundError(err.message);
    }
    throw new BadRequestError(err.message);
  }
};