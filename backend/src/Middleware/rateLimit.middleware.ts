import { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../config/redis.js";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: false,
});

export async function loginRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const identifier = req.ip || "anonymous";
    const { success, limit, remaining, reset } = await ratelimit.limit(
      `login:${identifier}`
    );

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again later.",
      });
    }

    return next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    return next();
  }
}