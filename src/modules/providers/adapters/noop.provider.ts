import { IProviderAdapter } from "../interfaces/provider-adapter.interface.js";
import {
  TextGenerationInput,
  TextGenerationOutput,
  ProviderHealth,
} from "../interfaces/provider.types.js";
import {
  noopProviderConfigSchema,
  NoopProviderConfig,
} from "../schema/provider.schema.js";

export class NoopProvider implements IProviderAdapter {
  readonly providerName = "noop";
  private config: NoopProviderConfig;

  constructor(config?: Partial<NoopProviderConfig>) {
    this.config = noopProviderConfigSchema.parse({
      providerName: "noop",
      enabled: true,
      ...config,
    });
  }

  async generateText(input: TextGenerationInput): Promise<TextGenerationOutput> {
    return {
      text: `[Noop] This is a mock response to: "${input.prompt}"`,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }

  async *streamText(input: TextGenerationInput): AsyncIterable<TextGenerationOutput> {
    yield {
      text: `[Noop stream] Response to: "${input.prompt}"`,
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.providerName,
      status: this.config.enabled ? "ok" : "error",
      message: this.config.enabled
        ? "Noop provider is always healthy."
        : "Noop provider is disabled.",
    };
  }
}