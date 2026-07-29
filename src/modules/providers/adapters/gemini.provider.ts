import { GoogleGenerativeAI } from "@google/generative-ai";
import { IProviderAdapter } from "../interfaces/provider-adapter.interface.js";
import {
  TextGenerationInput,
  TextGenerationOutput,
  ProviderHealth,
} from "../interfaces/provider.types.js";
import { config } from "../../../config/index.js";

export class GeminiProvider implements IProviderAdapter {
  readonly providerName = "gemini";
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    if (!config.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not set – Gemini provider disabled.");
      return;
    }
    this.client = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  }

  async generateText(input: TextGenerationInput): Promise<TextGenerationOutput> {
    if (!this.client) throw new Error("Gemini client not configured");

    const model = this.client.getGenerativeModel({
      model: input.model || config.GEMINI_MODEL,
    });

    const result = await model.generateContent(input.prompt);
    const response = result.response;

    return {
      text: response.text(),
      usage: {
        promptTokens: 0, // Gemini does not report token usage directly
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }

  async *streamText(input: TextGenerationInput): AsyncIterable<TextGenerationOutput> {
    if (!this.client) throw new Error("Gemini client not configured");

    const model = this.client.getGenerativeModel({
      model: input.model || config.GEMINI_MODEL,
    });

    const streamingResult = await model.generateContentStream(input.prompt);
    for await (const chunk of streamingResult.stream) {
      const text = chunk.text();
      if (text) yield { text };
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.providerName,
      status: this.client ? "ok" : "error",
      message: this.client ? "Gemini client ready" : "GEMINI_API_KEY not configured",
    };
  }
}