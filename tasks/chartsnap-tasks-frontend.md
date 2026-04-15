# ChartSnap AI - Frontend Engineer Task Brief

## Scope
Build the Next.js 14 frontend with TypeScript, Tailwind CSS, and shadcn/ui components.

---

## Deliverables

### 1. Project Setup
```bash
npx shadcn@latest init --yes --template next --base-color zinc
cd chartsnap-ai
npx shadcn add button card input label toast skeleton badge
npm install zod react-hook-form @hookform/resolvers
```

### 2. Required Pages

#### `/app/page.tsx` - Landing Page
**Sections:**
1. Hero: H1 "ChartSnap AI", subtitle, CTA button → `/analyze`
2. Features: 3 cards (Upload Any Screenshot, AI Analysis, Instant Results)
3. Examples: 3 sample analyses with mock data (decision badges + explanations)
4. Footer: Link to `/contact`

#### `/app/login/page.tsx` - Auth Page
- Toggle between Login and Register
- Form fields: email, password
- Link to switch modes
- On success: redirect to `/analyze`
- Use `AuthForm` component

#### `/app/analyze/page.tsx` - Analysis Page (Protected)
**Layout:**
```
┌─────────────────────────────────┐
│  Upload Area (centered)         │
│  [Drag & Drop or Choose File]   │
├─────────────────────────────────┤
│  Image Preview (if uploaded)    │
├─────────────────────────────────┤
│  [Analyze This Chart] Button    │
├─────────────────────────────────┤
│  Results Panel (after analysis) │
│  ┌───────────────────────────┐   │
│  │  🔵 DECISION: BUY        │   │
│  │                           │   │
│  │  Explanation text...      │   │
│  └───────────────────────────┘   │
└─────────────────────────────────┘
```

#### `/app/contact/page.tsx` - Contact Page
- Contact form: name, email, message
- FAQ accordion (3 questions)
- POST to `/api/contact` on submit

### 3. Components to Build

#### `components/auth-form.tsx`
```typescript
interface AuthFormProps {
  mode: 'login' | 'register';
  onToggle: () => void;
}
// Use react-hook-form + zod validation
// Email: z.string().email()
// Password: z.string().min(8)
```

#### `components/image-upload.tsx`
```typescript
interface ImageUploadProps {
  onUpload: (file: File) => void;
  preview: string | null;
}
// Drag-and-drop zone
// Accept: image/png, image/jpeg
// Max size: 5MB (client-side check)
// Show preview as <img>
```

#### `components/analysis-result.tsx`
```typescript
interface AnalysisResultProps {
  decision: 'Buy' | 'Sell' | 'Nothing';
  reason: string;
  isLoading: boolean;
}
// Badge colors: Buy=emerald, Sell=rose, Nothing=amber
// Skeleton while loading
```

#### `components/navbar.tsx`
- Logo → Home
- Links: Analyze, Contact
- Auth state: Show "Login" or "Logout"
- Use next-auth pattern with context

### 4. Hooks to Create

#### `hooks/use-auth.ts`
```typescript
interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
// Fetch /api/auth/me on mount
// Store auth state in React Context
```

#### `hooks/use-analysis.ts`
```typescript
interface UseAnalysisReturn {
  analyze: (file: File) => Promise<AnalysisResponse>;
  result: AnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;
}
// POST to /api/analyze with FormData
// Handle errors with toast notifications
```

### 5. Types to Define

#### `types/index.ts`
```typescript
export interface User {
  id: string;
  email: string;
}

export interface AnalysisResponse {
  decision: 'Buy' | 'Sell' | 'Nothing';
  reason: string;
  analyzedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
```

### 6. Styling Requirements

```css
/* globals.css */
:root {
  --background: 240 10% 3.9%; /* zinc-950 */
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 142 71% 45%; /* emerald-500 */
  --primary-foreground: 0 0% 98%;
}

.decision-buy { @apply bg-emerald-500/20 text-emerald-400 border-emerald-500/50; }
.decision-sell { @apply bg-rose-500/20 text-rose-400 border-rose-500/50; }
.decision-nothing { @apply bg-amber-500/20 text-amber-400 border-amber-500/50; }
```

### 7. Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "zod": "^3.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "sonner": "latest"
  }
}
```

### 8. Protected Route Pattern

```typescript
// middleware.ts or HOC pattern
import { redirect } from 'next/navigation';

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser(); // server-side check
  if (!user) redirect('/login');
  return <>{children}</>;
}
```

### 9. Testing Checklist

- [ ] Login form validates email format
- [ ] Login form shows error on invalid credentials
- [ ] Image upload rejects non-image files
- [ ] Image upload shows preview after selection
- [ ] Analyze button shows loading state
- [ ] Result displays with correct color-coded badge
- [ ] Mobile layout works (test at 375px width)
- [ ] Dark mode is default

---

## Integration Points

| Your Output | Backend Expects |
|-------------|-----------------|
| `POST /api/auth/login` | `{ email, password }` |
| `POST /api/auth/register` | `{ email, password }` |
| `POST /api/analyze` | `FormData: { image: File }` |
| `POST /api/contact` | `{ name, email, message }` |

---

## Time Estimate: 2-3 days

Start with auth pages, then build the analyze page with upload + results display.
