import { describe, it, expect } from "vitest";
import { NoopProvider } from "../../src/modules/providers/adapters/noop.provider.js";

describe("NoopProvider", () => {
  const provider = new NoopProvider();

  it("should return provider name 'noop'", () => {
    expect(provider.providerName).toBe("noop");
  });

  it("should generate mock text", async () => {
    const result = await provider.generateText({ prompt: "Hello" });
    expect(result.text).toContain("[Noop]");
    expect(result.usage?.totalTokens).toBe(0);
  });

  it("should stream mock text", async () => {
    const stream = provider.streamText!({ prompt: "Stream test" });
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk.text);
    }
    expect(chunks[0]).toContain("[Noop stream]");
  });

  it("should report healthy", async () => {
    const health = await provider.healthCheck();
    expect(health.status).toBe("ok");
  });
});