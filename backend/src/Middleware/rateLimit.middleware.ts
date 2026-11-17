import { RedisStore } from "rate-limit-redis";
import redis, { connectRedis } from "../config/redis.js";
import * as rateLimitModule from "express-rate-limit";

const rateLimit =
  (rateLimitModule as unknown as { default?: typeof rateLimitModule.rateLimit }).default ??
  rateLimitModule.rateLimit;

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    forwardedHeader: false,
  },
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      if (!redis.isOpen) {
        await connectRedis();
      }
      return redis.sendCommand(args);
    },
  }),
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});