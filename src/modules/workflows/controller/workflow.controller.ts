import { FastifyRequest, FastifyReply } from "fastify";
import { runWorkflowSchema } from "../schema/workflow.schema.js";
import { runWorkflow, getWorkflowRun } from "../service/workflow.service.js";
import { BadRequestError, NotFoundError } from "../../../shared/errors/index.js";

export const runWorkflowController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name } = req.params as { name: string };
  const body = runWorkflowSchema.parse(req.body);

  try {
    const result = await runWorkflow(name, body.input);
    return reply.status(201).send({ success: true, data: result });
  } catch (err: any) {
    throw new BadRequestError(err.message);
  }
};

export const getWorkflowRunController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const run = await getWorkflowRun(id);
  if (!run) {
    throw new NotFoundError("Workflow run not found");
  }
  return reply.send({ success: true, data: run });
};