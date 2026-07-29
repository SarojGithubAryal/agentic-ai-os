import { FastifyInstance } from "fastify";
import { toolRoutes } from "./routes/tool.routes.js";
import { CalculatorTool } from "./adapters/calculator.tool.js";
import { DateTimeTool } from "./adapters/datetime.tool.js";
import { toolRegistry } from "./registry/tool-registry.js";

export const registerToolsModule = async (app: FastifyInstance) => {
  // Register built‑in tools
  toolRegistry.register(new CalculatorTool());
  toolRegistry.register(new DateTimeTool());

  await app.register(toolRoutes, { prefix: "/api/v1/tools" });
};

export { toolRegistry };