"use client";

import { Calendar, TrendingUp, Zap, BarChart3, Info } from "lucide-react";
import { ActivityHeatmap } from "./activity-heatmap";

interface ActivityTabProps {
  profileData: any;
}

export function ActivityTab({ profileData }: ActivityTabProps) {
  console.log('🔥 ActivityTab Rendered');
  console.log('🔥 ProfileData:', profileData);
  console.log('🔥 Total Contributions:', profileData?.totalContributions);
  if (!profileData) {
    return (
      <div className="bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-[#131c26] p-8 text-center">
        <BarChart3 className="w-12 h-12 text-black/60 dark:text-[#666] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-black dark:text-[#e0e0e0] mb-2">No Activity Data</h3>
        <p className="text-black/60 dark:text-[#666] text-sm">Please analyze your profile first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-black dark:text-[#e0e0e0] tracking-tighter mb-2">
          Your Activity
        </h2>
        <p className="text-black/60 dark:text-[#666]">
          Track your coding patterns and consistency
        </p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* MOST ACTIVE DAY */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">MOST ACTIVE</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-black/60 dark:text-[#666]" />
                <div className="relative group/tooltip">
                  <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    The day of the week when you're most active with commits
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-black text-black dark:text-[#e0e0e0] mb-1">{profileData.mostActiveDay || "N/A"}</p>
            <p className="text-xs text-black/60 dark:text-[#666]">Day of the week</p>
          </div>

          {/* WEEKEND ACTIVITY */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">WEEKEND ACTIVITY</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-black/60 dark:text-[#666]" />
                <div className="relative group/tooltip">
                  <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    Percentage of your commits made on weekends (Saturday & Sunday)
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-black text-black dark:text-[#e0e0e0] mb-1">{profileData.weekendActivity || 0}%</p>
            <p className="text-xs text-black/60 dark:text-[#666]">Weekend commits</p>
          </div>

          {/* DAILY AVERAGE */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">DAILY AVERAGE</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-black/60 dark:text-[#666]" />
                <div className="relative group/tooltip">
                  <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    Your average number of commits per day based on your total commit history
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-black text-black dark:text-[#e0e0e0] mb-1">{profileData.averageCommitsPerDay || 0}</p>
            <p className="text-xs text-black/60 dark:text-[#666]">Commits per day</p>
          </div>

          {/* CONSISTENCY */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">CONSISTENCY</h3>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-black/60 dark:text-[#666]" />
                <div className="relative group/tooltip">
                  <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    Your current commit streak vs. your longest streak. Shows coding consistency!
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-black text-black dark:text-[#e0e0e0] mb-1">
              {profileData.currentStreak || 0}/{profileData.longestStreak || 0}
            </p>
            <p className="text-xs text-black/60 dark:text-[#666]">Current/longest streak</p>
          </div>

          {/* TOTAL CONTRIBUTIONS */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">CONTRIBUTIONS</h3>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-black/60 dark:text-[#666]" />
                <div className="relative group/tooltip">
                  <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    Total contributions this year including commits, PRs, issues, and code reviews
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-black text-black dark:text-[#e0e0e0] mb-1">{profileData.totalContributions || 0}</p>
            <p className="text-xs text-black/60 dark:text-[#666]">This year</p>
          </div>

          {/* ACCOUNT AGE */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">ACCOUNT AGE</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-black/60 dark:text-[#666]" />
                <div className="relative group/tooltip">
                  <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    How long you've been on GitHub. More experience = more context!
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-black text-black dark:text-[#e0e0e0] mb-1">{profileData.accountAge || 0} years</p>
            <p className="text-xs text-black/60 dark:text-[#666]">On GitHub</p>
          </div>
        </div>

      {/* Heatmap */}
      <ActivityHeatmap />
    </div>
  );
}