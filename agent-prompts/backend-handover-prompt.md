# Backend Handover - ChartSnap AI

## Current Status: ✅ PHASE 1 COMPLETE

The backend foundation is built and tested. A new agent needs to take over for **Phase 2: Testing, Refinement & Production Prep**.

---

## What's Already Built

### Core Files (All Functional)
| File | Status | Purpose |
|------|--------|---------|
| `lib/prisma.ts` | ✅ | Singleton Prisma client for SQLite |
| `lib/auth.ts` | ✅ | bcrypt (12 rounds), JWT, HTTP-only cookies |
| `lib/ai.ts` | ✅ | Hugging Face LLaVA integration + MOCK mode |
| `app/api/auth/register/route.ts` | ✅ | User registration with validation |
| `app/api/auth/login/route.ts` | ✅ | Login with credential check |
| `app/api/auth/logout/route.ts` | ✅ | Cookie clearance |
| `app/api/auth/me/route.ts` | ✅ | Current user from JWT |
| `app/api/analyze/route.ts` | ✅ | File upload (5MB, PNG/JPEG) + AI analysis |
| `app/api/contact/route.ts` | ✅ | Contact form validation & storage |

### Database
- **SQLite** at `prisma/dev.db`
- **Tables**: User, Analysis, ContactMessage
- **Migration**: Applied and working
- **Prisma Client**: Generated and functional

### AI Integration
- **Primary**: Hugging Face LLaVA (`llava-hf/llava-1.5-7b-hf`)
- **Fallback**: MOCK_AI mode (returns random Buy/Sell/Nothing)
- **Environment**: `HF_API_KEY` for real AI, `MOCK_AI=true` for free mode

### Tested & Working
```bash
# Registration works ✅
POST /api/auth/register → {"user":{"id":"...","email":"test@test.com"}}

# Database stores users ✅
npx prisma studio → View data at http://localhost:5555
```

---

## Your Mission: Phase 2

### 1. Security Hardening
- [ ] Add rate limiting on `/api/analyze` (5 req/min per user)
- [ ] Add rate limiting on auth endpoints (10 req/min per IP)
- [ ] Implement input sanitization beyond Zod validation
- [ ] Add request logging middleware
- [ ] Review CORS configuration for production

### 2. Error Handling & Resilience
- [ ] Add try-catch wrappers for all async operations
- [ ] Implement graceful degradation when Hugging Face API fails
- [ ] Add retry logic for AI calls (3 attempts with backoff)
- [ ] Better error messages for frontend consumption

### 3. File Upload Improvements
- [ ] Add image validation (check actual file content, not just extension)
- [ ] Implement virus scanning or file type verification
- [ ] Add cleanup job for orphaned uploaded files
- [ ] Compress/resize images before AI analysis

### 4. AI Reliability
- [ ] Handle Hugging Face API timeouts gracefully
- [ ] Add fallback to MOCK mode if HF API fails
- [ ] Cache analysis results for identical images (optional)
- [ ] Better JSON parsing from LLaVA responses

### 5. API Enhancements
- [ ] Add GET `/api/analyses` endpoint to fetch user's analysis history
- [ ] Add DELETE `/api/analyses/:id` endpoint
- [ ] Add pagination for analysis history
- [ ] Add GET `/api/analyses/:id` to view single analysis

### 6. Testing & Validation
- [ ] Create comprehensive API test suite
- [ ] Test all endpoints with edge cases (empty inputs, large files, etc.)
- [ ] Test authentication edge cases (expired tokens, missing cookies)
- [ ] Verify cookie security flags work in production

---

## Environment Variables

Current `.env.local`:
```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Auth
JWT_SECRET="change-this-to-a-random-string-min-32-chars-long"

# AI (Hugging Face)
HF_API_KEY="your-hf-api-key-here"  # Get free key at huggingface.co
MOCK_AI="true"  # Set "false" to use real Hugging Face API
```

**Note**: Hugging Face offers free API tier (~1000 requests/day). Perfect for MVP.

---

## Critical Code Sections

### lib/auth.ts
JWT cookie configuration (already secure):
```typescript
cookies().set('auth-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
});
```

### lib/ai.ts
Current implementation uses Hugging Face:
```typescript
const hf = new HfInference(process.env.HF_API_KEY);
const result = await hf.imageToText({
  model: 'llava-hf/llava-1.5-7b-hf',
  inputs: { image: base64Image, prompt: "..." }
});
```

### app/api/analyze/route.ts
File validation (already implemented):
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
```

---

## Dependencies to Add

You'll likely need:
```bash
# Rate limiting
npm install rate-limiter-flexible

# Image processing (for compression)
npm install sharp

# Enhanced logging
npm install pino pino-pretty
```

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Test with cookie (save and reuse)
curl -c cookies.txt -b cookies.txt http://localhost:3000/api/auth/me

# View database
npx prisma studio
```

---

## Integration Points

| Endpoint | Frontend Expects | Current Status |
|----------|-----------------|----------------|
| POST /api/auth/register | `{ user: { id, email } }` | ✅ Working |
| POST /api/auth/login | `{ user: { id, email } }` | ✅ Working |
| POST /api/auth/logout | `{ success: true }` | ✅ Working |
| GET /api/auth/me | `{ user }` or 401 | ✅ Working |
| POST /api/analyze | `{ decision, reason, analyzedAt }` | ✅ Working |
| POST /api/contact | `{ success }` | ✅ Working |
| GET /api/analyses | Paginated history | ❌ NEEDS BUILD |

---

## Files to Modify

1. **lib/ai.ts** - Add retry logic, better error handling
2. **app/api/analyze/route.ts** - Add rate limiting, image optimization
3. **NEW: app/api/analyses/route.ts** - Get user's analysis history
4. **NEW: lib/rate-limit.ts** - Rate limiting utility
5. **NEW: lib/logger.ts** - Request logging

---

## Security Checklist (Before Production)

From `SECURITY-CHECKLIST.md`:
- [ ] Rate limiting active on all endpoints
- [ ] Input validation strict (Zod schemas in place)
- [ ] No hardcoded secrets (use env vars)
- [ ] .env.local in .gitignore (verify)
- [ ] HTTPS configured for cookies (Secure flag already set)
- [ ] CORS limited to production domain
- [ ] Request logging for audit trail
- [ ] File upload security (content validation beyond mime type)

---

## Time Estimate

**Phase 2: 1-2 days**
- Security hardening: 4 hours
- API enhancements: 4 hours
- Testing & validation: 4 hours

---

## Questions?

Check these files:
- `docs/prd.md` - Full product requirements
- `tasks/chartsnap-tasks-backend.md` - Detailed task breakdown
- `SECURITY-CHECKLIST.md` - Security requirements

Message when ready for security review or deployment.
