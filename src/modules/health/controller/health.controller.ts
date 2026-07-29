import { FastifyReply } from "fastify";
import { getHealthStatus } from "../service/health.service.js";

export const healthController = async (_request: any, reply: FastifyReply) => {
  return reply.send({
    success: true,
    data: getHealthStatus(),
  });
};