// lru-cache v5 ships a CommonJS default export — named imports are v10+ only
import LRUCache from 'lru-cache'

/**
 * In-process token-bucket rate limiter backed by LRUCache.
 *
 * IMPORTANT — per-instance only:
 * This runs inside a Vercel serverless function. Each Lambda instance has its own
 * in-memory state, so limits are enforced per-instance, not globally across all
 * concurrent instances. For most traffic levels this is perfectly adequate.
 *
 * UPGRADE PATH to cross-instance enforcement:
 *   1. `npm install @upstash/ratelimit @upstash/redis`
 *   2. Replace this file with:
 *      import { Ratelimit } from "@upstash/ratelimit"
 *      import { Redis } from "@upstash/redis"
 *      export const chatLimiter = new Ratelimit({
 *        redis: Redis.fromEnv(),
 *        limiter: Ratelimit.slidingWindow(10, "60 s"),
 *        prefix: "velvet:chat",
 *      })
 *   3. Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to .env
 */

interface RateLimitEntry {
  tokens: number  // remaining tokens
  resetAt: number // epoch ms when the window resets
}

// Keep records for 1 minute (60,000 ms) in memory.
const WINDOW_MS = 60 * 1_000 // 60 seconds
const chatCache = new LRUCache<string, RateLimitEntry>({
    max: 10_000,
    maxAge: 60_000,
});

const checkoutCache = new LRUCache<string, RateLimitEntry>({
    max: 10_000,
    maxAge: 60_000,
});

function consume(
  cache: LRUCache<string, RateLimitEntry>,
  userId: string,
  maxTokens: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = cache.get(userId)

  if (!existing || now > existing.resetAt) {
    // New window
    const entry: RateLimitEntry = { tokens: maxTokens - 1, resetAt: now + WINDOW_MS }
    cache.set(userId, entry)
    return { allowed: true, remaining: entry.tokens, resetAt: entry.resetAt }
  }

  if (existing.tokens <= 0) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.tokens -= 1
  cache.set(userId, existing)
  return { allowed: true, remaining: existing.tokens, resetAt: existing.resetAt }
}

/** Chat endpoint: 10 messages per 60 seconds per user */
export function chatRateLimit(userId: string) {
  return consume(chatCache, userId, 10)
}

/** Checkout endpoint: 5 sessions per 60 seconds per user */
export function checkoutRateLimit(userId: string) {
  return consume(checkoutCache, userId, 5)
}
