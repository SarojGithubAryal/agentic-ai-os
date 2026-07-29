import { z } from "zod";

export const runWorkflowSchema = z.object({
  input: z.record(z.unknown()).optional(),
});