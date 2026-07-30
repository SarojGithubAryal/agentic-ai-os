import { FastifyRequest, FastifyReply } from "fastify";
import {
  searchQuerySchema,
  listDocumentsQuerySchema,
} from "../schema/knowledge.schema.js";
import {
  uploadAndIndexDocument,
  listUserDocuments,
  getDocumentWithChunks,
  deleteDocument,
  searchDocuments,
} from "../service/knowledge.service.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/index.js";

export const uploadController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const data = await (req as any).file();
  if (!data) throw new BadRequestError("No file uploaded");

  const buffer = await data.toBuffer();
  const content = buffer.toString("utf-8");
  const fileName = data.filename;
  const mimeType = data.mimetype;

  const doc = await uploadAndIndexDocument(
    req.user.sub,
    fileName,
    mimeType,
    content,
    fileName,
    buffer.length
  );

  return reply.status(201).send({ success: true, data: { id: doc.id, status: doc.status } });
};

export const listDocumentsController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const query = listDocumentsQuerySchema.parse(req.query);
  const docs = await listUserDocuments(req.user.sub, query.limit, query.offset);
  return reply.send({ success: true, data: docs });
};

export const getDocumentController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const { id } = req.params as { id: string };
  const doc = await getDocumentWithChunks(id, req.user.sub);
  if (!doc) throw new NotFoundError("Document not found");
  return reply.send({ success: true, data: doc });
};

export const deleteDocumentController = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) throw new UnauthorizedError();
  const { id } = req.params as { id: string };
  await deleteDocument(id, req.user.sub);
  return reply.status(204).send();
};

export const searchController = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = searchQuerySchema.parse(req.body);
  const results = await searchDocuments(body.query, body.limit);
  return reply.send({ success: true, data: results });
};