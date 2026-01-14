"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface RateLimitWarningProps {
  resetAt: string;
  minutesUntilReset: number;
}

export function RateLimitWarning({ resetAt, minutesUntilReset }: RateLimitWarningProps) {
  // Check if this is a GitHub API rate limit or user rate limit
  const isUserRateLimit = minutesUntilReset <= 15; // User rate limits are shorter (15 min max)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl p-4 backdrop-blur-md shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white mb-1">
              {isUserRateLimit ? "Too Many Requests" : "Rate Limit Exceeded"}
            </h3>
            <p className="text-xs text-white/70 mb-3">
              {isUserRateLimit
                ? "You've made too many analysis requests. Please wait before trying again."
                : "The GitHub API rate limit has been reached. Please try again later."}
            </p>

            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-white/90 font-medium">
                Available in {minutesUntilReset} minute{minutesUntilReset !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="mt-2 text-[10px] text-white/50 font-mono">
              Resets at: {new Date(resetAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
