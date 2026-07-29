import { describe, it, expect, beforeEach } from "vitest";
import { providerRegistry } from "../../src/modules/providers/registry/provider-registry.js";
import { NoopProvider } from "../../src/modules/providers/adapters/noop.provider.js";

describe("ProviderRegistry", () => {
  beforeEach(() => {
    providerRegistry.clear();
  });

  it("should register a provider", () => {
    const noop = new NoopProvider();
    providerRegistry.register(noop);
    expect(providerRegistry.list()).toContain("noop");
  });

  it("should retrieve a registered provider", () => {
    const noop = new NoopProvider();
    providerRegistry.register(noop);
    const retrieved = providerRegistry.get("noop");
    expect(retrieved).toBe(noop);
  });

  it("should throw when registering duplicate provider", () => {
    const noop = new NoopProvider();
    providerRegistry.register(noop);
    expect(() => providerRegistry.register(noop)).toThrow(
      'Provider "noop" is already registered.'
    );
  });

  it("should return undefined for non-existent provider", () => {
    expect(providerRegistry.get("openai")).toBeUndefined();
  });

  it("should list all registered provider names", () => {
    providerRegistry.register(new NoopProvider());
    expect(providerRegistry.list()).toEqual(["noop"]);
  });
});