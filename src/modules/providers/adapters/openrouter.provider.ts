import OpenAI from "openai";
import { IProviderAdapter } from "../interfaces/provider-adapter.interface.js";
import {
  TextGenerationInput,
  TextGenerationOutput,
  ProviderHealth,
} from "../interfaces/provider.types.js";
import { config } from "../../../config/index.js";
import { NoopProvider } from "./noop.provider.js";
import { logger } from "../../../shared/logging/index.js";

export class OpenRouterProvider implements IProviderAdapter {
  readonly providerName = "openrouter";
  private client: OpenAI | null = null;
  private fallback: NoopProvider = new NoopProvider();

  constructor() {
    if (!config.OPENROUTER_API_KEY) {
      logger.warn("OPENROUTER_API_KEY not set – OpenRouter provider disabled.");
      return;
    }
    this.client = new OpenAI({
      apiKey: config.OPENROUTER_API_KEY,
      baseURL: config.OPENROUTER_BASE_URL,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Agentic AI OS",
      },
    });
    logger.info("OpenRouter client initialized");
  }

  async generateText(input: TextGenerationInput): Promise<TextGenerationOutput> {
    if (!this.client) return this.fallback.generateText(input);

    try {
      logger.info({ model: config.OPENROUTER_MODEL }, "OpenRouter generating text");

      const completion = await this.client.chat.completions.create({
        model: input.model || config.OPENROUTER_MODEL,
        messages: [{ role: "user", content: input.prompt }],
        max_tokens: input.maxTokens,
        temperature: input.temperature ?? 0.7,
      });

      const choice = completion.choices[0];
      return {
        text: choice.message.content ?? "",
        usage: {
          promptTokens: completion.usage?.prompt_tokens ?? 0,
          completionTokens: completion.usage?.completion_tokens ?? 0,
          totalTokens: completion.usage?.total_tokens ?? 0,
        },
      };
    } catch (error: any) {
      logger.error({ err: error }, "OpenRouter generateText failed");
      return this.fallback.generateText(input);
    }
  }

  async *streamText(input: TextGenerationInput): AsyncIterable<TextGenerationOutput> {
    if (!this.client) {
      yield* this.fallback.streamText(input);
      return;
    }

    try {
      const stream = await this.client.chat.completions.create({
        model: input.model || config.OPENROUTER_MODEL,
        messages: [{ role: "user", content: input.prompt }],
        max_tokens: input.maxTokens,
        temperature: input.temperature ?? 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          yield { text };
        }
      }
    } catch (error: any) {
      logger.error({ err: error }, "OpenRouter streamText failed");
      yield* this.fallback.streamText(input);
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.providerName,
      status: this.client ? "ok" : "error",
      message: this.client ? "OpenRouter client ready" : "OPENROUTER_API_KEY not configured",
    };
  }
}