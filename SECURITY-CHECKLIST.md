# Security Checklist - ChartSnap AI

**DO THIS AFTER** frontend and backend are complete and basic integration works.

These are hardening tasks before deployment, not during initial development.

---

## When to Run Security Checks

**Timing:** After both agents finish AND basic integration test passes

**Order:**
1. ✅ Frontend complete
2. ✅ Backend complete  
3. ✅ Integration test works (register → login → upload → see result)
4. ⏳ **NOW RUN SECURITY CHECKS** ← You are here
5. Deploy

---

## Security Prompts to Send to AI Agents

### Prompt 1: Rate Limiting
**Send to:** Backend Agent

```
Add rate limiting to all API endpoints.

REQUIREMENTS:
- Login routes: max 5 attempts per 15 minutes per IP
- Register routes: max 3 attempts per hour per IP
- Analyze endpoint: max 10 requests per minute per user
- Contact form: max 5 submissions per hour per IP

Use a simple in-memory store or Redis if available.
Return 429 status with "Too many requests, try again later" message.

Implement this in lib/rate-limit.ts and apply to all API routes.
```

---

### Prompt 2: Scan for Hardcoded Secrets
**Send to:** Both Agents

```
SECURITY AUDIT: Scan entire codebase for hardcoded secrets.

CHECK FOR:
- API keys (sk-..., pk_..., etc.)
- JWT secrets in code
- Database passwords
- Third-party service tokens
- Test credentials

FILES TO CHECK:
- All .ts, .tsx files
- All .js files
- Any config files
- Any test files

REPORT:
List every file with hardcoded secrets and the line number.
```

---

### Prompt 3: Environment Variables
**Send to:** Backend Agent

```
Move all sensitive data to environment variables.

CHECK:
- JWT_SECRET - must be in .env.local, never in code
- DATABASE_URL - use env var
- Any API keys - use env vars
- No secrets in frontend code (frontend can't access env vars anyway)

VERIFY:
- .env.local is in .gitignore
- No secrets committed to git
- All secrets accessed via process.env.VAR_NAME

SHOW ME:
- Your .env.local (sanitized)
- How each secret is accessed in code
```

---

### Prompt 4: Input Sanitization
**Send to:** Backend Agent

```
Sanitize all user inputs - reject oversized or malformed data.

ENDPOINTS TO SECURE:
POST /api/auth/register
  - email: validate format, max 255 chars
  - password: min 8, max 128 chars

POST /api/analyze
  - image: max 5MB, only PNG/JPEG
  - reject if not image file type

POST /api/contact
  - name: max 100 chars, sanitize HTML
  - email: validate format
  - message: max 2000 chars, sanitize HTML

USE:
- Zod schemas for validation (already installed)
- Return 400 with specific error messages
```

---

### Prompt 5: Full Security Audit
**Send to:** Backend Agent (main) + Frontend Agent (for XSS check)

```
RUN FULL SECURITY AUDIT

BACKEND CHECKS:
- [ ] Rate limiting implemented
- [ ] No hardcoded secrets
- [ ] All inputs sanitized
- [ ] JWT secure (HTTP-only, SameSite, Secure in production)
- [ ] File upload validation (type, size, extension)
- [ ] SQL injection prevention (Prisma handles this, verify)
- [ ] CORS configured for production
- [ ] Error messages don't leak stack traces

FRONTEND CHECKS:
- [ ] No API keys in frontend code
- [ ] XSS prevention (sanitize user content)
- [ ] Secure cookie handling
- [ ] No sensitive data in localStorage

REPORT:
List any remaining vulnerabilities with severity (High/Medium/Low).
```

---

## Quick Security Verification Commands

After agents implement security fixes, run these:

```bash
# 1. Check .gitignore has .env files
cat .gitignore | grep env

# 2. Search for hardcoded secrets in code
grep -r "sk-" . --include="*.ts" --include="*.tsx" --include="*.js"
grep -r "JWT_SECRET" . --include="*.ts" --include="*.tsx"

# 3. Verify no secrets in git history
git log --all --source --remotes --full-history -S "sk-"

# 4. Test rate limiting (should get 429 after 5 attempts)
for i in {1..6}; do curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done

# 5. Test file upload size limit
curl -X POST http://localhost:3000/api/analyze -F "image=@/path/to/6mb-image.jpg"
# Should return 400 "File too large"
```

---

## Security Checklist Summary

| Check | Agent | Status |
|-------|-------|--------|
| Rate limiting | Backend | ⬜ Pending |
| No hardcoded secrets | Both | ⬜ Pending |
| Env vars configured | Backend | ⬜ Pending |
| Input sanitization | Backend | ⬜ Pending |
| Full security audit | Both | ⬜ Pending |

---

## Reminder Schedule

**After integration test passes, send these prompts in order:**

1. **Day 3 evening** - Send Prompt 1 (Rate limiting)
2. **Day 4 morning** - Send Prompt 2 (Scan secrets) 
3. **Day 4 afternoon** - Send Prompt 3 (Env vars)
4. **Day 4 evening** - Send Prompt 4 (Input sanitization)
5. **Day 5 morning** - Send Prompt 5 (Full audit)
6. **Day 5 afternoon** - Run verification commands
7. **Day 5 evening** - Deploy if all clear

---

## Pre-Deployment Final Check

Before going live:

- [ ] All security prompts completed
- [ ] No hardcoded secrets in codebase
- [ ] .env.local in .gitignore
- [ ] Rate limiting active
- [ ] Input validation strict
- [ ] HTTPS configured for cookies (Secure flag)
- [ ] CORS limited to production domain

**Estimated time for security hardening:** 1 day

---

## Current Status

**Date:** ___________

**MVP Complete:** ⬜ Yes / ⬜ No

**Integration Test:** ⬜ Pass / ⬜ Fail

**Ready for Security Hardening:** ⬜ Yes / ⬜ No

**Next Action:** _______________________________
