// lib/client-cache.ts - Client-side session storage

interface CacheEntry<T> {
    data: T;
    timestamp: number;
  }
  
  export class ClientCache {
    private static prefix = 'gitrack_pro_';
  
    static set<T>(key: string, data: T): void {
      if (typeof window === 'undefined') return;
      try {
        const entry: CacheEntry<T> = { data, timestamp: Date.now() };
        sessionStorage.setItem(this.prefix + key, JSON.stringify(entry));
        console.log(`💾 Session saved: ${key}`);
      } catch (error) {
        console.warn('Session storage failed:', error);
      }
    }
  
    static get<T>(key: string): T | null {
      if (typeof window === 'undefined') return null;
      try {
        const item = sessionStorage.getItem(this.prefix + key);
        if (!item) return null;
        const entry: CacheEntry<T> = JSON.parse(item);
        console.log(`✅ Session hit: ${key}`);
        return entry.data;
      } catch (error) {
        return null;
      }
    }
  
    static has(key: string): boolean {
      return this.get(key) !== null;
    }
  
    static remove(key: string): void {
      if (typeof window === 'undefined') return;
      sessionStorage.removeItem(this.prefix + key);
    }
  
    static clear(): void {
      if (typeof window === 'undefined') return;
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }
  
  export const ProCacheKeys = {
    codeQuality: (username: string) => `code_quality_${username}`,
    repoHealth: (username: string) => `repo_health_${username}`,
    devPatterns: (username: string) => `dev_patterns_${username}`,
  };