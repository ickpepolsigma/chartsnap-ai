# ChartSnap AI - Refined Product Requirements Document

## 1. Executive Summary

**Product:** ChartSnap AI - AI-powered candlestick chart analysis tool
**Target User:** Retail traders seeking quick technical analysis feedback
**Core Value:** Upload a chart screenshot → Get Buy/Sell/Hold verdict with explanation in <5 seconds

---

## 2. Refined Requirements

### 2.1 Core Features (MVP)

| Feature | Priority | Notes |
|---------|----------|-------|
| User Authentication (Login/Register) | P0 | Email/password, bcrypt hashed, JWT sessions |
| Chart Upload & Preview | P0 | Drag-and-drop, PNG/JPEG, max 5MB, client-side validation |
| AI Analysis API | P0 | Hugging Face Inference API integration, structured JSON response |
| Results Display | P0 | Buy/Sell/Nothing badge + 100-200 word explanation |
| Responsive Design | P0 | Mobile-first, dark mode default |
| Contact Form | P1 | Store messages in DB |
| Example Gallery | P1 | 3 mock analyses on homepage |

### 2.2 Technical Decisions - 100% Free Stack

```yaml
Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
Backend: Next.js API Routes (consolidated stack)
Database: SQLite (via Prisma ORM) - completely free, local file
AI Provider: Hugging Face Inference API with free tier for development
Auth: JWT tokens in HTTP-only cookies - custom implementation, no third-party
File Storage: Local filesystem - free, no cloud storage needed
Deployment: Vercel free tier or self-hosted
```

**Why this stack is completely free:**
- **SQLite**: Zero cost, single file database (no hosted service needed)
- **Custom Auth**: JWT implementation, no Auth0/Firebase/Clerk costs
- **Local Storage**: Images saved to `uploads/` folder, no S3/Cloudinary
- **Mock AI Mode**: Works without paid API key for unlimited free testing
- **Vercel**: Free tier handles Next.js deployment

**Zero third-party services required for MVP.**

### 2.3 API Endpoints

```
POST   /api/auth/register    → Create account, return JWT
POST   /api/auth/login       → Authenticate, return JWT
POST   /api/auth/logout      → Clear cookie
GET    /api/auth/me          → Get current user
POST   /api/analyze          → Upload image, return AI analysis
POST   /api/contact          → Submit contact form
```

### 2.4 AI Prompt Template

```
You are a technical analysis assistant specializing in candlestick chart patterns.

Analyze the provided chart image and respond with ONLY valid JSON in this format:
{
  "decision": "Buy" | "Sell" | "Nothing",
  "reason": string (100-200 words explaining visible patterns, trend direction, and key levels)
}

Rules:
1. Decision must be exactly one of: Buy, Sell, Nothing
2. Reason must reference specific visible patterns (e.g., "higher highs", "shooting star", "consolidation")
3. If chart is unclear or not a candlestick chart, return decision "Nothing" and explain why
4. Never include markdown formatting, only raw JSON
```

### 2.5 Response Schema

```typescript
interface AnalysisResponse {
  decision: 'Buy' | 'Sell' | 'Nothing';
  reason: string;
  analyzedAt: string; // ISO timestamp
}
```

---

## 3. Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  createdAt DateTime @default(now())
  analyses  Analysis[]
}

model Analysis {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  imagePath  String   // Path to stored image
  decision   String   // Buy | Sell | Nothing
  reason     String
  createdAt  DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

---

## 4. Page Structure

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing page with hero, features, examples, CTA |
| `/login` | Public | Auth toggle (login/register) |
| `/analyze` | Protected | Chart upload + analysis interface |
| `/contact` | Public | Contact form + FAQ |

---

## 5. UI/UX Specifications

### 5.1 Design System - Liquid Glass Dark Theme
- **Theme:** Ultra-modern liquid glass dark mode
- **Background:** Gradient mesh from `slate-950` to `black` with subtle animated gradient orbs
- **Glass Cards:** `bg-white/5 backdrop-blur-xl border-white/10` with gradient border highlights
- **Primary Colors:** 
  - Buy: `emerald-400` with glow effect `shadow-emerald-500/20`
  - Sell: `rose-400` with glow effect `shadow-rose-500/20`
  - Nothing: `amber-400` with glow effect `shadow-amber-500/20`
- **Typography:** Inter font, 16px base, letter-spacing tight for headings
- **Effects:** 
  - Backdrop blur on all cards (`backdrop-blur-xl`)
  - Gradient borders using pseudo-elements
  - Subtle inner shadows for depth
  - Smooth transitions (300ms ease-out)
- **Spacing:** 4px grid system

### 5.2 Key Components Needed (Liquid Glass Style)
1. `AuthForm` - Glass card with gradient border, floating labels
2. `ImageUpload` - Glass drop zone with animated border glow on drag
3. `AnalysisResult` - Glass card with decision badge glow effect
4. `LoadingState` - Animated gradient skeleton with shimmer
5. `Navbar` - Glassmorphism header with blur, sticky position
6. `ContactForm` - Glass inputs with focus glow effects
7. `GlassCard` - Reusable glass container component
8. `GradientButton` - Primary CTA with gradient background

---

## 6. Error Handling

| Scenario | UX Response |
|----------|-------------|
| Invalid image format | Toast: "Please upload PNG or JPEG" |
| File > 5MB | Toast: "Image must be under 5MB" |
| Non-chart image | Result: "Nothing" + "Unable to identify candlestick patterns" |
| AI API failure | Toast: "Analysis failed. Please try again." |
| Network error | Toast: "Connection error. Check your internet." |

---

## 7. Security Checklist

- [ ] Passwords hashed with bcrypt (cost factor 12)
- [ ] JWT in HTTP-only, Secure, SameSite=Strict cookies
- [ ] File upload validation (mimetype + size)
- [ ] Rate limiting on /api/analyze (5 req/min per user)
- [ ] Input sanitization on all text fields
- [ ] CORS configured for production domain only

---

## 8. Development Phases

**Phase 1 (Days 1-2):** Setup + Auth
- Project scaffold, database, login/register pages

**Phase 2 (Days 3-4):** Core Analysis
- Upload component, AI integration, results display

**Phase 3 (Days 5-6):** Polish
- Homepage, examples, contact, responsive testing

**Phase 4 (Day 7):** Deploy
- Build, env config, Vercel deployment

---

## 9. Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# Auth
JWT_SECRET="your-secret-key"

# AI
HF_API_KEY="your-huggingface-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 10. Success Criteria

- [ ] User can register, login, logout
- [ ] User can upload chart and receive analysis in <5s
- [ ] Decision is one of: Buy, Sell, Nothing
- [ ] Explanation is 100-200 words with pattern references
- [ ] Works on mobile and desktop
- [ ] All error states handled gracefully
- [ ] **100% free - no paid services required to run or develop**

---

## 11. Cost Breakdown (Free)

| Component | Cost | Why |
|-----------|------|-----|
| Database | $0 | SQLite file, no server needed |
| Authentication | $0 | Custom JWT implementation |
| File Storage | $0 | Local filesystem |
| AI (Development) | $0 | MOCK_AI mode returns random valid responses |
| AI (Production) | ~$0.01/analysis | Only if you add real OpenAI key later |
| Hosting | $0 | Vercel free tier |
| **Total MVP Cost** | **$0** | Completely free to build and test |
