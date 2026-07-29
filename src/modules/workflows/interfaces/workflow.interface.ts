import { WorkflowDefinition, WorkflowStep } from "./workflow.types.js";

export interface IWorkflow {
  readonly definition: WorkflowDefinition;
  // Optional: validate step configs
  validateStep?(step: WorkflowStep): boolean;
}