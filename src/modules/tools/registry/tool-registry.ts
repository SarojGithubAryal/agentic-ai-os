import { ITool } from "../interfaces/tool.interface.js";

class ToolRegistry {
  private tools: Map<string, ITool> = new Map();

  register(tool: ITool): void {
    if (this.tools.has(tool.definition.name)) {
      throw new Error(`Tool "${tool.definition.name}" is already registered.`);
    }
    this.tools.set(tool.definition.name, tool);
  }

  get(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  list(): string[] {
    return Array.from(this.tools.keys());
  }

  getDefinitions(): { name: string; description: string }[] {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.definition.name,
      description: tool.definition.description,
    }));
  }

  clear(): void {
    this.tools.clear();
  }
}

export const toolRegistry = new ToolRegistry();