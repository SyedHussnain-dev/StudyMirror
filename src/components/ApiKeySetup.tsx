"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Key, X, Check, ExternalLink, AlertCircle } from "lucide-react";

const STORAGE_KEY = "openrouter_api_key";

export default function ApiKeySetup() {
  const [show, setShow] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHasKey(true);
    }
    // Only show modal if no key stored — the server env key handles the default case
    // but users can override with their own key
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
      setHasKey(true);
      setSaved(true);
      setTimeout(() => {
        setShow(false);
        setSaved(false);
        setApiKey("");
      }, 1200);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasKey(false);
    setApiKey("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setShow(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
        onClick={() => setShow(true)}
        title={hasKey ? "Custom API key active" : "Set your own API key"}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 border backdrop-blur-sm shadow-lg ${
          hasKey
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            : "bg-slate-900/80 border-slate-700/50 text-slate-400 hover:text-violet-400 hover:border-violet-500/30"
        }`}
      >
        <Key className="size-3.5" />
        {hasKey ? "Custom Key" : "API Key"}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShow(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-black/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Key className="size-4 text-violet-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">OpenRouter API Key</h2>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800/50"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 mb-5">
                <AlertCircle className="size-4 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  StudyMirror uses OpenRouter to power AI interviews. A shared key is active by default,
                  but you can set your own key to guarantee unlimited usage.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-3 mb-4">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="sk-or-v1-..."
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm font-mono"
                />
                <button
                  onClick={handleSave}
                  disabled={!apiKey.trim() || saved}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    saved
                      ? "bg-emerald-600 text-white"
                      : apiKey.trim()
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="size-4" />
                      Key Saved!
                    </>
                  ) : (
                    <>
                      <Key className="size-4" />
                      Save Key Locally
                    </>
                  )}
                </button>
              </div>

              {/* Current key status + clear */}
              {hasKey && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <Check className="size-3.5" />
                    Custom key active
                  </div>
                  <button
                    onClick={handleClear}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Clear & use default
                  </button>
                </div>
              )}

              {/* Footer */}
              <p className="text-xs text-slate-600 mt-4 text-center">
                Your key is stored only in your browser.{" "}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
                >
                  Get a free key
                  <ExternalLink className="size-3" />
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
