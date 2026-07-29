import { IAgent } from "./interfaces/agent.interface.js";
import { AgentGoal, AgentStep, AgentResult } from "./interfaces/agent.types.js";
import { storeMemory } from "../../modules/memory/service/memory.service.js";
import { toolRegistry } from "../../modules/tools/registry/tool-registry.js";
import { runWorkflow } from "../../modules/workflows/service/workflow.service.js";

// Simple placeholder resolver (e.g., {{previous.result}})
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

export abstract class BaseAgent implements IAgent {
  abstract readonly name: string;

  async run(goal: AgentGoal): Promise<AgentResult> {
    const steps: AgentStep[] = [];
    const startTime = new Date().toISOString();

    await storeMemory({
      content: `Agent "${this.name}" started with goal: ${goal.goal}`,
      namespace: "agents",
      metadata: { agent: this.name, goal },
    });

    try {
      const plan = await this.plan(goal);

      const context: Record<string, unknown> = { goal: goal.goal, input: goal.context ?? {} };

      for (let i = 0; i < plan.length; i++) {
        const plannedStep = plan[i];
        const result = await this.executeStep(plannedStep, context);
        steps.push({ ...plannedStep, result });

        // Update context so next steps can reference previous result
        context.previous = { result };

        await storeMemory({
          content: `Step "${plannedStep.thought}" completed`,
          namespace: "agents",
          metadata: { agent: this.name, step: plannedStep, result },
        });
      }

      const finalAnswer = await this.synthesize(goal, steps);
      const result: AgentResult = {
        status: "success",
        finalAnswer,
        steps,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
      };

      await storeMemory({
        content: `Agent "${this.name}" completed`,
        namespace: "agents",
        metadata: { agent: this.name, result },
      });

      return result;
    } catch (error: any) {
      await storeMemory({
        content: `Agent "${this.name}" failed: ${error.message}`,
        namespace: "agents",
        metadata: { agent: this.name, error: error.message },
      });
      return {
        status: "failed",
        finalAnswer: error.message,
        steps,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
      };
    }
  }

  private async executeStep(step: AgentStep, context: Record<string, unknown>): Promise<unknown> {
    const action = step.action;

    // Resolve any placeholders in the action input
    const resolvedInput: Record<string, unknown> = {};
    if (action.input) {
      for (const [key, value] of Object.entries(action.input)) {
        if (typeof value === "string") {
          resolvedInput[key] = replacePlaceholders(value, context);
        } else {
          resolvedInput[key] = value;
        }
      }
    }

    if (action.type === "tool") {
      const tool = toolRegistry.get(action.name);
      if (!tool) throw new Error(`Tool "${action.name}" not found`);
      const output = await tool.execute(resolvedInput);
      return output.result;
    } else if (action.type === "workflow") {
      const workflowResult = await runWorkflow(action.name, resolvedInput);
      return workflowResult;
    } else if (action.type === "provider") {
      // Future: call a provider
      throw new Error("Provider action not yet supported");
    } else {
      throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  protected abstract plan(goal: AgentGoal): Promise<AgentStep[]>;
  protected abstract synthesize(goal: AgentGoal, steps: AgentStep[]): Promise<string>;
}