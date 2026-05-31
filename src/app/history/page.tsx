"use client";

import { motion } from "motion/react";
import { useAppStore } from "@/lib/store";
import {
  Brain,
  ArrowLeft,
  Trash2,
  MessageSquare,
  Trophy,
  Clock,
  Calendar,
  TrendingUp,
  Zap,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { InterviewMode, MODE_LABELS, MODE_COLORS } from "@/lib/types";

const MODE_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDuration(startMs: number, endMs: number | null): string {
  if (!endMs) return "In progress";
  const diff = endMs - startMs;
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export default function HistoryPage() {
  const sessions = useAppStore((s) => s.sessions);
  const deleteSession = useAppStore((s) => s.deleteSession);
  const streak = useAppStore((s) => s.streak);

  const completedSessions = sessions.filter((s) => s.evaluation !== null);
  const avgScore = completedSessions.length > 0
    ? Math.round(
        completedSessions.reduce((sum, s) => sum + (s.evaluation?.overallScore || 0), 0) /
          completedSessions.length
      )
    : 0;

  return (
    <main className="flex-1 min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-16">
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
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <BarChart3 className="size-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Session History</h1>
          </div>
          <p className="text-slate-400">
            Track your learning progress and review past evaluations.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Total Sessions", value: sessions.length, icon: MessageSquare, color: "violet" },
            { label: "Completed", value: completedSessions.length, icon: Trophy, color: "emerald" },
            { label: "Avg Score", value: avgScore > 0 ? `${avgScore}%` : "—", icon: TrendingUp, color: "amber" },
            { label: "Current Streak", value: `${streak.currentStreak}d`, icon: Zap, color: "rose" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 text-center"
            >
              <stat.icon className={`size-5 mx-auto mb-2 ${
                stat.color === "violet" ? "text-violet-400" :
                stat.color === "emerald" ? "text-emerald-400" :
                stat.color === "amber" ? "text-amber-400" : "text-rose-400"
              }`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Weekly Activity Heatmap */}
        {streak.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Calendar className="size-4 text-violet-400" />
              Weekly Activity
            </h2>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-end gap-2 h-24">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - 13 + i);
                  const key = date.toISOString().split("T")[0];
                  const count = streak.weeklyActivity[key] || 0;
                  const maxCount = Math.max(...Object.values(streak.weeklyActivity), 1);
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-sm transition-all duration-300 ${
                          count > 0
                            ? "bg-violet-500/60 hover:bg-violet-500/80"
                            : "bg-slate-800/50"
                        }`}
                        style={{ height: `${Math.max(height, 8)}%` }}
                        title={`${key}: ${count} session${count !== 1 ? "s" : ""}`}
                      />
                      <span className="text-[10px] text-slate-600">
                        {date.toLocaleDateString("en-US", { weekday: "narrow" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Session List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Clock className="size-4 text-violet-400" />
            Recent Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
              <Brain className="size-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 mb-2">No sessions yet</p>
              <p className="text-sm text-slate-600 mb-6">Start your first learning session!</p>
              <Link
                href="/setup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
              >
                Start Learning
                <ChevronRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, i) => {
                const modeColorKey = MODE_COLORS[session.mode];
                const modeColors = MODE_COLOR_MAP[modeColorKey] || MODE_COLOR_MAP.emerald;
                const hasEval = session.evaluation !== null;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 hover:border-slate-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg ${modeColors.bg} ${modeColors.text} flex items-center justify-center shrink-0`}>
                          {hasEval ? (
                            <Trophy className="size-4" />
                          ) : (
                            <MessageSquare className="size-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {session.topic}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className={`px-1.5 py-0.5 rounded-full ${modeColors.bg} ${modeColors.text} ${modeColors.border} border`}>
                              {MODE_LABELS[session.mode]}
                            </span>
                            <span>{formatDate(session.createdAt)}</span>
                            <span>·</span>
                            <span>{session.messageCount} turns</span>
                            <span>·</span>
                            <span>{formatDuration(session.createdAt, session.completedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        {hasEval && (
                          <div className={`text-lg font-bold ${
                            (session.evaluation!.overallScore >= 80) ? "text-emerald-400" :
                            (session.evaluation!.overallScore >= 60) ? "text-amber-400" : "text-rose-400"
                          }`}>
                            {session.evaluation!.overallScore}%
                          </div>
                        )}
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Delete session"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
