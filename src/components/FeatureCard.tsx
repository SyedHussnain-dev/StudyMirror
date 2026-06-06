"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  accentColor?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  accentColor = "violet",
}: FeatureCardProps) {
  const iconColors: Record<string, string> = {
    violet: "text-violet-400 bg-violet-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10",
    sky: "text-sky-400 bg-sky-500/10",
  };

  const accent = (accentColor as "violet" | "emerald" | "amber" | "rose" | "sky") || "violet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlowCard accent={accent} className="group cursor-default h-full">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColors[accent]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="size-6" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </GlowCard>
    </motion.div>
  );
}
