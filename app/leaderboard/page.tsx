"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Globe, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

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
  const [filterType, setFilterType] = useState<"global" | "country">("global");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [filterType, selectedCountry]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = filterType === "global"
        ? "/api/leaderboard?type=global"
        : `/api/leaderboard?type=country&country=${selectedCountry}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        if (data.countries) {
          setAvailableCountries(data.countries);
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
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
      <Navbar maxWidth="max-w-7xl" sticky={false} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-purple-500" />
            <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg text-black/60 dark:text-white/40">
            Top developers ranked by GitCheck score
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center"
        >
          {/* Filter Type Toggle */}
          <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl border border-black/10 dark:border-white/10">
            <button
              onClick={() => setFilterType("global")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                filterType === "global"
                  ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                  : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Global
            </button>
            <button
              onClick={() => setFilterType("country")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                filterType === "country"
                  ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
                  : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              By Country
            </button>
          </div>

          {/* Country Selector */}
          {filterType === "country" && (
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-black dark:text-white">{users.length}</p>
            <p className="text-xs text-black/40 dark:text-white/40">Total Developers</p>
          </div>
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-black dark:text-white">
              {users[0]?.score || 0}
            </p>
            <p className="text-xs text-black/40 dark:text-white/40">Top Score</p>
          </div>
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center">
            <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-black dark:text-white">
              {availableCountries.length}
            </p>
            <p className="text-xs text-black/40 dark:text-white/40">Countries</p>
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
                className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBackground(user.rank)} hover:scale-[1.02] transition-all cursor-pointer`}
                onClick={() => window.location.href = `/dashboard?username=${user.username}`}
              >
                {/* Rank */}
                <div className="w-16 flex items-center justify-center flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-12 h-12 rounded-full border-2 border-black/10 dark:border-white/10"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-black dark:text-white truncate">
                      {user.username}
                    </h3>
                    {user.country && (
                      <span className="text-xs px-2 py-1 rounded-full bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60">
                        {user.country}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {user.score}
                  </p>
                  <p className="text-xs text-black/40 dark:text-white/40">score</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
}
