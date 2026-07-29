import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config/index.js";

export interface TokenPayload {
  sub: string; // user id or application id
  type: "access" | "refresh";
  [key: string]: any;
}

export const generateAccessToken = (payload: Omit<TokenPayload, "type">): string => {
  return jwt.sign({ ...payload, type: "access" }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: Omit<TokenPayload, "type">): string => {
  return jwt.sign({ ...payload, type: "refresh" }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
};