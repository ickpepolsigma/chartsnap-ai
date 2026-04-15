import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendVerificationEmail, generateVerificationCode } from '@/lib/email';
import { checkVerificationRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const sendVerificationSchema = z.object({
  email: z.string().email(),
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
    const { email } = sendVerificationSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Update user with verification code
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: code },
    });

    // Log code for debugging (temporary)
    console.log('=== VERIFICATION CODE FOR DEBUGGING ===');
    console.log(`Email: ${email}`);
    console.log(`Code: ${code}`);
    console.log('=====================================');

    // Send email
    const emailSent = await sendVerificationEmail(email, code);

    // For debugging: return code in response if email fails
    if (!emailSent) {
      return NextResponse.json(
        { success: true, message: 'Email failed to send, but code generated for testing', code, debug: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
