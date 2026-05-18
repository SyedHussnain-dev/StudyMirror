"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

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
  const colorMap: Record<string, string> = {
    violet: "from-violet-500/20 to-purple-500/20 border-violet-500/20 hover:border-violet-500/40",
    emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20 hover:border-emerald-500/40",
    amber: "from-amber-500/20 to-orange-500/20 border-amber-500/20 hover:border-amber-500/40",
    rose: "from-rose-500/20 to-pink-500/20 border-rose-500/20 hover:border-rose-500/40",
    sky: "from-sky-500/20 to-blue-500/20 border-sky-500/20 hover:border-sky-500/40",
  };

  const iconColorMap: Record<string, string> = {
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    sky: "text-sky-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`group relative rounded-2xl bg-gradient-to-br ${colorMap[accentColor] || colorMap.violet} backdrop-blur-sm border p-6 transition-all duration-300 hover:-translate-y-1`}
    >
      <div className={`w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4 ${iconColorMap[accentColor] || iconColorMap.violet}`}>
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
