import { FastifyRequest, FastifyReply } from "fastify";
import { createMemorySchema, searchMemorySchema } from "../schema/memory.schema.js";
import { storeMemory, searchMemories, removeMemory } from "../service/memory.service.js";
import { BadRequestError, NotFoundError } from "../../../shared/errors/index.js";

export const createMemoryController = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = createMemorySchema.parse(req.body);
  const memory = await storeMemory(body);
  return reply.status(201).send({ success: true, data: memory });
};

export const searchMemoriesController = async (req: FastifyRequest, reply: FastifyReply) => {
  const query = searchMemorySchema.parse(req.query);
  const results = await searchMemories(query);
  return reply.send({ success: true, data: results });
};

export const deleteMemoryController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  try {
    await removeMemory(id);
    return reply.send({ success: true, message: "Memory deleted" });
  } catch {
    throw new NotFoundError("Memory not found");
  }
};