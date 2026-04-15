import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkVerificationRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting check
    const rateLimitPassed = await checkVerificationRateLimit(ip);
    if (!rateLimitPassed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 requests per 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, code } = verifyEmailSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Verify code
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Mark email as verified and clear code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
