"use client";

import { Brain, Code2, MessageSquare, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-[#020617]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Brain className="size-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">StudyMirror</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Master any topic by teaching it. AI-powered learning through the Feynman Technique.
              Stop rereading, start proving understanding.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/setup" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
                  Start Learning
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
                  Session History
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart className="size-3 text-rose-500" /> by StudyMirror Team
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Code2 className="size-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              <MessageSquare className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
