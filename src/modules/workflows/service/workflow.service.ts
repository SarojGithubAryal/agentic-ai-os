import { randomUUID } from "node:crypto";
import { workflowRegistry } from "../registry/workflow-registry.js";
import { toolRegistry } from "../../../modules/tools/registry/tool-registry.js";
import { storeMemory, searchMemories } from "../../../modules/memory/service/memory.service.js";
import { WorkflowRun, WorkflowStep } from "../interfaces/workflow.types.js";

const replacePlaceholders = (template: string, context: Record<string, unknown>): string => {
  return template.replace(/\{\{(.+?)\}\}/g, (_, key) => {
    const keys = key.trim().split(".");
    let value: any = context;
    for (const k of keys) {
      value = value?.[k];
    }
    return value !== undefined ? String(value) : "";
  });
};

export const runWorkflow = async (name: string, initialInput?: Record<string, unknown>): Promise<WorkflowRun> => {
  const workflow = workflowRegistry.get(name);
  if (!workflow) {
    throw new Error(`Workflow "${name}" not found`);
  }

  const runId = randomUUID();
  const run: WorkflowRun = {
    id: runId,
    workflowName: name,
    status: "running",
    currentStepIndex: 0,
    results: [],
    startedAt: new Date().toISOString(),
  };

  // Save initial run state as a memory checkpoint
  await storeMemory({
    content: `Workflow "${name}" started`,
    namespace: "workflow-runs",
    metadata: { runId, run },
  });

  const context: Record<string, unknown> = { input: initialInput ?? {} };

  try {
    for (let i = 0; i < workflow.definition.steps.length; i++) {
      const step = workflow.definition.steps[i];
      run.currentStepIndex = i;

      // Resolve placeholders in step config using current context
      const resolvedConfig = JSON.parse(
        JSON.stringify(step.config),
        (key, value) => {
          if (typeof value === "string") {
            return replacePlaceholders(value, context);
          }
          return value;
        }
      );

      let result: unknown;

      if (step.type === "tool") {
        const toolName = resolvedConfig.toolName as string;
        const tool = toolRegistry.get(toolName);
        if (!tool) throw new Error(`Tool "${toolName}" not found`);
        const output = await tool.execute(resolvedConfig.input as Record<string, unknown> ?? {});
        result = output.result;
      } else if (step.type === "provider") {
        // Future: call provider
        throw new Error("Provider steps not yet supported");
      } else {
        throw new Error(`Unsupported step type: ${step.type}`);
      }

      run.results.push({ stepId: step.id, result });

      // Update context with the result so next steps can use it as `previous.result`
      context.previous = { result };

      // Save checkpoint after each step
      await storeMemory({
        content: `Step "${step.name}" completed with result: ${JSON.stringify(result)}`,
        namespace: "workflow-runs",
        metadata: { runId, stepId: step.id, result },
      });
    }

    run.status = "completed";
    run.completedAt = new Date().toISOString();
  } catch (error: any) {
    run.status = "failed";
    run.completedAt = new Date().toISOString();
    await storeMemory({
      content: `Workflow failed at step ${run.currentStepIndex}: ${error.message}`,
      namespace: "workflow-runs",
      metadata: { runId, error: error.message },
    });
    throw error; // rethrow so the API can return the error
  }

  // Save final state
  await storeMemory({
    content: `Workflow "${name}" ${run.status}`,
    namespace: "workflow-runs",
    metadata: { runId, run },
  });

  return run;
};

export const getWorkflowRun = async (runId: string): Promise<WorkflowRun | null> => {
  const memories = await searchMemories({ namespace: "workflow-runs", query: runId, limit: 1 });
  if (memories.length === 0) return null;
  // Extract the run object from the latest checkpoint metadata
  const lastMemory = memories[0];
  return (lastMemory.metadata as any)?.run ?? null;
};