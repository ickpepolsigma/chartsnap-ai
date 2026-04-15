# 100% Free Stack Guide - ChartSnap AI

Complete list of free resources and draft messages for agents.

---

## What We're Using (All Free)

### Core Stack
| Component | Free Solution | Paid Alternative We DON'T Use |
|-----------|---------------|-------------------------------|
| **Database** | SQLite (local file) | Supabase, PlanetScale, MongoDB Atlas |
| **Authentication** | Custom JWT + bcrypt | Auth0, Firebase Auth, Clerk |
| **File Storage** | Local filesystem | AWS S3, Cloudinary, Firebase Storage |
| **AI Analysis** | MOCK_AI mode (development) | OpenAI GPT-4o ($0.01/analysis) |
| **Frontend Framework** | Next.js (open source) | Vercel paid tiers (not needed) |
| **Styling** | Tailwind CSS (open source) | Any paid UI library |
| **UI Components** | shadcn/ui (open source) | Any paid component library |
| **Animations** | Framer Motion (open source) | Any paid animation library |
| **Hosting** | Vercel free tier | Vercel Pro, AWS, etc. |
| **IDE** | Windsurf / VS Code | WebStorm, paid IDEs |
| **AI Coding Help** | Cascade (Windsurf) / Claude Free | GPT-4 paid subscription |

### Development Tools (All Free)
- **Node.js** - Free runtime
- **npm** - Free package manager
- **Prisma** - Free ORM
- **TypeScript** - Free language
- **Git** - Free version control
- **GitHub** - Free repos (public or private)

---

## Draft Messages for Agents

### Message 1: Initial Assignment (Frontend)

```
Build the ChartSnap AI frontend - 100% FREE stack.

PROJECT: /Users/kaleb/CascadeProjects/chartsnap-ai

READ FIRST:
- docs/prd.md (Section 2.2: 100% Free Stack)
- tasks/chartsnap-tasks-frontend.md

FREE RESOURCES YOU'RE USING:
✓ Next.js 14 (free, open source)
✓ Tailwind CSS (free)
✓ shadcn/ui components (free)
✓ Framer Motion (free)
✓ React Hook Form + Zod (free)

NO PAID SERVICES:
× No Supabase
× No Firebase
× No Auth0
× No API keys needed for frontend

THEME: Liquid Glass Dark (CSS already in app/globals.css)

Build in this order:
1. /login page
2. /analyze page (protected)
3. / landing page
4. /contact page

Start now. Questions?
```

### Message 2: Initial Assignment (Backend)

```
Build the ChartSnap AI backend - 100% FREE stack.

PROJECT: /Users/kaleb/CascadeProjects/chartsnap-ai

READ FIRST:
- docs/prd.md (Section 2.2: 100% Free Stack)
- tasks/chartsnap-tasks-backend.md

FREE RESOURCES YOU'RE USING:
✓ SQLite database (local file, zero cost)
✓ Prisma ORM (free)
✓ bcrypt (free)
✓ jsonwebtoken (free)
✓ Next.js API Routes (free)
✓ MOCK_AI mode (no API costs for development)

NO PAID SERVICES:
× NO Supabase (use existing SQLite)
× NO Firebase (custom JWT only)
× NO Auth0 (custom JWT only)
× NO S3/Cloudinary (local uploads/ folder)
× NO OpenAI API key needed (MOCK_AI=true works without it)

DATABASE ALREADY SET UP:
- Location: prisma/dev.db
- Schema: prisma/schema.prisma
- Tables: User, Analysis, ContactMessage

Build in this order:
1. lib/prisma.ts
2. lib/auth.ts
3. lib/ai.ts (with MOCK mode)
4. API routes: register, login, logout, me, analyze, contact

Start now. Questions?
```

### Message 3: If Backend Agent Asks for Supabase

```
NO Supabase. Use the EXISTING SQLite database.

The database is ALREADY configured:
- File: prisma/dev.db
- Schema: prisma/schema.prisma
- Run: npx prisma studio (to see it)

This is a 100% free project. SQLite costs $0.
Supabase would cost $0-25/month.

Use SQLite as specified in the docs.
```

### Message 4: If Backend Agent Asks for OpenAI API Key

```
NO API key needed. Use MOCK_AI mode.

In .env.local:
MOCK_AI="true"

This returns random valid responses:
{ decision: "Buy" | "Sell" | "Nothing", reason: string }

For lib/ai.ts:
if (!process.env.HF_API_KEY || process.env.MOCK_AI === "true") {
  return mockAnalysis(); // returns random Buy/Sell/Nothing
}

Development is FREE. No API costs.
Only add real Hugging Face key later if you want production AI (free tier available).
```

### Message 5: If Frontend Agent Asks for Paid UI Library

```
Use the FREE resources already installed:

✓ shadcn/ui components (already set up)
✓ Tailwind CSS (already configured)
✓ Framer Motion (already installed)
✓ Lucide React icons (already installed)

NO paid UI libraries:
× No Material UI Pro
× No Chakra UI Pro
× No Ant Design Pro
× No Tailwind UI paid components

The Liquid Glass theme CSS is in app/globals.css.
Use those classes: .glass, .btn-gradient, .input-glass, etc.
```

### Message 6: Progress Check (Day 1)

```
Progress check - what have you built so far?

Frontend: Show me /login page
Backend: Show me lib/auth.ts

Remember: 100% free stack only.
If you're trying to use any paid service, STOP and ask first.

Free checklist:
✓ SQLite database (not Supabase)
✓ Custom JWT (not Auth0)
✓ Local storage (not S3)
✓ MOCK_AI mode (no API key)
```

### Message 7: Integration Phase

```
Integration time! Test the full flow.

FREE testing (no costs):
1. Register at /login
2. Login
3. Upload any image at /analyze
4. Get MOCK_AI result (Buy/Sell/Nothing)

This costs $0. MOCK_AI mode works without any API keys.

Report any issues:
- API not connecting
- CORS errors
- JSON format mismatches
```

### Message 8: Before Deployment

```
Pre-deployment check - verify everything is free:

NO paid services in code:
× No hardcoded API keys
× No paid database connections
× No paid auth services
× No paid storage services

FREE stack verified:
✓ SQLite database file
✓ Custom JWT auth
✓ Local file storage
✓ MOCK_AI or optional real AI
✓ Vercel free tier ready

Deployment will cost $0 on Vercel free tier.
```

---

## Agent Reminders During Development

### Daily Reminders (Copy-Paste)

**Morning reminder:**
```
Reminder: 100% free stack today.

Check what you're building:
- Database: SQLite (local file)
- Auth: Custom JWT (no third-party)
- Storage: Local uploads/ folder
- AI: MOCK mode (no API costs)

Any paid service requests? Ask first.
```

**Evening check:**
```
End of day check - did you use any paid services?

Expected (free):
- SQLite ✓
- Custom JWT ✓
- Local storage ✓
- MOCK_AI ✓

Not allowed (paid):
- Supabase ✗
- Auth0 ✗
- Firebase ✗
- S3/Cloudinary ✗
- Required API key ✗

Report your progress and any cost concerns.
```

---

## Cost Breakdown Summary

| Item | Cost | Notes |
|------|------|-------|
| Development | $0 | MOCK_AI mode, SQLite, local storage |
| Testing | $0 | Unlimited uploads with MOCK_AI |
| Database | $0 | SQLite file (no server) |
| Auth | $0 | Custom JWT implementation |
| File Storage | $0 | Local filesystem |
| Frontend Tools | $0 | Next.js, Tailwind, shadcn, Framer Motion |
| Backend Tools | $0 | Prisma, bcrypt, jsonwebtoken |
| Hosting (Vercel) | $0 | Free tier |
| AI Help (Cascade) | $0 | Windsurf AI |
| **Total MVP** | **$0** | Completely free |

**Optional future cost:**
- Real Hugging Face API: Free tier (~1000 requests/day) or paid tier only if you add it later
- Vercel paid: Only if you exceed free tier limits (unlikely for MVP)

---

## Quick Reference: Free vs Not Free

### ✅ FREE (Use These)
- SQLite
- Custom JWT auth
- Local file storage
- MOCK_AI mode
- Next.js
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Prisma
- bcrypt
- jsonwebtoken
- Vercel free tier

### ❌ NOT FREE (Don't Use)
- Supabase
- Firebase (auth, storage, database)
- Auth0
- Clerk
- AWS S3
- Cloudinary
- PlanetScale
- MongoDB Atlas (paid tier)
- OpenAI API (use Hugging Face free tier instead)
- Any "Pro" UI library

---

## If Agents Ask About Costs

### "What's the database cost?"
```
$0. SQLite is a local file. No server, no hosting fees.
```

### "What's the auth cost?"
```
$0. Custom JWT implementation. No Auth0/Firebase fees.
```

### "What's the storage cost?"
```
$0. Images saved to uploads/ folder locally. No S3/Cloudinary.
```

### "What's the AI cost?"
```
$0 for development. MOCK_AI mode works without API key.
Free tier available with Hugging Face (~1000 requests/day) if you add real AI later.
```

### "What's the hosting cost?"
```
$0 on Vercel free tier. Only pay if you exceed limits (rare for MVP).
```

---

## Final Free Stack Verification

Before declaring project complete, verify:

```bash
# Check no paid services in package.json
grep -E "(supabase|firebase|auth0|aws-sdk|@clerk|stripe)" package.json
# Should return nothing

# Check .env.local has MOCK_AI
grep MOCK_AI .env.local
# Should show MOCK_AI="true"

# Check database is SQLite
grep -r "sqlite" prisma/schema.prisma
# Should show provider = "sqlite"

# Check no API keys committed
grep -r "sk-" . --include="*.ts" --include="*.tsx" --include="*.js"
# Should return nothing (or only in .env files)
```

All checks pass = 100% free stack confirmed.
