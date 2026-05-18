"use client";

import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import {
  Brain,
  MessageSquareText,
  BarChart3,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Target,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <Hero />

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Three simple steps to validate your understanding
            </p>
          </div>

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
              <div
                key={i}
                className="relative group"
              >
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 hover:border-violet-500/30 transition-all duration-300 h-full">
                  <span className="text-violet-500/40 text-5xl font-bold absolute top-4 right-6">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5 text-violet-400">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Intelligent Features
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built for deep understanding, not surface-level recall
            </p>
          </div>

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

      {/* Demo Preview */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See It In Action
            </h2>
            <p className="text-slate-400">
              A glimpse of how StudyMirror validates understanding
            </p>
          </div>

          {/* Mock Chat */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800/50">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                <Brain className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">StudyMirror Interview</p>
                <p className="text-xs text-slate-500">Topic: Polymorphism · Strict Professor</p>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {/* User */}
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                  Polymorphism means methods behave differently depending on the object.
                </div>
              </div>
              {/* AI */}
              <div className="flex justify-start">
                <div className="bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[80%]">
                  What makes the same method call behave differently across objects? What mechanism enables that at runtime?
                </div>
              </div>
              {/* User */}
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                  Different classes implement the same function... through inheritance.
                </div>
              </div>
              {/* AI */}
              <div className="flex justify-start">
                <div className="bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[80%]">
                  You mentioned inheritance, but not overriding specifically. What&apos;s the difference between overriding and overloading?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
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
        </div>
      </section>
    </main>
  );
}
