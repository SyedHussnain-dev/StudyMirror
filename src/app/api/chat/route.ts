import { NextResponse } from "next/server";
import { generateWithFallback, type AIMessage } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompts";
import type { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { topic, mode, messages } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Missing topic", errorType: "validation" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(topic, mode);

    // Build OpenRouter-compatible message array
    const aiMessages: AIMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    if (!messages || messages.length === 0) {
      // First turn — ask the AI to generate an opening question
      aiMessages.push({
        role: "user",
        content:
          "I just joined the interview. Generate your very first short question to ask me to explain the concept. Respond ONLY as StudyMirror interviewer.",
      });
    } else {
      // Append conversation history
      for (const m of messages) {
        aiMessages.push({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        });
      }
    }

    let text: string;

    try {
      text = await generateWithFallback(aiMessages);
    } catch (err: any) {
      const errMsg = err?.message || "";
      const isQuota = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("rate");

      return NextResponse.json(
        {
          error: isQuota
            ? "API rate limit reached. Please wait a moment and try again."
            : "Failed to generate response",
          errorType: isQuota ? "quota" : "api_error",
          details: errMsg,
        },
        { status: isQuota ? 429 : 500 }
      );
    }

    // Trigger evaluation once the user has answered 6 times.
    const userTurnCount = (messages || []).filter((m) => m.role === "user").length;

    const evaluationReady =
      userTurnCount >= 6 ||
      text.toLowerCase().includes("evaluation") ||
      text.toLowerCase().includes("assess");

    return NextResponse.json({
      reply: text,
      evaluationReady,
    });
  } catch (err: any) {
    console.error("CHAT ERROR:", err);

    return NextResponse.json(
      {
        error: "Failed to generate response",
        errorType: "api_error",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
