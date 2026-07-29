import OpenAI from "openai";
import { IProviderAdapter } from "../interfaces/provider-adapter.interface.js";
import {
  TextGenerationInput,
  TextGenerationOutput,
  ProviderHealth,
} from "../interfaces/provider.types.js";
import { config } from "../../../config/index.js";

export class OpenAIProvider implements IProviderAdapter {
  readonly providerName = "openai";
  private client: OpenAI | null = null;

  constructor() {
    if (!config.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not set – OpenAI provider disabled.");
      return;
    }
    this.client = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }

  async generateText(input: TextGenerationInput): Promise<TextGenerationOutput> {
    if (!this.client) throw new Error("OpenAI client not configured");

    const completion = await this.client.chat.completions.create({
      model: input.model || config.OPENAI_MODEL,
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
  }

  async *streamText(input: TextGenerationInput): AsyncIterable<TextGenerationOutput> {
    if (!this.client) throw new Error("OpenAI client not configured");

    const stream = await this.client.chat.completions.create({
      model: input.model || config.OPENAI_MODEL,
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
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.providerName,
      status: this.client ? "ok" : "error",
      message: this.client ? "OpenAI client ready" : "OpenAI API key not configured",
    };
  }
}