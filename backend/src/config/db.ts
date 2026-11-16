
import "dotenv/config";
import { Pool } from "pg";
export const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon SSL connections in serverless
  },
  max: 10, // Limit pool size per serverless instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
  console.log("PostgreSQL connection established");
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error);
});
