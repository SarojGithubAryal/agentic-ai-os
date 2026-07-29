import { BaseAgent } from "../base-agent.js";
import { AgentGoal, AgentStep } from "../interfaces/agent.types.js";
import { toolRegistry } from "../../tools/registry/tool-registry.js";
import { workflowRegistry } from "../../workflows/registry/workflow-registry.js";
import { runWorkflow } from "../../workflows/service/workflow.service.js";

export class SimpleAssistant extends BaseAgent {
  readonly name = "simple-assistant";

  protected async plan(goal: AgentGoal): Promise<AgentStep[]> {
    const steps: AgentStep[] = [];
    const goalLower = goal.goal.toLowerCase();

    // Check if goal mentions datetime
    if (goalLower.includes("time") || goalLower.includes("date") || goalLower.includes("now")) {
      steps.push({
        thought: "I need to get the current time.",
        action: { type: "tool", name: "datetime", input: { format: "unix" } },
      });
    }

    // Check if goal mentions calculation
    if (goalLower.includes("calc") || goalLower.includes("math") || goalLower.includes("compute")) {
      // Use the result of previous step if exists, else a default expression
      const previousResult = steps.length > 0 ? "{{previous.result}}" : "100";
      steps.push({
        thought: "I will perform a calculation.",
        action: {
          type: "tool",
          name: "calculator",
          input: { expression: `2 * ${previousResult}` },
        },
      });
    }

    // If goal mentions a workflow by name, run it
    const workflows = workflowRegistry.list();
    for (const wfName of workflows) {
      if (goalLower.includes(wfName)) {
        steps.push({
          thought: `I will run the "${wfName}" workflow.`,
          action: { type: "workflow", name: wfName },
        });
        break; // only one workflow per simple plan
      }
    }

    // Fallback: always add a datetime step if no steps were chosen
    if (steps.length === 0) {
      steps.push({
        thought: "I'll provide the current time as a default action.",
        action: { type: "tool", name: "datetime", input: { format: "readable" } },
      });
    }

    return steps;
  }

  protected async synthesize(goal: AgentGoal, steps: AgentStep[]): Promise<string> {
    const stepDescriptions = steps.map((s) => {
      if (s.result !== undefined) return `- ${s.thought}: ${JSON.stringify(s.result)}`;
      return `- ${s.thought}`;
    });

    return `Goal: ${goal.goal}\n\nI performed the following steps:\n${stepDescriptions.join("\n")}\n\nAll steps completed.`;
  }
}