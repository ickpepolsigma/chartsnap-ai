## Agent Assignment: Frontend Engineer

### 🆓 100% FREE PROJECT - NO PAID SERVICES

**ChartSnap AI** - Web app for AI-powered candlestick chart analysis.  
**Stack Cost: $0** - All tools are free and open source.

### Free Resources You're Using
✓ Next.js 14 (free, open source)  
✓ Tailwind CSS (free)  
✓ shadcn/ui components (free)  
✓ Framer Motion (free)  
✓ React Hook Form + Zod (free)  
✓ Lucide React icons (free)

**NO paid UI libraries, NO subscription services, NO API keys needed.**

### Your Task
Build the complete Next.js 14 frontend with TypeScript, Tailwind CSS, and shadcn/ui.

### Reference Documents
- Full PRD: `chartsnap-prd.md`
- Your detailed brief: `tasks/chartsnap-tasks-frontend.md`

### Key Requirements
1. **Liquid Glass Dark Theme** - Ultra-modern glassmorphism aesthetic
   - Animated gradient background (shifting gradient orbs)
   - Glass cards: `bg-white/5 backdrop-blur-xl border-white/10`
   - Gradient border effects using pseudo-elements
   - Glowing decision badges with colored shadows
2. **Mobile-first responsive** - must work at 375px, 768px, 1440px
3. **Form validation** - Use react-hook-form + zod on all forms
4. **Loading states** - Glass shimmer skeleton, toast notifications
5. **Animations** - Framer Motion for page transitions, hover effects, button presses

### Design System (CRITICAL)
All components must follow liquid glass aesthetic from `tasks/chartsnap-tasks-frontend.md` Section 6:
- `.glass` class for all cards/containers
- `.glass-gradient-border` for highlighted elements
- `.btn-gradient` for primary CTAs with glow
- `.input-glass` for form inputs with focus effects
- `.skeleton-glass` for loading states with shimmer animation
- Animated `.gradient-bg` for page backgrounds

### Pages to Build
| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing: hero, features, examples, footer |
| `/login` | Public | Auth toggle (login ↔ register) |
| `/analyze` | Protected | Upload area, preview, analyze button, results |
| `/contact` | Public | Contact form + FAQ accordion |

### API Contracts (Backend provides these)
```
POST /api/auth/register    → { email, password } → { user: { id, email } }
POST /api/auth/login       → { email, password } → { user: { id, email } }
POST /api/auth/logout      → {} → { success: true }
GET  /api/auth/me          → Cookie auth → { user } or 401
POST /api/analyze          → FormData: { image: File } → { decision, reason, analyzedAt }
POST /api/contact          → { name, email, message } → { success: true }
```

### Critical Components
1. **`components/glass-card.tsx`** - Reusable glass container with optional gradient border
2. **`components/gradient-button.tsx`** - Primary CTA with gradient + glow effect
3. **`components/auth-form.tsx`** - Glass card with gradient border, floating labels
4. **`components/image-upload.tsx`** - Glass drop zone with animated border glow on drag
5. **`components/analysis-result.tsx`** - Glass card with glowing decision badges
6. **`components/navbar.tsx`** - Glassmorphism sticky header with blur
7. **`hooks/use-auth.ts`** - React Context for auth state
8. **`hooks/use-analysis.ts`** - Handle analyze API with loading/error states

### Animation Requirements
- Page transitions: Fade + slide up (Framer Motion)
- Card hover: Scale 1.02 + increased glow
- Button hover: Lift + intensified shadow
- Loading: Shimmer effect on skeleton
- Drag over upload: Border glow pulse animation

### Deliverables
- [ ] All 4 pages fully functional with liquid glass theme
- [ ] Protected route middleware for `/analyze`
- [ ] Components match API contracts exactly
- [ ] No TypeScript errors
- [ ] Responsive on all breakpoints
- [ ] **Framer Motion installed and configured**
- [ ] **All CSS classes from Section 6 implemented in globals.css**
- [ ] **Animated gradient background on all pages**
- [ ] **Glass cards with backdrop-blur on all containers**
- [ ] **Gradient buttons with hover lift effect**
- [ ] **Glowing decision badges (emerald/rose/amber)**

### Integration Checkpoints
Message me when:
- API response format doesn't match expectations
- Blocked on design decisions
- Ready for code review

### Time Estimate: 2-3 days

Start with `/login` page and auth context, then build `/analyze` page with upload → preview → results flow.
