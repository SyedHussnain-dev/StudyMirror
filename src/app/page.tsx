"use client";

import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowCard from "@/components/ui/GlowCard";
import { useAppStore } from "@/lib/store";
import { computeDashboardStats } from "@/lib/analytics";
import { TOPIC_LIBRARY } from "@/lib/topics";
import {
  Brain,
  MessageSquareText,
  BarChart3,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Target,
  ArrowRight,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function LandingPage() {
  const streak = useAppStore((s) => s.streak);
  const sessions = useAppStore((s) => s.sessions);
  const stats = computeDashboardStats(sessions, streak);

  return (
    <main className="flex-1 relative">
      <ParticleBackground />

      {/* Hero */}
      <Hero />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/3 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHeader
            title="How It Works"
            subtitle="Three simple steps to validate your understanding"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Target,
                title: "Pick a Topic",
                description:
                  "Choose any concept you want to test — from OOP to Calculus to Networking.",
              },
              {
                step: "02",
                icon: MessageSquareText,
                title: "Explain It",
                description:
                  "The AI acts as a confused student and asks probing questions about your explanation.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Get Evaluated",
                description:
                  "Receive a detailed understanding score with strengths, gaps, and revision tips.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 hover:border-violet-500/30 transition-all duration-300 h-full card-shine">
                  <span className="text-violet-500/20 text-6xl font-bold absolute top-4 right-6 select-none">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5 text-violet-400 transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: stats.totalSessions > 0 ? "Your Sessions" : "Library Topics",
                value: stats.totalSessions > 0 ? stats.totalSessions : TOPIC_LIBRARY.length,
                icon: Zap,
                accent: "violet" as const,
              },
              {
                label: "Completed",
                value: stats.completedSessions || "—",
                icon: TrendingUp,
                accent: "emerald" as const,
              },
              {
                label: stats.topicsStudied > 0 ? "Topics Studied" : "Study Modes",
                value: stats.topicsStudied > 0 ? stats.topicsStudied : 3,
                icon: BookOpen,
                accent: "amber" as const,
              },
              {
                label: stats.averageScore > 0 ? "Avg. Score" : "Day Streak",
                value: stats.averageScore > 0 ? `${stats.averageScore}%` : streak.currentStreak,
                icon: Award,
                accent: "sky" as const,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlowCard accent={stat.accent} hoverLift={false} className="text-center p-6">
                  <stat.icon className={`size-5 mx-auto mb-2 ${
                    stat.accent === "violet" ? "text-violet-400" :
                    stat.accent === "emerald" ? "text-emerald-400" :
                    stat.accent === "amber" ? "text-amber-400" : "text-sky-400"
                  }`} />
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="Intelligent Features"
            subtitle="Built for deep understanding, not surface-level recall"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={Brain}
              title="AI Interviewer"
              description="A confused AI student that probes your explanations with intelligent follow-up questions."
              index={0}
              accentColor="violet"
            />
            <FeatureCard
              icon={BookOpen}
              title="Beginner Mode"
              description="Friendly questioning with simple wording and patient guidance for starters."
              index={1}
              accentColor="emerald"
            />
            <FeatureCard
              icon={GraduationCap}
              title="Viva Mode"
              description="Academic exam-style questioning with scenario-based practical challenges."
              index={2}
              accentColor="amber"
            />
            <FeatureCard
              icon={ShieldAlert}
              title="Strict Professor"
              description="Deep conceptual probing demanding technical precision and rigorous logic."
              index={3}
              accentColor="rose"
            />
            <FeatureCard
              icon={BarChart3}
              title="Understanding Score"
              description="Detailed evaluation across 5 categories with actionable revision suggestions."
              index={4}
              accentColor="sky"
            />
            <FeatureCard
              icon={MessageSquareText}
              title="Adaptive Dialogue"
              description="Questions adapt to your answers — no two sessions are ever the same."
              index={5}
              accentColor="violet"
            />
          </div>
        </div>
      </section>

      {/* Streak Banner */}
      {streak.currentStreak > 0 && (
        <section className="py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="size-5 text-amber-400" />
                <span className="text-amber-400 font-semibold">{streak.currentStreak} day streak!</span>
              </div>
              <p className="text-sm text-slate-400">
                You have studied {streak.totalSessions} times. Keep it up to maintain your streak!
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to test your understanding?
          </h2>
          <p className="text-slate-400 mb-8">
            Pick a topic, explain it, and find out what you really know.
          </p>
          <Link
            href="/setup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
          >
            <Brain className="size-5" />
            Start Explaining
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
