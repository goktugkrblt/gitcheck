"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeEmbedProps {
  username: string;
  rank?: number;
}

export function BadgeEmbed({ username, rank }: BadgeEmbedProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<"markdown" | "html">("markdown");
  const [badgeKey, setBadgeKey] = useState(Date.now());

  // Update badge key when username changes to force refresh
  useEffect(() => {
    setBadgeKey(Date.now());
  }, [username]);

  const badgeUrl = `https://gitcheck.me/api/badge/${username}`;
  const badgePreviewUrl = `${badgeUrl}?v=${badgeKey}`;
  const profileUrl = `https://gitcheck.me/dashboard/${username}`;

  const markdownCode = `[![GitCheck Score](${badgeUrl})](${profileUrl})`;
  const htmlCode = `<a href="${profileUrl}"><img src="${badgeUrl}" alt="GitCheck Score" /></a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const isTopTen = rank && rank <= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <Code className="w-5 h-5 text-black/60 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-black dark:text-white">Embed Badge</h3>
          <p className="text-xs text-black dark:text-black/40 dark:text-black/40 dark:text-white/40">Add to your GitHub README</p>
        </div>
        {isTopTen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
          >
            <span className="text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ⭐ TOP {rank}
            </span>
          </motion.div>
        )}
      </div>

      {/* Badge Preview */}
      <div className="mb-4 p-4 rounded-lg bg-white dark:bg-black/30 border border-black/10 dark:border-white/5 flex items-center justify-center">
        <img
          src={badgePreviewUrl}
          alt="GitCheck Score Badge"
          className="max-w-full h-auto"
          key={badgeKey}
        />
      </div>

      {/* Style Selector */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSelectedStyle("markdown")}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStyle === "markdown"
              ? "bg-black/10 dark:bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-black/5 dark:bg-white/5 text-black dark:text-black/40 dark:text-black/40 dark:text-white/40 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-black/10 dark:bg-white/10"
          }`}
        >
          Markdown
        </button>
        <button
          onClick={() => setSelectedStyle("html")}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStyle === "html"
              ? "bg-black/10 dark:bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-black/5 dark:bg-white/5 text-black dark:text-black/40 dark:text-black/40 dark:text-white/40 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-black/10 dark:bg-white/10"
          }`}
        >
          HTML
        </button>
      </div>

      {/* Code Block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-3"
        >
          {/* Code Display */}
          <div className="relative">
            <div className="p-3 pr-12 md:pr-3 rounded-lg bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 font-mono text-xs text-black dark:text-white/80 overflow-x-auto">
              <code className="whitespace-nowrap">
                {selectedStyle === "markdown" ? markdownCode : htmlCode}
              </code>
            </div>

            {/* Copy Button - Desktop (absolute positioned) */}
            <button
              onClick={() =>
                copyToClipboard(
                  selectedStyle === "markdown" ? markdownCode : htmlCode,
                  selectedStyle
                )
              }
              className="hidden md:block absolute top-2 right-2 p-2 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 transition-all group"
            >
              <AnimatePresence mode="wait">
                {copied === selectedStyle ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-black/60 dark:text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4 h-4 text-black dark:text-black/40 dark:text-black/40 dark:text-white/40 group-hover:text-black dark:text-black/60 dark:text-white/60" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Copy Button - Mobile (full width below) */}
          <button
            onClick={() =>
              copyToClipboard(
                selectedStyle === "markdown" ? markdownCode : htmlCode,
                selectedStyle
              )
            }
            className="md:hidden w-full p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <AnimatePresence mode="wait">
              {copied === selectedStyle ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-black/60 dark:text-green-400" />
                  <span className="text-black/60 dark:text-green-400">Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-black dark:text-black/60 dark:text-white/60" />
                  <span className="text-black dark:text-black/60 dark:text-white/60">Copy Code</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Info */}
      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-black/10 dark:border-blue-500/20">
        <p className="text-xs text-black dark:text-blue-300/80 leading-relaxed">
          <span className="font-semibold">💡 Tip:</span> Badge updates automatically every hour. Share your score proudly!
        </p>
      </div>
    </motion.div>
  );
}
