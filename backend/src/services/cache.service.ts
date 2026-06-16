import { redisClient } from "../lib/redis.js";

export const getCache = async (key:string) => {
  const value = await redisClient.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

export const setCache = async (
  key:string,
  value:any,
  ttlSeconds = 86400
) => {
  await redisClient.set(
    key,
    JSON.stringify(value),
    {
      EX: ttlSeconds,
    }
  );
};