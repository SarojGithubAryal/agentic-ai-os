import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import { config } from "./config/index.js";
import { logger } from "./shared/logging/index.js";
import { errorHandler } from "./shared/errors/index.js";
import { authPlugin } from "./shared/auth/index.js";
import { registerHealthModule } from "./modules/health/index.js";
import { registerAuthModule } from "./modules/auth/index.js";
import { registerApplicationsModule } from "./modules/applications/index.js";
import { registerProvidersModule } from "./modules/providers/index.js";
import { registerChatModule } from "./modules/chat/index.js";
import { registerMemoryModule } from "./modules/memory/index.js";
import { registerToolsModule } from "./modules/tools/index.js";
import { registerWorkflowsModule } from "./modules/workflows/index.js";
import { registerAgentsModule } from "./modules/agents/index.js";

const app = Fastify({
  logger: {
    level: config.LOG_LEVEL,
    ...(config.isDev && {
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    }),
  },
  genReqId: () => randomUUID(),
});

app.setErrorHandler(errorHandler);

// Swagger / OpenAPI
await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Agentic AI OS",
      version: "0.1.0",
      description: "Intelligence platform API",
    },
    components: {
      schemas: {
        Application: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            userId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ApplicationWithKey: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            apiKey: { type: "string" },
          },
        },
      },
    },
  },
});
await app.register(fastifySwaggerUi, { routePrefix: "/docs" });

// CORS – allow frontend calls from any origin during development
await app.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Shared plugins (authentication middleware)
await app.register(authPlugin);

// Domain modules (routes)
await registerHealthModule(app);
await registerAuthModule(app);
await registerApplicationsModule(app);
await registerProvidersModule(app);
await registerChatModule(app);
await registerMemoryModule(app);
await registerToolsModule(app);
await registerWorkflowsModule(app);
await registerAgentsModule(app);

// Start server
app.listen({ port: config.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});