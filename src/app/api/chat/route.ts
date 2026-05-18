import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { buildSystemPrompt } from "@/lib/prompts";
import type { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { topic, mode, messages } = body;

    if (!topic || !messages) {
      return NextResponse.json(
        { error: "Missing topic or messages" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(topic, mode);

    // Convert chat history into a single prompt (simpler + stable)
    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // Fix for the initial empty message array on chat start
    if (messages.length === 0) {
      const fullPrompt = `
${systemPrompt}

The user just joined the interview. 
Generate your very first short question to ask them to explain the concept.
Respond ONLY as StudyMirror interviewer:
`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return NextResponse.json({
        reply: response.text(),
        evaluationReady: false,
      });
    }

    const fullPrompt = `
${systemPrompt}

CONVERSATION SO FAR:
${conversation}

Now respond as StudyMirror interviewer:
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Simple evaluation trigger logic
    const turnCount = messages.length;

    const evaluationReady =
      turnCount >= 6 ||
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
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
