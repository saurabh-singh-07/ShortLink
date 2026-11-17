import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

let connectPromise: Promise<void> | null = null;

export async function connectRedis(): Promise<void> {
  if (redis.isOpen) return;

  if (!connectPromise) {
    connectPromise = redis
      .connect()
      .then(() => {
        console.log("Redis connected...");
      })
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }

  return connectPromise;
}

export default redis;