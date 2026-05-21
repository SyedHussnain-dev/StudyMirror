"use client";

import { useState, useEffect, useRef } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type Mode = "beginner" | "viva" | "strict";

type Props = {
  topic: string;
  mode: Mode;
};

export function useChat({ topic, mode }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluationReady, setEvaluationReady] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const initialFetched = useRef(false);

  // Fetch the initial AI greeting when the interview starts
  useEffect(() => {
    if (!topic || initialFetched.current) return;
    initialFetched.current = true;

    const fetchGreeting = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            mode,
            messages: [], // Empty = triggers initial question
          }),
        });

        const data = await res.json();

        if (res.ok && typeof data.reply === "string" && data.reply.trim()) {
          setMessages([{ role: "assistant", content: data.reply }]);
        } else {
          const errorMsg = data.errorType === "quota"
            ? "⚠️ API quota exceeded. The API key needs to be refreshed or upgraded."
            : `Welcome! I'm StudyMirror. Let's test your understanding of "${topic}". Go ahead and explain it to me!`;

          if (data.errorType === "quota") {
            setError(errorMsg);
          }

          setMessages([{ role: "assistant", content: errorMsg }]);
        }
      } catch (err) {
        console.error("Greeting fetch error:", err);
        setMessages([
          {
            role: "assistant",
            content: `Hi! Let's explore your understanding of "${topic}". Go ahead and explain it to me!`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, [topic, mode]);

  // Send message to AI
  const sendMessage = async (content: string) => {
    const updatedMessages = [
      ...messages,
      { role: "user", content } as Message,
    ];
    const userTurnCount = updatedMessages.filter((m) => m.role === "user").length;

    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          mode,
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      let replyText: string;

      if (res.ok && typeof data.reply === "string" && data.reply.trim().length > 0) {
        replyText = data.reply;
      } else if (data.errorType === "quota") {
        replyText = "⚠️ API rate limit reached. Please wait a moment and try again.";
        setError(replyText);
      } else {
        replyText = buildFallbackReply(content);
        // Show the actual error message from the server if available, so they know why it failed on live site
        if (data.error || data.details) {
          setError(`API Error: ${data.details || data.error}. Using offline fallback.`);
        }
      }

      const aiMessage: Message = {
        role: "assistant",
        content: replyText,
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setMessages(finalMessages);

      if (userTurnCount >= 6 || (res.ok && data.evaluationReady)) {
        setEvaluationReady(true);
      }
    } catch (err) {
      console.error("Chat error:", err);

      const aiMessage: Message = {
        role: "assistant",
        content: buildFallbackReply(content),
      };

      setMessages([...updatedMessages, aiMessage]);

      if (userTurnCount >= 6) {
        setEvaluationReady(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const buildFallbackReply = (userContent: string) => {
    const cleanUserContent = userContent.trim();

    if (!cleanUserContent) {
      return `Can you explain ${topic} more clearly?`;
    }

    const modePrefix =
      mode === "strict"
        ? "At a deeper level, "
        : mode === "viva"
          ? "In exam terms, "
          : "Okay, but ";

    return `${modePrefix}you mentioned "${cleanUserContent}". Can you give one concrete example and explain why it matters for ${topic}?`;
  };

  // Trigger evaluation
  const getEvaluation = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          mode,
          messages,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.errorType === "quota"
          ? "API quota exceeded. Evaluation unavailable."
          : "Evaluation failed. Please try again.");
        return null;
      }

      setEvaluation(data);
      return data;
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset session
  const reset = () => {
    setMessages([]);
    setEvaluation(null);
    setEvaluationReady(false);
    setError(null);
    initialFetched.current = false;
  };

  return {
    messages,
    loading,
    evaluationReady,
    evaluation,
    error,
    sendMessage,
    getEvaluation,
    reset,
  };
}
