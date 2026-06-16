import { createClient } from "redis";


export const redisClient = createClient({
 url:process.env.REDIS_URL

});

redisClient.on("error", (err) => {
  console.error("Redis Error", err);
});

redisClient.connect().catch((err) => {
  console.error("Redis Connect Error", err);
});