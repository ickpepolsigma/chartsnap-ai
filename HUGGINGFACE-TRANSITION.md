# Switch to Hugging Face (Free Alternative to OpenAI)

**Why Hugging Face:**
- Completely free tier available
- No credit card required
- Open source models
- No API costs like OpenAI (~$0.01/analysis)
- Privacy-friendly (models run on HF infrastructure)

---

## Backend Agent - Hugging Face Implementation

### Prompt for New Backend Agent:

```
UPDATE: Switch AI provider from OpenAI to Hugging Face.

CURRENT CODE:
- lib/ai.ts currently has OpenAI + MOCK fallback
- Need to replace with Hugging Face Inference API

HUGGING FACE SETUP (FREE):
1. Get free API token from https://huggingface.co/settings/tokens
2. No billing required for free tier
3. Use vision-language model like:
   - llava-hf/llava-1.5-7b-hf
   - or Salesforce/blip-image-captioning-base + text model

IMPLEMENTATION:
Replace lib/ai.ts with Hugging Face client:

```typescript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_KEY);

export async function analyzeImage(imagePath: string): Promise<AnalysisResult> {
  // For development without HF token, use mock
  if (!process.env.HF_API_KEY || process.env.MOCK_AI === 'true') {
    return mockAnalysis();
  }
  
  // Read image as base64
  const imageBase64 = await imageToBase64(imagePath);
  
  // Use Hugging Face vision model
  const response = await hf.imageToText({
    model: 'llava-hf/llava-1.5-7b-hf',
    data: Buffer.from(imageBase64, 'base64'),
  });
  
  // Parse response and extract decision/reason
  // Return { decision: 'Buy'|'Sell'|'Nothing', reason: string }
}
```

ENVIRONMENT VARIABLES:
```bash
# Remove old OpenAI key
# OPENAI_API_KEY="sk-..."

# Add Hugging Face (FREE)
HF_API_KEY="hf_..."  # Get from huggingface.co/settings/tokens
MOCK_AI="true"  # Still works without HF key for development
```

INSTALL DEPENDENCY:
```bash
npm install @huggingface/inference
```

FREE TIER LIMITS:
- ~1,000 requests/month free
- Perfect for development and light usage
- No credit card required

Keep MOCK_AI fallback for development without any API keys.
```

---

## Frontend Agent - Update References

### Prompt for Frontend Agent:

```
UPDATE: Change AI provider references from OpenAI to Hugging Face.

SEARCH AND REPLACE in all files:

1. docs/prd.md:
   OLD: "AI Provider: OpenAI GPT-4o Vision API"
   NEW: "AI Provider: Hugging Face Inference API (free tier)"

2. Any comments/strings mentioning OpenAI:
   OLD: "OpenAI", "GPT-4o", "ChatGPT"
   NEW: "Hugging Face", "open source AI model"

3. README or landing page copy:
   OLD: "Powered by GPT-4o Vision"
   NEW: "Powered by open source AI models via Hugging Face"

4. Component descriptions:
   OLD: "GPT-4o analyzes your chart"
   NEW: "AI vision model analyzes your chart"

NO FUNCTIONAL CHANGES - just text updates.
The API contract stays the same:
POST /api/analyze → returns { decision, reason }

Users don't care about the specific model, just that AI analyzes their chart.
```

---

## Updated .env.local Template

```bash
# Database (SQLite - free local file)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret (generate random string, 32+ characters)
JWT_SECRET="change-this-to-a-random-string-min-32-chars-long"

# AI Provider (Hugging Face - FREE tier)
# Get free token at: https://huggingface.co/settings/tokens
HF_API_KEY="hf_..."
MOCK_AI="true"  # Set "false" to use real Hugging Face API
```

---

## Free AI Options Comparison

| Provider | Cost | Setup | Privacy | Best For |
|----------|------|-------|---------|----------|
| **MOCK_AI** | $0 | None | 100% local | Development only |
| **Hugging Face** | $0-5/month | Free token | Good | Production (free tier) |
| **OpenAI** | ~$0.01/analysis | Paid API key | Cloud | Production (high volume) |

**Recommendation:**
1. **Development:** MOCK_AI mode (no keys needed)
2. **Production:** Hugging Face free tier (1K requests/month)
3. **Scale:** Only then consider OpenAI or Hugging Face Pro

---

## Quick Implementation Checklist

Backend Agent:
- [ ] npm install @huggingface/inference
- [ ] Update lib/ai.ts with HF client
- [ ] Test with HF_API_KEY
- [ ] Verify MOCK_AI still works without key
- [ ] Update .env.local template

Frontend Agent:
- [ ] Replace "OpenAI" text with "Hugging Face"
- [ ] Update landing page copy
- [ ] Update any docs/comments

You:
- [ ] Get free HF token at huggingface.co/settings/tokens
- [ ] Add to .env.local
- [ ] Test end-to-end
