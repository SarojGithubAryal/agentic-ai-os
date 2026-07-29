import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../users.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../shared/auth/index.js";

export const registerUser = async (email: string, password: string, name?: string) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email, passwordHash, name });

  const accessToken = generateAccessToken({ sub: user.id });
  const refreshToken = generateRefreshToken({ sub: user.id });

  return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken({ sub: user.id });
  const refreshToken = generateRefreshToken({ sub: user.id });

  return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
};

export const refreshTokens = async (token: string) => {
  const payload = verifyRefreshToken(token);
  const accessToken = generateAccessToken({ sub: payload.sub });
  const refreshToken = generateRefreshToken({ sub: payload.sub });
  return { accessToken, refreshToken };
};