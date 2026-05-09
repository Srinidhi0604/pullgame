/**
 * Caching utilities and helpers
 */

/**
 * Simple in-memory cache with TTL support
 */
export class CacheManager {
  private cache: Map<string, { value: unknown; expiresAt: number }> = new Map();

  /**
   * Set value in cache with optional TTL
   */
  set(key: string, value: unknown, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get value from cache
   */
  get(key: string): unknown {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const globalCache = new CacheManager();

/**
 * Cache decorator for functions
 */
export function withCache(ttlSeconds: number = 300) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;

      if (globalCache.has(cacheKey)) {
        return globalCache.get(cacheKey);
      }

      const result = await originalMethod.apply(this, args);
      globalCache.set(cacheKey, result, ttlSeconds);
      return result;
    };

    return descriptor;
  };
}
