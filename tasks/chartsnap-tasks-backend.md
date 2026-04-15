# ChartSnap AI - Backend Engineer Task Brief

## Scope
Build Next.js API routes for authentication, analysis, and contact form. Set up database with Prisma.

---

## Deliverables

### 1. Project Setup

```bash
# Initialize Prisma
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite

# Install dependencies
npm install bcrypt jsonwebtoken zod
npm install -D @types/bcrypt @types/jsonwebtoken
```

### 2. Database Schema

#### `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  createdAt DateTime   @default(now())
  analyses  Analysis[]
}

model Analysis {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  imagePath String
  decision  String
  reason    String
  createdAt DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

#### Run Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### `lib/prisma.ts` - Singleton Client
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 3. Authentication Utils

#### `lib/auth.ts`
```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true }
  });
}

export async function setAuthCookie(token: string) {
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export async function clearAuthCookie() {
  cookies().delete('auth-token');
}
```

### 4. API Routes

#### `app/api/auth/register/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: NextRequest) {
  try {
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
    const user = await prisma.user.create({
      data: { email, password: hashed },
      select: { id: true, email: true }
    });
    
    const token = createToken(user.id);
    await setAuthCookie(token);
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### `app/api/auth/login/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function POST(req: NextRequest) {
  try {
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
    
    return NextResponse.json({
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### `app/api/auth/logout/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
```

#### `app/api/auth/me/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ user });
}
```

#### `app/api/analyze/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { analyzeImage } from '@/lib/ai';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    
    return NextResponse.json({
      decision: analysis.decision,
      reason: analysis.reason,
      analyzedAt: saved.createdAt
    });
    
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
```

#### `app/api/contact/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function POST(req: NextRequest) {
  try {
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
```

### 5. AI Integration Module

#### `lib/ai.ts`
```typescript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_KEY);

interface AnalysisResult {
  decision: 'Buy' | 'Sell' | 'Nothing';
  reason: string;
}

export async function analyzeImage(imagePath: string): Promise<AnalysisResult> {
  // For development without API key, return mock
  if (!process.env.HF_API_KEY || process.env.MOCK_AI === 'true') {
    return mockAnalysis();
  }

  const imageBase64 = await imageToBase64(imagePath);

  const response = await hf.imageToText({
    model: 'llava-hf/llava-1.5-7b-hf',
    inputs: {
      image: imageBase64,
      prompt: `You are a technical analysis assistant specializing in candlestick chart patterns.

Analyze the provided chart image and respond with ONLY valid JSON in this format:
{
  "decision": "Buy" | "Sell" | "Nothing",
  "reason": string (100-200 words explaining visible patterns, trend direction, and key levels)
}

Rules:
1. Decision must be exactly one of: Buy, Sell, Nothing
2. Reason must reference specific visible patterns (e.g., "higher highs", "shooting star", "consolidation")
3. If chart is unclear or not a candlestick chart, return decision "Nothing" and explain why
4. Never include markdown formatting, only raw JSON`
    }
  });

  const content = response.generated_text || '{}';

  try {
    // Extract JSON from possible markdown code blocks
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) ||
                      content.match(/{[\s\S]*}/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    const parsed = JSON.parse(jsonStr);
    
    return {
      decision: parsed.decision || 'Nothing',
      reason: parsed.reason || 'Unable to analyze chart'
    };
  } catch {
    return {
      decision: 'Nothing',
      reason: 'Analysis parsing failed. Please try again.'
    };
  }
}

async function imageToBase64(path: string): Promise<string> {
  const { readFile } = await import('fs/promises');
  const buffer = await readFile(path);
  return buffer.toString('base64');
}

function mockAnalysis(): AnalysisResult {
  const decisions: ('Buy' | 'Sell' | 'Nothing')[] = ['Buy', 'Sell', 'Nothing'];
  const reasons = [
    'The chart shows higher highs and higher lows, indicating an uptrend. Recent candles suggest a bullish continuation pattern, with support near the lower wicks.',
    'A shooting star pattern is visible at resistance, suggesting potential bearish reversal. Volume appears to be declining on upward moves.',
    'The market is consolidating with no clear direction. Support and resistance levels are too close to establish a reliable trade setup.'
  ];
  
  const idx = Math.floor(Math.random() * 3);
  return {
    decision: decisions[idx],
    reason: reasons[idx]
  };
}
```

### 6. Environment Variables

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Auth
JWT_SECRET="your-secret-key"

# AI
HF_API_KEY="your-huggingface-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 7. Testing Checklist

- [ ] Register creates user with hashed password
- [ ] Login returns JWT in HTTP-only cookie
- [ ] /api/auth/me returns 401 without valid cookie
- [ ] /api/analyze requires authentication
- [ ] /api/analyze validates file type and size
- [ ] /api/analyze saves image to uploads/ directory
- [ ] /api/analyze saves analysis to database
- [ ] /api/contact saves message to database
- [ ] All endpoints handle Zod validation errors
- [ ] AI mock mode works without API key

---

## Integration Points

| Your Endpoint | Frontend Expects |
|---------------|------------------|
| `POST /api/auth/register` | Returns `{ user: { id, email } }` or `{ error }` |
| `POST /api/auth/login` | Returns `{ user: { id, email } }` or `{ error }` |
| `POST /api/auth/logout` | Returns `{ success: true }` |
| `GET /api/auth/me` | Returns `{ user }` or 401 |
| `POST /api/analyze` | Accepts FormData, returns `{ decision, reason, analyzedAt }` |
| `POST /api/contact` | Accepts JSON, returns `{ success }` or `{ error }` |

---

## Time Estimate: 2-3 days

Start with database setup, then auth routes, then the analyze endpoint with AI integration.
