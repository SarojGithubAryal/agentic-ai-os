import { describe, it, expect, vi, beforeEach } from "vitest";
import { AgentStep } from "../../src/modules/agents/interfaces/agent.types.js";

// Mock tool registry
vi.mock("../../src/modules/tools/registry/tool-registry.js", () => ({
  toolRegistry: {
    get: vi.fn(),
    list: vi.fn(),
    register: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock workflow registry
vi.mock("../../src/modules/workflows/registry/workflow-registry.js", () => ({
  workflowRegistry: {
    get: vi.fn(),
    list: vi.fn().mockReturnValue(["datetime-and-calc"]),
    register: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock workflow runner
vi.mock("../../src/modules/workflows/service/workflow.service.js", () => ({
  runWorkflow: vi.fn(),
}));

// Mock memory service
vi.mock("../../src/modules/memory/service/memory.service.js", () => ({
  storeMemory: vi.fn().mockResolvedValue(undefined),
  searchMemories: vi.fn().mockResolvedValue([]),
}));

import { SimpleAssistant } from "../../src/modules/agents/adapters/simple-assistant.agent.js";
import { toolRegistry } from "../../src/modules/tools/registry/tool-registry.js";

describe("SimpleAssistant", () => {
  let agent: SimpleAssistant;

  beforeEach(() => {
    vi.clearAllMocks();
    agent = new SimpleAssistant();
  });

  it("should plan a datetime step when goal mentions time", async () => {
    const steps = await (agent as any).plan({ goal: "tell me the time" });
    expect(steps).toHaveLength(1);
    expect(steps[0].action.name).toBe("datetime");
  });

  it("should plan a calculator step when goal mentions calc", async () => {
    const steps = await (agent as any).plan({ goal: "do a calculation" });
    expect(steps).toHaveLength(1);
    expect(steps[0].action.name).toBe("calculator");
  });

  it("should plan both datetime and calculator when goal contains both", async () => {
    const steps = await (agent as any).plan({ goal: "time and calc" });
    expect(steps).toHaveLength(2);
    expect(steps[0].action.name).toBe("datetime");
    expect(steps[1].action.name).toBe("calculator");
  });

  it("should plan a workflow step when goal mentions a known workflow", async () => {
    const steps = await (agent as any).plan({ goal: "run the datetime-and-calc workflow" });
    // Expect at least 1 step, and one of them must be a workflow step.
    expect(steps.length).toBeGreaterThanOrEqual(1);
    const workflowStep = steps.find((s: AgentStep) => s.action.type === "workflow");
    expect(workflowStep).toBeDefined();
    expect(workflowStep!.action.name).toBe("datetime-and-calc");
  });

  it("should synthesize a final answer summarizing steps", async () => {
    const steps: AgentStep[] = [
      {
        thought: "Get time",
        action: { type: "tool", name: "datetime", input: {} },
        result: 123456,
      },
    ];
    const answer = await (agent as any).synthesize({ goal: "test" }, steps);
    expect(answer).toContain("test");
    expect(answer).toContain("123456");
  });

  it("should run successfully with mocked tools", async () => {
    vi.mocked(toolRegistry.get).mockReturnValue({
      execute: async () => ({ result: "mocked result" }),
    } as any);

    const result = await agent.run({ goal: "tell me the time" });
    expect(result.status).toBe("success");
    expect(result.finalAnswer).toContain("mocked result");
  });
});