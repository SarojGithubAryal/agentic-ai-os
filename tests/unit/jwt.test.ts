import { describe, it, expect } from "vitest";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../src/shared/auth/jwt.js";

describe("JWT Utilities", () => {
  const payload = { sub: "user-123", role: "admin" };

  it("should generate and verify an access token", () => {
    const token = generateAccessToken(payload);
    expect(token).toBeTypeOf("string");

    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe("user-123");
    expect(decoded.type).toBe("access");
  });

  it("should generate and verify a refresh token", () => {
    const token = generateRefreshToken(payload);
    expect(token).toBeTypeOf("string");

    const decoded = verifyRefreshToken(token);
    expect(decoded.sub).toBe("user-123");
    expect(decoded.type).toBe("refresh");
  });

  it("should throw on invalid access token", () => {
    expect(() => verifyAccessToken("invalid-token")).toThrow();
  });
});