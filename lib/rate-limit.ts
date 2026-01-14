/**
 * Rate Limiting Utility
 *
 * Simple in-memory rate limiting for bot protection.
 * For production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
  firstRequest: number;
}

// In-memory store (consider Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum requests allowed per window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Minimum time between requests in milliseconds */
  minRequestInterval?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
  reason?: string;
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  let entry = rateLimitStore.get(identifier);

  // Initialize or reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
      firstRequest: now,
    };
  }

  // Check minimum request interval (anti-bot)
  if (config.minRequestInterval && entry.count > 0) {
    const timeSinceFirst = now - entry.firstRequest;
    if (timeSinceFirst < config.minRequestInterval * entry.count) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: new Date(entry.resetAt),
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
        reason: 'Requests too frequent - possible bot detected',
      };
    }
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: new Date(entry.resetAt),
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      reason: 'Rate limit exceeded',
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: new Date(entry.resetAt),
  };
}

/**
 * Get client IP from request headers
 * Handles proxies and load balancers
 */
export function getClientIp(request: Request): string {
  // Check various headers that might contain the real IP
  const headers = request.headers;

  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Standard forwarded headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;

  // Fallback (won't work in serverless environments)
  return 'unknown';
}

/**
 * Verify honeypot field (anti-bot)
 * Honeypot fields are hidden from users but visible to bots
 */
export function verifyHoneypot(honeypotValue: string | undefined): boolean {
  // Honeypot should be empty (humans can't see it, bots fill everything)
  return !honeypotValue || honeypotValue.trim() === '';
}

/**
 * Verify request timing (anti-bot)
 * Checks if request came too quickly after page load
 */
export function verifyRequestTiming(
  clientTimestamp: number | undefined,
  minTimeMs: number = 1000
): boolean {
  if (!clientTimestamp) return false;

  const now = Date.now();
  const timeSincePageLoad = now - clientTimestamp;

  // Request must be at least minTimeMs after page load
  // (bots often submit forms instantly)
  return timeSincePageLoad >= minTimeMs;
}
