import pino from "pino";
import { config } from "../../config/index.js";

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: config.isDev
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
  redact: ["req.headers.authorization", "req.headers.cookie"],
});