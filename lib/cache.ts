// lib/cache.ts - Server-side memory cache
const analysisCache = new Map<string, {
    data: any;
    timestamp: number;
  }>();
  
  export const CacheService = {
    set: (key: string, data: any) => {
      analysisCache.set(key, {
        data,
        timestamp: Date.now()
      });
      console.log(`💾 Cache set: ${key}`);
    },
    
    get: (key: string) => {
      const cached = analysisCache.get(key);
      if (!cached) return null;
      
      // 1 saat sonra expire (session içinde)
      const ONE_HOUR = 60 * 60 * 1000;
      if (Date.now() - cached.timestamp > ONE_HOUR) {
        analysisCache.delete(key);
        console.log(`⏰ Cache expired: ${key}`);
        return null;
      }
      
      console.log(`✅ Cache hit: ${key}`);
      return cached.data;
    },
    
    has: (key: string): boolean => {
      return CacheService.get(key) !== null;
    },
    
    clear: (key: string) => {
      analysisCache.delete(key);
      console.log(`🗑️ Cache cleared: ${key}`);
    },
    
    clearAll: () => {
      analysisCache.clear();
      console.log(`🧹 All cache cleared`);
    },
    
    getStats: () => {
      return {
        size: analysisCache.size,
        keys: Array.from(analysisCache.keys())
      };
    }
  };
  
  // Cache key helpers
  export const CacheKeys = {
    readmeQuality: (username: string) => `readme_quality:${username}`,
    repoHealth: (username: string) => `repo_health:${username}`,
    devPatterns: (username: string) => `dev_patterns:${username}`,
    cicdAnalysis: (username: string) => `cicd_analysis:${username}`,
    testCoverage: (username: string) => `test_coverage:${username}`,
    careerInsights: (username: string) => `career_insights:${username}`,
  };
  
  // Cache TTL constants
  export const CacheTTL = {
    SHORT: 2 * 60 * 1000,      // 2 minutes
    MEDIUM: 5 * 60 * 1000,     // 5 minutes
    LONG: 15 * 60 * 1000,      // 15 minutes
    VERY_LONG: 60 * 60 * 1000, // 1 hour (current default)
  };