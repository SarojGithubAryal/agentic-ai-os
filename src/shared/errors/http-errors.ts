import { AppError } from "./app-error.js";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, "AUTH_ERROR", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, "PERMISSION_ERROR", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, "INTERNAL_ERROR", 500);
  }
}