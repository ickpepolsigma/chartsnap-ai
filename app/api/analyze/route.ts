import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { analyzeImage } from '@/lib/ai';
import { checkAnalyzeRateLimit } from '@/lib/rate-limit';
import { logRequest, logError, logAIAnalysis } from '@/lib/logger';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_ANALYSES_PER_USER = 10;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Auth check
    const user = await getCurrentUser();
    if (!user) {
      logRequest({ method: 'POST', url: '/api/analyze', ip, statusCode: 401, duration: Date.now() - startTime });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Email verification check
    if (!user.emailVerified) {
      logRequest({ method: 'POST', url: '/api/analyze', ip, userId: user.id, statusCode: 403, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: 'Please verify your email before analyzing charts' },
        { status: 403 }
      );
    }

    // Rate limiting check
    const rateLimitPassed = await checkAnalyzeRateLimit(user.id);
    if (!rateLimitPassed) {
      logRequest({ method: 'POST', url: '/api/analyze', ip, userId: user.id, statusCode: 429, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 requests per minute.' },
        { status: 429 }
      );
    }

    // Check analysis limit per user
    const analysisCount = await prisma.analysis.count({
      where: { userId: user.id }
    });

    if (analysisCount >= MAX_ANALYSES_PER_USER) {
      logRequest({ method: 'POST', url: '/api/analyze', ip, userId: user.id, statusCode: 403, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: `Analysis limit reached. Maximum ${MAX_ANALYSES_PER_USER} analyses per user.` },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG and JPEG allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB.' },
        { status: 400 }
      );
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Call AI
    const analysis = await analyzeImage(filepath);

    // Save to DB
    const saved = await prisma.analysis.create({
      data: {
        userId: user.id,
        imagePath: filename,
        decision: analysis.decision,
        reason: analysis.reason
      }
    });

    // Log successful analysis
    logAIAnalysis({
      method: 'POST',
      url: '/api/analyze',
      ip,
      userId: user.id,
      decision: analysis.decision,
      mockMode: process.env.MOCK_AI === 'true',
      statusCode: 200,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({
      decision: analysis.decision,
      reason: analysis.reason,
      analyzedAt: saved.createdAt
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logError({
      method: 'POST',
      url: '/api/analyze',
      ip,
      statusCode: 500,
      duration,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
