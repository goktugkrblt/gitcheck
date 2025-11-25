"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ScoreDisplay } from "@/components/dashboard/score-display";
import { 
  Star, 
  GitFork, 
  Package, 
  TrendingUp, 
  GitPullRequest,
  Users,
  Zap,
  Calendar,
  GitBranch,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageChart } from "@/components/dashboard/language-chart";
import { TopRepos } from "@/components/dashboard/top-repos";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        setProfileData(data.profile);
        setHasProfile(true);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchProfile();
      } else {
        alert(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#919191] font-mono text-sm">LOADING...</div>
      </div>
    );
  }

  const displayData = profileData ? {
    score: profileData.score || 0,
    percentile: profileData.percentile || 0,
    totalRepos: profileData.totalRepos || 0,
    totalStars: profileData.totalStars || 0,
    totalForks: profileData.totalForks || 0,
    totalCommits: profileData.totalCommits || 0,
    totalPRs: profileData.totalPRs || 0,
    mergedPRs: profileData.mergedPRs || 0,
    currentStreak: profileData.currentStreak || 0,
    longestStreak: profileData.longestStreak || 0,
    followersCount: profileData.followersCount || 0,
    organizationsCount: profileData.organizationsCount || 0,
    averageCommitsPerDay: profileData.averageCommitsPerDay || 0,
    mostActiveDay: profileData.mostActiveDay || "N/A",
    weekendActivity: profileData.weekendActivity || 0,
    languages: profileData.languages || {},
    topRepos: profileData.topRepos || [],
  } : {
    score: 0,
    percentile: 0,
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    totalPRs: 0,
    mergedPRs: 0,
    currentStreak: 0,
    longestStreak: 0,
    followersCount: 0,
    organizationsCount: 0,
    averageCommitsPerDay: 0,
    mostActiveDay: "N/A",
    weekendActivity: 0,
    languages: {},
    topRepos: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-[#e0e0e0] tracking-tighter">
          DASHBOARD
        </h1>
        <p className="text-[#919191] mt-2 font-light">
          Track your GitHub metrics and developer growth
        </p>
      </motion.div>

      {!hasProfile ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#252525] rounded-2xl p-16 border border-[#2a2a2a] text-center"
        >
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-10 w-10 text-[#919191]" />
            </div>
            <h2 className="text-3xl font-black text-[#e0e0e0] tracking-tighter">
              ANALYZE YOUR PROFILE
            </h2>
            <p className="text-[#919191] font-light">
              Get insights into your coding activity, discover your strengths, and see how you compare to other developers.
            </p>
            <Button 
              size="lg" 
              className="bg-[#e0e0e0] text-[#1f1f1f] hover:bg-[#d0d0d0] px-12 py-7 text-base font-bold rounded-2xl transition-colors duration-300"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "ANALYZING..." : "START ANALYSIS"}
            </Button>
            <p className="text-xs text-[#666] font-mono">
              ✓ FREE SCAN • NO LIMITS
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Score + Primary Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <ScoreDisplay
                score={displayData.score}
                percentile={displayData.percentile}
              />
            </motion.div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-4">
              {[
                { title: "REPOSITORIES", value: displayData.totalRepos, icon: Package, description: "Public repos" },
                { title: "TOTAL STARS", value: displayData.totalStars, icon: Star, description: "Stars received" },
                { title: "TOTAL COMMITS", value: displayData.totalCommits, icon: GitBranch, description: `${displayData.averageCommitsPerDay}/day avg` },
                { title: "PULL REQUESTS", value: displayData.totalPRs, icon: GitPullRequest, description: `${displayData.mergedPRs} merged` },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                >
                  <StatsCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    description={stat.description}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* New Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: "CURRENT STREAK", 
                value: `${displayData.currentStreak} days`, 
                icon: Zap, 
                description: `Longest: ${displayData.longestStreak} days`,
                color: "text-yellow-500"
              },
              { 
                title: "COMMUNITY", 
                value: displayData.followersCount, 
                icon: Users, 
                description: `${displayData.organizationsCount} organizations`,
                color: "text-purple-500"
              },
              { 
                title: "MOST ACTIVE", 
                value: displayData.mostActiveDay, 
                icon: Calendar, 
                description: `${displayData.weekendActivity}% weekend`,
                color: "text-teal-500"
              },
              { 
                title: "LANGUAGES", 
                value: Object.keys(displayData.languages).length, 
                icon: Code, 
                description: "Technologies used",
                color: "text-cyan-500"
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              >
                <div className="bg-[#252525] rounded-xl p-6 border border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-[#666] tracking-wider">{stat.title}</h3>
                    <stat.icon className={`h-4 w-4 ${stat.color || 'text-[#919191]'}`} />
                  </div>
                  <p className="text-2xl font-black text-[#e0e0e0]">{stat.value}</p>
                  <p className="text-xs text-[#666] mt-1">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <LanguageChart languages={displayData.languages} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <TopRepos repos={displayData.topRepos} />
            </motion.div>
          </div>

          {/* Re-analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex justify-center pt-4"
          >
            <Button 
              className="bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#333] px-8 py-6 text-sm font-bold rounded-xl transition-colors duration-300"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "ANALYZING..." : "REFRESH ANALYSIS"}
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}