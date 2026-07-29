import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import Fastify, { FastifyInstance } from "fastify";
import { registerHealthModule } from "../../src/modules/health/index.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify({ logger: false });
  await registerHealthModule(app);
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /api/v1/health", () => {
  it("returns 200 with status ok", async () => {
    const response = await supertest(app.server)
      .get("/api/v1/health")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.uptime).toBeTypeOf("number");
    expect(response.body.data.timestamp).toBeDefined();
  });
});