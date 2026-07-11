import Redis from "ioredis";
import { AppLogger } from "@/core/logging/logger";

const logger = new AppLogger("RedisClient");

// Augment globalThis to prevent multiple instances during hot-reloads
const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  (() => {
    const redisUrl = process.env.RADIS_URL || process.env.REDIS_URL;

    if (!redisUrl) {
      logger.warn("RADIS_URL or REDIS_URL is not defined in the environment. Redis integration will fail if used.");
    }

    const client = new Redis(redisUrl || "", {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    client.on("error", (error) => {
      logger.error("Redis connection error", { error: error.message });
    });

    client.on("connect", () => {
      logger.info("Successfully connected to Redis");
    });

    return client;
  })();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
