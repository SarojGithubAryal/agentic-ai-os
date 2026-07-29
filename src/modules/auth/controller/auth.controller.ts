import { FastifyRequest, FastifyReply } from "fastify";
import { registerSchema, loginSchema, refreshSchema } from "../schema/auth.schema.js";
import { registerUser, loginUser, refreshTokens } from "../service/auth.service.js";
import { BadRequestError, UnauthorizedError } from "../../../shared/errors/index.js";

export const registerController = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = registerSchema.parse(req.body);
  try {
    const result = await registerUser(body.email, body.password, body.name);
    return reply.status(201).send({ success: true, data: result });
  } catch (err: any) {
    if (err.message === "User already exists") {
      throw new BadRequestError("Email already registered");
    }
    throw err;
  }
};

export const loginController = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = loginSchema.parse(req.body);
  try {
    const result = await loginUser(body.email, body.password);
    return reply.send({ success: true, data: result });
  } catch (err: any) {
    if (err.message === "Invalid email or password") {
      throw new UnauthorizedError("Invalid credentials");
    }
    throw err;
  }
};

export const refreshController = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = refreshSchema.parse(req.body);
  try {
    const result = await refreshTokens(body.refreshToken);
    return reply.send({ success: true, data: result });
  } catch (err) {
    throw new UnauthorizedError("Invalid refresh token");
  }
};

export const meController = async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    success: true,
    data: req.user,
  });
};