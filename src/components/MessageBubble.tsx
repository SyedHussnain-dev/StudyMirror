"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { motion } from "motion/react";
import { Brain, User } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isAI = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-3 max-w-[85%]", isAI ? "self-start" : "self-end flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 transition-transform duration-200",
          isAI
            ? "bg-violet-500/20 text-violet-400"
            : "bg-slate-700 text-slate-300"
        )}
      >
        {isAI ? <Brain className="size-4" /> : <User className="size-4" />}
      </div>

      {/* Message */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAI
            ? "bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm"
            : "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-tr-sm"
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
