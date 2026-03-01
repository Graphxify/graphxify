import "server-only";

import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

type LimitOptions = {
  key: string;
  route: string;
  limit?: number;
  windowSec?: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

type ScoredEntry = {
  member: string;
  score: number | string;
};

const memoryStore = new Map<string, number[]>();

const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export async function rateLimit({ key, route, limit = 10, windowSec = 60 }: LimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const fullKey = `${route}:${key}`;

  if (redis) {
    try {
      const redisKey = `rl:${fullKey}`;
      await redis.zremrangebyscore(redisKey, 0, windowStart);
      const total = await redis.zcard(redisKey);

      if (total >= limit) {
        const oldest = (await redis.zrange(redisKey, 0, 0, { withScores: true })) as ScoredEntry[];
        const oldestTimestamp = oldest[0] ? Number(oldest[0].score) : now;
        const retryAfter = Math.max(1, Math.ceil((oldestTimestamp + windowSec * 1000 - now) / 1000));
        return { allowed: false, remaining: 0, retryAfter };
      }

      await redis.zadd(redisKey, { score: now, member: `${now}-${Math.random().toString(36).slice(2)}` });
      await redis.expire(redisKey, windowSec);
      return { allowed: true, remaining: limit - (total + 1), retryAfter: 0 };
    } catch (error) {
      logger.warn("Redis rate-limit failed, falling back to memory store", {
        route,
        key,
        error: error instanceof Error ? error.message : "unknown"
      });
    }
  }

  const points = memoryStore.get(fullKey) ?? [];
  const filtered = points.filter((timestamp) => timestamp > windowStart);
  if (filtered.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((filtered[0] + windowSec * 1000 - now) / 1000));
    memoryStore.set(fullKey, filtered);
    return { allowed: false, remaining: 0, retryAfter };
  }
  filtered.push(now);
  memoryStore.set(fullKey, filtered);
  return { allowed: true, remaining: limit - filtered.length, retryAfter: 0 };
}
