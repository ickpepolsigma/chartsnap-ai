import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkContactRateLimit } from '@/lib/rate-limit';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting check
    const rateLimitPassed = await checkContactRateLimit(ip);
    if (!rateLimitPassed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 requests per hour.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = contactSchema.parse(body);

    await prisma.contactMessage.create({ data });

    return NextResponse.json(
      { success: true, message: 'Message sent' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
