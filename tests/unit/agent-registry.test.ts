import { describe, it, expect, beforeEach } from "vitest";
import { agentRegistry } from "../../src/modules/agents/registry/agent-registry.js";
import { SimpleAssistant } from "../../src/modules/agents/adapters/simple-assistant.agent.js";

describe("AgentRegistry", () => {
  beforeEach(() => {
    agentRegistry.clear();
  });

  it("should register an agent", () => {
    const agent = new SimpleAssistant();
    agentRegistry.register(agent);
    expect(agentRegistry.list()).toContain("simple-assistant");
  });

  it("should throw on duplicate registration", () => {
    const agent = new SimpleAssistant();
    agentRegistry.register(agent);
    expect(() => agentRegistry.register(agent)).toThrow("already registered");
  });

  it("should retrieve a registered agent", () => {
    const agent = new SimpleAssistant();
    agentRegistry.register(agent);
    expect(agentRegistry.get("simple-assistant")).toBe(agent);
  });

  it("should return undefined for unknown agent", () => {
    expect(agentRegistry.get("unknown")).toBeUndefined();
  });
});