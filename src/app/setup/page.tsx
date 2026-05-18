"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { InterviewMode } from "@/lib/types";
import ModeCard from "@/components/ModeCard";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const SUGGESTION_CHIPS = [
  "OOP",
  "Recursion",
  "Networking",
  "Database Normalization",
  "Calculus",
  "Photosynthesis",
  "Newton's Laws",
  "Binary Search",
];

export default function SetupPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<InterviewMode | null>(null);

  const canProceed = topic.trim().length > 0 && mode !== null;

  const handleStart = () => {
    if (!canProceed) return;
    const params = new URLSearchParams({
      topic: topic.trim(),
      mode: mode!,
    });
    router.push(`/interview?${params.toString()}`);
  };


  return (
    <main className="flex-1 min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Brain className="size-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Set Up Your Session
            </h1>
          </div>
          <p className="text-slate-400">
            Choose a topic and interview mode to begin testing your understanding.
          </p>
        </motion.div>

        {/* Topic Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-slate-300 mb-3">
            What topic do you want to explain?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Explain polymorphism..."
            className="w-full px-5 py-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all text-lg"
          />

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setTopic(chip)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 cursor-pointer ${
                  topic === chip
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Choose interview mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModeCard
              mode="beginner"
              selected={mode === "beginner"}
              onSelect={setMode}
              index={0}
            />
            <ModeCard
              mode="viva"
              selected={mode === "viva"}
              onSelect={setMode}
              index={1}
            />
            <ModeCard
              mode="strict"
              selected={mode === "strict"}
              onSelect={setMode}
              index={2}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleStart}
            disabled={!canProceed}
            className={`group flex items-center gap-2 px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-300 w-full sm:w-auto justify-center ${
              canProceed
                ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 cursor-pointer"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            <Sparkles className="size-5" />
            Start Interview
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>

        </motion.div>
      </div>
    </main>
  );
}
