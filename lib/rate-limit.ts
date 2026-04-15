import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';

// In-memory rate limiters for development
// For production, consider using Redis for distributed rate limiting

// Login routes: 5 attempts per 15 minutes
const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 900, // per 900 seconds (15 minutes)
});

// Register routes: 5 attempts per 15 minutes
const registerLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 900, // per 900 seconds (15 minutes)
});

// Analyze routes: 5 requests per minute
const analyzeLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds (1 minute)
});

// Contact routes: 5 requests per hour
const contactLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 3600, // per 3600 seconds (1 hour)
});

// Verification routes: 5 requests per 15 minutes
const verificationLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 900, // per 900 seconds (15 minutes)
});

// Admin routes: 20 requests per minute
const adminLimiter = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 60, // per 60 seconds (1 minute)
});

export async function checkLoginRateLimit(ip: string): Promise<boolean> {
  try {
    await loginLimiter.consume(ip);
    return true;
  } catch (rejRes) {
    return false;
  }
}

export async function checkRegisterRateLimit(ip: string): Promise<boolean> {
  try {
    await registerLimiter.consume(ip);
    return true;
  } catch (rejRes) {
    return false;
  }
}

export async function checkAnalyzeRateLimit(userId: string): Promise<boolean> {
  try {
    await analyzeLimiter.consume(userId);
    return true;
  } catch (rejRes) {
    return false;
  }
}

export async function checkContactRateLimit(ip: string): Promise<boolean> {
  try {
    await contactLimiter.consume(ip);
    return true;
  } catch (rejRes) {
    return false;
  }
}

export async function checkVerificationRateLimit(ip: string): Promise<boolean> {
  try {
    await verificationLimiter.consume(ip);
    return true;
  } catch (rejRes) {
    return false;
  }
}

export async function checkAdminRateLimit(ip: string): Promise<boolean> {
  try {
    await adminLimiter.consume(ip);
    return true;
  } catch (rejRes) {
    return false;
  }
}

// Deprecated: use checkLoginRateLimit or checkRegisterRateLimit
export async function checkAuthRateLimit(ip: string): Promise<boolean> {
  return checkLoginRateLimit(ip);
}

export function getRateLimitHeaders(userId: string, ip: string) {
  return {
    'X-RateLimit-Limit': '5',
    'X-RateLimit-Remaining': '4', // Simplified, in production use actual remaining
    'X-RateLimit-Reset': '900',
  };
}
