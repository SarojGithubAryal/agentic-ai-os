export interface TextGenerationInput {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface TextGenerationOutput {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface EmbeddingInput {
  input: string | string[];
  model?: string;
}

export interface EmbeddingOutput {
  embeddings: number[][];
}

export interface ImageAnalysisInput {
  imageUrl: string;
  prompt?: string;
}

export interface ImageAnalysisOutput {
  description: string;
}

export interface AudioProcessingInput {
  audioUrl: string;
  language?: string;
}

export interface AudioProcessingOutput {
  transcript: string;
}

export interface ProviderHealth {
  provider: string;
  status: "ok" | "error";
  message?: string;
}