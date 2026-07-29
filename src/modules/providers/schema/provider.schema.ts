import { z } from "zod";

// Base configuration required by every provider
export const baseProviderConfigSchema = z.object({
  providerName: z.string(),
  enabled: z.boolean().default(true),
});

// OpenAI-like provider configuration (example for future use)
export const openAIProviderConfigSchema = baseProviderConfigSchema.extend({
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional(),
  defaultModel: z.string().default("gpt-4o"),
});

// Noop provider requires no extra config
export const noopProviderConfigSchema = baseProviderConfigSchema.extend({});

export type BaseProviderConfig = z.infer<typeof baseProviderConfigSchema>;
export type OpenAIProviderConfig = z.infer<typeof openAIProviderConfigSchema>;
export type NoopProviderConfig = z.infer<typeof noopProviderConfigSchema>;

// Helper to validate a provider config
export const validateProviderConfig = <T extends z.ZodSchema>(
  schema: T,
  config: unknown
): z.infer<T> => {
  return schema.parse(config);
};