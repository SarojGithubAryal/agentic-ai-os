import { IWorkflow } from "../interfaces/workflow.interface.js";
import { WorkflowDefinition, WorkflowStep } from "../interfaces/workflow.types.js";

export class DemoWorkflow implements IWorkflow {
  readonly definition: WorkflowDefinition = {
    name: "datetime-and-calc",
    description: "Get current Unix timestamp, then double it",
    steps: [
      {
        id: "step-1",
        type: "tool",
        name: "Get current time as Unix",
        config: {
          toolName: "datetime",
          input: { format: "unix" },
        },
        onFailure: "stop",
      },
      {
        id: "step-2",
        type: "tool",
        name: "Double the timestamp",
        config: {
          toolName: "calculator",
          input: { expression: "2 * {{previous.result}}" },
        },
        onFailure: "stop",
      },
    ],
  };

  validateStep(step: WorkflowStep): boolean {
    return step.type === "tool" && !!step.config.toolName;
  }
}