import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the tool registry so execution doesn't need real tools
vi.mock("../../src/modules/tools/registry/tool-registry.js", () => ({
  toolRegistry: {
    get: vi.fn(),
    list: vi.fn(),
    register: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock the memory service
vi.mock("../../src/modules/memory/service/memory.service.js", () => ({
  storeMemory: vi.fn().mockResolvedValue(undefined),
  searchMemories: vi.fn().mockResolvedValue([]),
}));

import { workflowRegistry } from "../../src/modules/workflows/registry/workflow-registry.js";
import { DemoWorkflow } from "../../src/modules/workflows/adapters/demo-workflow.js";
import { runWorkflow } from "../../src/modules/workflows/service/workflow.service.js";
import { toolRegistry } from "../../src/modules/tools/registry/tool-registry.js";
import { storeMemory } from "../../src/modules/memory/service/memory.service.js";

describe("Workflow Execution", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    workflowRegistry.clear();
    workflowRegistry.register(new DemoWorkflow());
  });

  it("should run demo workflow successfully", async () => {
    // Mock tools: step 1 returns Unix timestamp, step 2 doubles it
    vi.mocked(toolRegistry.get)
      .mockReturnValueOnce({
        execute: async (input: any) => ({ result: 1785230000 }),
      } as any)
      .mockReturnValueOnce({
        execute: async (input: any) => {
          // The expression "2 * {{previous.result}}" should resolve to 2 * 1785230000
          expect(input.expression).toBe("2 * 1785230000");
          return { result: 3570460000 };
        },
      } as any);

    const result = await runWorkflow("datetime-and-calc", {});
    expect(result.status).toBe("completed");
    expect(result.results).toHaveLength(2);
    expect(result.results[0].result).toBe(1785230000);
    expect(result.results[1].result).toBe(3570460000);
  });

  it("should throw for unknown workflow", async () => {
    await expect(runWorkflow("nonexistent")).rejects.toThrow("not found");
  });

  it("should save checkpoints to memory", async () => {
    vi.mocked(toolRegistry.get).mockReturnValue({
      execute: async () => ({ result: 123 }),
    } as any);

    await runWorkflow("datetime-and-calc", {});
    // storeMemory should have been called for start, each step, and end
    expect(storeMemory).toHaveBeenCalled();
  });
});