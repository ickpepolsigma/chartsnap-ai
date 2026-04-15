import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { checkAdminRateLimit } from '@/lib/rate-limit';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.contactMessage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
