"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ScoreDisplay } from "@/components/dashboard/score-display";
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
  Sparkles
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
  
  // DEV MODE - Mock plan state
  const [devMockPlan, setDevMockPlan] = useState<"FREE" | "PRO" | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // DEV MODE - Keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setDevMockPlan(prev => {
          const newPlan = prev === "PRO" ? "FREE" : "PRO";
          console.log(`🔧 DEV MODE: Switched to ${newPlan}`);
          
          // Toast notification (optional)
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

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        console.log('📊 Profile Data:', data.profile);
        console.log('📊 Total Contributions:', data.profile.totalContributions);
        console.log('📊 Total Issues:', data.profile.totalIssuesOpened);
        console.log('📊 Total Reviews:', data.profile.totalReviews);
        setProfileData(data.profile);
        setHasProfile(true);
        
        // User plan'ı al
        setUserPlan(data.user?.plan || "FREE");
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

  // DEV MODE: Override plan if dev mock is active
  const effectivePlan = process.env.NODE_ENV === 'development' && devMockPlan 
    ? devMockPlan 
    : userPlan;

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

  return (
    <div className="space-y-6">
      {/* DEV MODE Indicator (sadece development'ta görünür) */}
      {process.env.NODE_ENV === 'development' && devMockPlan && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-bold text-sm">
          🔧 DEV: {devMockPlan} MODE
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-black text-[#e0e0e0] tracking-tighter">
          DASHBOARD
        </h1>
        <p className="text-[#666] text-sm mt-1">
          Track your GitHub metrics and developer growth
          {process.env.NODE_ENV === 'development' && (
            <span className="ml-2 text-purple-400 text-xs">
              (Press Ctrl+Shift+P to toggle PRO)
            </span>
          )}
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
          {/* Profile + Score Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol: GitHub Profile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-6 md:p-8 flex items-center"
            >
              <div className="flex items-center gap-4 md:gap-8 w-full">
                <div className="relative flex-shrink-0">
                  <img 
                    src={displayData.avatarUrl} 
                    alt={displayData.username}
                    className="w-20 h-20 md:w-32 lg:w-48 md:h-32 lg:h-48 rounded-full border-2 md:border-4 border-[#2a2a2a]"
                  />                 
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#e0e0e0] tracking-tight mb-1 md:mb-2 truncate">
                    {displayData.username}
                  </h2>
                  <p className="text-xs md:text-sm text-[#666] mb-3 md:mb-6">
                    GitHub Developer
                  </p>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-xs md:text-sm">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Users className="w-3 h-3 md:w-4 md:h-4 text-[#666]" />
                      <span className="text-[#919191] font-medium">{displayData.followersCount} followers</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Package className="w-3 h-3 md:w-4 md:h-4 text-[#666]" />
                      <span className="text-[#919191] font-medium">{displayData.totalRepos} repos</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sağ: Score Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ScoreDisplay
                score={displayData.score}
                percentile={displayData.percentile}
              />
            </motion.div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="w-full">
  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <TabsList className={`bg-[#1a1a1a] border border-[#2a2a2a] p-1.5 w-full min-w-max md:min-w-0 grid ${process.env.NEXT_PUBLIC_ENABLE_PRO_TAB === 'true' ? 'grid-cols-6' : 'grid-cols-5'} rounded-xl h-auto`}>
      
      <TabsTrigger value="overview" className="...">
        <BarChart3 className="w-4 h-4 mr-1.5" />
        OVERVIEW
      </TabsTrigger>
      
      <TabsTrigger value="activity" className="...">
        <Activity className="w-4 h-4 mr-1.5" />
        ACTIVITY
      </TabsTrigger>
      
      <TabsTrigger value="skills" className="...">
        <Code className="w-4 h-4 mr-1.5" />
        SKILLS
      </TabsTrigger>
      
      <TabsTrigger value="repositories" className="...">
        <Package className="w-4 h-4 mr-1.5" />
        REPOS
      </TabsTrigger>
      
      <TabsTrigger value="compare" className="...">
        <Target className="w-4 h-4 mr-1.5" />
        COMPARE
      </TabsTrigger>
      
      {/* PRO TAB - Conditionally render */}
      {process.env.NEXT_PUBLIC_ENABLE_PRO_TAB === 'true' && (
        <TabsTrigger 
          value="pro" 
          className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          PRO
        </TabsTrigger>
      )}
    </TabsList>
  </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* ... mevcut overview content ... */}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6 mt-6">
              <ActivityTab profileData={profileData} />
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6 mt-6">
            <SkillsTab profileData={profileData} />
          </TabsContent>

            <TabsContent value="repositories" className="space-y-6 mt-6">
              <RepositoriesTab profileData={profileData} />
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare" className="space-y-6 mt-6">
              <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-8 text-center">
              <CompareTab userProfile={profileData} />
              </div>
            </TabsContent>

            {/* Pro Tab */}
            {process.env.NEXT_PUBLIC_ENABLE_PRO_TAB === 'true' && (
                <TabsContent value="pro" className="space-y-6 mt-6">
                  <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-8 text-center">
                    <ProTab 
                      isPro={effectivePlan === "PRO"} 
                      onPurchaseComplete={() => {
                        fetchProfile();
                      }}
                    />
                  </div>
                </TabsContent>
              )}
            </Tabs>               
        </>
      )}
    </div>
  );
}