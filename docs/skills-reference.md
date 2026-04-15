# ChartSnap AI - Skills Reference

## Agent Role Definitions

### Frontend Engineer
**Stack:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
**Responsibilities:**
- Page routing and navigation
- Component architecture
- Form validation (react-hook-form + zod)
- API integration (SWR or React Query)
- Responsive/mobile-first styling
- Toast notifications and error handling

**Key Skills:**
- React Server Components vs Client Components
- Next.js App Router patterns
- Tailwind CSS arbitrary values and custom config
- shadcn/ui component customization
- Image optimization with next/image

---

### Backend Engineer
**Stack:** Next.js API Routes + Prisma + SQLite
**Responsibilities:**
- Database schema and migrations
- Authentication (bcrypt + JWT + cookies)
- API route handlers
- File upload processing
- AI service integration (OpenAI)
- Input validation and sanitization

**Key Skills:**
- Next.js Route Handlers (App Router)
- Prisma ORM queries and relations
- JWT token lifecycle
- HTTP-only cookie security
- Multipart form data parsing
- OpenAI API error handling

---

### DevOps Engineer
**Stack:** Vercel + GitHub Actions
**Responsibilities:**
- Production deployment
- Environment configuration
- CI/CD pipeline
- Monitoring and logging
- Database backup strategy

**Key Skills:**
- Vercel deployment configuration
- GitHub Actions workflows
- Environment variable management
- Production vs development settings

---

## Skill Prerequisites by Task

### For Frontend Agent
```
REQUIRED:
- Next.js 14 App Router experience
- TypeScript generics and utility types
- Tailwind CSS responsive design
- React Hook Form + Zod validation

NICE TO HAVE:
- shadcn/ui component library usage
- Framer Motion for animations
- next/image optimization
```

### For Backend Agent
```
REQUIRED:
- Prisma ORM (schema, migrations, queries)
- JWT authentication patterns
- File upload handling in Node.js
- Zod schema validation

NICE TO HAVE:
- OpenAI API experience
- Rate limiting implementation
- Image processing (sharp library)
```

---

## Decision Matrix

When agents ask "should I do X or Y?", use this:

| Question | Decision Rule |
|----------|---------------|
| Add new dependency? | Prefer built-in Next.js features first |
| Change API contract? | Both agents must agree, document in PRD |
| Skip a feature? | Only if marked P1/P2 in PRD, never P0 |
| Use client or server component? | Server by default, client only when needed |
| Store in state or URL? | Local state for ephemeral, URL for shareable |

---

## Common Patterns

### Protected Route Pattern
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtected = request.nextUrl.pathname.startsWith('/analyze');
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/analyze', request.url));
  }
}

export const config = {
  matcher: ['/analyze', '/login']
};
```

### API Error Response Pattern
```typescript
// Standard error shape for all API routes
interface ApiError {
  error: string;
  details?: unknown;  // Validation errors
  code?: string;      // Machine-readable code
}

// Usage
return NextResponse.json(
  { error: 'Invalid input', details: zodError.errors },
  { status: 400 }
);
```

### Loading State Pattern
```typescript
// Consistent loading UI across components
const LoadingState = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-zinc-800 rounded w-1/3" />
    <div className="h-32 bg-zinc-800 rounded" />
    <div className="h-20 bg-zinc-800 rounded" />
  </div>
);
```

---

## Integration Checklist

Before declaring work complete:

### Frontend
- [ ] All pages render without hydration errors
- [ ] Forms validate with Zod before submission
- [ ] Loading states show during API calls
- [ ] Error toasts display for all error cases
- [ ] Mobile layout tested at 375px, 768px, 1440px

### Backend
- [ ] All routes return correct HTTP status codes
- [ ] Database migrations run successfully
- [ ] JWT tokens expire correctly
- [ ] File uploads are saved and retrievable
- [ ] AI mock mode works without API key

### Full Stack
- [ ] Login → Redirect to Analyze → Upload → See Result
- [ ] Logout clears session
- [ ] Invalid credentials show error
- [ ] Large image shows validation error
- [ ] Contact form saves to database
