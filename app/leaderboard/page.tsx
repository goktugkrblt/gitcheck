"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, Medal, Crown, Globe, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

interface LeaderboardUser {
  username: string;
  score: number;
  avatarUrl: string;
  country: string | null;
  rank: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterType, setFilterType] = useState<"global" | "country">("global");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLeaderboard(true);
  }, [filterType, selectedCountry]);

  // Infinite scroll setup
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchLeaderboard(false);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, users.length]);

  const fetchLeaderboard = async (reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setUsers([]);
    } else {
      setLoadingMore(true);
    }

    try {
      const offset = reset ? 0 : users.length;
      const url = filterType === "global"
        ? `/api/leaderboard?type=global&limit=50&offset=${offset}`
        : `/api/leaderboard?type=country&country=${selectedCountry}&limit=50&offset=${offset}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setUsers(prev => reset ? data.users : [...prev, ...data.users]);
        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
        if (data.countries) {
          setAvailableCountries(data.countries);
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="text-xl font-bold text-black/40 dark:text-white/40">#{rank}</span>;
  };

  const getRankBackground = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/40";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/40";
    return "bg-white dark:bg-white/5 border-black/10 dark:border-white/10";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050307]">
      <Navbar sticky={false} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tighter">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm text-black/60 dark:text-white/40">
            Top developers ranked by GitCheck score
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-center"
        >
          {/* Filter Type Toggle */}
          <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-black/10 dark:border-white/10">
            <button
              onClick={() => setFilterType("global")}
              className={`px-4 py-1.5 rounded-md font-semibold text-xs transition-all ${
                filterType === "global"
                  ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                  : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
              }`}
            >
              <Globe className="w-3.5 h-3.5 inline mr-1.5" />
              Global
            </button>
            <button
              onClick={() => setFilterType("country")}
              className={`px-4 py-1.5 rounded-md font-semibold text-xs transition-all ${
                filterType === "country"
                  ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                  : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
              By Country
            </button>
          </div>

          {/* Country Selector */}
          {filterType === "country" && (
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="pl-4 pr-6 py-1.5 rounded-md bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[140px]"
            >
              <option value="">Select Country</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1.5" />
            <p className="text-xl font-black text-black dark:text-white">{totalCount || users.length}</p>
            <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider">Total Developers</p>
          </div>
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 text-center">
            <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-1.5" />
            <p className="text-xl font-black text-black dark:text-white">
              {users[0]?.score.toFixed(2) || '0.00'}
            </p>
            <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider">Top Score</p>
          </div>
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 text-center">
            <Globe className="w-6 h-6 text-blue-500 mx-auto mb-1.5" />
            <p className="text-xl font-black text-black dark:text-white">
              {availableCountries.length}
            </p>
            <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider">Countries</p>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-black/60 dark:text-white/40">Loading leaderboard...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-black/20 dark:text-white/20 mx-auto mb-4" />
              <p className="text-black/60 dark:text-white/40">No users found</p>
            </div>
          ) : (
            users.map((user, index) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRankBackground(user.rank)} hover:scale-[1.01] transition-all cursor-pointer`}
                onClick={() => window.location.href = `/dashboard?username=${user.username}`}
              >
                {/* Rank */}
                <div className="w-12 flex items-center justify-center flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-9 h-9 rounded-full border-2 border-black/10 dark:border-white/10"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-black dark:text-white truncate">
                      {user.username}
                    </h3>
                    {user.country && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60">
                        {user.country}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {user.score.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-black/40 dark:text-white/40">score</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Infinite Scroll Trigger & Loading Indicator */}
        {!loading && hasMore && (
          <div ref={loadMoreRef} className="mt-6 text-center py-8">
            {loadingMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                <p className="text-sm text-black/60 dark:text-white/40 font-mono">
                  Loading more developers... ({users.length}/{totalCount})
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* End of List Indicator */}
        {!loading && !hasMore && users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center py-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Trophy className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-black/60 dark:text-white/40 font-medium">
                You've reached the end • {users.length} developers
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="pt-16 md:pt-24 border-t border-black/[0.06] dark:border-white/[0.06] mt-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs text-black/40 dark:text-white/40">
              {[
                { label: "Documentation", href: "/docs" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Refund Policy", href: "/refund" },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="hover:text-black/70 dark:hover:text-white/70 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-xs text-black/40 dark:text-white/40 font-mono">
              © 2025 • Built for{" "}
              <a
                href="https://goktug.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
              >
                developer
              </a>
              {" "}by developers
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  );
}
