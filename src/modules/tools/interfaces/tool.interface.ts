import { ToolInput, ToolOutput, ToolDefinition } from "./tool.types.js";

export interface ITool {
  readonly definition: ToolDefinition;
  execute(input: ToolInput): Promise<ToolOutput>;
}