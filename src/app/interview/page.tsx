"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useChat } from "@/hooks/useChat";
import { InterviewMode, MODE_LABELS } from "@/lib/types";
import ChatInterface from "@/components/ChatInterface";
import EvaluationDashboard from "@/components/EvaluationDashboard";
import {
  Brain,
  ArrowLeft,
  BarChart3,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const EVALUATION_TURN_TARGET = 2;

function InterviewContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const mode = (searchParams.get("mode") || "beginner") as InterviewMode;

  const {
    messages,
    loading: isLoading,
    evaluationReady,
    evaluation,
    error,
    sendMessage,
    getEvaluation: requestEvaluation,
  } = useChat({ topic, mode });

  const turnCount = messages.filter((m) => m.role === "user").length;

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No topic selected</h2>
          <p className="text-slate-400 mb-6">Please go back and choose a topic first.</p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="size-4" />
            Go to Setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-20"
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/setup"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
              <Brain className="size-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white flex items-center gap-2">
                {topic}
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {MODE_LABELS[mode]}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Turn counter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MessageSquare className="size-3.5" />
              Turn {turnCount}/{EVALUATION_TURN_TARGET}
            </div>

            {/* Evaluate button */}
            {evaluationReady && !evaluation && (
              <button
                onClick={requestEvaluation}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="size-4" />
                    Get Understanding Score
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.header>



      {/* Error banner */}
      {error && (
        <div className="shrink-0 mx-auto max-w-4xl w-full px-4 pt-2">
          <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        {evaluation ? (
          /* Evaluation Dashboard */
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <EvaluationDashboard
              evaluation={evaluation}
              topic={topic}
              mode={mode}
              messages={messages}
            />
          </div>
        ) : (
          /* Chat Interface */
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            disabled={!!evaluation}
          />
        )}
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Loading interview...
          </div>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
