// OpenRouter AI client — drop-in replacement for the old Gemini SDK setup

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// Primary + fallback models (tried in order)
export const modelNames = [
  process.env.MODEL_NAME || "openrouter/free",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterChoice {
  message: { role: string; content: string };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  error?: { message: string; code?: number };
}

/**
 * Call OpenRouter chat completions API for a given model.
 * Throws on HTTP errors so the caller can retry/fallback.
 */
export async function generateContent(
  modelName: string,
  messages: AIMessage[]
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment variables");
  }

  const res = await fetch(OPENROUTER_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "StudyMirror",
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    const err: any = new Error(
      `OpenRouter ${res.status}: ${errorBody}`
    );
    err.status = res.status;
    throw err;
  }

  const data: OpenRouterResponse = await res.json();

  if (data.error) {
    const err: any = new Error(data.error.message);
    err.status = data.error.code || 500;
    throw err;
  }

  return data.choices?.[0]?.message?.content?.trim() || "";
}

/**
 * Try generating with exponential backoff on 429s.
 */
export async function generateWithRetry(
  modelName: string,
  messages: AIMessage[],
  maxRetries = 2
): Promise<string> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await generateContent(modelName, messages);
    } catch (err: any) {
      const status = err?.status;
      if (status === 429 && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 2000;
        console.log(`Rate limited on ${modelName}, retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

/**
 * Try all fallback models in order until one succeeds.
 */
export async function generateWithFallback(
  messages: AIMessage[]
): Promise<string> {
  let lastError: unknown = null;

  for (const modelName of modelNames) {
    try {
      const text = await generateWithRetry(modelName, messages);
      if (text.trim()) return text;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err.message || err);
    }
  }

  // Throw the last error so callers can inspect it
  throw lastError || new Error("All models failed");
}
