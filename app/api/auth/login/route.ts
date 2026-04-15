import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { checkLoginRateLimit } from '@/lib/rate-limit';
import { logRequest, logError, logAuthAttempt } from '@/lib/logger';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting check
    const rateLimitPassed = await checkLoginRateLimit(ip);
    if (!rateLimitPassed) {
      logRequest({ method: 'POST', url: '/api/auth/login', ip, statusCode: 429, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 attempts per 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createToken(user.id);
    await setAuthCookie(token);

    logAuthAttempt({
      method: 'POST',
      url: '/api/auth/login',
      ip,
      action: 'login',
      userId: user.id,
      statusCode: 200,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof z.ZodError) {
      logRequest({ method: 'POST', url: '/api/auth/login', ip, statusCode: 400, duration });
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    logError({
      method: 'POST',
      url: '/api/auth/login',
      ip,
      statusCode: 500,
      duration,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
