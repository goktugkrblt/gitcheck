"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ScoreDisplay } from "@/components/dashboard/score-display";
import { BadgeEmbed } from "@/components/dashboard/badge-embed";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { ProTab } from "@/components/dashboard/pro-tab";
import { CompareTab } from "@/components/dashboard/compare-tab";
import { RepositoriesTab } from "@/components/dashboard/repositories-tab";
import { ActivityTab } from "@/components/dashboard/activity-tab";
import { SkillsTab } from "@/components/dashboard/skills-tab";
import { 
  Star, 
  Package, 
  TrendingUp, 
  GitPullRequest,
  Users,
  Zap,
  Calendar,
  GitBranch,
  Code,
  BarChart3,
  Activity,
  Target,
  Sparkles,
  Brain,
  Info, // ✅ Info icon eklendi
  Crown // ✅ PRO badge için Crown icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageChart } from "@/components/dashboard/language-chart";
import { TopRepos } from "@/components/dashboard/top-repos";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>("FREE");
  const [activeTab, setActiveTab] = useState("overview");
  const [devMockPlan, setDevMockPlan] = useState<"FREE" | "PRO" | null>(null);

  // ✅ NEW: PRO Analysis state
  const [proAnalysisStatus, setProAnalysisStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [initialCheckDone, setInitialCheckDone] = useState(false); // ✅ YENİ: Sadece bir kez kontrol

  // ✅ NEW: Cache warning state
  const [cacheInfo, setCacheInfo] = useState<{
    nextScanAvailable: string;
    hoursRemaining: number;
  } | null>(null);

  // ✅ NEW: Global rank state
  const [globalRank, setGlobalRank] = useState<{
    rank: number;
    totalProfiles: number;
    percentile: number;
  } | null>(null);

  // ✅ Check if user is PRO (from database)
  const isProUser = userPlan === "PRO";

  const effectivePlan = process.env.NODE_ENV === 'development' && devMockPlan
    ? devMockPlan
    : userPlan;

  // ✅ CHANGED: Show score only after analysis completes
  const shouldShowScore = proAnalysisStatus === 'complete';

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ NEW: Auto-start PRO analysis in background
  useEffect(() => {
    if (hasProfile && proAnalysisStatus === 'idle') {
      startBackgroundAnalysis();
    }
  }, [hasProfile, proAnalysisStatus]);

  // ✅ NEW: Listen for analysis completion
  useEffect(() => {
    const handleAnalysisComplete = () => {
      console.log('✅ PRO analysis complete event received');
      setProAnalysisStatus('complete');
      setAnalysisProgress(100);
      // Refresh profile to get updated score
      fetchProfile();
    };
    
    window.addEventListener('proAnalysisComplete', handleAnalysisComplete);
    
    return () => {
      window.removeEventListener('proAnalysisComplete', handleAnalysisComplete);
    };
  }, []);

  useEffect(() => {
    const handleNavigateToProTab = () => {
      console.log('📥 Received navigateToProTab event - switching to PRO tab');
      setActiveTab('pro');
    };
    
    window.addEventListener('navigateToProTab', handleNavigateToProTab);
    
    return () => {
      window.removeEventListener('navigateToProTab', handleNavigateToProTab);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setDevMockPlan(prev => {
          const newPlan = prev === "PRO" ? "FREE" : "PRO";
          console.log(`🔧 DEV MODE: Switched to ${newPlan}`);
          
          const toast = document.createElement('div');
          toast.textContent = `Dev Mode: ${newPlan}`;
          toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(to right, #a855f7, #ec4899);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
          `;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
          
          return newPlan;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ✅ NEW: Start background PRO analysis
  const startBackgroundAnalysis = async () => {
    // ✅ YENİ: Eğer zaten score varsa, analiz yapma!
    if (profileData?.score && profileData.score > 0) {
      console.log('✅ Score exists, skipping analysis');
      setProAnalysisStatus('complete');
      setAnalysisProgress(100);
      return;
    }

    setProAnalysisStatus('running');
    setAnalysisProgress(0);
    
    console.log('🚀 Starting background PRO analysis...');
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 5;
        });
      }, 1000);

      const response = await fetch('/api/pro/analyze-all');
      const result = await response.json();

      clearInterval(progressInterval);

      if (result.success) {
        console.log('✅ Background PRO analysis complete');
        
        // ✅ YENİ: Score'u güncelle
        console.log('🔄 Updating score in database...');
        await fetch('/api/score'); // Score hesapla ve kaydet
        
        setProAnalysisStatus('complete');
        setAnalysisProgress(100);
        
        window.dispatchEvent(new Event('proAnalysisComplete'));
        
        // Refresh profile data
        await fetchProfile();
      } else {
        console.error('❌ PRO analysis failed:', result.error);
        setProAnalysisStatus('complete');
      }
    } catch (error) {
      console.error('❌ Background analysis error:', error);
      setProAnalysisStatus('complete');
    }
  };

 const fetchProfile = async () => {
  try {
    // Get username from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (!username) {
      console.error('No username provided - redirecting to homepage');
      window.location.href = '/';
      return;
    }

    const res = await fetch(`/api/profile?username=${username}`);
    const data = await res.json();
    if (data.profile) {
      setProfileData(data.profile);
      setHasProfile(true);
      setUserPlan(data.user?.plan || "FREE");

      // ✅ Check if profile is cached
      if (data.cached && data.nextScanAvailable) {
        const nextScan = new Date(data.nextScanAvailable);
        const now = new Date();
        const hoursRemaining = Math.ceil((nextScan.getTime() - now.getTime()) / (1000 * 60 * 60));

        setCacheInfo({
          nextScanAvailable: data.nextScanAvailable,
          hoursRemaining: Math.max(0, hoursRemaining),
        });
      }

      // ✅ YENİ: Score > 0 ise analiz tamamlanmış
      if (!initialCheckDone) {
        if (data.profile.score > 0) {
          console.log('✅ Score ready:', data.profile.score);
          setProAnalysisStatus('complete');
          setAnalysisProgress(100);
        } else {
          console.log('⚠️ No score yet, analysis needed');
          // Status 'idle' kalacak
        }
        setInitialCheckDone(true);
      }

      // ✅ NEW: Fetch global rank if score exists
      if (data.profile.score && data.profile.score > 0) {
        fetchGlobalRank(username);
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  } finally {
    setInitialLoading(false);
  }
};

// ✅ NEW: Fetch global rank
const fetchGlobalRank = async (username: string) => {
  try {
    const res = await fetch(`/api/global-rank?username=${username}`);
    const data = await res.json();

    if (res.ok && data.rank) {
      setGlobalRank({
        rank: data.rank,
        totalProfiles: data.totalProfiles,
        percentile: data.percentile,
      });
    }
  } catch (error) {
    console.error("Failed to fetch global rank:", error);
  }
};

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // ✅ skipPro=true ile sadece public verileri çek (hızlı ~5 saniye)
      const res = await fetch("/api/github/analyze?skipPro=true", {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.success) {
        // ✅ Public veriler geldi, dashboard'a geç
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
    username: profileData.username || "Developer",
    avatarUrl: profileData.avatarUrl || `https://github.com/${profileData.username}.png`,
    bio: profileData.bio || null,
    totalIssuesOpened: profileData.totalIssuesOpened || 0,
    totalReviews: profileData.totalReviews || 0,
    totalContributions: profileData.totalContributions || 0,
    totalWatchers: profileData.totalWatchers || 0,
    totalOpenIssues: profileData.totalOpenIssues || 0,
    averageRepoSize: profileData.averageRepoSize || 0,
    gistsCount: profileData.gistsCount || 0,
    accountAge: profileData.accountAge || 0,
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
    username: "Developer",
    avatarUrl: "",
    bio: null,
    totalIssuesOpened: 0,
    totalReviews: 0,
    totalContributions: 0,
    totalWatchers: 0,
    totalOpenIssues: 0,
    averageRepoSize: 0,
    gistsCount: 0,
    accountAge: 0,
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white/60 font-mono text-sm">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {process.env.NODE_ENV === 'development' && devMockPlan && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-bold text-sm">
          🔧 DEV: {devMockPlan} MODE
        </div>
      )}

      {/* ✅ NEW: Cache Warning */}
      {cacheInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 mx-4 md:mx-0"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-black dark:text-white mb-1">
                Viewing Cached Data
              </h3>
              <p className="text-xs text-black dark:text-white/70 mb-3">
                This profile was recently analyzed. To prevent excessive API usage, you can request a fresh analysis once per day.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-black dark:text-white/90 font-medium">
                  Next scan available in {cacheInfo.hoursRemaining} hour{cacheInfo.hoursRemaining !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="mt-2 text-[10px] text-black dark:text-white/50 font-mono">
                Resets at: {new Date(cacheInfo.nextScanAvailable).toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ✅ NEW: Analysis Progress Indicator */}
      {proAnalysisStatus === 'running' && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 mx-4 md:mx-0"
        >
          <div className="flex items-center gap-4">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-bold text-sm">
                  <Brain className="w-4 h-4 inline mr-2" />
                  Calculating your developer score...
                </p>
                <span className="text-blue-400 text-xs font-mono">{analysisProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2">
                Your basic stats are visible below. Score calculation may take 30-60 seconds.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ✅ CHANGED: Animations only on large screens */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
        className="lg:motion-safe:animate-fadeIn"
      >
        <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter px-4 md:px-0">
          Dashboard
        </h1>
        <p className="text-black/60 dark:text-white/40 text-sm mt-1 px-4 md:px-0">
          Track your GitHub metrics and developer growth
          {process.env.NODE_ENV === 'development' && (
            <span className="ml-2 text-purple-400 text-xs">
              (Press Ctrl+Shift+P to toggle PRO)
            </span>
          )}
        </p>
      </motion.div>

      {hasProfile ? (
        <>
          {/* ✅ CHANGED: Stacked layout instead of grid */}
          <div className="space-y-6 px-4 md:px-0">
            {/* Profile Card - Full width with Badge */}
            <div className="bg-white dark:bg-[#050307] rounded-xl border border-black/10 dark:border-white/10 p-6 md:p-8 backdrop-blur-sm lg:motion-safe:animate-slideInLeft">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 w-full">
                {/* Left: Profile Info */}
                <div className="flex items-center gap-4 md:gap-6 flex-1">
                  <div className="relative flex-shrink-0">
                    <img
                      src={displayData.avatarUrl}
                      alt={displayData.username}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 md:border-4 border-black/10 dark:border-white/10"
                    />
                    {/* PRO Badge */}
                    {isProUser && (
                      <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white dark:border-[#050307] shadow-lg">
                        <Crown className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-black dark:text-white tracking-tight truncate">
                        {displayData.username}
                      </h2>
                      {isProUser && (
                        <div className="px-2 md:px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-1 flex-shrink-0">
                          <Crown className="w-3 h-3 text-white" />
                          <span className="text-[10px] md:text-xs font-black text-white tracking-wider">PRO</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-black/60 dark:text-white/40 mb-3 md:mb-4">
                      GitHub Developer
                    </p>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Users className="w-3 h-3 md:w-4 md:h-4 text-black/60 dark:text-white/40" />
                        <span className="text-black dark:text-white/60 font-medium">{displayData.followersCount} followers</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Package className="w-3 h-3 md:w-4 md:h-4 text-black/60 dark:text-white/40" />
                        <span className="text-black dark:text-white/60 font-medium">{displayData.totalRepos} repos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Badge */}
                {globalRank && (
                  <div className="flex-shrink-0 w-full lg:w-auto">
                    <img
                      src={`/api/badge/${displayData.username}`}
                      alt={`${displayData.username} badge`}
                      className="lg:w-[210px] h-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ✅ CHANGED: Score Display - Full width, separate from profile */}
            <div className="lg:motion-safe:animate-slideInRight">
              {shouldShowScore ? (
                <>
                  <ScoreDisplay
                    score={displayData.score}
                    percentile={displayData.percentile}
                    username={displayData.username}
                    globalRank={globalRank}
                  />

                  {/* Badge Embed Component */}
                  <div className="mt-6">
                    <BadgeEmbed
                      username={displayData.username}
                      rank={globalRank?.rank}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-[#050307] rounded-xl border border-blue-500/30 p-6 md:p-8 flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-bold text-white mb-2">Calculating Developer Score</h3>
                    <p className="text-white/40 text-sm">
                      Analyzing your coding patterns and contribution quality...
                    </p>
                    <p className="text-blue-400 text-xs mt-3 font-mono">
                      This may take 30-60 seconds
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Tabs section */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsList className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1.5 w-full min-w-max md:min-w-0 grid grid-cols-6 rounded-xl h-auto backdrop-blur-sm">

                <TabsTrigger
                  value="overview"
                  className="cursor-pointer data-[state=active]:bg-black/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-black dark:data-[state=active]:text-white text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  OVERVIEW
                </TabsTrigger>

                <TabsTrigger
                  value="activity"
                  className="cursor-pointer data-[state=active]:bg-black/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-black dark:data-[state=active]:text-white text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Activity className="w-4 h-4 mr-1.5" />
                  ACTIVITY
                </TabsTrigger>

                <TabsTrigger
                  value="skills"
                  className="cursor-pointer data-[state=active]:bg-black/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-black dark:data-[state=active]:text-white text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Code className="w-4 h-4 mr-1.5" />
                  SKILLS
                </TabsTrigger>

                <TabsTrigger
                  value="repositories"
                  className="cursor-pointer data-[state=active]:bg-black/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-black dark:data-[state=active]:text-white text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Package className="w-4 h-4 mr-1.5" />
                  REPOS
                </TabsTrigger>

                <TabsTrigger
                  value="compare"
                  className="cursor-pointer data-[state=active]:bg-black/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-black dark:data-[state=active]:text-white text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Target className="w-4 h-4 mr-1.5" />
                  COMPARE
                </TabsTrigger>

                <TabsTrigger
                  value="pro"
                  className="relative cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 text-purple-600/60 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Crown className="w-4 h-4 mr-1.5" />
                  PRO
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ✅ OVERVIEW TAB - Info iconlar eklendi */}
            <TabsContent value="overview" className="space-y-6 mt-6 px-4 md:px-0">
              <div>
                <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter mb-2">
                  Overview
                </h2>
                <p className="text-black/40 dark:text-white/40">
                  Your core GitHub metrics at a glance
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* TOTAL COMMITS */}
                <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-black/40 dark:text-white/40 tracking-wider">TOTAL COMMITS</h3>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-black/40 dark:text-white/40" />
                      <div className="relative group/tooltip">
                        <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                          Total number of commits you've made across all your repositories
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-black dark:text-white mb-1">{displayData.totalCommits}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">{displayData.averageCommitsPerDay}/day average</p>
                </div>

                {/* PULL REQUESTS */}
                <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-black/40 dark:text-white/40 tracking-wider">PULL REQUESTS</h3>
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-black/40 dark:text-white/40" />
                      <div className="relative group/tooltip">
                        <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                          Total pull requests you've created. Shows how actively you collaborate and contribute to projects
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-black dark:text-white mb-1">{displayData.totalPRs}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">{displayData.mergedPRs} merged</p>
                </div>

                {/* CURRENT STREAK */}
                <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-black/40 dark:text-white/40 tracking-wider">CURRENT STREAK</h3>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-black/40 dark:text-white/40" />
                      <div className="relative group/tooltip">
                        <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                          Consecutive days with at least one commit. Maintain your streak to show consistency!
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-black dark:text-white mb-1">{displayData.currentStreak} days</p>
                  <p className="text-xs text-black/40 dark:text-white/40">Longest: {displayData.longestStreak} days</p>
                </div>

                {/* COMMUNITY */}
                <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-black/40 dark:text-white/40 tracking-wider">COMMUNITY</h3>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-black/40 dark:text-white/40" />
                      <div className="relative group/tooltip">
                        <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                          Your GitHub followers count. Reflects your influence and network in the developer community
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-black dark:text-white mb-1">{displayData.followersCount}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">{displayData.organizationsCount} organizations</p>
                </div>

                {/* ISSUES OPENED */}
                <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-black/40 dark:text-white/40 tracking-wider">ISSUES OPENED</h3>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-black/40 dark:text-white/40" />
                      <div className="relative group/tooltip">
                        <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                          Total issues you've opened. Shows your engagement in identifying bugs and suggesting improvements
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-black dark:text-white mb-1">{displayData.totalIssuesOpened || 0}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">Contributions made</p>
                </div>

                {/* CODE REVIEWS */}
                <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-black/40 dark:text-white/40 tracking-wider">CODE REVIEWS</h3>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-black/40 dark:text-white/40" />
                      <div className="relative group/tooltip">
                        <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                          Number of code reviews you've completed. Demonstrates your collaboration and code quality focus
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-black dark:text-white mb-1">{displayData.totalReviews || 0}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">Reviews given</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6 px-4 md:px-0">
              <ActivityTab profileData={profileData} />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-6 px-4 md:px-0">
              <SkillsTab profileData={profileData} />
            </TabsContent>

            <TabsContent value="repositories" className="space-y-6 mt-6 px-4 md:px-0">
              <RepositoriesTab profileData={profileData} />
            </TabsContent>

            <TabsContent value="compare" className="space-y-6 mt-6 px-4 md:px-0">
              <div className="bg-white/5 rounded-xl border border-white/10 p-8 px-[10px] text-center backdrop-blur-sm">
                <CompareTab userProfile={profileData} />
              </div>
            </TabsContent>
            
            <TabsContent value="pro" className="space-y-6 mt-6 px-4 md:px-0">
              <div className="bg-white/5 rounded-xl border border-white/10 p-1 text-center backdrop-blur-sm">
                {process.env.NEXT_PUBLIC_ENABLE_PRO_TAB === 'true' ? (                  
                  <ProTab 
                    isPro={effectivePlan === "PRO"}
                    username={displayData.username}
                    onPurchaseComplete={() => {
                      fetchProfile();
                    }}
                  />
                ) : (
                  <div className="py-12">
                    <Sparkles className="w-16 h-16 text-purple-400/40 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-3">
                      Premium Features Coming Soon
                    </h3>
                    <p className="text-white/40 max-w-md mx-auto">
                      Advanced analytics and insights are on the way. Stay tuned for exclusive features!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </>
      ) : null}
    </div>
  );
}