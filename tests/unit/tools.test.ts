import { describe, it, expect, vi, beforeEach } from "vitest";
import { CalculatorTool } from "../../src/modules/tools/adapters/calculator.tool.js";
import { DateTimeTool } from "../../src/modules/tools/adapters/datetime.tool.js";

describe("CalculatorTool", () => {
  const calc = new CalculatorTool();

  it("should evaluate a simple expression", async () => {
    const result = await calc.execute({ expression: "2 + 3" });
    expect(result.result).toBe(5);
  });

  it("should evaluate a complex expression", async () => {
    const result = await calc.execute({ expression: "10 * (2 + 3)" });
    expect(result.result).toBe(50);
  });

  it("should throw on invalid characters", async () => {
    await expect(calc.execute({ expression: "alert('xss')" })).rejects.toThrow("invalid characters");
  });

  it("should throw when expression is missing", async () => {
    await expect(calc.execute({})).rejects.toThrow("Missing");
  });
});

describe("DateTimeTool", () => {
  const dt = new DateTimeTool();

  it("should return ISO format by default", async () => {
    const result = await dt.execute({});
    expect(result.result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("should return unix timestamp", async () => {
    const result = await dt.execute({ format: "unix" });
    expect(typeof result.result).toBe("number");
  });

  it("should return readable format", async () => {
    const result = await dt.execute({ format: "readable" });
    expect(typeof result.result).toBe("string");
  });
});