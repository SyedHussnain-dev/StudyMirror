"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  TOPIC_LIBRARY,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  type TopicCategory,
  type TopicDifficulty,
} from "@/lib/topics";
import GlowCard from "@/components/ui/GlowCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ParticleBackground from "@/components/ParticleBackground";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = "all" as const;

const DIFFICULTY_STYLES: Record<TopicDifficulty, string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

export default function LibraryPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TopicCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [difficulty, setDifficulty] = useState<TopicDifficulty | typeof ALL_CATEGORIES>(ALL_CATEGORIES);

  const filtered = useMemo(() => {
    return TOPIC_LIBRARY.filter((t) => {
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === ALL_CATEGORIES || t.category === category;
      const matchesDifficulty = difficulty === ALL_CATEGORIES || t.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [query, category, difficulty]);

  const handleStart = (title: string) => {
    router.push(`/setup?topic=${encodeURIComponent(title)}`);
  };

  return (
    <main className="flex-1 relative min-h-screen">
      <ParticleBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-16">
        <SectionHeader
          align="left"
          title="Topic Library"
          subtitle="Curated learning paths across programming, systems, and more."
          className="mb-10"
        />

        {/* Search & filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="size-4 text-slate-500 mr-1" />
            <button
              onClick={() => setCategory(ALL_CATEGORIES)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                category === ALL_CATEGORIES
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                  : "bg-slate-800/40 text-slate-400 border-slate-700/30 hover:border-slate-600"
              )}
            >
              All
            </button>
            {(Object.keys(CATEGORY_LABELS) as TopicCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors",
                  category === cat
                    ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                    : "bg-slate-800/40 text-slate-400 border-slate-700/30 hover:border-slate-600"
                )}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(["beginner", "intermediate", "advanced"] as TopicDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(difficulty === diff ? ALL_CATEGORIES : diff)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors",
                  difficulty === diff
                    ? DIFFICULTY_STYLES[diff]
                    : "bg-slate-800/40 text-slate-400 border-slate-700/30 hover:border-slate-600"
                )}
              >
                {DIFFICULTY_LABELS[diff]}
              </button>
            ))}
          </div>
        </div>

        {/* Topic grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <GlowCard
                accent="violet"
                className="h-full flex flex-col cursor-pointer group"
                onClick={() => handleStart(topic.title)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <BookOpen className="size-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full border",
                      DIFFICULTY_STYLES[topic.difficulty]
                    )}
                  >
                    {DIFFICULTY_LABELS[topic.difficulty]}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      ~{topic.estimatedMinutes} min
                    </span>
                    <span>{CATEGORY_LABELS[topic.category]}</span>
                  </div>
                  <ArrowRight className="size-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <GlowCard className="text-center py-12">
            <p className="text-slate-400">No topics match your filters.</p>
          </GlowCard>
        )}
      </div>
    </main>
  );
}
