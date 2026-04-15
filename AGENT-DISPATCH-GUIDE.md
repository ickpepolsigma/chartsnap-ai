# Agent Dispatch Guide - ChartSnap AI

Exactly what to say and what files to give each AI agent.

---

## Overview

You have 2 AI agents:
1. **Frontend Agent** - Builds the UI (React components, pages, styling)
2. **Backend Agent** - Builds the API (database, auth, file handling, AI integration)

Both agents work in parallel from the same project folder.

---

## Step 1: Open AI Chats

### In Windsurf:
1. Press `Cmd+B` (or `Ctrl+B`) to open secondary sidebar
2. Click `+` to add new AI chat
3. Select "Frontend Engineer" persona
4. Repeat: Click `+` → Select "Backend Engineer" persona

### In External AI (Claude/GPT):
- Open 2 separate browser tabs/conversations
- One for Frontend, one for Backend

---

## Step 2: Send to Frontend Agent

### Copy-Paste This Message:

```
Build the ChartSnap AI frontend.

PROJECT LOCATION: /Users/kaleb/CascadeProjects/chartsnap-ai

REFERENCE FILES (read these first):
1. /Users/kaleb/CascadeProjects/chartsnap-ai/docs/prd.md
2. /Users/kaleb/CascadeProjects/chartsnap-ai/tasks/chartsnap-tasks-frontend.md

CRITICAL - LIQUID GLASS THEME:
All components MUST use the CSS classes in app/globals.css:
- .gradient-bg for page backgrounds
- .glass for cards/containers  
- .glass-gradient-border for highlighted elements
- .btn-gradient for primary buttons
- .input-glass for form inputs
- .decision-buy / .decision-sell / .decision-nothing for badges
- .skeleton-glass for loading states

PAGES TO BUILD (in order):
1. /login - Auth form (login/register toggle)
2. /analyze - Protected upload page with drag-drop, preview, results
3. / - Landing page (hero, features, examples)
4. /contact - Contact form + FAQ

COMPONENTS TO BUILD:
- components/glass-card.tsx - Reusable glass container
- components/gradient-button.tsx - Primary CTA button
- components/auth-form.tsx - Login/register form
- components/image-upload.tsx - Drag-drop upload with preview
- components/analysis-result.tsx - Result display with glowing badge
- components/navbar.tsx - Glassmorphism navigation
- components/loading-state.tsx - Skeleton loader

HOOKS TO BUILD:
- hooks/use-auth.ts - Auth state management
- hooks/use-analysis.ts - API integration for analysis

API ENDPOINTS (Backend will provide these):
POST /api/auth/register
POST /api/auth/login  
POST /api/auth/logout
GET /api/auth/me
POST /api/analyze (FormData with image)
POST /api/contact

DEPENDENCIES ALREADY INSTALLED:
- framer-motion (for animations)
- react-hook-form + zod (for validation)
- shadcn/ui components

Start with /login page. Use Framer Motion for page transitions and hover effects.

Message me when you have questions or when /login is complete.
```

### Files to Share (if your AI supports file attachments):
- `docs/prd.md`
- `tasks/chartsnap-tasks-frontend.md`
- `app/globals.css` (so they see the CSS classes)

---

## Step 3: Send to Backend Agent

### Copy-Paste This Message:

```
Build the ChartSnap AI backend.

PROJECT LOCATION: /Users/kaleb/CascadeProjects/chartsnap-ai

REFERENCE FILES (read these first):
1. /Users/kaleb/CascadeProjects/chartsnap-ai/docs/prd.md
2. /Users/kaleb/CascadeProjects/chartsnap-ai/tasks/chartsnap-tasks-backend.md

CRITICAL - 100% FREE STACK:
- SQLite database (already configured in prisma/schema.prisma)
- Custom JWT auth (NO Supabase, NO Firebase, NO Auth0)
- Local file storage (images saved to uploads/ folder)
- MOCK_AI mode works WITHOUT API key (returns random valid responses)

DATABASE ALREADY SET UP:
- Prisma schema at prisma/schema.prisma
- Database at prisma/dev.db
- Tables: User, Analysis, ContactMessage
- Run 'npx prisma studio' to view database

API ROUTES TO BUILD (in order):
1. lib/prisma.ts - Prisma client singleton
2. lib/auth.ts - bcrypt, JWT, cookie helpers
3. lib/ai.ts - AI integration with MOCK mode
4. app/api/auth/register/route.ts - Create user, set JWT cookie
5. app/api/auth/login/route.ts - Validate, set JWT cookie
6. app/api/auth/logout/route.ts - Clear cookie
7. app/api/auth/me/route.ts - Return current user
8. app/api/analyze/route.ts - Upload image, AI analysis
9. app/api/contact/route.ts - Save contact message

ENVIRONMENT (already configured in .env.local):
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="change-this-to-a-random-string-min-32-chars-long"
MOCK_AI="true"  # FREE mode - no API key needed!

TESTING:
```bash
# Register test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# The response should set an HTTP-only cookie
# MOCK_AI mode returns random Buy/Sell/Nothing without API costs
```

Start with lib/prisma.ts and lib/auth.ts. Then build auth routes. Then analyze route with file upload.

Message me when lib/auth.ts is complete or when you have questions.
```

### Files to Share (if your AI supports file attachments):
- `docs/prd.md`
- `tasks/chartsnap-tasks-backend.md`
- `prisma/schema.prisma`
- `.env.local` (show them the config)

---

## Step 4: Monitor Progress

### Day 1 Check-ins (after ~2 hours):

**Ask Frontend Agent:**
```
Show me what you've built so far. 
Is /login page working?
Are you using the Liquid Glass CSS classes from globals.css?
```

**Ask Backend Agent:**
```
Show me lib/auth.ts and the auth routes.
Can I register a test user?
Is MOCK_AI mode working without API key?
```

### Day 2 Check-ins:

**Ask Frontend Agent:**
```
Show me /analyze page with upload and results.
Does it handle loading states with skeleton-glass?
Are decision badges glowing (emerald/rose/amber)?
```

**Ask Backend Agent:**
```
Show me /api/analyze route.
Does it save uploaded images to uploads/ folder?
Does it return proper JSON with decision and reason?
```

### Day 3 - Integration:

Tell both agents:
```
Time to integrate. Frontend, make sure your API calls match the backend routes exactly.
Backend, verify your response JSON matches what frontend expects.

Test the full flow:
1. Register
2. Login  
3. Upload image
4. See AI result

Report any mismatches immediately.
```

---

## Step 5: Common Issues & Responses

### If Frontend Agent Says "I don't understand Liquid Glass":
```
Look at app/globals.css. Use these exact classes:
- <div className="gradient-bg"> for page wrapper
- <div className="glass"> for any card/container
- <button className="btn-gradient"> for primary buttons
- <input className="input-glass"> for form inputs
- <span className="decision-buy"> for the buy badge

The CSS is already written - just use the classes.
```

### If Backend Agent Says "Should I use Supabase?":
```
NO. Use the EXISTING SQLite database.
- Database is at prisma/dev.db
- Schema is in prisma/schema.prisma
- Run 'npx prisma studio' to see it

Custom JWT auth is already required in the docs.
```

### If Backend Agent Says "I need OpenAI API key":
```
NO. Use MOCK_AI mode.
- Set MOCK_AI="true" in .env.local
- lib/ai.ts should return random valid responses when MOCK_AI is true
- This is for FREE development without API costs
```

### If Frontend & Backend APIs Don't Match:
```
Both of you: Check docs/prd.md Section 2.3 for the API contract.

Frontend sends: POST /api/analyze with FormData { image: File }
Backend returns: { decision: 'Buy'|'Sell'|'Nothing', reason: string, analyzedAt: string }

Match this exactly.
```

---

## Step 6: Final Verification Checklist

When both agents say they're done, verify:

### Frontend Check:
```bash
# All these should work:
- Register form at /login
- Login form at /login
- Upload page at /analyze (protected)
- Landing page at /
- Contact page at /contact

# Visual check:
- Gradient animated background
- Glass cards with blur
- Glowing decision badges
- Smooth Framer Motion animations
```

### Backend Check:
```bash
# All these should work:
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}'
# Should return { user: { id, email } }

curl -c cookies.txt -b cookies.txt http://localhost:3000/api/auth/me
# Should return { user } when logged in

# Upload test (need to do via browser or form)
# Should save image to uploads/ and return { decision, reason, analyzedAt }
```

### Integration Check:
- Register → Login → Upload → See AI result
- Logout clears session
- Invalid credentials show error
- Large image (>5MB) shows validation error

---

## Quick Reference

| Agent | First Task | Files to Read | Key Constraint |
|-------|-----------|---------------|----------------|
| Frontend | /login page | docs/prd.md, tasks/chartsnap-tasks-frontend.md | Use globals.css classes |
| Backend | lib/auth.ts | docs/prd.md, tasks/chartsnap-tasks-backend.md | No external services |

| Checkpoint | Ask Frontend | Ask Backend |
|------------|-------------|-------------|
| Day 1 | Show /login page | Show lib/auth.ts |
| Day 2 | Show /analyze page | Show /api/analyze |
| Day 3 | Full integration test | Full API test |

---

## Success Criteria

Both agents complete when:
- [ ] User can register/login/logout
- [ ] User can upload chart image
- [ ] See mock AI result (Buy/Sell/Nothing + explanation)
- [ ] Liquid glass theme looks correct
- [ ] Works on mobile
- [ ] Zero API costs (MOCK_AI used)
