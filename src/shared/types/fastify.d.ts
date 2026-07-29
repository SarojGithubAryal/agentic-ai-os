import { TokenPayload } from "../auth/jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}