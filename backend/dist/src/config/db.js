import dns from "node:dns";
import net from "node:net";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamilyAttemptTimeout(10000);
neonConfig.webSocketConstructor = ws;
if (!process.env.DB_URL) {
    throw new Error("DB_URL environment variable is missing");
}
export const pool = new Pool({
    connectionString: process.env.DB_URL.trim(),
});
pool.on("error", (err) => {
    console.error("Unexpected Neon pool error:", err);
});
//# sourceMappingURL=db.js.map