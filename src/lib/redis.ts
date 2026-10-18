/**
 * TROFEO — Redis Client (Singleton)
 * For session caching, rate limiting, and short-term memory
 */

import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis | null }

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) {
    console.warn('[TROFEO] REDIS_URL not set — Redis features disabled')
    return null
  }

  try {
    const redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 100, 2000)
      },
      lazyConnect: true,
    })

    redis.on('error', (err) => {
      console.error('[TROFEO Redis]', err.message)
    })

    return redis
  } catch {
    return null
  }
}

export const redis: Redis | null = globalForRedis.redis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

// ─── Cache helpers ─────────────────────────────────────────────────
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const val = await redis.get(key)
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
  } catch { /* ignore */ }
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch { /* ignore */ }
}

// ─── Rate limiting ──────────────────────────────────────────────────
export async function checkRateLimit(
  userId: string,
  plan: string,
  window = 86400 // 24 hours
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limits: Record<string, number> = {
    FREE: parseInt(process.env.RATE_LIMIT_FREE_MESSAGES ?? '50'),
    CREATOR: parseInt(process.env.RATE_LIMIT_CREATOR_MESSAGES ?? '500'),
    PRO: parseInt(process.env.RATE_LIMIT_PRO_MESSAGES ?? '5000'),
  }

  const limit = limits[plan] ?? limits.FREE
  const key = `rate:${userId}:${new Date().toDateString()}`

  if (!redis) {
    return { allowed: true, remaining: limit, limit }
  }

  try {
    const current = await redis.incr(key)
    if (current === 1) await redis.expire(key, window)
    const remaining = Math.max(0, limit - current)
    return { allowed: current <= limit, remaining, limit }
  } catch {
    return { allowed: true, remaining: limit, limit }
  }
}
