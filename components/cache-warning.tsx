"use client";

import { Clock, Database } from "lucide-react";
import { motion } from "framer-motion";

interface CacheWarningProps {
  nextScanAvailable: string;
  hoursRemaining: number;
}

export function CacheWarning({ nextScanAvailable, hoursRemaining }: CacheWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-500/30 dark:border-blue-500/30 rounded-xl p-4 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Database className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-black dark:text-white mb-1">
            Viewing Cached Data
          </h3>
          <p className="text-xs text-black dark:text-white/70 mb-3">
            This profile was recently analyzed. To prevent excessive API usage, you can request a fresh analysis once per day.
          </p>

          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-black dark:text-white/90 font-medium">
              Next scan available in {hoursRemaining} hour{hoursRemaining !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="mt-2 text-[10px] text-black dark:text-white/50 font-mono">
            Available at: {new Date(nextScanAvailable).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
