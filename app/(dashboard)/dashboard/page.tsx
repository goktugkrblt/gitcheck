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
  Sparkles,
  Brain
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
    setProAnalysisStatus('running');
    setAnalysisProgress(0);
    
    console.log('🚀 Starting background PRO analysis...');
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return 90; // Stop at 90%, wait for actual completion
          return prev + 5;
        });
      }, 1000);

      const response = await fetch('/api/pro/analyze-all');
      const result = await response.json();

      clearInterval(progressInterval);

      if (result.success) {
        console.log('✅ Background PRO analysis complete');
        setProAnalysisStatus('complete');
        setAnalysisProgress(100);
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('proAnalysisComplete'));
        
        // Refresh profile data
        await fetchProfile();
      } else {
        console.error('❌ PRO analysis failed:', result.error);
        setProAnalysisStatus('complete'); // Still show score even if analysis fails
      }
    } catch (error) {
      console.error('❌ Background analysis error:', error);
      setProAnalysisStatus('complete'); // Still show score even on error
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        setProfileData(data.profile);
        setHasProfile(true);
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

      {/* ✅ NEW: Analysis Progress Indicator */}
      {proAnalysisStatus === 'running' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-bold text-sm">
                  <Brain className="w-4 h-4 inline mr-2" />
                  Analyzing your GitHub profile...
                </p>
                <span className="text-purple-400 text-xs font-mono">{analysisProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2">
                Please wait, this may take 20-30 seconds. Your score will appear when ready.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-black text-white tracking-tighter">
          DASHBOARD
        </h1>
        <p className="text-white/40 text-sm mt-1">
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
          className="bg-white/5 rounded-2xl p-16 border border-white/10 text-center backdrop-blur-sm"
        >
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-10 w-10 text-white/60" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              ANALYZE YOUR PROFILE
            </h2>
            <p className="text-white/60 font-light">
              Get insights into your coding activity, discover your strengths, and see how you compare to other developers.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 px-12 py-7 text-base font-bold rounded-2xl transition-colors duration-300"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "ANALYZING..." : "START ANALYSIS"}
            </Button>
            <p className="text-xs text-white/40 font-mono">
              ✓ FREE SCAN • NO LIMITS
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#050307] rounded-xl border border-white/10 p-6 md:p-8 flex items-center backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 md:gap-8 w-full">
                <div className="relative flex-shrink-0">
                  <img 
                    src={displayData.avatarUrl} 
                    alt={displayData.username}
                    className="w-20 h-20 md:w-32 lg:w-48 md:h-32 lg:h-48 rounded-full border-2 md:border-4 border-white/10"
                  />                 
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight mb-1 md:mb-2 truncate">
                    {displayData.username}
                  </h2>
                  <p className="text-xs md:text-sm text-white/40 mb-3 md:mb-6">
                    GitHub Developer
                  </p>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-xs md:text-sm">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Users className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
                      <span className="text-white/60 font-medium">{displayData.followersCount} followers</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Package className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
                      <span className="text-white/60 font-medium">{displayData.totalRepos} repos</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ✅ CHANGED: Only show score after analysis completes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {shouldShowScore ? (
                <ScoreDisplay
                  score={displayData.score}
                  percentile={displayData.percentile}
                  username={displayData.username}
                />
              ) : (
                <div className="bg-[#050307] rounded-xl border border-purple-500/30 p-6 md:p-8 flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-bold text-white mb-2">Calculating Your Score</h3>
                    <p className="text-white/40 text-sm">
                      Analyzing {displayData.totalCommits} commits across {displayData.totalRepos} repositories...
                    </p>
                    <p className="text-purple-400 text-xs mt-3 font-mono">
                      {analysisProgress}% complete
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsList className="bg-white/5 border border-white/10 p-1.5 w-full min-w-max md:min-w-0 grid grid-cols-6 rounded-xl h-auto backdrop-blur-sm">
                
                <TabsTrigger 
                  value="overview" 
                  className="cursor-pointer data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  OVERVIEW
                </TabsTrigger>
                
                <TabsTrigger 
                  value="activity" 
                  className="cursor-pointer data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Activity className="w-4 h-4 mr-1.5" />
                  ACTIVITY
                </TabsTrigger>
                
                <TabsTrigger 
                  value="skills" 
                  className="cursor-pointer data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Code className="w-4 h-4 mr-1.5" />
                  SKILLS
                </TabsTrigger>
                
                <TabsTrigger 
                  value="repositories" 
                  className="cursor-pointer data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Package className="w-4 h-4 mr-1.5" />
                  REPOS
                </TabsTrigger>
                
                <TabsTrigger 
                  value="compare" 
                  className="cursor-pointer data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 hover:text-white/60 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Target className="w-4 h-4 mr-1.5" />
                  COMPARE
                </TabsTrigger>
                
                <TabsTrigger 
                  value="pro" 
                  className="relative cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  PRO                  
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                  Overview
                </h2>
                <p className="text-white/40">
                  Your core GitHub metrics at a glance
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/40 tracking-wider">TOTAL COMMITS</h3>
                    <GitBranch className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{displayData.totalCommits}</p>
                  <p className="text-xs text-white/40">{displayData.averageCommitsPerDay}/day average</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/40 tracking-wider">PULL REQUESTS</h3>
                    <GitPullRequest className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{displayData.totalPRs}</p>
                  <p className="text-xs text-white/40">{displayData.mergedPRs} merged</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/40 tracking-wider">CURRENT STREAK</h3>
                    <Zap className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{displayData.currentStreak} days</p>
                  <p className="text-xs text-white/40">Longest: {displayData.longestStreak} days</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/40 tracking-wider">COMMUNITY</h3>
                    <Users className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{displayData.followersCount}</p>
                  <p className="text-xs text-white/40">{displayData.organizationsCount} organizations</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/40 tracking-wider">ISSUES OPENED</h3>
                    <Activity className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{displayData.totalIssuesOpened || 0}</p>
                  <p className="text-xs text-white/40">Contributions made</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/40 tracking-wider">CODE REVIEWS</h3>
                    <Code className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{displayData.totalReviews || 0}</p>
                  <p className="text-xs text-white/40">Reviews given</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
              <ActivityTab profileData={profileData} />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-6">
              <SkillsTab profileData={profileData} />
            </TabsContent>

            <TabsContent value="repositories" className="space-y-6 mt-6">
              <RepositoriesTab profileData={profileData} />
            </TabsContent>

            <TabsContent value="compare" className="space-y-6 mt-6">
              <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center backdrop-blur-sm">
                <CompareTab userProfile={profileData} />
              </div>
            </TabsContent>
            
            <TabsContent value="pro" className="space-y-6 mt-6">
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
        </>
      )}
    </div>
  );
}