import "dotenv/config";
import express from "express";
import cors from "cors";
import * as helmetModule from "helmet";
import cookieParser from "cookie-parser";
import { pool } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import authRouter from "./Routes/authRoute.js";
import googleAuthRouter from "./Routes/googleAuthRoute.js";
import { redirectShortUrl } from "./Controllers/urlController.js";
import qrRouter from "./Routes/qrRoutes.js";
import urlRouter from "./Routes/urlRoute.js";

const app = express();

const helmet =
  (helmetModule as unknown as { default?: (...args: any[]) => any }).default ||
  (helmetModule as unknown as (...args: any[]) => any);

const allowedOrigin = (
   "http://localhost:5173"
).replace(/\/$/, "");

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.set("trust proxy", 1)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

let redisConnection: Promise<void> | null = null;

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    if (!redisConnection) {
      redisConnection = connectRedis().catch((error) => {
        redisConnection = null;
        throw error;
      });
    }

    await redisConnection;
    next();
  } catch (error) {
    console.error("Redis connection failed:", error);
    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable",
    });
  }
});

app.use("/api/qr", qrRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", googleAuthRouter);
app.use("/api/urls", urlRouter);

app.get("/", (req, res) => {
  res.send("server live");
});

app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT current_database(), current_user, current_schema()
    `);
    res.json({
      success: true,
      db: result.rows[0],
    });
  } catch (error: any) {
    console.error("DB test error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/:shortCode", redirectShortUrl);

export default app;
