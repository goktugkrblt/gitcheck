"use client";
import { useRef } from "react";
import {
  Code, Shield, Activity, Target, Brain,
  Sparkles, ArrowRight, Check, X, Lock, TrendingUp, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { CodeQualityCard } from "@/components/dashboard/code-quality-card";
import { RepoHealthCard } from "@/components/dashboard/repo-health-card";
import { DevPatternsCard } from "@/components/dashboard/dev-patterns-card";
import { CareerInsightsCard } from "@/components/dashboard/career-insights-card";
import { AIAnalysisCard } from "@/components/dashboard/ai-analysis-card";
import { ClientCache, ProCacheKeys } from "@/lib/client-cache";
import { useRouter } from "next/navigation";

interface ProTabProps {
  isPro?: boolean;
  username?: string;
  onPurchaseComplete?: () => void;
}

export function ProTab({ isPro = false, username, onPurchaseComplete }: ProTabProps) {
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const proTabRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const router = useRouter();

  
  const [proData, setProData] = useState<{
    readmeQuality: any;
    repoHealth: any;
    devPatterns: any;
    careerInsights: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ AI Analysis state - persists across tab switches
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGeneratedAt, setAiGeneratedAt] = useState<number | null>(null);
  const [aiIsCached, setAiIsCached] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const response = await fetch('/api/simulate-purchase', {
        method: 'POST',
      });

      if (response.ok) {
        if (onPurchaseComplete) {
          onPurchaseComplete();
        }
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };


  // ✅ NEW: Run analysis for ALL users (FREE and PRO)
  const fetchAllProData = useCallback(async () => {
    if (!username) return;

    const cached = ClientCache.get<{
      readmeQuality: any;
      repoHealth: any;
      devPatterns: any;
      careerInsights: any;
    }>(ProCacheKeys.allAnalysis(username));

    if (cached) {
      console.log("⚡ INSTANT LOAD: All PRO data from session storage!");
      setProData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ FIX: Send username as query parameter
      const response = await fetch(`/api/pro/analyze-all?username=${encodeURIComponent(username)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch PRO analysis');
      }

      setProData(result.data);

      // ✅ Dispatch event so score updates immediately
      window.dispatchEvent(new Event('proAnalysisComplete'));
      console.log('✅ PRO analysis complete - event dispatched');

      // ✅ Cache with timestamp
      ClientCache.set(ProCacheKeys.allAnalysis(username), {
        ...result.data,
        timestamp: new Date().toISOString()
      });
      console.log("💾 All PRO data cached in session storage with timestamp");

    } catch (err: any) {
      setError(err.message);
      console.error('PRO analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleRefresh = useCallback(() => {
    if (username) {
      ClientCache.remove(ProCacheKeys.allAnalysis(username));
      fetchAllProData();
    }
  }, [username, fetchAllProData]);

  // ✅ CHANGED: Run analysis for ALL users (not just PRO)
  useEffect(() => {
    if (username) {
      fetchAllProData();
    }
  }, [username, fetchAllProData]);

  // ✅ Scroll kontrolü - en sona gelince gradient'i gizle
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px tolerance
        setShowGradient(!isAtEnd);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      // İlk yüklemede kontrol et
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [proData]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFeaturesModal(false);
      }
    };

    if (showFeaturesModal) {
      document.addEventListener('keydown', handleEscape);
      if (proTabRef.current) {
        proTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showFeaturesModal]);

  // ✅ Show PRO features to ALL users (now public)
  // Get analysis date from session storage or current time
  const cachedData = username ? ClientCache.get<any>(ProCacheKeys.allAnalysis(username)) : null;
  const analysisDate = cachedData?.timestamp ? new Date(cachedData.timestamp) : (proData ? new Date() : null);

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Hero Header with Analysis Date & Re-analyze Button */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-2 border-black/10 dark:border-purple-500/20 p-3 sm:p-4 md:p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 animate-pulse" />

          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* Top Row: Title & PRO Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black dark:text-white" />
                </div>
                <div className="text-left min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-black dark:text-[#e0e0e0] tracking-tighter truncate">
                    Premium Analytics
                  </h2>
                  <p className="text-black/60 dark:text-purple-400 text-xs sm:text-sm font-medium">
                    Advanced insights
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 flex items-center gap-1.5 sm:gap-2">
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-black dark:text-white" />
                  <span className="text-[10px] sm:text-xs md:text-sm font-black text-black dark:text-white tracking-wider whitespace-nowrap">
                    PRO MEMBER
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Analysis Date & Re-analyze Button */}
            {proData && analysisDate && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-black/10 dark:border-purple-500/20">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-black dark:text-purple-300/80">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last analyzed: {analysisDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <Button
                  onClick={() => router.push('/pricing')}
                  className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:bg-white/20 border border-black/20 dark:border-white/20 hover:border-white/30 text-black dark:text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Re-analyze ($2)
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && !proData && (
          <div className="bg-white dark:bg-[#050307] border border-black/10 dark:border-[#131c26] rounded-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-black/60 dark:text-[#666]">Analyzing your GitHub data...</p>
            <p className="text-xs text-black/60 dark:text-[#444] mt-2">This may take 15-30 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-black/10 dark:border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-black/60 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Data loaded - Show full tabs */}
        {proData && (
          <Tabs defaultValue="code-quality" className="w-full">
            <div className="relative">
              {/* Fade indicator on right to show scrollability - only on small screens */}
              {showGradient && (
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/80 dark:from-[#050307]/80 via-white/30 dark:via-[#050307]/30 to-transparent pointer-events-none z-10 md:hidden transition-opacity duration-300" />
              )}

              <div ref={scrollRef} className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TabsList className="bg-black/5 dark:bg-[#131c26] border border-black/10 dark:border-[#131c26] p-1.5 w-full min-w-max md:min-w-0 grid grid-cols-5 rounded-xl h-auto">
                <TabsTrigger value="code-quality" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 text-black/60 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Code className="w-4 h-4 mr-1.5" />
                  README
                </TabsTrigger>
                <TabsTrigger value="repo-health" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 text-black/60 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Shield className="w-4 h-4 mr-1.5" />
                  HEALTH
                </TabsTrigger>
                <TabsTrigger value="dev-patterns" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 text-black/60 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Activity className="w-4 h-4 mr-1.5" />
                  PATTERNS
                </TabsTrigger>
                <TabsTrigger value="career" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 text-black/60 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Target className="w-4 h-4 mr-1.5" />
                  CAREER
                </TabsTrigger>
                <TabsTrigger value="ai-analysis" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 text-black/60 dark:text-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap relative">
                  <Brain className="w-4 h-4 mr-1.5" />
                  AI
                </TabsTrigger>
              </TabsList>
              </div>
            </div>

            <TabsContent value="code-quality" className="space-y-6 mt-6">
              <CodeQualityCard data={proData.readmeQuality} />
            </TabsContent>
            <TabsContent value="repo-health" className="space-y-6 mt-6">
              <RepoHealthCard data={proData.repoHealth} />
            </TabsContent>
            <TabsContent value="dev-patterns" className="space-y-6 mt-6">
              <DevPatternsCard data={proData.devPatterns} />
            </TabsContent>
            <TabsContent value="career" className="space-y-6 mt-6">
              <CareerInsightsCard data={proData.careerInsights} />
            </TabsContent>
            <TabsContent value="ai-analysis" className="space-y-6 mt-6">
              <AIAnalysisCard
                username={username || ''}
                analysis={aiAnalysis}
                setAnalysis={setAiAnalysis}
                loading={aiLoading}
                setLoading={setAiLoading}
                error={aiError}
                setError={setAiError}
                generatedAt={aiGeneratedAt}
                setGeneratedAt={setAiGeneratedAt}
                isCached={aiIsCached}
                setIsCached={setAiIsCached}
              />
            </TabsContent>
          </Tabs>
        )}

      </div>
    </>
  );
}