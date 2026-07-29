import { describe, it, expect, beforeEach } from "vitest";
import { toolRegistry } from "../../src/modules/tools/registry/tool-registry.js";
import { CalculatorTool } from "../../src/modules/tools/adapters/calculator.tool.js";
import { DateTimeTool } from "../../src/modules/tools/adapters/datetime.tool.js";

describe("ToolRegistry", () => {
  beforeEach(() => {
    toolRegistry.clear();
  });

  it("should register a tool", () => {
    const calc = new CalculatorTool();
    toolRegistry.register(calc);
    expect(toolRegistry.list()).toContain("calculator");
  });

  it("should throw when registering duplicate tool", () => {
    const calc = new CalculatorTool();
    toolRegistry.register(calc);
    expect(() => toolRegistry.register(calc)).toThrow("already registered");
  });

  it("should retrieve a registered tool", () => {
    const calc = new CalculatorTool();
    toolRegistry.register(calc);
    const retrieved = toolRegistry.get("calculator");
    expect(retrieved).toBe(calc);
  });

  it("should return undefined for non-existent tool", () => {
    expect(toolRegistry.get("nonexistent")).toBeUndefined();
  });

  it("should list all tool definitions", () => {
    toolRegistry.register(new CalculatorTool());
    toolRegistry.register(new DateTimeTool());
    const definitions = toolRegistry.getDefinitions();
    expect(definitions).toHaveLength(2);
    expect(definitions[0].name).toBe("calculator");
    expect(definitions[1].name).toBe("datetime");
  });
});