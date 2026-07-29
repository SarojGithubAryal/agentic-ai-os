import { providerRegistry } from "../../providers/index.js";
import { storeMemory, searchMemories } from "../../memory/service/memory.service.js";

export const generateChatResponse = async (
  message: string,
  userId?: string,
  providerName?: string,
  model?: string,
  maxTokens?: number,
  temperature?: number
) => {
  // Retrieve relevant past memories
  const pastMemories = await searchMemories({
    query: message,
    userId,
    limit: 5,
  });

  const memoryContext = pastMemories
    .map((m) => `[Memory] ${m.content}`)
    .join("\n");

  const fullPrompt = memoryContext
    ? `${memoryContext}\n\n[User] ${message}`
    : message;

  // Select provider: use explicit request, else first non-noop, else noop
  const availableProviders = providerRegistry.list();
  const selected = providerName
    ?? availableProviders.find((p) => p !== "noop")
    ?? "noop";

  const provider = providerRegistry.get(selected);
  if (!provider) {
    throw new Error(`Provider "${selected}" not found`);
  }

  const result = await provider.generateText({
    prompt: fullPrompt,
    model,
    maxTokens,
    temperature,
  });

  // Save user message as memory
  await storeMemory({
    content: message,
    namespace: "chat",
    userId,
    metadata: { role: "user" },
  });

  // Save AI response as memory
  await storeMemory({
    content: result.text,
    namespace: "chat",
    userId,
    metadata: { role: "assistant" },
  });

  return result;
};