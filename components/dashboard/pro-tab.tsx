"use client";
import { useRef } from "react";
import { 
  Code, Shield, Activity, Target, Brain,
  Sparkles, ArrowRight, Check, X, Lock
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

export function ProTab({ isPro = false, username, onPurchaseComplete }: ProTabProps) {
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const proTabRef = useRef<HTMLDivElement>(null);

  
  const [proData, setProData] = useState<{
    readmeQuality: any;
    repoHealth: any;
    devPatterns: any;
    careerInsights: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch('/api/pro/analyze-all');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch PRO analysis');
      }

      setProData(result.data);
      
      // ✅ Dispatch event so score updates immediately
      window.dispatchEvent(new Event('proAnalysisComplete'));
      console.log('✅ PRO analysis complete - event dispatched');
      
      ClientCache.set(ProCacheKeys.allAnalysis(username), result.data);
      console.log("💾 All PRO data cached in session storage");

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
    return (
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-2 border-purple-500/20 p-4 md:p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 animate-pulse" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl md:text-2xl font-black text-[#e0e0e0] tracking-tighter">
                  Premium Analytics
                </h2>
                <p className="text-purple-400 text-xs md:text-sm font-medium">
                  Advanced insights from your GitHub data
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                <span className="text-xs md:text-sm font-black text-white tracking-wider">
                  ✨ PRO MEMBER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !proData && (
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#666]">Analyzing your GitHub data...</p>
            <p className="text-xs text-[#444] mt-2">This may take 15-30 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Data loaded - Show full tabs */}
        {proData && (
          <Tabs defaultValue="code-quality" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsList className="bg-[#131c26] border border-[#131c26] p-1.5 w-full min-w-max md:min-w-0 grid grid-cols-5 rounded-xl h-auto">
                <TabsTrigger value="code-quality" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Code className="w-4 h-4 mr-1.5" />
                  README
                </TabsTrigger>
                <TabsTrigger value="repo-health" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Shield className="w-4 h-4 mr-1.5" />
                  HEALTH
                </TabsTrigger>
                <TabsTrigger value="dev-patterns" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Activity className="w-4 h-4 mr-1.5" />
                  PATTERNS
                </TabsTrigger>
                <TabsTrigger value="career" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap">
                  <Target className="w-4 h-4 mr-1.5" />
                  CAREER
                </TabsTrigger>
                <TabsTrigger value="ai-analysis" className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:text-purple-300 text-purple-400/60 hover:text-purple-400 font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap relative">
                  <Brain className="w-4 h-4 mr-1.5" />
                  AI                
                </TabsTrigger>
              </TabsList>
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
              <AIAnalysisCard username={username || ''} />
            </TabsContent>
          </Tabs>
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
          <div className="fixed bottom-4 right-4 bg-[#050307] border border-purple-500/30 rounded-lg p-4 shadow-xl z-50">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              <div className="text-sm">
                <p className="text-white font-medium">Calculating your score...</p>
                <p className="text-xs text-[#666]">This will improve your profile score</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ CHANGED: Removed absolute positioning, now flows naturally */}
        <div className="flex items-center justify-center py-8 md:py-12 px-4">
          <div className="w-full max-w-2xl bg-[#050307] border-2 border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-400">PREMIUM ANALYTICS</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-[#e0e0e0] tracking-tighter mb-2">
                Unlock Detailed Insights
              </h2>
              <p className="text-[#919191]">
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
                <div key={i} className={`flex items-start gap-3 bg-[#050307] rounded-lg p-4 ${i === 4 ? 'md:col-span-2' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#e0e0e0] text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-[#666]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-xs text-purple-400 font-bold mb-2">ONE-TIME PAYMENT</p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-5xl font-black text-[#e0e0e0]">$2.99</span>
                </div>
                <p className="text-xs text-[#666]">
                  One-time payment • Lifetime access
                </p>
              </div>

              <div className="space-y-2 mb-4 text-center">
                {[
                  "All premium features included",
                  "Complete profile analysis",
                  "Advanced code quality metrics",
                  "AI-powered career insights"
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 text-sm text-[#919191]">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Unlock PRO – $2.99
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-[#666] mt-3">
                💳 Secure payment • ❌ No recurring charges               
              </p>
            </div>

            {/* Learn More Button */}
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors mx-auto block font-medium cursor-pointer"
            >
              Learn more about features →
            </button>
          </div>
        </div>
      </div>

      {/* Features Modal - unchanged */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm rounded-xl" onClick={() => setShowFeaturesModal(false)}>
          <div className="fixed top-[27%] md:top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto bg-[#050307] border-2 border-purple-500/30 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#050307] border-b border-[#131c26] p-6 flex items-center justify-between">
              <div className="text-left ml-4">
                <h3 className="text-2xl font-black text-[#e0e0e0]">Premium Features</h3>
                <p className="text-sm text-[#666]">Everything included in your purchase</p>
              </div>
              <button onClick={() => setShowFeaturesModal(false)} className="w-10 h-10 rounded-lg bg-[#050307] hover:bg-[#131c26] flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-5 h-5 text-[#666]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Code className="w-5 h-5 text-blue-400" />
                  Code Quality Metrics
                </h4>
                <ul className="space-y-2 ml-7 text-[#919191] text-left">
                  <li>• README quality scoring based on length, structure, sections, and badges</li>
                  <li>• Test coverage detection by analyzing test files and frameworks</li>
                  <li>• CI/CD integration analysis including GitHub Actions workflows</li>
                  <li>• Documentation depth measurement across docs folder and wiki</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                  Repository Health
                </h4>
                <ul className="space-y-2 ml-7 text-[#919191] text-left">
                  <li>• Maintenance score tracking based on commit frequency and recency</li>
                  <li>• Issue response time analysis measuring community engagement</li>
                  <li>• PR merge rate statistics showing collaboration effectiveness</li>
                  <li>• Security checks overview including Dependabot and advisories</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Developer Patterns
                </h4>
                <ul className="space-y-2 ml-7 text-[#919191] text-left">
                  <li>• Commit patterns by hour with 0-23 detailed heatmap visualization</li>
                  <li>• Language evolution tracking showing technology adoption over time</li>
                  <li>• Productivity peak hours analysis identifying your best coding times</li>
                  <li>• Collaboration style analysis comparing solo vs team projects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-yellow-400" />
                  Career Insights
                </h4>
                <ul className="space-y-2 ml-7 text-[#919191] text-left">
                  <li>• Experience level indicator based on account age and activity depth</li>
                  <li>• Specialization score calculation showing your strongest tech areas</li>
                  <li>• Consistency rating analysis measuring your commitment patterns</li>
                  <li>• Learning curve tracking to visualize skill development over time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#e0e0e0] mb-3 flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-pink-400" />
                  AI Career Analysis
                </h4>
                <ul className="space-y-2 ml-7 text-[#919191] text-left">
                  <li>• Personalized career roadmap generated by Claude AI analyzing your profile</li>
                  <li>• Actionable growth strategies tailored to your current skill level and goals</li>
                  <li>• Technical strengths identification highlighting your best competencies</li>
                  <li>• 90-day improvement plan with specific monthly milestones and objectives</li>
                  <li>• This week action items with 5 concrete steps you can take immediately</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#050307] border-t border-[#131c26] p-6">
              <Button
                onClick={() => {
                  setShowFeaturesModal(false);
                  handlePurchase();
                }}
                disabled={isPurchasing}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Unlock PRO – $2.99
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