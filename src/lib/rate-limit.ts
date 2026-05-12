/**
 * Rate limiting utilities for API requests
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limiter using token bucket algorithm
 */
export class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record || now > record.resetTime) {
      this.records.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count < this.maxRequests) {
      record.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests for key
   */
  getRemaining(key: string): number {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record || now > record.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - record.count);
  }

  /**
   * Get reset time for key
   */
  getResetTime(key: string): number | null {
    const record = this.records.get(key);
    return record ? record.resetTime : null;
  }

  /**
   * Clear all records
   */
  clear(): void {
    this.records.clear();
  }

  /**
   * Remove expired records
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetTime) {
        this.records.delete(key);
      }
    }
  }
}

/**
 * Create rate limiter for API endpoint
 */
export function createEndpointLimiter(
  maxRequests: number = 100,
  windowMs: number = 60000
): RateLimiter {
  return new RateLimiter(maxRequests, windowMs);
}

/**
 * Extract rate limit key from request
 */
export function getRateLimitKey(ip: string, userId?: string): string {
  return userId ? `${userId}:${ip}` : ip;
}

/**
 * Format rate limit headers
 */
export function formatRateLimitHeaders(
  remaining: number,
  resetTime: number | null
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": String(remaining),
  };

  if (resetTime) {
    const resetSeconds = Math.ceil((resetTime - Date.now()) / 1000);
    headers["X-RateLimit-Reset"] = String(resetTime);
    headers["Retry-After"] = String(Math.max(0, resetSeconds));
  }

  return headers;
}
