import OpenAI from "openai";
import { config } from "../../../config/index.js";

let client: OpenAI | null = null;

const getClient = () => {
  if (!client && config.OPENROUTER_API_KEY) {
    client = new OpenAI({
      apiKey: config.OPENROUTER_API_KEY,
      baseURL: config.OPENROUTER_BASE_URL,
    });
  }
  return client;
};

// Free embedding model available on OpenRouter
const EMBEDDING_MODEL = "openai/text-embedding-3-small";

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const openai = getClient();
  if (!openai) {
    return new Array(1536).fill(0);
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return new Array(1536).fill(0);
  }
};