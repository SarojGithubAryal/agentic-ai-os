import { randomBytes, createHash } from "node:crypto";
import {
  createApplication,
  findApplicationByApiKey,
  findApplicationsByUserId,
  findApplicationById,
  updateApplication,
  deleteApplicationById,
} from "../applications.repository.js";
import { NotFoundError } from "../../../shared/errors/index.js";

const hashApiKey = (key: string): string => {
  return createHash("sha256").update(key).digest("hex");
};

export const registerApplication = async (name: string, userId: string) => {
  const rawKey = randomBytes(32).toString("hex");
  const apiKeyHash = hashApiKey(rawKey);
  const app = await createApplication({ name, apiKeyHash, userId });
  return { id: app.id, name: app.name, apiKey: rawKey };
};

export const validateApiKey = async (apiKey: string) => {
  const apiKeyHash = hashApiKey(apiKey);
  const app = await findApplicationByApiKey(apiKeyHash);
  if (!app) {
    throw new Error("Invalid API key");
  }
  return app;
};

export const listUserApplications = async (userId: string, limit: number, offset: number) => {
  return findApplicationsByUserId(userId, limit, offset);
};

export const getApplicationById = async (id: string, userId: string) => {
  const app = await findApplicationById(id);
  if (!app || app.userId !== userId) {
    throw new NotFoundError("Application not found");
  }
  // Do not return the API key
  const { apiKey, ...safe } = app;
  return safe;
};

export const updateApplicationName = async (id: string, userId: string, name: string) => {
  const app = await findApplicationById(id);
  if (!app || app.userId !== userId) {
    throw new NotFoundError("Application not found");
  }
  return updateApplication(id, { name });
};

export const deleteApplication = async (id: string, userId: string) => {
  const app = await findApplicationById(id);
  if (!app || app.userId !== userId) {
    throw new NotFoundError("Application not found");
  }
  await deleteApplicationById(id);
};