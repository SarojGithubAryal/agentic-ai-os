import { IWorkflow } from "../interfaces/workflow.interface.js";

class WorkflowRegistry {
  private workflows: Map<string, IWorkflow> = new Map();

  register(workflow: IWorkflow): void {
    if (this.workflows.has(workflow.definition.name)) {
      throw new Error(`Workflow "${workflow.definition.name}" is already registered.`);
    }
    this.workflows.set(workflow.definition.name, workflow);
  }

  get(name: string): IWorkflow | undefined {
    return this.workflows.get(name);
  }

  list(): string[] {
    return Array.from(this.workflows.keys());
  }

  getDefinitions(): { name: string; description: string }[] {
    return Array.from(this.workflows.values()).map((w) => ({
      name: w.definition.name,
      description: w.definition.description,
    }));
  }

  clear(): void {
    this.workflows.clear();
  }
}

export const workflowRegistry = new WorkflowRegistry();