"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Message, InterviewMode, Evaluation } from "@/lib/types";
import { EVALUATION_TURN_TARGET } from "@/lib/types";
import { useAppStore } from "@/lib/store";

export type ChatMessage = Message;

type Mode = InterviewMode;

type Props = {
  topic: string;
  mode: Mode;
  sessionId?: string;
};

export function useChat({ topic, mode, sessionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluationReady, setEvaluationReady] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const initialFetched = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateSession = useAppStore((s) => s.updateSession);
  const recordStudySession = useAppStore((s) => s.recordStudySession);

  const getApiKey = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("openrouter_api_key") || "";
    }
    return "";
  };

  // Persist messages to session store
  const persistMessages = useCallback((msgs: ChatMessage[], evalData?: Evaluation | null) => {
    if (sessionId) {
      const userCount = msgs.filter((m) => m.role === "user").length;
      updateSession(sessionId, {
        messages: msgs,
        messageCount: userCount,
        ...(evalData !== undefined ? { evaluation: evalData } : {}),
        ...(evalData ? { completedAt: Date.now() } : {}),
      });
    }
  }, [sessionId, updateSession]);

  // Fetch the initial AI greeting when the interview starts
  useEffect(() => {
    if (!topic || initialFetched.current) return;
    initialFetched.current = true;

    // Record study session for streak tracking
    recordStudySession();

    const fetchGreeting = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = getApiKey();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiKey) headers["X-Api-Key"] = apiKey;

        const res = await fetch("/api/chat", {
          method: "POST",
          cache: "no-store",
          headers,
          body: JSON.stringify({
            topic,
            mode,
            messages: [],
          }),
        });

        const data = await res.json();

        if (res.ok && typeof data.reply === "string" && data.reply.trim()) {
          const newMessages = [{ role: "assistant" as const, content: data.reply, timestamp: Date.now() }];
          setMessages(newMessages);
          persistMessages(newMessages);
        } else {
          const errorMsg = data.errorType === "quota"
            ? "API quota exceeded. The API key needs to be refreshed or upgraded."
            : `Welcome! I'm StudyMirror. Let's test your understanding of "${topic}". Go ahead and explain it to me!`;

          if (data.errorType === "quota") {
            setError(errorMsg);
          }

          const newMessages = [{ role: "assistant" as const, content: errorMsg, timestamp: Date.now() }];
          setMessages(newMessages);
          persistMessages(newMessages);
        }
      } catch (err) {
        console.error("Greeting fetch error:", err);
        setMessages([
          {
            role: "assistant",
            content: `Hi! Let's explore your understanding of "${topic}". Go ahead and explain it to me!`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, [topic, mode, recordStudySession, persistMessages]);

  // Send message to AI
  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content, timestamp: Date.now() };
    const updatedMessages = [...messages, userMessage];
    const userTurnCount = updatedMessages.filter((m) => m.role === "user").length;

    setMessages(updatedMessages);
    persistMessages(updatedMessages);
    setLoading(true);
    setError(null);
    setStreamingText("");

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const apiKey = getApiKey();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["X-Api-Key"] = apiKey;

      const res = await fetch("/api/chat", {
        method: "POST",
        cache: "no-store",
        headers,
        body: JSON.stringify({
          topic,
          mode,
          messages: updatedMessages,
        }),
        signal: abortController.signal,
      });

      const data = await res.json();

      let replyText: string;

      if (res.ok && typeof data.reply === "string" && data.reply.trim().length > 0) {
        replyText = data.reply;
      } else if (data.errorType === "quota") {
        replyText = "API rate limit reached. Please wait a moment and try again.";
        setError(replyText);
      } else {
        replyText = buildFallbackReply(content);
        if (data.error || data.details) {
          setError(`API Error: ${data.details || data.error}. Using offline fallback.`);
        }
      }

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: replyText,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setMessages(finalMessages);
      persistMessages(finalMessages);

      if (userTurnCount >= EVALUATION_TURN_TARGET || (res.ok && data.evaluationReady)) {
        setEvaluationReady(true);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;

      console.error("Chat error:", err);

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: buildFallbackReply(content),
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      persistMessages(finalMessages);

      if (userTurnCount >= EVALUATION_TURN_TARGET) {
        setEvaluationReady(true);
      }
    } finally {
      setLoading(false);
      setStreamingText("");
      abortControllerRef.current = null;
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
      const apiKey = getApiKey();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["X-Api-Key"] = apiKey;

      const res = await fetch("/api/evaluate", {
        method: "POST",
        cache: "no-store",
        headers,
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
      persistMessages(messages, data);
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
    setStreamingText("");
    initialFetched.current = false;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    loading,
    evaluationReady,
    evaluation,
    error,
    streamingText,
    sendMessage,
    getEvaluation,
    reset,
  };
}
