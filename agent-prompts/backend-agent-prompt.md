## Agent Assignment: Backend Engineer

### 🆓 100% FREE PROJECT - ZERO COST STACK

**ChartSnap AI** - Web app for AI-powered candlestick chart analysis.  
**Stack Cost: $0** - Everything is free and self-hosted.

### Free Resources You're Using
✓ SQLite database (local file, $0)  
✓ Prisma ORM (free)  
✓ Custom JWT auth (free, no Auth0/Firebase)  
✓ Local file storage (free, no S3/Cloudinary)  
✓ MOCK_AI mode (NO API key needed for development)  
✓ Next.js API Routes (free)  
✓ bcrypt, jsonwebtoken (free)

### ⚠️ FORBIDDEN (Paid Services)
❌ NO Supabase  
❌ NO Firebase (auth/database/storage)  
❌ NO Auth0  
❌ NO Clerk  
❌ NO AWS S3 / Cloudinary  
❌ NO required API keys for development

**Use ONLY the free resources listed above.**

### Your Task
Build the complete backend API using the 100% free stack above.

### Reference Documents
- Full PRD: `chartsnap-prd.md`
- Your detailed brief: `tasks/chartsnap-tasks-backend.md`

### Key Requirements
1. **100% Free Stack** - No third-party services, everything self-hosted
   - SQLite database (single file, zero cost)
   - Custom JWT auth (no Auth0/Firebase fees)
   - Local filesystem storage (no S3/Cloudinary)
   - Mock AI mode works without API key
2. **Security first** - bcrypt passwords, HTTP-only JWT cookies, input validation
3. **File handling** - 5MB max, PNG/JPEG only, saved to `uploads/` directory
4. **AI integration** - Hugging Face LLaVA with **FREE mock fallback** for development
5. **Error handling** - Consistent JSON error responses, Zod validation

### API Routes to Build
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/register` | No | Create user, set JWT cookie |
| POST | `/api/auth/login` | No | Validate credentials, set JWT cookie |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| GET | `/api/auth/me` | Yes | Return current user |
| POST | `/api/analyze` | Yes | Upload image, call AI, save result |
| POST | `/api/contact` | No | Save contact form to DB |

### Database Schema (Prisma)
```prisma
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
  decision  String   // Buy | Sell | Nothing
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

### AI Prompt Template
```
You are a technical analysis assistant specializing in candlestick chart patterns.

Analyze the provided chart image and respond with ONLY valid JSON:
{
  "decision": "Buy" | "Sell" | "Nothing",
  "reason": string (100-200 words)
}

Rules:
1. Decision must be exactly one of: Buy, Sell, Nothing
2. Reference specific visible patterns
3. If unclear, return "Nothing" and explain why
4. Never include markdown, only raw JSON
```

### Critical Files
1. **`lib/prisma.ts`** - Singleton Prisma client
2. **`lib/auth.ts`** - bcrypt, JWT, cookie helpers
3. **`lib/ai.ts`** - Hugging Face integration + mock mode
4. **`app/api/auth/*/route.ts`** - All auth endpoints
5. **`app/api/analyze/route.ts`** - File upload + AI call

### Environment Variables (Free Setup)
```bash
# Database - FREE local file
DATABASE_URL="file:./dev.db"

# Auth - FREE custom implementation
JWT_SECRET="your-secret-key-here-min-32-characters"

# AI - FREE development mode (no API key needed!)
MOCK_AI="true"
# HF_API_KEY="your-huggingface-api-key"  # Only add later if you want real AI (free tier available)
```

**Development is completely FREE:**
- Mock AI returns realistic Buy/Sell/Nothing responses
- Test unlimited uploads with zero cost
- No credit card or API key required

### Deliverables
- [ ] Prisma schema and migrations working with SQLite
- [ ] All 6 API routes functional
- [ ] JWT auth working with HTTP-only cookies (custom implementation)
- [ ] File upload saves to local `uploads/` directory
- [ ] **Mock AI mode works WITHOUT API key (free development)**
- [ ] **Zero external services required**

### Integration Checkpoints
Message me when:
- API contract questions arise
- Frontend needs different response format
- AI integration issues
- Ready for integration testing

### Testing Your Work (Free)
```bash
# 1. Test auth flow (free)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 2. Test with cookie jar (free)
curl -c cookies.txt -b cookies.txt http://localhost:3000/api/auth/me

# 3. Test AI analysis - FREE mock mode
# No HF_API_KEY needed! MOCK_AI returns random valid responses.

# 4. View database (free)
npx prisma studio
# Opens local DB viewer at http://localhost:5555
```

**Total cost to build and test: $0**

### Time Estimate: 2-3 days

Start with database + Prisma setup, then auth utils and routes, then analyze endpoint with AI integration.
