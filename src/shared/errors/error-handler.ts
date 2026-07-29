import { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { AppError } from "./app-error.js";
import { logger } from "../logging/index.js";

export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  logger.error({ err: error, requestId: request.id }, "Unexpected error");
  return reply.status(500).send({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
};