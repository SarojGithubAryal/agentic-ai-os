import { FastifyRequest, FastifyReply } from "fastify";
import {
  createApplicationSchema,
  updateApplicationSchema,
  listApplicationsQuerySchema,
} from "../schema/applications.schema.js";
import {
  registerApplication,
  listUserApplications,
  getApplicationById,
  updateApplicationName,
  deleteApplication,
} from "../service/applications.service.js";
import { BadRequestError, UnauthorizedError } from "../../../shared/errors/index.js";

export const createAppController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) {
    throw new UnauthorizedError("User authentication required");
  }
  const body = createApplicationSchema.parse(req.body);
  const app = await registerApplication(body.name, req.user.sub);
  return reply.status(201).send({ success: true, data: app });
};

export const listAppsController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const query = listApplicationsQuerySchema.parse(req.query);
  const apps = await listUserApplications(req.user.sub, query.limit, query.offset);
  return reply.send({ success: true, data: apps });
};

export const getAppController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const { id } = req.params as { id: string };
  const app = await getApplicationById(id, req.user.sub);
  return reply.send({ success: true, data: app });
};

export const updateAppController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const { id } = req.params as { id: string };
  const body = updateApplicationSchema.parse(req.body);
  const app = await updateApplicationName(id, req.user.sub, body.name);
  return reply.send({ success: true, data: app });
};

export const deleteAppController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const { id } = req.params as { id: string };
  await deleteApplication(id, req.user.sub);
  return reply.status(204).send();
};