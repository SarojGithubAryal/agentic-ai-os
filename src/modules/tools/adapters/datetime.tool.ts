import { ITool } from "../interfaces/tool.interface.js";
import { ToolInput, ToolOutput, ToolDefinition } from "../interfaces/tool.types.js";

export class DateTimeTool implements ITool {
  readonly definition: ToolDefinition = {
    name: "datetime",
    description: "Returns the current date and time, or formats a given date",
    parameters: [
      {
        name: "format",
        type: "string",
        description: "Optional: 'iso', 'unix', 'readable' (default: 'iso')",
        required: false,
      },
    ],
  };

  async execute(input: ToolInput): Promise<ToolOutput> {
    const format = (input.format as string) || "iso";
    const now = new Date();

    let result: string | number;
    switch (format) {
      case "unix":
        result = Math.floor(now.getTime() / 1000);
        break;
      case "readable":
        result = now.toLocaleString();
        break;
      case "iso":
      default:
        result = now.toISOString();
    }

    return {
      result,
      metadata: { format },
    };
  }
}