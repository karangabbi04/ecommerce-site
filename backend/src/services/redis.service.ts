import { redisClient } from "../lib/redis.js";

class RedisService {
  async set(
    key: string,
    value: unknown,
    ttlInSeconds?: number
  ) {
    const data = JSON.stringify(value);

    if (ttlInSeconds) {
      await redisClient.set(key, data, {
        EX: ttlInSeconds,
      });
      return;
    }

    await redisClient.set(key, data);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  async remove(key: string) {
    await redisClient.del(key);
  }
}

export const redisService = new RedisService();