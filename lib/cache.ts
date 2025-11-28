// lib/cache.ts
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
    },
    
    get: (key: string) => {
      const cached = analysisCache.get(key);
      if (!cached) return null;
      
      // 1 saat sonra expire (session içinde)
      const ONE_HOUR = 60 * 60 * 1000;
      if (Date.now() - cached.timestamp > ONE_HOUR) {
        analysisCache.delete(key);
        return null;
      }
      
      return cached.data;
    },
    
    clear: (key: string) => {
      analysisCache.delete(key);
    }
  };