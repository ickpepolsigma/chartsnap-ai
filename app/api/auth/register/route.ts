import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { checkRegisterRateLimit } from '@/lib/rate-limit';
import { logRequest, logError, logAuthAttempt } from '@/lib/logger';
import { sendVerificationEmail, generateVerificationCode } from '@/lib/email';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting check
    const rateLimitPassed = await checkRegisterRateLimit(ip);
    if (!rateLimitPassed) {
      logRequest({ method: 'POST', url: '/api/auth/register', ip, statusCode: 429, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 attempts per 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);
    const verificationCode = generateVerificationCode();
    const user = await prisma.user.create({
      data: { email, password: hashed, verificationCode },
      select: { id: true, email: true, emailVerified: true }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    const token = createToken(user.id);
    await setAuthCookie(token);

    logAuthAttempt({
      method: 'POST',
      url: '/api/auth/register',
      ip,
      action: 'register',
      userId: user.id,
      statusCode: 201,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof z.ZodError) {
      logRequest({ method: 'POST', url: '/api/auth/register', ip, statusCode: 400, duration });
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    logError({
      method: 'POST',
      url: '/api/auth/register',
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
