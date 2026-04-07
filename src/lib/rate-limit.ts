/** Simple in-memory sliding window rate limiter (no external dependencies). */

type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

// Clean up expired entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key)
  })
}

/**
 * Check if a request should be rate-limited.
 * @param key - Unique identifier (e.g. IP address)
 * @param limit - Max requests per window
 * @param windowMs - Window size in milliseconds
 * @returns { limited, remaining, resetAt }
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): { limited: boolean; remaining: number; resetAt: number } {
  cleanup()
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs }
  }

  entry.count++
  if (entry.count > limit) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt }
  }

  return { limited: false, remaining: limit - entry.count, resetAt: entry.resetAt }
}
