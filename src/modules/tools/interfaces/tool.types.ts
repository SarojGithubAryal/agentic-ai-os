export interface ToolInput {
  [key: string]: unknown;
}

export interface ToolOutput {
  result: unknown;
  metadata?: Record<string, unknown>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: "string" | "number" | "boolean" | "object" | "array";
    description: string;
    required: boolean;
  }[];
}