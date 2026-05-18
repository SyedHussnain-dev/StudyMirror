"use client";

import { useState } from "react";

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

  // Send message to AI
  const sendMessage = async (content: string) => {
    const updatedMessages = [
      ...messages,
      { role: "user", content } as Message,
    ];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          mode,
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setMessages(finalMessages);

      if (data.evaluationReady) {
        setEvaluationReady(true);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger evaluation
  const getEvaluation = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          mode,
          messages,
        }),
      });

      const data = await res.json();
      setEvaluation(data);

      return data;
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset session
  const reset = () => {
    setMessages([]);
    setEvaluation(null);
    setEvaluationReady(false);
  };

  return {
    messages,
    loading,
    evaluationReady,
    evaluation,
    sendMessage,
    getEvaluation,
    reset,
  };
}
