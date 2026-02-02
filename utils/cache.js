import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/**
 * Cache Manager with SQLite persistence
 */
class CacheManager {
  constructor(options = {}) {
    this.options = {
      dbPath: options.dbPath || './cache.db',
      defaultTTL: options.defaultTTL || 24 * 60 * 60 * 1000, // 24 hours
      maxSize: options.maxSize || 1000, // Maximum cache entries
      cleanupInterval: options.cleanupInterval || 60 * 1000, // 1 minute cleanup interval
      tableName: options.tableName || 'cache_entries',
      infiniteCache: options.infiniteCache !== false, // Default to infinite cache
      ...options
    };

    this.db = null;
    this.cleanupTimer = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the cache database
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Ensure directory exists
      const dbDir = path.dirname(this.options.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Open database connection
      this.db = new Database(this.options.dbPath);
      
      // Enable WAL mode for better concurrency
      this.db.pragma('journal_mode = WAL');
      
      // Create cache table if it doesn't exist
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS ${this.options.tableName} (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          last_checked INTEGER NOT NULL,
          check_after INTEGER NOT NULL,
          access_count INTEGER DEFAULT 1,
          last_accessed INTEGER NOT NULL,
          is_stale INTEGER DEFAULT 0
        )
      `);

      // Create indexes for better performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_check_after ON ${this.options.tableName}(check_after);
        CREATE INDEX IF NOT EXISTS idx_last_accessed ON ${this.options.tableName}(last_accessed);
        CREATE INDEX IF NOT EXISTS idx_is_stale ON ${this.options.tableName}(is_stale);
      `);

      // Prepare frequently used statements
      this.statements = {
        get: this.db.prepare(`
          SELECT value, created_at, last_checked, check_after, is_stale FROM ${this.options.tableName} 
          WHERE key = ?
        `),
        set: this.db.prepare(`
          INSERT OR REPLACE INTO ${this.options.tableName} 
          (key, value, created_at, last_checked, check_after, last_accessed, is_stale) 
          VALUES (?, ?, ?, ?, ?, ?, 0)
        `),
        update: this.db.prepare(`
          UPDATE ${this.options.tableName} 
          SET access_count = access_count + 1, last_accessed = ? 
          WHERE key = ?
        `),
        markStale: this.db.prepare(`
          UPDATE ${this.options.tableName} 
          SET is_stale = 1, last_checked = ? 
          WHERE key = ?
        `),
        markFresh: this.db.prepare(`
          UPDATE ${this.options.tableName} 
          SET is_stale = 0, last_checked = ?, check_after = ? 
          WHERE key = ?
        `),
        delete: this.db.prepare(`DELETE FROM ${this.options.tableName} WHERE key = ?`),
        size: this.db.prepare(`SELECT COUNT(*) as count FROM ${this.options.tableName}`),
        clear: this.db.prepare(`DELETE FROM ${this.options.tableName}`),
        stats: this.db.prepare(`
          SELECT 
            COUNT(*) as total_entries,
            SUM(CASE WHEN check_after > ? THEN 1 ELSE 0 END) as fresh_entries,
            SUM(CASE WHEN is_stale = 1 THEN 1 ELSE 0 END) as stale_entries,
            AVG(access_count) as avg_access_count,
            MIN(created_at) as oldest_entry,
            MAX(last_accessed) as newest_access
          FROM ${this.options.tableName}
        `),
        lru: this.db.prepare(`
          DELETE FROM ${this.options.tableName} 
          WHERE key IN (
            SELECT key FROM ${this.options.tableName} 
            ORDER BY last_accessed ASC 
            LIMIT ?
          )
        `),
        getStaleEntries: this.db.prepare(`
          SELECT key FROM ${this.options.tableName} 
          WHERE check_after <= ? AND is_stale = 0
          LIMIT 10
        `)
      };

      // Start cleanup timer
      this.startCleanupTimer();
      
      this.isInitialized = true;
      console.log(`Infinite cache initialized with database: ${this.options.dbPath}`);
      
    } catch (error) {
      console.error('Failed to initialize cache:', error);
      throw error;
    }
  }

  /**
   * Get value from cache with freshness information
   * @param {string} key - Cache key
   * @returns {Object|null} - {data, isStale, age, needsRefresh} or null if not found
   */
  async get(key) {
    await this.ensureInitialized();
    
    try {
      const result = this.statements.get.get(key);
      
      if (result) {
        const now = Date.now();
        
        // Update access statistics
        this.statements.update.run(now, key);
        
        // Parse value
        let data;
        try {
          data = JSON.parse(result.value);
        } catch (parseError) {
          console.error('Failed to parse cached value:', parseError);
          // Delete corrupted entry
          this.statements.delete.run(key);
          return null;
        }

        const needsRefresh = now > result.check_after;
        const age = now - result.created_at;
        const isStale = result.is_stale === 1;

        return {
          data,
          isStale,
          needsRefresh,
          age,
          lastChecked: result.last_checked,
          checkAfter: result.check_after
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
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  async set(key, value, ttl = null) {
    await this.ensureInitialized();
    
    try {
      const now = Date.now();
      const checkAfter = now + (ttl || this.options.defaultTTL);
      const serializedValue = JSON.stringify(value);
      
      // Check if we need to make room (LRU eviction)
      if (this.options.maxSize > 0) {
        const currentSize = this.statements.size.get().count;
        if (currentSize >= this.options.maxSize) {
          const toRemove = Math.max(1, Math.floor(this.options.maxSize * 0.1)); // Remove 10%
          this.statements.lru.run(toRemove);
        }
      }
      
      this.statements.set.run(key, serializedValue, now, now, checkAfter, now);
      return true;
      
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Mark cache entry as stale (failed to refresh)
   * @param {string} key - Cache key
   */
  async markAsStale(key) {
    await this.ensureInitialized();
    
    try {
      const now = Date.now();
      this.statements.markStale.run(now, key);
      return true;
    } catch (error) {
      console.error('Cache mark stale error:', error);
      return false;
    }
  }

  /**
   * Mark cache entry as fresh (successfully refreshed)
   * @param {string} key - Cache key
   * @param {number} ttl - New TTL for next check
   */
  async markAsFresh(key, ttl = null) {
    await this.ensureInitialized();
    
    try {
      const now = Date.now();
      const checkAfter = now + (ttl || this.options.defaultTTL);
      this.statements.markFresh.run(now, checkAfter, key);
      return true;
    } catch (error) {
      console.error('Cache mark fresh error:', error);
      return false;
    }
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  async has(key) {
    const result = await this.get(key);
    return result !== null;
  }

  /**
   * Delete specific key from cache
   * @param {string} key - Cache key
   */
  async delete(key) {
    await this.ensureInitialized();
    
    try {
      const result = this.statements.delete.run(key);
      return result.changes > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear() {
    await this.ensureInitialized();
    
    try {
      this.statements.clear.run();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  async getStats() {
    await this.ensureInitialized();
    
    try {
      const now = Date.now();
      const stats = this.statements.stats.get(now);
      
      return {
        totalEntries: stats.total_entries || 0,
        freshEntries: stats.fresh_entries || 0,
        staleEntries: stats.stale_entries || 0,
        needsRefreshEntries: (stats.total_entries || 0) - (stats.fresh_entries || 0),
        avgAccessCount: Math.round((stats.avg_access_count || 0) * 100) / 100,
        oldestEntry: stats.oldest_entry ? new Date(stats.oldest_entry) : null,
        newestAccess: stats.newest_access ? new Date(stats.newest_access) : null,
        maxSize: this.options.maxSize,
        defaultTTL: this.options.defaultTTL,
        infiniteCache: this.options.infiniteCache,
        dbPath: this.options.dbPath
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {};
    }
  }

  /**
   * Get entries that need refresh (TTL expired but not deleted)
   * @returns {Array} - Array of keys that need refresh
   */
  async getEntriesNeedingRefresh() {
    await this.ensureInitialized();
    
    try {
      const now = Date.now();
      const results = this.statements.getStaleEntries.all(now);
      return results.map(row => row.key);
    } catch (error) {
      console.error('Cache get stale entries error:', error);
      return [];
    }
  }

  /**
   * Cleanup only for size management (not expiration)
   */
  async cleanup() {
    await this.ensureInitialized();
    
    try {
      // Only cleanup if we're over the max size
      if (this.options.maxSize > 0) {
        const currentSize = this.statements.size.get().count;
        if (currentSize > this.options.maxSize) {
          const toRemove = currentSize - this.options.maxSize;
          const removed = this.statements.lru.run(toRemove);
          
          if (removed.changes > 0) {
            console.log(`Cache size cleanup: removed ${removed.changes} least recently used entries`);
          }
          
          return removed.changes;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Start automatic cleanup timer
   */
  startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    this.stopCleanupTimer();
    
    if (this.db) {
      try {
        this.db.close();
        this.db = null;
        this.isInitialized = false;
        console.log('Cache database connection closed');
      } catch (error) {
        console.error('Error closing cache database:', error);
      }
    }
  }

  /**
   * Ensure cache is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }
}

// Default cache instance
let defaultCache = null;

/**
 * Get default cache instance
 * @param {Object} options - Cache options
 * @returns {CacheManager}
 */
export function getCache(options = {}) {
  if (!defaultCache) {
    defaultCache = new CacheManager(options);
  }
  return defaultCache;
}

/**
 * Create a new cache instance
 * @param {Object} options - Cache options
 * @returns {CacheManager}
 */
export function createCache(options = {}) {
  return new CacheManager(options);
}

/**
 * Convenient cache functions using default instance
 */
export const cache = {
  async get(key) {
    return getCache().get(key);
  },
  
  async set(key, value, ttl) {
    return getCache().set(key, value, ttl);
  },
  
  async has(key) {
    return getCache().has(key);
  },
  
  async delete(key) {
    return getCache().delete(key);
  },
  
  async clear() {
    return getCache().clear();
  },
  
  async getStats() {
    return getCache().getStats();
  },
  
  async cleanup() {
    return getCache().cleanup();
  }
};

export { CacheManager };
export default CacheManager; 