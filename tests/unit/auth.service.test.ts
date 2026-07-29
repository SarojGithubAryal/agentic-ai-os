import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

// Import the real JWT helpers for refresh token generation
import { generateRefreshToken } from "../../src/shared/auth/jwt.js";

// Mock the repository module before importing the service
vi.mock("../../src/modules/auth/users.repository.js", () => ({
  findUserByEmail: vi.fn(),
  createUser: vi.fn(),
}));

import { registerUser, loginUser, refreshTokens } from "../../src/modules/auth/service/auth.service.js";
import { findUserByEmail, createUser } from "../../src/modules/auth/users.repository.js";

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should create a new user and return tokens", async () => {
      const mockUser = { id: "user-id", email: "test@test.com", name: "Test" };
      vi.mocked(findUserByEmail).mockResolvedValue(null); // no existing user
      vi.mocked(createUser).mockResolvedValue(mockUser);

      const result = await registerUser("test@test.com", "password123");

      expect(result.user.id).toBe("user-id");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw if user already exists", async () => {
      const mockUser = { id: "existing-id", email: "test@test.com", name: "Test" };
      vi.mocked(findUserByEmail).mockResolvedValue(mockUser);

      await expect(registerUser("test@test.com", "password123")).rejects.toThrow("User already exists");
    });
  });

  describe("loginUser", () => {
    it("should return tokens for valid credentials", async () => {
      const passwordHash = await bcrypt.hash("password123", 10);
      const mockUser = {
        id: "user-id",
        email: "test@test.com",
        passwordHash,
        name: "Test",
      };
      vi.mocked(findUserByEmail).mockResolvedValue(mockUser);

      const result = await loginUser("test@test.com", "password123");
      expect(result.accessToken).toBeDefined();
    });

    it("should throw for invalid password", async () => {
      const passwordHash = await bcrypt.hash("password123", 10);
      vi.mocked(findUserByEmail).mockResolvedValue({
        id: "user-id",
        email: "test@test.com",
        passwordHash,
        name: "Test",
      });

      await expect(loginUser("test@test.com", "wrongpassword")).rejects.toThrow("Invalid email or password");
    });
  });

  describe("refreshTokens", () => {
    it("should issue new tokens from a valid refresh token", async () => {
      const refreshToken = generateRefreshToken({ sub: "user-id" });

      const result = await refreshTokens(refreshToken);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw on invalid refresh token", async () => {
      await expect(refreshTokens("bad-token")).rejects.toThrow();
    });
  });
});