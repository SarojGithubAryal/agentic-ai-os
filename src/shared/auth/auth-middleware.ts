import { FastifyInstance, FastifyRequest } from "fastify";
import { verifyAccessToken } from "./jwt.js";
import { validateApiKey } from "../../modules/applications/service/applications.service.js";
import { UnauthorizedError } from "../errors/index.js";
import type { TokenPayload } from "./jwt.js";

const userSymbol = Symbol("user");

export const authPlugin = async (app: FastifyInstance) => {
  app.decorateRequest("user", {
    getter(this: FastifyRequest) {
      return (this as any)[userSymbol] as TokenPayload | undefined;
    },
    setter(this: FastifyRequest, value: TokenPayload | undefined) {
      (this as any)[userSymbol] = value;
    },
  });
};

export const requireAuth = async (req: FastifyRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid token");
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const requireApiKey = async (req: FastifyRequest) => {
  const apiKey = req.headers["x-api-key"] as string | undefined;
  if (!apiKey) {
    throw new UnauthorizedError("Missing API key");
  }

  try {
    const app = await validateApiKey(apiKey);
    // Attach application identity in the same user object so both work uniformly
    req.user = {
      sub: app.id,
      type: "access",
      appName: app.name,
      userId: app.userId,
    };
  } catch {
    throw new UnauthorizedError("Invalid API key");
  }
};