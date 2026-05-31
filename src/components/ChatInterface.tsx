"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Brain, Loader2 } from "lucide-react";
import type { Message } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-3 self-start max-w-[85%]"
    >
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 bg-violet-500/20 text-violet-400">
        <Brain className="size-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-slate-800/80 border border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-400 typing-dot-1" />
          <span className="w-2 h-2 rounded-full bg-violet-400 typing-dot-2" />
          <span className="w-2 h-2 rounded-full bg-violet-400 typing-dot-3" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  disabled = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 scrollbar-thin min-h-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <MessageBubble key={`${i}-${msg.timestamp || i}`} message={msg} index={i} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && <TypingIndicator />}
        </AnimatePresence>

        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center text-slate-600">
              <Brain className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Start explaining to begin the interview</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-slate-800 bg-[#020617]/80 backdrop-blur-md p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Session ended" : "Explain your understanding..."}
              disabled={isLoading || disabled}
              rows={1}
              className={cn(
                "w-full resize-none rounded-xl bg-slate-800/60 border border-slate-700/50 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors",
                (isLoading || disabled) && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className={cn(
              "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
              input.trim() && !isLoading && !disabled
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
        <p className="text-xs text-slate-600 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
