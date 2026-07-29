import { FastifyRequest, FastifyReply } from "fastify";
import { runAgentSchema } from "../schema/agent.schema.js";
import { runAgent } from "../service/agent.service.js";
import { BadRequestError, NotFoundError } from "../../../shared/errors/index.js";

export const runAgentController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name } = req.params as { name: string };
  const body = runAgentSchema.parse(req.body);

  try {
    const result = await runAgent(name, body.goal, body.context);
    return reply.status(201).send({ success: true, data: result });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      throw new NotFoundError(err.message);
    }
    throw new BadRequestError(err.message);
  }
};