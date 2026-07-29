import { FastifyInstance } from "fastify";
import { providerRoutes } from "./routes/provider.routes.js";
import { NoopProvider } from "./adapters/noop.provider.js";
import { OpenAIProvider } from "./adapters/openai.provider.js";
import { GeminiProvider } from "./adapters/gemini.provider.js";
import { OpenRouterProvider } from "./adapters/openrouter.provider.js";
import { providerRegistry } from "./registry/provider-registry.js";
import { config } from "../../config/index.js";

export const registerProvidersModule = async (app: FastifyInstance) => {
  // Always register Noop (fallback)
  providerRegistry.register(new NoopProvider());

  // Register real providers if their API keys are present.
  // Order matters: the first registered real provider becomes the default.
  if (config.OPENROUTER_API_KEY) {
    providerRegistry.register(new OpenRouterProvider());
  }

  if (config.OPENAI_API_KEY) {
    providerRegistry.register(new OpenAIProvider());
  }

  if (config.GEMINI_API_KEY) {
    providerRegistry.register(new GeminiProvider());
  }

  await app.register(providerRoutes, { prefix: "/api/v1/providers" });
};

export { providerRegistry };