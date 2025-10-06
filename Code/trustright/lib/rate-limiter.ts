// Simple in-memory rate limiter
// In production, you'd want to use Redis or a database
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitData>();

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000 // 1 minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries
  const expiredKeys = Array.from(rateLimitStore.entries())
    .filter(([, data]) => now > data.resetTime)
    .map(([key]) => key);

  expiredKeys.forEach(key => rateLimitStore.delete(key));

  // Get current data
  let data = rateLimitStore.get(key);

  if (!data) {
    data = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitStore.set(key, data);
    return { success: true, remaining: limit - 1, resetTime: data.resetTime };
  }

  if (now > data.resetTime) {
    // Window has expired, reset
    data.count = 1;
    data.resetTime = now + windowMs;
    rateLimitStore.set(key, data);
    return { success: true, remaining: limit - 1, resetTime: data.resetTime };
  }

  if (data.count >= limit) {
    // Rate limit exceeded
    return { success: false, remaining: 0, resetTime: data.resetTime };
  }

  // Increment count
  data.count++;
  rateLimitStore.set(key, data);

  return { success: true, remaining: limit - data.count, resetTime: data.resetTime };
}

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
}