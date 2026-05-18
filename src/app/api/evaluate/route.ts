import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import type { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { topic, messages, mode } = body;

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `
You are an expert evaluator for StudyMirror.

Analyze this conversation about: ${topic}

MODE: ${mode}

Return ONLY valid JSON.

SCHEMA:
{
  "overallScore": number,
  "categories": {
    "conceptAccuracy": number,
    "depthOfExplanation": number,
    "examplesUsed": number,
    "clarityOfExplanation": number,
    "missingConceptCoverage": number
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

CONVERSATION:
${conversation}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}
