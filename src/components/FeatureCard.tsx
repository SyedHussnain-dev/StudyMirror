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
  const colorMap: Record<string, { gradient: string; border: string; hoverBorder: string; icon: string }> = {
    violet: {
      gradient: "from-violet-500/10 to-purple-500/5",
      border: "border-violet-500/10",
      hoverBorder: "hover:border-violet-500/30",
      icon: "text-violet-400 bg-violet-500/10",
    },
    emerald: {
      gradient: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/10",
      hoverBorder: "hover:border-emerald-500/30",
      icon: "text-emerald-400 bg-emerald-500/10",
    },
    amber: {
      gradient: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/10",
      hoverBorder: "hover:border-amber-500/30",
      icon: "text-amber-400 bg-amber-500/10",
    },
    rose: {
      gradient: "from-rose-500/10 to-pink-500/5",
      border: "border-rose-500/10",
      hoverBorder: "hover:border-rose-500/30",
      icon: "text-rose-400 bg-rose-500/10",
    },
    sky: {
      gradient: "from-sky-500/10 to-blue-500/5",
      border: "border-sky-500/10",
      hoverBorder: "hover:border-sky-500/30",
      icon: "text-sky-400 bg-sky-500/10",
    },
  };

  const colors = colorMap[accentColor] || colorMap.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl bg-gradient-to-br ${colors.gradient} backdrop-blur-sm border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 cursor-default card-shine`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.icon} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
