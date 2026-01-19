"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { RateLimitWarning } from "./rate-limit-warning";

interface UsernameInputProps {
  isMobile?: boolean;
  isLoading?: boolean;
}

export function UsernameInput({ isMobile = false, isLoading = false }: UsernameInputProps) {
  const [username, setUsername] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    resetAt: string;
    minutesUntilReset: number;
  } | null>(null);
  const [pageLoadTime] = useState(() => Date.now()); // Track when component mounted
  const [honeypot, setHoneypot] = useState(""); // Honeypot field (should stay empty)
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username or profile URL");
      return;
    }

    // Extract username from GitHub URL if provided
    let extractedUsername = username.trim();

    // Check if it's a GitHub URL
    const githubUrlPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)/;
    const urlMatch = extractedUsername.match(githubUrlPattern);

    if (urlMatch) {
      extractedUsername = urlMatch[1];
    }

    // Basic validation
    if (!/^[a-zA-Z0-9-]+$/.test(extractedUsername)) {
      setError("Invalid username format");
      return;
    }

    setError("");
    setAnalyzing(true);
    setProgress(0);
    setStatusMessage("Validating username...");

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    const statusMessages = [
      "Validating username...",
      "Fetching GitHub data...",
      "Analyzing repositories...",
      "Calculating developer score...",
      "Finalizing analysis..."
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % statusMessages.length;
      setStatusMessage(statusMessages[messageIndex]);
    }, 2000);

    try {
      const response = await fetch("/api/analyze-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: extractedUsername,
          _honeypot: honeypot, // Bot protection: should be empty
          _timestamp: pageLoadTime, // Bot protection: time since page load
        }),
      });

      const data = await response.json();

      clearInterval(progressInterval);
      clearInterval(messageInterval);

      if (!response.ok) {
        // Handle rate limit error specifically
        if (response.status === 429 && data.resetAt && data.minutesUntilReset) {
          setRateLimitInfo({
            resetAt: data.resetAt,
            minutesUntilReset: data.minutesUntilReset,
          });
          setError(data.error || "Rate limit exceeded. Please try again later.");
        } else {
          setError(data.error || "Failed to analyze profile");
        }
        setAnalyzing(false);
        setProgress(0);
        setStatusMessage("");
        return;
      }

      // Success - complete progress
      setProgress(100);
      setStatusMessage("Analysis complete! Redirecting...");

      // Small delay before redirect
      setTimeout(() => {
        router.push(`/dashboard?username=${extractedUsername}`);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setError("Network error. Please try again.");
      setAnalyzing(false);
      setProgress(0);
      setStatusMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <>
      <div className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Honeypot field - Hidden from users, visible to bots */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
          }}
          aria-hidden="true"
        />

        {/* Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="username or github.com/username"
            disabled={analyzing || isLoading}
            className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Button */}
        <motion.div
          whileHover={!isMobile ? { scale: 1.05 } : {}}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative group"
        >
          <motion.div
            className="absolute inset-0 bg-black/20 dark:bg-white/20 rounded-lg blur-xl"
            animate={!isMobile ? { opacity: [0.5, 0.8, 0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || isLoading || !username.trim()}
            className="relative bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 text-sm px-6 py-3 w-full sm:w-auto disabled:opacity-50 overflow-hidden h-[48px] font-bold"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-black/30 to-transparent"
              animate={!isMobile ? { x: ["-200%", "200%"] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Progress Bar & Status */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-2"
        >
          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Status Message */}
          <div className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="font-mono">{statusMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
        >
          {error}
        </motion.div>
      )}

      {/* Rate Limit Warning */}
      {rateLimitInfo && (
        <div className="mt-3">
          <RateLimitWarning
            resetAt={rateLimitInfo.resetAt}
            minutesUntilReset={rateLimitInfo.minutesUntilReset}
          />
        </div>
      )}

      {/* Helper Text */}
      {!error && !analyzing && (
        <div className="mt-3 space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-black/50 dark:text-white/40 font-mono"
          >
            Enter any GitHub username or profile URL to analyze
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 border border-blue-500/20 dark:border-blue-500/10"
          >
            <span className="text-blue-500 dark:text-blue-400 text-sm shrink-0">ℹ️</span>
            <p className="text-xs text-blue-600 dark:text-blue-300/70 font-mono leading-relaxed">
              Analysis takes 30-60 seconds. Basic stats appear instantly while we calculate your developer score.
            </p>
          </motion.div>
        </div>
      )}
      </div>
    </>
  );
}
