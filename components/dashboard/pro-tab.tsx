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

interface ProTabProps {
  isPro?: boolean;
  username?: string;
  onPurchaseComplete?: () => void;
}

interface ReAnalyzeState {
  isProcessing: boolean;
  showPaymentModal: boolean;
}

export function ProTab({ isPro = false, username, onPurchaseComplete }: ProTabProps) {
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const proTabRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);

  // ✅ Re-analyze state
  const [reAnalyzeState, setReAnalyzeState] = useState<ReAnalyzeState>({
    isProcessing: false,
    showPaymentModal: false
  });

  
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

  // ✅ Handle re-analysis
  const handleReAnalyze = async () => {
    if (!username) return;

    setReAnalyzeState({ isProcessing: true, showPaymentModal: false });

    try {
      // Simulate $2 payment
      const paymentResponse = await fetch('/api/simulate-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2, type: 'reanalyze' }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Payment failed');
      }

      // Clear cache to force fresh analysis
      ClientCache.remove(ProCacheKeys.allAnalysis(username));

      // Clear AI analysis cache too
      const aiClearResponse = await fetch(`/api/pro/ai-analysis?username=${username}`, {
        method: 'DELETE',
      });

      if (!aiClearResponse.ok) {
        console.warn('Failed to clear AI cache, continuing...');
      }

      // Fetch fresh analysis with force flag
      const response = await fetch(`/api/pro/analyze-all?username=${username}&force=true`);
      const result = await response.json();

      if (result.success) {
        setProData(result.data);
        // Clear AI state to force regeneration
        setAiAnalysis(null);
        setAiGeneratedAt(null);
        setAiIsCached(false);

        alert('✅ Profile re-analyzed successfully! Your PRO data has been updated with the latest information.');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Re-analysis error:', error);
      alert('❌ Re-analysis failed. Please try again.');
    } finally {
      setReAnalyzeState({ isProcessing: false, showPaymentModal: false });
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

  // ✅ PRO user view - Show full details
  if (isPro) {
    // Get analysis date from session storage or current time
    const cachedData = username ? ClientCache.get<any>(ProCacheKeys.allAnalysis(username)) : null;
    const analysisDate = cachedData?.timestamp ? new Date(cachedData.timestamp) : (proData ? new Date() : null);

    return (
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
                  onClick={() => setReAnalyzeState({ ...reAnalyzeState, showPaymentModal: true })}
                  disabled={reAnalyzeState.isProcessing}
                  className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:bg-white/20 border border-black/20 dark:border-white/20 hover:border-white/30 text-black dark:text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                >
                  {reAnalyzeState.isProcessing ? (
                    <>
                      <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Re-analyze ($2)
                    </>
                  )}
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

        {/* Re-analyze Payment Modal */}
        {reAnalyzeState.showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setReAnalyzeState({ ...reAnalyzeState, showPaymentModal: false })}>
            <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-[#050307] border-2 border-blue-500/30 rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>

                <h3 className="text-2xl font-black text-black dark:text-white mb-2">
                  Re-analyze Your Profile
                </h3>
                <p className="text-black/60 dark:text-white/60 text-sm mb-2">
                  Get fresh PRO analytics with the latest data from your GitHub profile
                </p>
                <p className="text-black/40 dark:text-white/40 text-xs mb-6">
                  Note: Your basic score updates automatically every 24 hours at no cost. This re-analysis updates your PRO insights, AI recommendations, and all advanced metrics.
                </p>

                <div className="bg-gradient-to-r from-black/5 to-black/5 dark:from-blue-500/10 dark:to-cyan-500/10 border border-black/10 dark:border-blue-500/20 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-black dark:text-white mb-1">$2.00</div>
                    <p className="text-xs text-black/60 dark:text-white/60">One-time payment for fresh analysis</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-left">
                  {[
                    "Fresh PRO analysis of all repositories",
                    "Updated career insights & AI recommendations",
                    "Latest metrics & scoring",
                    "Instant results in 30-60 seconds"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-black/80 dark:text-white/80">
                      <Check className="w-4 h-4 text-black/60 dark:text-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setReAnalyzeState({ ...reAnalyzeState, showPaymentModal: false })}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReAnalyze}
                    disabled={reAnalyzeState.isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black dark:text-white font-bold shadow-lg shadow-blue-500/20"
                  >
                    {reAnalyzeState.isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Pay $2 & Re-analyze</>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-black/40 dark:text-white/40 mt-4">
                  💳 Secure payment • This updates your existing PRO data
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ FREE user view - Analysis runs in background, show upgrade prompt
  return (
    <>
      {/* ✅ CHANGED: Removed extra margins, modal now aligns with PRO tab position */}
      <div ref={proTabRef} className="relative">
        
        {/* ✅ NEW: Silent background analysis for FREE users */}
        {loading && !proData && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-[#050307] border border-purple-500/30 rounded-lg p-4 shadow-xl z-50">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              <div className="text-sm">
                <p className="text-black dark:text-white font-medium">Calculating your score...</p>
                <p className="text-xs text-black/60 dark:text-[#666]">This will improve your profile score</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ CHANGED: Removed absolute positioning, now flows naturally */}
        <div className="flex items-center justify-center py-8 md:py-12 px-0 md:px-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#050307] border-2 border-purple-500/30 rounded-2xl p-6 px-[15px] md:p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-black/5 to-black/5 dark:from-purple-500/10 dark:to-pink-500/10 border border-black/10 dark:border-purple-500/20 mb-4">
                <Sparkles className="w-4 h-4 text-black/60 dark:text-purple-400" />
                <span className="text-sm font-bold text-black/60 dark:text-purple-400">PREMIUM ANALYTICS</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-black dark:text-[#e0e0e0] tracking-tighter mb-2">
                Unlock Detailed Insights
              </h2>
              <p className="text-black/50 dark:text-[#919191]">
                Your score is calculated! Get full PRO analytics
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              {[
                { icon: Code, title: "README Quality", desc: "Detailed documentation analysis", },
                { icon: Shield, title: "Repository Health", desc: "Maintenance & activity metrics" },
                { icon: Activity, title: "Developer Patterns", desc: "Commit patterns & productivity" },
                { icon: Target, title: "Career Insights", desc: "Experience & specialization" },
                { icon: Brain, title: "AI Career Analysis", desc: "Personalized recommendations" }
              ].map((feature, i) => (
                <div key={i} className={`flex items-start gap-3 bg-white dark:bg-[#050307] rounded-lg p-4 ${i === 4 ? 'md:col-span-2' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-[#e0e0e0] text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-black/60 dark:text-[#666]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-black/5 to-black/5 dark:from-purple-500/10 dark:to-pink-500/10 border border-black/10 dark:border-purple-500/20 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-xs text-black/60 dark:text-purple-400 font-bold mb-2">ONE-TIME PAYMENT</p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-5xl font-black text-black dark:text-[#e0e0e0]">$4.00</span>
                </div>
                <p className="text-xs text-black/60 dark:text-[#666]">
                  First analysis • $2 for re-analysis
                </p>
              </div>

              <div className="space-y-2 mb-4 text-left">
                {[
                  "All premium features included",
                  "Complete profile analysis",
                  "Advanced code quality metrics",
                  "AI-powered career insights"
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 text-sm text-black/50 dark:text-[#919191]">
                    <Check className="w-4 h-4 text-black/60 dark:text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-black dark:text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Unlock PRO – $4.00
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-black/60 dark:text-[#666] mt-3">
                💳 Secure payment • ❌ No recurring charges               
              </p>
            </div>

            {/* Learn More Button */}
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="text-sm text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors mx-auto block font-medium cursor-pointer"
            >
              Learn more about features →
            </button>
          </div>
        </div>
      </div>

      {/* Features Modal - unchanged */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm rounded-xl" onClick={() => setShowFeaturesModal(false)}>
          <div className="fixed top-[27%] md:top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#050307] border-2 border-purple-500/30 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-[#050307] border-b border-black/10 dark:border-[#131c26] p-6 flex items-center justify-between">
              <div className="text-left ml-4">
                <h3 className="text-2xl font-black text-black dark:text-[#e0e0e0]">Premium Features</h3>
                <p className="text-sm text-black/60 dark:text-[#666]">Everything included in your purchase</p>
              </div>
              <button onClick={() => setShowFeaturesModal(false)} className="w-10 h-10 rounded-lg bg-white dark:bg-[#050307] hover:bg-black/5 dark:bg-[#131c26] flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-5 h-5 text-black/60 dark:text-[#666]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-black dark:text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Code className="w-5 h-5 text-black/60 dark:text-blue-400" />
                  Code Quality Metrics
                </h4>
                <ul className="space-y-2 ml-7 text-black/50 dark:text-[#919191] text-left">
                  <li>• README quality scoring based on length, structure, sections, and badges</li>
                  <li>• Test coverage detection by analyzing test files and frameworks</li>
                  <li>• CI/CD integration analysis including GitHub Actions workflows</li>
                  <li>• Documentation depth measurement across docs folder and wiki</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black dark:text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-black/60 dark:text-green-400" />
                  Repository Health
                </h4>
                <ul className="space-y-2 ml-7 text-black/50 dark:text-[#919191] text-left">
                  <li>• Maintenance score tracking based on commit frequency and recency</li>
                  <li>• Issue response time analysis measuring community engagement</li>
                  <li>• PR merge rate statistics showing collaboration effectiveness</li>
                  <li>• Security checks overview including Dependabot and advisories</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black dark:text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-black/60 dark:text-purple-400" />
                  Developer Patterns
                </h4>
                <ul className="space-y-2 ml-7 text-black/50 dark:text-[#919191] text-left">
                  <li>• Commit patterns by hour with 0-23 detailed heatmap visualization</li>
                  <li>• Language evolution tracking showing technology adoption over time</li>
                  <li>• Productivity peak hours analysis identifying your best coding times</li>
                  <li>• Collaboration style analysis comparing solo vs team projects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black dark:text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-black/60 dark:text-yellow-400" />
                  Career Insights
                </h4>
                <ul className="space-y-2 ml-7 text-black/50 dark:text-[#919191] text-left">
                  <li>• Experience level indicator based on account age and activity depth</li>
                  <li>• Specialization score calculation showing your strongest tech areas</li>
                  <li>• Consistency rating analysis measuring your commitment patterns</li>
                  <li>• Learning curve tracking to visualize skill development over time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black dark:text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-black/60 dark:text-pink-400" />
                  AI Career Analysis
                </h4>
                <ul className="space-y-2 ml-7 text-black/50 dark:text-[#919191] text-left">
                  <li>• Personalized career roadmap generated by Claude AI analyzing your profile</li>
                  <li>• Actionable growth strategies tailored to your current skill level and goals</li>
                  <li>• Technical strengths identification highlighting your best competencies</li>
                  <li>• 90-day improvement plan with specific monthly milestones and objectives</li>
                  <li>• This week action items with 5 concrete steps you can take immediately</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-[#050307] border-t border-black/10 dark:border-[#131c26] p-6">
              <Button
                onClick={() => {
                  setShowFeaturesModal(false);
                  handlePurchase();
                }}
                disabled={isPurchasing}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-black dark:text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Unlock PRO – $4.00
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}