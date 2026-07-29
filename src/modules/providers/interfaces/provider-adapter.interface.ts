import {
  TextGenerationInput,
  TextGenerationOutput,
  EmbeddingInput,
  EmbeddingOutput,
  ImageAnalysisInput,
  ImageAnalysisOutput,
  AudioProcessingInput,
  AudioProcessingOutput,
  ProviderHealth,
} from "./provider.types.js";

export interface IProviderAdapter {
  readonly providerName: string;

  generateText(input: TextGenerationInput): Promise<TextGenerationOutput>;
  streamText?(input: TextGenerationInput): AsyncIterable<TextGenerationOutput>;
  createEmbedding?(input: EmbeddingInput): Promise<EmbeddingOutput>;
  analyzeImage?(input: ImageAnalysisInput): Promise<ImageAnalysisOutput>;
  processAudio?(input: AudioProcessingInput): Promise<AudioProcessingOutput>;
  healthCheck(): Promise<ProviderHealth>;
}