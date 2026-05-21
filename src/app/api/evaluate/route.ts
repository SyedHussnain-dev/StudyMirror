import { NextResponse } from "next/server";
import { generateWithFallback, type AIMessage } from "@/lib/ai";
import type { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { topic, messages, mode } = body;

    const conversation = (messages || [])
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const aiMessages: AIMessage[] = [
      {
        role: "system",
        content: `You are an expert evaluator for StudyMirror.
You evaluate how well a student explained a concept during an interview.

Return ONLY valid JSON matching this exact schema:
{
  "overallScore": number (0-100),
  "categories": {
    "conceptAccuracy": number (0-10),
    "depthOfExplanation": number (0-10),
    "examplesUsed": number (0-10),
    "clarityOfExplanation": number (0-10),
    "missingConceptCoverage": number (0-10)
  },
  "strengths": string[],
  "vaguePoints": string[],
  "missingConcepts": string[],
  "revisionSuggestions": string[]
}

SCORING RULES:
- Be strict but fair
- Penalize vague explanations
- Reward examples and clarity
- Identify missing core concepts
- Return ONLY the JSON object, no markdown, no explanation`,
      },
      {
        role: "user",
        content: `Evaluate this interview conversation about: ${topic}\nMode: ${mode}\n\nCONVERSATION:\n${conversation}`,
      },
    ];

    let text: string;

    try {
      text = await generateWithFallback(aiMessages);
    } catch (err: any) {
      const errMsg = err?.message || "";
      const isQuota = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("rate");

      return NextResponse.json(
        {
          error: isQuota
            ? "API rate limit reached. Please wait and try again."
            : "Evaluation failed",
          errorType: isQuota ? "quota" : "api_error",
        },
        { status: isQuota ? 429 : 500 }
      );
    }

    let json;

    try {
      // Find JSON block if wrapped in markdown
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const cleanText = jsonMatch ? jsonMatch[1] : text;
      json = JSON.parse(cleanText);
    } catch {
      // fallback if model returns messy JSON
      json = {
        overallScore: 60,
        categories: {
          conceptAccuracy: 6,
          depthOfExplanation: 6,
          examplesUsed: 5,
          clarityOfExplanation: 6,
          missingConceptCoverage: 5,
        },
        strengths: ["Explained some key ideas"],
        vaguePoints: ["Some unclear explanations"],
        missingConcepts: ["Could not parse AI output"],
        revisionSuggestions: ["Try again for better evaluation"],
      };
    }

    return NextResponse.json(json);
  } catch (err: any) {
    console.error("EVALUATION ERROR:", err);

    return NextResponse.json(
      {
        error: "Evaluation failed",
        errorType: "api_error",
      },
      { status: 500 }
    );
  }
}
