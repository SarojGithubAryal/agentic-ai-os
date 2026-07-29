import { ITool } from "../interfaces/tool.interface.js";
import { ToolInput, ToolOutput, ToolDefinition } from "../interfaces/tool.types.js";

export class CalculatorTool implements ITool {
  readonly definition: ToolDefinition = {
    name: "calculator",
    description: "Performs basic arithmetic operations",
    parameters: [
      {
        name: "expression",
        type: "string",
        description: "A mathematical expression to evaluate (e.g. '2 + 3 * 4')",
        required: true,
      },
    ],
  };

  async execute(input: ToolInput): Promise<ToolOutput> {
    const expression = input.expression as string;
    if (!expression) throw new Error("Missing 'expression' parameter");

    // Safe evaluation: only allow numbers, operators, parentheses, and spaces
    const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
    if (sanitized !== expression) {
      throw new Error("Expression contains invalid characters");
    }

    const result = Function(`"use strict"; return (${sanitized})`)();
    return {
      result,
      metadata: { operation: "arithmetic", expression },
    };
  }
}