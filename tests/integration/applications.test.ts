import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import Fastify, { FastifyInstance } from "fastify";
import { authPlugin, generateAccessToken } from "../../src/shared/auth/index.js";
import { registerApplicationsModule } from "../../src/modules/applications/index.js";
import { errorHandler } from "../../src/shared/errors/index.js";

let app: FastifyInstance;
let userToken: string;

beforeAll(async () => {
  app = Fastify({ logger: false });
  app.setErrorHandler(errorHandler);
  await app.register(authPlugin);
  await registerApplicationsModule(app);
  await app.ready();

  // Generate a valid token for a test user
  userToken = generateAccessToken({ sub: "11111111-1111-1111-1111-111111111111" });
});

afterAll(async () => {
  await app.close();
});

describe("Applications API", () => {
  it("POST / creates application and returns apiKey", async () => {
    const res = await supertest(app.server)
      .post("/")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Test App" })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.apiKey).toBeDefined();
  });

  it("GET / lists applications", async () => {
    // First create one
    await supertest(app.server)
      .post("/")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Another" });

    const res = await supertest(app.server)
      .get("/")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /:id returns application without apiKey", async () => {
    const createRes = await supertest(app.server)
      .post("/")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Single" });

    const id = createRes.body.data.id;
    const res = await supertest(app.server)
      .get(`/${id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.data.id).toBe(id);
    expect(res.body.data).not.toHaveProperty("apiKey");
  });

  it("GET /:id returns 404 for unknown id", async () => {
    await supertest(app.server)
      .get("/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(404);
  });

  it("PUT /:id updates name", async () => {
    const createRes = await supertest(app.server)
      .post("/")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Old Name" });

    const id = createRes.body.data.id;
    const res = await supertest(app.server)
      .put(`/${id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "New Name" })
      .expect(200);

    expect(res.body.data.name).toBe("New Name");
  });

  it("DELETE /:id deletes application", async () => {
    const createRes = await supertest(app.server)
      .post("/")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "ToDelete" });

    const id = createRes.body.data.id;
    await supertest(app.server)
      .delete(`/${id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(204);
  });

  it("returns 401 without token", async () => {
    await supertest(app.server).get("/").expect(401);
    await supertest(app.server).get("/some-id").expect(401);
    await supertest(app.server).put("/some-id").expect(401);
    await supertest(app.server).delete("/some-id").expect(401);
  });

  it("returns 404 for another user's application", async () => {
    // Create app with our token
    const createRes = await supertest(app.server)
      .post("/")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Owned" });

    const id = createRes.body.data.id;

    // Another user token
    const otherToken = generateAccessToken({ sub: "22222222-2222-2222-2222-222222222222" });
    await supertest(app.server)
      .get(`/${id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(404);
  });
});