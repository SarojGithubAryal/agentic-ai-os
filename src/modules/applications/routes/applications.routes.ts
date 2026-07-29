import { FastifyInstance } from "fastify";
import {
  createAppController,
  listAppsController,
  getAppController,
  updateAppController,
  deleteAppController,
} from "../controller/applications.controller.js";
import { requireAuth } from "../../../shared/auth/index.js";

export async function applicationsRoutes(app: FastifyInstance) {
  // List – GET /api/v1/applications
  app.get("/", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Applications"],
      querystring: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          offset: { type: "integer", minimum: 0, default: 0 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  userId: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  }, listAppsController);

  // Create – POST /api/v1/applications
  app.post("/", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Applications"],
      body: {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string", minLength: 1, maxLength: 255 } },
      },
      response: {
        201: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                apiKey: { type: "string" },
              },
            },
          },
        },
      },
    },
  }, createAppController);

  // Get by ID – GET /api/v1/applications/:id
  app.get("/:id", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Applications"],
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                userId: { type: "string" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
        },
      },
    },
  }, getAppController);

  // Update – PUT /api/v1/applications/:id
  app.put("/:id", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Applications"],
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string", minLength: 1, maxLength: 255 } },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                userId: { type: "string" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
        },
      },
    },
  }, updateAppController);

  // Delete – DELETE /api/v1/applications/:id
  app.delete("/:id", {
    preHandler: [requireAuth],
    schema: {
      tags: ["Applications"],
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
      response: {
        204: { type: "null" },
      },
    },
  }, deleteAppController);
}