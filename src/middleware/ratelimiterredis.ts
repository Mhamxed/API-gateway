import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

const redis = new Redis(); // Connect to Redis instance

const WINDOW_SIZE = 60 * 1000; // 1-minute window in milliseconds
const MAX_REQUESTS = 10;

const slidingWindowRateLimiterRedis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const ip = req.ip; // Use IP as an identifier
  const now = Date.now();
  const key = `rate_limit:${ip}`;

  try {
    // Remove outdated timestamps
    await redis.zremrangebyscore(key, 0, now - WINDOW_SIZE);

    // Count remaining requests within the window
    const requestCount = (await redis.zcard(key)) ?? 0;

    if (requestCount >= MAX_REQUESTS) {
        res.status(429).json({ error: "Too many requests" });
        return;
    }

    // Add current request timestamp
    await redis.zadd(key, now, now);
    await redis.expire(key, WINDOW_SIZE / 1000); // Expire key after window duration

    next();
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export default slidingWindowRateLimiterRedis;