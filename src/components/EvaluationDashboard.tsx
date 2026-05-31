"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import type { Evaluation, InterviewMode, Message } from "@/lib/types";
import { MODE_LABELS, CATEGORY_LABELS } from "@/lib/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  RotateCcw,
  Trophy,
  MessageSquare,
  Code2,
  AlertCircle,
  Share2,
  Download,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface EvaluationDashboardProps {
  evaluation: Evaluation;
  topic: string;
  mode: InterviewMode;
  messages: Message[];
}

function AnimatedScore({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const scoreRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      scoreRef.current = Math.round(eased * score);
      setDisplayScore(scoreRef.current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const colorClass =
    score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";

  const bgColorClass =
    score >= 80 ? "stroke-emerald-500" : score >= 60 ? "stroke-amber-500" : "stroke-rose-500";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className="relative w-48 h-48 mx-auto"
    >
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-800"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={bgColorClass}
          stroke="currentColor"
          initial={{ strokeDasharray: "0 327" }}
          animate={{ strokeDasharray: `${(score / 100) * 327} 327` }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-5xl font-bold ${colorClass}`}
        >
          {displayScore}%
        </motion.span>
        <span className="text-xs text-slate-400 mt-1">Understanding</span>
      </div>
    </motion.div>
  );
}

function CategoryBar({
  label,
  score,
  maxScore,
  index,
}: {
  label: string;
  score: number;
  maxScore: number;
  index: number;
}) {
  const percentage = (score / maxScore) * 100;
  const barColor =
    percentage >= 80
      ? "from-emerald-500 to-emerald-400"
      : percentage >= 60
        ? "from-amber-500 to-amber-400"
        : "from-rose-500 to-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
      className="space-y-1.5"
    >
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 font-mono">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
        />
      </div>
    </motion.div>
  );
}

export default function EvaluationDashboard({
  evaluation,
  topic,
  mode,
  messages,
}: EvaluationDashboardProps) {
  const userMessages = messages.filter((m) => m.role === "user").length;
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const confettiRef = useRef<HTMLDivElement>(null);

  // Trigger confetti on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamic import for confetti
    import("canvas-confetti").then((confetti) => {
      const score = evaluation.overallScore;
      const colors =
        score >= 80
          ? ["#10b981", "#34d399", "#6ee7b7"]
          : score >= 60
            ? ["#f59e0b", "#fbbf24", "#fcd34d"]
            : ["#f43f5e", "#fb7185", "#fda4af"];

      // First burst
      confetti.default({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        disableForReducedMotion: true,
      });

      // Second burst after delay
      setTimeout(() => {
        confetti.default({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.7, x: 0.3 },
          colors,
          disableForReducedMotion: true,
        });
      }, 300);

      setTimeout(() => {
        confetti.default({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.7, x: 0.7 },
          colors,
          disableForReducedMotion: true,
        });
      }, 500);
    });
  }, [evaluation.overallScore]);

  const handleShare = useCallback(async () => {
    const shareText = `I scored ${evaluation.overallScore}% on "${topic}" using StudyMirror! ${evaluation.overallScore >= 80 ? "Nailed it!" : evaluation.overallScore >= 60 ? "Good effort!" : "Back to the books!"}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "StudyMirror Score",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      }
    } catch {
      // Share cancelled or failed
    }
  }, [evaluation.overallScore, topic]);

  const handleExport = useCallback(() => {
    const data = {
      topic,
      mode: MODE_LABELS[mode],
      score: evaluation.overallScore,
      categories: evaluation.categories,
      strengths: evaluation.strengths,
      vaguePoints: evaluation.vaguePoints,
      missingConcepts: evaluation.missingConcepts,
      revisionSuggestions: evaluation.revisionSuggestions,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studymirror-${topic.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [evaluation, topic, mode]);

  const scoreLabel =
    evaluation.overallScore >= 80
      ? "Excellent"
      : evaluation.overallScore >= 60
        ? "Good"
        : "Needs Work";

  const scoreColor =
    evaluation.overallScore >= 80
      ? "text-emerald-400"
      : evaluation.overallScore >= 60
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto"
    >
      {/* Confetti container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4"
        >
          <Trophy className="size-4" />
          Understanding Report
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Your Evaluation</h2>
        <p className={`text-sm font-medium mt-1 ${scoreColor}`}>{scoreLabel}</p>
      </div>

      {/* Session Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: "Topic", value: topic, icon: MessageSquare },
          { label: "Mode", value: MODE_LABELS[mode], icon: AlertCircle },
          { label: "Questions Asked", value: `${userMessages}`, icon: Code2 },
          { label: "Missing Concepts", value: `${evaluation.missingConcepts.length}`, icon: AlertTriangle },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-3 text-center"
          >
            <item.icon className="size-4 text-slate-500 mx-auto mb-1" />
            <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
            <p className="text-sm font-medium text-slate-200 truncate">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Score Circle */}
      <AnimatedScore score={evaluation.overallScore} />

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="size-4 text-violet-400" />
          Category Breakdown
        </h3>
        {Object.entries(evaluation.categories).map(([key, score], i) => (
          <CategoryBar
            key={key}
            label={CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS]}
            score={score}
            maxScore={10}
            index={i}
          />
        ))}
      </motion.div>

      {/* Strengths */}
      {evaluation.strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-emerald-500/5 rounded-2xl border border-emerald-500/20 p-5"
        >
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            What You Explained Well
          </h3>
          <ul className="space-y-2">
            {evaluation.strengths.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Vague Points */}
      {evaluation.vaguePoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-5"
        >
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4" />
            What Was Vague
          </h3>
          <ul className="space-y-2">
            {evaluation.vaguePoints.map((v, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                {v}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Missing Concepts */}
      {evaluation.missingConcepts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-rose-500/5 rounded-2xl border border-rose-500/20 p-5"
        >
          <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <XCircle className="size-4" />
            Missing Concepts
          </h3>
          <ul className="space-y-2">
            {evaluation.missingConcepts.map((m, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                {m}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Revision Suggestions */}
      {evaluation.revisionSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-violet-500/5 rounded-2xl border border-violet-500/20 p-5"
        >
          <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lightbulb className="size-4" />
            What To Revise
          </h3>
          <div className="space-y-3">
            {evaluation.revisionSuggestions.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="flex items-start gap-3 text-sm text-slate-300 bg-slate-800/40 rounded-xl p-3"
              >
                <span className="shrink-0 w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {r}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
      >
        <Link
          href="/setup"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
        >
          <RotateCcw className="size-4" />
          Try Again
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 font-medium rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50"
        >
          <Share2 className="size-4" />
          {shareStatus === "copied" ? "Copied!" : "Share Score"}
        </button>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 font-medium rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50"
        >
          <Download className="size-4" />
          Export
        </button>
      </motion.div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="text-center"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-violet-400 transition-colors"
        >
          Back to home
          <ChevronRight className="size-3" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
