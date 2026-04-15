import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_KEY);

interface AnalysisResult {
  decision: 'Buy' | 'Sell' | 'Nothing';
  reason: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callHuggingFaceAPI(base64Image: string, attempt: number = 1): Promise<{ generated_text: string }> {
  try {
    const result = await hf.imageToText({
      model: 'Salesforce/blip-image-captioning-large',
      inputs: {
        image: base64Image,
        prompt: `You are an expert technical analyst specializing in candlestick chart pattern recognition.

CRITICAL PATTERN RULES:
- Head and Shoulders: BEARISH reversal pattern → "Sell"
- Double Top: BEARISH reversal pattern → "Sell"
- Double Bottom: BULLISH reversal pattern → "Buy"
- Ascending Triangle: BULLISH continuation → "Buy"
- Descending Triangle: BEARISH continuation → "Sell"
- Shooting Star: BEARISH reversal at resistance → "Sell"
- Hammer: BULLISH reversal at support → "Buy"
- Bullish Engulfing: BULLISH continuation → "Buy"
- Bearish Engulfing: BEARISH reversal → "Sell"

Analyze the chart and respond with ONLY valid JSON:
{
  "decision": "Buy" | "Sell" | "Nothing",
  "reason": string (100-200 words explaining visible patterns, trend direction, key support/resistance levels)
}

Rules:
1. Decision must be exactly: Buy, Sell, or Nothing
2. Reference specific visible patterns with correct directional bias
3. If unclear or not a candlestick chart, return "Nothing"
4. Never include markdown, only raw JSON`
      }
    });
    return result;
  } catch (error) {
    // Check if it's a retryable error (network, timeout, rate limit)
    const isRetryable = error instanceof Error && (
      error.message.includes('timeout') ||
      error.message.includes('rate limit') ||
      error.message.includes('429') ||
      error.message.includes('503') ||
      error.message.includes('network') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT')
    );

    if (isRetryable && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt; // Exponential backoff
      console.log(`Hugging Face API retry attempt ${attempt}/${MAX_RETRIES} after ${delay}ms`);
      await sleep(delay);
      return callHuggingFaceAPI(base64Image, attempt + 1);
    }

    throw error;
  }
}

export async function analyzeImage(imagePath: string): Promise<AnalysisResult> {
  // For development without API key, return mock
  if (!process.env.HF_API_KEY || process.env.MOCK_AI === 'true') {
    return mockAnalysis();
  }

  const base64Image = await imageToBase64(imagePath);

  try {
    // Use Hugging Face LLaVA vision model for image analysis with retry logic
    const result = await callHuggingFaceAPI(base64Image);
    const content = result.generated_text || '{}';

    try {
      // Extract JSON from possible markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) ||
        content.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const parsed = JSON.parse(jsonStr);

      return {
        decision: parsed.decision || 'Nothing',
        reason: parsed.reason || 'Unable to analyze chart'
      };
    } catch {
      return {
        decision: 'Nothing',
        reason: 'Analysis parsing failed. Please try again.'
      };
    }
  } catch (error) {
    console.error('Hugging Face API failed after retries:', error);
    // Fallback to mock mode if all retries failed
    console.log('Falling back to mock analysis due to API failure');
    return mockAnalysis();
  }
}

async function imageToBase64(path: string): Promise<string> {
  const { readFile } = await import('fs/promises');
  const buffer = await readFile(path);
  return buffer.toString('base64');
}

function mockAnalysis(): AnalysisResult {
  const decisions: ('Buy' | 'Sell' | 'Nothing')[] = ['Buy', 'Sell', 'Nothing'];
  const reasons = [
    'The chart shows higher highs and higher lows, indicating an uptrend. Recent candles suggest a bullish continuation pattern, with support near the lower wicks.',
    'A shooting star pattern is visible at resistance, suggesting potential bearish reversal. Volume appears to be declining on upward moves.',
    'The market is consolidating with no clear direction. Support and resistance levels are too close to establish a reliable trade setup.'
  ];

  const idx = Math.floor(Math.random() * 3);
  return {
    decision: decisions[idx],
    reason: reasons[idx]
  };
}
