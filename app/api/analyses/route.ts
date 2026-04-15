import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logRequest, logError } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Auth check
    const user = await getCurrentUser();
    if (!user) {
      logRequest({ method: 'GET', url: '/api/analyses', ip, statusCode: 401, duration: Date.now() - startTime });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch user's analyses with pagination
    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          decision: true,
          reason: true,
          createdAt: true,
        },
      }),
      prisma.analysis.count({ where: { userId: user.id } }),
    ]);

    logRequest({
      method: 'GET',
      url: '/api/analyses',
      ip,
      userId: user.id,
      statusCode: 200,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({
      analyses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError({
      method: 'GET',
      url: '/api/analyses',
      ip,
      statusCode: 500,
      duration,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}
