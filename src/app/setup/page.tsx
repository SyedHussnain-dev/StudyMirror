"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { InterviewMode, POPULAR_TOPICS } from "@/lib/types";
import ModeCard from "@/components/ModeCard";
import { useAppStore, createSession } from "@/lib/store";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Search,
  Clock,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<InterviewMode | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentTopics, setRecentTopics] = useState<string[]>([]);

  const addSession = useAppStore((s) => s.addSession);
  const setCurrentSessionId = useAppStore((s) => s.setCurrentSessionId);
  const sessions = useAppStore((s) => s.sessions);

  useEffect(() => {
    // Get recent unique topics from session history
    const topics = [...new Set(sessions.slice(0, 10).map((s) => s.topic))];
    setRecentTopics(topics);
  }, [sessions]);

  const canProceed = topic.trim().length > 0 && mode !== null;

  const filteredTopics = POPULAR_TOPICS.filter(
    (t) =>
      topic.length > 0 &&
      t.toLowerCase().includes(topic.toLowerCase()) &&
      t.toLowerCase() !== topic.toLowerCase()
  ).slice(0, 5);

  const handleStart = () => {
    if (!canProceed) return;
    const session = createSession(topic.trim(), mode!);
    addSession(session);
    setCurrentSessionId(session.id);

    const params = new URLSearchParams({
      topic: topic.trim(),
      mode: mode!,
      sessionId: session.id,
    });
    router.push(`/interview?${params.toString()}`);
  };

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setShowSuggestions(false);
  };

  return (
    <main className="flex-1 min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-violet-600/8 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-purple-600/8 rounded-full blur-[128px] animate-float-reverse" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
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
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-slate-300 mb-3">
            What topic do you want to explain?
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-600 pointer-events-none" />
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(topic.length > 0)}
              placeholder="e.g., Explain polymorphism, React Hooks, Database Normalization..."
              className="w-full pl-12 pr-10 py-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all text-base"
            />
            {topic && (
              <button
                onClick={() => {
                  setTopic("");
                  setShowSuggestions(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Topic Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && filteredTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="px-3 py-2 text-xs text-slate-500 font-medium border-b border-slate-800/50">
                  Suggested topics
                </div>
                {filteredTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopicSelect(t)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-violet-500/10 hover:text-violet-300 transition-colors flex items-center gap-3"
                  >
                    <TrendingUp className="size-3.5 text-slate-500" />
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Topics */}
          {recentTopics.length > 0 && !showSuggestions && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Clock className="size-3.5 text-slate-600" />
              <span className="text-xs text-slate-500 mr-1">Recent:</span>
              {recentTopics.slice(0, 4).map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleTopicSelect(t)}
                  className="text-xs px-3 py-1 rounded-full bg-slate-800/60 text-slate-400 hover:bg-violet-500/10 hover:text-violet-300 transition-colors border border-slate-700/30"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Popular Topics Pills */}
          {!showSuggestions && (
            <div className="mt-4">
              <span className="text-xs text-slate-500 mb-2 block">Popular topics</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOPICS.slice(0, 8).map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopicSelect(t)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 border ${
                      topic === t
                        ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                        : "bg-slate-800/40 text-slate-400 hover:bg-slate-700/50 border-slate-700/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
