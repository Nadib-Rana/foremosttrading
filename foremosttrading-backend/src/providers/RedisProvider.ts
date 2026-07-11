import Redis from "ioredis";
import { InfrastructureProvider } from "@/core/InfrastructureProvider";
import { AppLogger } from "@/core/logging/logger";

export class RedisProvider implements InfrastructureProvider<Redis> {
  public name = "Redis Cache";
  private logger = new AppLogger("RedisProvider");

  constructor(private readonly redisClient: Redis) {}

  public getClient(): Redis {
    return this.redisClient;
  }

  public async connect(): Promise<void> {
    // ioredis connects automatically unless lazyConnect is true
    this.logger.info("Connecting to Redis...");
  }

  public async disconnect(): Promise<void> {
    await this.redisClient.quit();
    this.logger.info("Disconnected from Redis");
  }
}
