import { FastifyRequest, FastifyReply } from "fastify";
import { listProviders, healthCheckAll } from "../service/provider.service.js";

export const listProvidersController = async (_req: FastifyRequest, reply: FastifyReply) => {
  const providers = listProviders();
  return reply.send({ success: true, data: providers });
};

export const healthCheckController = async (_req: FastifyRequest, reply: FastifyReply) => {
  const results = await healthCheckAll();
  return reply.send({ success: true, data: results });
};