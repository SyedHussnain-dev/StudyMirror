"use client";

import { motion } from "motion/react";
import { InterviewMode, MODE_LABELS, MODE_DESCRIPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GraduationCap, BookOpen, ShieldAlert } from "lucide-react";

interface ModeCardProps {
  mode: InterviewMode;
  selected: boolean;
  onSelect: (mode: InterviewMode) => void;
  index: number;
}

const MODE_ICONS: Record<InterviewMode, React.ElementType> = {
  beginner: BookOpen,
  viva: GraduationCap,
  strict: ShieldAlert,
};

const MODE_STYLES: Record<InterviewMode, { border: string; glow: string; icon: string; badge: string }> = {
  beginner: {
    border: "border-emerald-500/50 shadow-emerald-500/20",
    glow: "bg-emerald-500/10",
    icon: "text-emerald-400 bg-emerald-500/15",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  viva: {
    border: "border-amber-500/50 shadow-amber-500/20",
    glow: "bg-amber-500/10",
    icon: "text-amber-400 bg-amber-500/15",
    badge: "bg-amber-500/20 text-amber-400",
  },
  strict: {
    border: "border-rose-500/50 shadow-rose-500/20",
    glow: "bg-rose-500/10",
    icon: "text-rose-400 bg-rose-500/15",
    badge: "bg-rose-500/20 text-rose-400",
  },
};

export default function ModeCard({ mode, selected, onSelect, index }: ModeCardProps) {
  const Icon = MODE_ICONS[mode];
  const styles = MODE_STYLES[mode];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => onSelect(mode)}
      className={cn(
        "relative text-left p-6 rounded-2xl border bg-slate-900/50 backdrop-blur-sm transition-all duration-300 cursor-pointer w-full",
        selected
          ? `${styles.border} shadow-lg`
          : "border-slate-700/50 hover:border-slate-600/50"
      )}
    >
      {/* Selected glow */}
      {selected && (
        <div className={`absolute inset-0 rounded-2xl ${styles.glow} pointer-events-none`} />
      )}

      <div className="relative z-10">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", styles.icon)}>
          <Icon className="size-6" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white">{MODE_LABELS[mode]}</h3>
          {selected && (
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", styles.badge)}>
              Selected
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400">{MODE_DESCRIPTIONS[mode]}</p>
      </div>
    </motion.button>
  );
}
