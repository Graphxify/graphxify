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
const MEMORY_STORE_MAX_KEYS = 5000;
const MS_IN_SECOND = 1000;

const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : null;

function trimExpiredTimestamps(timestamps: number[], windowStart: number): number[] {
  let firstValidIndex = 0;
  while (firstValidIndex < timestamps.length && timestamps[firstValidIndex] <= windowStart) {
    firstValidIndex += 1;
  }

  if (firstValidIndex === 0) {
    return timestamps;
  }

  return timestamps.slice(firstValidIndex);
}

function retryAfterSeconds(untilTimestamp: number, now: number): number {
  return Math.max(1, Math.ceil((untilTimestamp - now) / MS_IN_SECOND));
}

function evictStaleKeys(now: number, windowSec: number): void {
  if (memoryStore.size <= MEMORY_STORE_MAX_KEYS) {
    return;
  }
  const cutoff = now - windowSec * MS_IN_SECOND;
  for (const [storedKey, timestamps] of memoryStore) {
    const latestTimestamp = timestamps[timestamps.length - 1];
    if (!latestTimestamp || latestTimestamp <= cutoff) {
      memoryStore.delete(storedKey);
    }
  }
}

export async function rateLimit({ key, route, limit = 10, windowSec = 60 }: LimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSec * MS_IN_SECOND;
  const windowStart = now - windowMs;
  const fullKey = `${route}:${key}`;

  if (redis) {
    try {
      const redisKey = `rl:${fullKey}`;
      await redis.zremrangebyscore(redisKey, 0, windowStart);
      const total = await redis.zcard(redisKey);

      if (total >= limit) {
        const oldest = (await redis.zrange(redisKey, 0, 0, { withScores: true })) as ScoredEntry[];
        const oldestTimestamp = oldest[0] ? Number(oldest[0].score) : now;
        const retryAfter = retryAfterSeconds(oldestTimestamp + windowMs, now);
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

  const timestamps = trimExpiredTimestamps(memoryStore.get(fullKey) ?? [], windowStart);
  if (timestamps.length >= limit) {
    const retryAfter = retryAfterSeconds(timestamps[0] + windowMs, now);
    memoryStore.set(fullKey, timestamps);
    return { allowed: false, remaining: 0, retryAfter };
  }

  timestamps.push(now);
  memoryStore.set(fullKey, timestamps);
  evictStaleKeys(now, windowSec);
  return { allowed: true, remaining: limit - timestamps.length, retryAfter: 0 };
}
