import { describe, it, expect, vi, beforeEach } from "vitest";
import { randomBytes } from "node:crypto";

vi.mock("../../src/modules/applications/applications.repository.js", () => ({
  createApplication: vi.fn(),
  findApplicationByApiKey: vi.fn(),
  findApplicationsByUserId: vi.fn(),
  findApplicationById: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplicationById: vi.fn(),
}));

import {
  registerApplication,
  validateApiKey,
  listUserApplications,
  getApplicationById,
  updateApplicationName,
  deleteApplication,
} from "../../src/modules/applications/service/applications.service.js";
import {
  createApplication,
  findApplicationByApiKey,
  findApplicationsByUserId,
  findApplicationById,
  updateApplication,
  deleteApplicationById,
} from "../../src/modules/applications/applications.repository.js";

describe("Applications Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerApplication", () => {
    it("should create an application and return raw key", async () => {
      const mockApp = { id: "app-id", name: "MyApp", apiKey: "hashed-key" };
      // Cast the mock to any to avoid strict return-type checking
      (createApplication as any).mockResolvedValue(mockApp);

      const result = await registerApplication("MyApp", "user-id");
      expect(result.id).toBe("app-id");
      expect(result.apiKey).toBeDefined();
      expect(result.apiKey.length).toBe(64);
    });
  });

  describe("validateApiKey", () => {
    it("should return application for valid key", async () => {
      const rawKey = randomBytes(32).toString("hex");
      const { createHash } = await import("node:crypto");
      const hash = createHash("sha256").update(rawKey).digest("hex");
      const mockApp = { id: "app-id", name: "TestApp", apiKey: hash };
      (findApplicationByApiKey as any).mockResolvedValue(mockApp);

      const result = await validateApiKey(rawKey);
      expect(result.id).toBe("app-id");
    });

    it("should throw for invalid key", async () => {
      (findApplicationByApiKey as any).mockResolvedValue(null);
      await expect(validateApiKey("bad-key")).rejects.toThrow("Invalid API key");
    });
  });

  describe("listUserApplications", () => {
    it("should return list of applications", async () => {
      const mockApps = [{ id: "1", name: "App1" }, { id: "2", name: "App2" }];
      (findApplicationsByUserId as any).mockResolvedValue(mockApps);

      const apps = await listUserApplications("user-id", 20, 0);
      expect(apps).toHaveLength(2);
    });
  });

  describe("getApplicationById", () => {
    it("should return application without apiKey if owned", async () => {
      const mockApp = { id: "1", name: "App", userId: "user-id", apiKey: "secret" };
      (findApplicationById as any).mockResolvedValue(mockApp);
      const app = await getApplicationById("1", "user-id");
      expect(app).not.toHaveProperty("apiKey");
    });

    it("should throw NotFound if not found", async () => {
      (findApplicationById as any).mockResolvedValue(null);
      await expect(getApplicationById("1", "user-id")).rejects.toThrow("not found");
    });

    it("should throw NotFound if owned by another user", async () => {
      (findApplicationById as any).mockResolvedValue({ userId: "other" });
      await expect(getApplicationById("1", "user-id")).rejects.toThrow("not found");
    });
  });

  describe("updateApplicationName", () => {
    it("should update if owner", async () => {
      (findApplicationById as any).mockResolvedValue({ id: "1", userId: "user-id" });
      (updateApplication as any).mockResolvedValue({ id: "1", name: "New" });
      const result = await updateApplicationName("1", "user-id", "New");
      expect(result.name).toBe("New");
    });
  });

  describe("deleteApplication", () => {
    it("should delete if owner", async () => {
      (findApplicationById as any).mockResolvedValue({ id: "1", userId: "user-id" });
      (deleteApplicationById as any).mockResolvedValue(undefined);
      await expect(deleteApplication("1", "user-id")).resolves.toBeUndefined();
    });
  });
});