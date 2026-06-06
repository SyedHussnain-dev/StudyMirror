"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Accent = "violet" | "emerald" | "amber" | "rose" | "sky";

const ACCENT_STYLES: Record<Accent, { gradient: string; border: string; hoverBorder: string }> = {
  violet: {
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/10",
    hoverBorder: "hover:border-violet-500/30",
  },
  emerald: {
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/30",
  },
  amber: {
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/10",
    hoverBorder: "hover:border-amber-500/30",
  },
  rose: {
    gradient: "from-rose-500/10 to-pink-500/5",
    border: "border-rose-500/10",
    hoverBorder: "hover:border-rose-500/30",
  },
  sky: {
    gradient: "from-sky-500/10 to-blue-500/5",
    border: "border-sky-500/10",
    hoverBorder: "hover:border-sky-500/30",
  },
};

interface GlowCardProps extends HTMLMotionProps<"div"> {
  accent?: Accent;
  hoverLift?: boolean;
  shine?: boolean;
  children: React.ReactNode;
}

export default function GlowCard({
  accent = "violet",
  hoverLift = true,
  shine = true,
  className,
  children,
  ...props
}: GlowCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <motion.div
      whileHover={hoverLift ? { y: -4 } : undefined}
      className={cn(
        "rounded-2xl bg-gradient-to-br backdrop-blur-sm border p-6 transition-all duration-300",
        styles.gradient,
        styles.border,
        styles.hoverBorder,
        shine && "card-shine",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
