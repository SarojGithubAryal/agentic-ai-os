import { FastifyInstance } from "fastify";
import {
  uploadController,
  listDocumentsController,
  getDocumentController,
  deleteDocumentController,
  searchController,
} from "../controller/knowledge.controller.js";
import { requireAuth } from "../../../shared/auth/index.js";

export async function knowledgeRoutes(app: FastifyInstance) {
  app.post("/upload", {
    preHandler: [requireAuth],
    schema: { tags: ["Knowledge"], consumes: ["multipart/form-data"] },
  }, uploadController);

  app.get("/", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Knowledge"],
      querystring: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          offset: { type: "integer", minimum: 0, default: 0 },
        },
      },
    },
  }, listDocumentsController);

  app.get("/:id", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Knowledge"],
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
    },
  }, getDocumentController);

  app.delete("/:id", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Knowledge"],
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
    },
  }, deleteDocumentController);

  app.post("/search", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Knowledge"],
      body: {
        type: "object",
        required: ["query"],
        properties: {
          query: { type: "string" },
          limit: { type: "integer", minimum: 1, maximum: 20, default: 5 },
        },
      },
    },
  }, searchController);
}