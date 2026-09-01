import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Extremely lightweight in-memory rate limiter for Edge Runtime
// Note: In a serverless/edge environment, this state is isolated per lambda instance.
// For true global rate limiting, you would use Redis (e.g., Upstash). 
// But this is sufficient for basic deploy-ready protection against aggressive local spam.
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(req: NextRequest): NextResponse | null {
  // Only aggressively rate limit API routes to prevent abuse, allow static/page loads
  if (!req.nextUrl.pathname.startsWith('/api')) return null;

  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return null;
  }

  record.count += 1;
  ipRequestMap.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // Cleanup old entries periodically (every 1000 requests)
  if (Math.random() < 0.001) {
    for (const [key, value] of ipRequestMap.entries()) {
      if (now > value.resetTime) {
        ipRequestMap.delete(key);
      }
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  // 1. Check Rate Limit First
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Update Supabase Session & Handle Auth Routing
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
