import { ScraperCache } from '../models/index.js';

/**
 * Cache Manager using MongoDB for persistent caching
 */
class CacheManager {
  constructor(options = {}) {
    this.options = {
      defaultTTL: options.defaultTTL || 24 * 60 * 60 * 1000, // 24 hours
      maxSize: options.maxSize || 1000,
      infiniteCache: options.infiniteCache !== false,
      ...options
    };
    this.isInitialized = true; // MongoDB connection handled by connectDB
  }

  async ensureInitialized() {
    // MongoDB connection is handled globally
  }

  /**
   * Get value from cache with freshness information
   */
  async get(key) {
    try {
      const result = await ScraperCache.findOne({ url: key });
      
      if (result) {
        const now = Date.now();
        const needsRefresh = now > result.expires_at.getTime();
        const age = now - result.createdAt.getTime();

        return {
          data: result.data,
          isStale: needsRefresh,
          needsRefresh,
          age,
          lastChecked: result.updatedAt.getTime(),
          checkAfter: result.expires_at.getTime()
        };
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key, value, ttl = null) {
    try {
      const now = Date.now();
      const expiresAt = new Date(now + (ttl || this.options.defaultTTL));
      
      await ScraperCache.findOneAndUpdate(
        { url: key },
        { 
          data: value, 
          expires_at: expiresAt,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Mark an entry as fresh
   */
  async markAsFresh(key, ttl = null) {
    try {
      const now = Date.now();
      const expiresAt = new Date(now + (ttl || this.options.defaultTTL));
      
      await ScraperCache.findOneAndUpdate(
        { url: key },
        { 
          expires_at: expiresAt,
          updatedAt: new Date()
        }
      );
    } catch (error) {
      console.error('Cache markAsFresh error:', error);
    }
  }

  /**
   * Delete entry from cache
   */
  async delete(key) {
    try {
      await ScraperCache.deleteOne({ url: key });
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  async clear() {
    try {
      await ScraperCache.deleteMany({});
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

// Factory function to get cache instance
let cacheInstances = {};

export function getCache(options = {}) {
  const key = options.tableName || 'default';
  if (!cacheInstances[key]) {
    cacheInstances[key] = new CacheManager(options);
  }
  return cacheInstances[key];
}

export { CacheManager };
