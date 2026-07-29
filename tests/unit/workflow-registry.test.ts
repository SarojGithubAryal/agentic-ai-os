import { describe, it, expect, beforeEach } from "vitest";
import { workflowRegistry } from "../../src/modules/workflows/registry/workflow-registry.js";
import { DemoWorkflow } from "../../src/modules/workflows/adapters/demo-workflow.js";

describe("WorkflowRegistry", () => {
  beforeEach(() => {
    workflowRegistry.clear();
  });

  it("should register a workflow", () => {
    const demo = new DemoWorkflow();
    workflowRegistry.register(demo);
    expect(workflowRegistry.list()).toContain("datetime-and-calc");
  });

  it("should throw on duplicate registration", () => {
    const demo = new DemoWorkflow();
    workflowRegistry.register(demo);
    expect(() => workflowRegistry.register(demo)).toThrow("already registered");
  });

  it("should retrieve a registered workflow", () => {
    const demo = new DemoWorkflow();
    workflowRegistry.register(demo);
    expect(workflowRegistry.get("datetime-and-calc")).toBe(demo);
  });

  it("should return undefined for unknown workflow", () => {
    expect(workflowRegistry.get("nonexistent")).toBeUndefined();
  });

  it("should list definitions", () => {
    workflowRegistry.register(new DemoWorkflow());
    const defs = workflowRegistry.getDefinitions();
    expect(defs).toHaveLength(1);
    expect(defs[0].name).toBe("datetime-and-calc");
  });
});