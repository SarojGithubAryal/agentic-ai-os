import { toolRegistry } from "../registry/tool-registry.js";
import { storeMemory } from "../../memory/service/memory.service.js";

export const listTools = () => {
  return toolRegistry.getDefinitions();
};

export const executeTool = async (name: string, input: Record<string, unknown>, userId?: string) => {
  const tool = toolRegistry.get(name);
  if (!tool) {
    throw new Error(`Tool "${name}" not found`);
  }

  const output = await tool.execute(input);

  // Save tool execution as a memory
  await storeMemory({
    content: `Tool "${name}" executed with result: ${JSON.stringify(output.result)}`,
    namespace: "tools",
    userId,
    metadata: { toolName: name, input, output },
  });

  return output;
};