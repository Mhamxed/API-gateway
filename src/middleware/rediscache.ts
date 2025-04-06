import type { Request, Response, NextFunction } from 'express';
import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

async function redisCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const key = `cache:${req.method}-${req.originalUrl}`;
        const cachedData = await redis.get(key);
        if (cachedData) {
            res.json(JSON.parse(cachedData));
            return;
        }
        next()
    }
    catch (e) {
        console.error(e)
    }
}

export default redisCache;