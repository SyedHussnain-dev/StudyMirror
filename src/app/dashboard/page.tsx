"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  BarChart3,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { computeDashboardStats, getLast7DaysActivity } from "@/lib/analytics";
import GlowCard from "@/components/ui/GlowCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ParticleBackground from "@/components/ParticleBackground";

function StatTile({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: "violet" | "emerald" | "amber" | "sky";
}) {
  const iconColors = {
    violet: "text-violet-400 bg-violet-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    sky: "text-sky-400 bg-sky-500/10",
  };

  return (
    <GlowCard accent={accent} hoverLift={false}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconColors[accent]}`}>
        <Icon className="size-5" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </GlowCard>
  );
}

export default function DashboardPage() {
  const sessions = useAppStore((s) => s.sessions);
  const streak = useAppStore((s) => s.streak);
  const stats = computeDashboardStats(sessions, streak);
  const weekActivity = getLast7DaysActivity(stats.weeklyActivity);
  const maxActivity = Math.max(...weekActivity.map((d) => d.count), 1);

  return (
    <main className="flex-1 relative min-h-screen">
      <ParticleBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-16">
        <SectionHeader
          align="left"
          title="Your Progress"
          subtitle="Track scores, streaks, and topics that need more practice."
          className="mb-10"
        />

        {sessions.length === 0 ? (
          <GlowCard className="text-center py-16">
            <Brain className="size-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No sessions yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Complete your first interview to see scores, weak areas, and activity charts here.
            </p>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl"
            >
              Start Your First Session
              <ArrowRight className="size-4" />
            </Link>
          </GlowCard>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatTile label="Average Score" value={`${stats.averageScore}%`} icon={BarChart3} accent="violet" />
              <StatTile label="Best Score" value={`${stats.bestScore}%`} icon={Trophy} accent="amber" />
              <StatTile label="Topics Studied" value={stats.topicsStudied} icon={Target} accent="emerald" />
              <StatTile label="Day Streak" value={stats.currentStreak} icon={Zap} accent="sky" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly activity */}
              <GlowCard accent="violet">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="size-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">7-Day Activity</h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                  {weekActivity.map((day, i) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.count / maxActivity) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="w-full min-h-[4px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-t-md"
                      />
                      <span className="text-xs text-slate-500">{day.label}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>

              {/* Score history */}
              <GlowCard accent="sky">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="size-5 text-sky-400" />
                  <h3 className="text-lg font-semibold text-white">Recent Scores</h3>
                </div>
                {stats.scoreHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">Complete a session to see score history.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.scoreHistory.map((entry, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-12 shrink-0">{entry.date}</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.score}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className={`h-full rounded-full ${
                              entry.score >= 80
                                ? "bg-emerald-500"
                                : entry.score >= 60
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                            }`}
                          />
                        </div>
                        <span className="text-sm font-medium text-white w-10 text-right">{entry.score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlowCard>
            </div>

            {/* Weak areas */}
            {stats.weakTopics.length > 0 && (
              <GlowCard accent="rose" className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="size-5 text-rose-400" />
                  <h3 className="text-lg font-semibold text-white">Topics to Review</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  These scored below 70% — revisit them with the Feynman technique.
                </p>
                <div className="space-y-3">
                  {stats.weakTopics.map((item, i) => (
                    <Link
                      key={i}
                      href={`/setup?topic=${encodeURIComponent(item.topic)}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-rose-500/30 transition-colors group"
                    >
                      <div>
                        <p className="text-white font-medium group-hover:text-rose-300 transition-colors">
                          {item.topic}
                        </p>
                        <p className="text-xs text-slate-500">
                          Last studied {new Date(item.lastStudied).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-rose-400 font-semibold">{item.score}%</span>
                        <ArrowRight className="size-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </GlowCard>
            )}

            <div className="flex justify-center">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Browse topic library
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
