"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useChat } from "@/hooks/useChat";
import { InterviewMode, MODE_LABELS, EVALUATION_TURN_TARGET } from "@/lib/types";
import ChatInterface from "@/components/ChatInterface";
import EvaluationDashboard from "@/components/EvaluationDashboard";
import ParticleBackground from "@/components/ParticleBackground";
import {
  Brain,
  ArrowLeft,
  BarChart3,
  Loader2,
  AlertCircle,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";

function InterviewContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const mode = (searchParams.get("mode") || "beginner") as InterviewMode;
  const sessionId = searchParams.get("sessionId") || undefined;

  const {
    messages,
    loading: isLoading,
    evaluationReady,
    evaluation,
    error,
    sendMessage,
    getEvaluation: requestEvaluation,
  } = useChat({ topic, mode, sessionId });

  const turnCount = messages.filter((m) => m.role === "user").length;
  const progressPercent = Math.min((turnCount / EVALUATION_TURN_TARGET) * 100, 100);

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <ParticleBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0 border-b border-slate-800/80 bg-[#020617]/80 backdrop-blur-md z-20"
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/setup"
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800/50"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
              <Brain className="size-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="max-w-[200px] md:max-w-sm truncate">{topic}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 whitespace-nowrap">
                  {MODE_LABELS[mode]}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Turn counter with progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MessageSquare className="size-3.5" />
                <span>Turn {turnCount}/{EVALUATION_TURN_TARGET}</span>
              </div>
              <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Mobile turn counter */}
            <div className="flex sm:hidden items-center gap-1 text-xs text-slate-500">
              <Zap className="size-3" />
              <span>{turnCount}/{EVALUATION_TURN_TARGET}</span>
            </div>

            {/* Evaluate button */}
            {evaluationReady && !evaluation && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={requestEvaluation}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/20 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="hidden sm:inline">Evaluating...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="size-4" />
                    <span className="hidden sm:inline">Get Score</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 mx-auto max-w-4xl w-full px-4 pt-2 z-10"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0 relative z-10">
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
        <div className="flex-1 flex items-center justify-center min-h-screen bg-[#020617]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-slate-400"
          >
            <Loader2 className="size-5 animate-spin" />
            Loading interview...
          </motion.div>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
