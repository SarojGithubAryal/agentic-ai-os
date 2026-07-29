import { describe, it, expect } from "vitest";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../../src/shared/errors/index.js";

describe("AppError", () => {
  it("should create a base error with code and statusCode", () => {
    const err = new AppError("test", "TEST_ERR", 400);
    expect(err.message).toBe("test");
    expect(err.code).toBe("TEST_ERR");
    expect(err.statusCode).toBe(400);
  });
});

describe("HTTP Errors", () => {
  it("BadRequestError should have status 400", () => {
    const err = new BadRequestError();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("NotFoundError should have status 404", () => {
    const err = new NotFoundError("Resource missing");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Resource missing");
  });

  it("InternalServerError should have status 500", () => {
    const err = new InternalServerError();
    expect(err.statusCode).toBe(500);
  });
});