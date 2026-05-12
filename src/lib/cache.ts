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

/**
 * Cache invalidation manager for related cache keys
 */
export class CacheInvalidationManager {
  private dependencies: Map<string, Set<string>> = new Map();

  /**
   * Register cache key dependency
   */
  registerDependency(key: string, dependentKey: string): void {
    if (!this.dependencies.has(key)) {
      this.dependencies.set(key, new Set());
    }
    this.dependencies.get(key)?.add(dependentKey);
  }

  /**
   * Invalidate cache key and all dependent keys
   */
  invalidate(key: string, cache: CacheManager): void {
    cache.delete(key);
    const dependents = this.dependencies.get(key);
    if (dependents) {
      for (const dependent of dependents) {
        cache.delete(dependent);
        this.invalidate(dependent, cache);
      }
    }
  }

  /**
   * Invalidate multiple keys by pattern
   */
  invalidateByPattern(pattern: RegExp, cache: CacheManager): number {
    let count = 0;
    // Note: This would require access to cache internals in production
    // For now, it's a placeholder for pattern-based invalidation
    return count;
  }

  /**
   * Clear all dependencies
   */
  clear(): void {
    this.dependencies.clear();
  }
}

/**
 * Global cache invalidation manager
 */
export const cacheInvalidation = new CacheInvalidationManager();

/**
 * Common cache key builders for consistent key generation
 */
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userEmail: (email: string) => `user:email:${email}`,
  paper: (paperId: string) => `paper:${paperId}`,
  papers: (filters: string) => `papers:${filters}`,
  problem: (problemId: string) => `problem:${problemId}`,
  problems: (filters: string) => `problems:${filters}`,
  leaderboard: (page: number, pageSize: number) => `leaderboard:${page}:${pageSize}`,
  search: (query: string) => `search:${query}`,
};

/**
 * Utility to invalidate user-related caches
 */
export function invalidateUserCache(userId: string): void {
  globalCache.delete(cacheKeys.user(userId));
}

/**
 * Utility to invalidate paper-related caches
 */
export function invalidatePaperCaches(): void {
  // Clear paper caches - in production, this would use pattern matching
  globalCache.cleanup();
}
