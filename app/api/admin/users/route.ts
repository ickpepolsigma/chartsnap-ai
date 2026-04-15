import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { checkAdminRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting check
    const rateLimitPassed = await checkAdminRateLimit(ip);
    if (!rateLimitPassed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 20 requests per minute.' },
        { status: 429 }
      );
    }

    // Check admin authentication
    const adminAuth = cookies().get('admin-auth')?.value;
    if (adminAuth !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: { analyses: true },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
