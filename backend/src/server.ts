import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./config/db";
import authRouter from "../src/Routes/authRoute";
import cookieParser from "cookie-parser";
import googleAuthRouter from "./Routes/googleAuthRoute";
import { redirectShortUrl } from "./Controllers/urlController";
import qrRouter from "./Routes/qrRoutes";
import urlRouter from "./Routes/urlRoute";
import helmet from "helmet";
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use("/api/qr", qrRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", googleAuthRouter);
app.use("/api/urls", urlRouter);
app.get("/", (req, res) => {
  res.send("sever live");
});
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query(`SELECT
        current_database(),
        current_user,
        current_schema()
`);
    res.json({
      success: true,
      time: result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " Database connection failed",
    });
  }
});
app.get("/:shortCode", redirectShortUrl);
export default app;
