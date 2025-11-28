"use client";

import { 
  Code, Shield, Activity, Target, 
  Sparkles, ArrowRight, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { CodeQualityCard } from "@/components/dashboard/code-quality-card";
import { RepoHealthCard } from "@/components/dashboard/repo-health-card";

interface ProTabProps {
  isPro?: boolean;
  username?: string; // ✅ USERNAME PROP EKLE
  onPurchaseComplete?: () => void;
}

export function ProTab({ isPro = false, username, onPurchaseComplete }: ProTabProps) {
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFeaturesModal(false);
      }
    };

    if (showFeaturesModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showFeaturesModal]);

  // PRO user görünümü
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
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#e0e0e0] tracking-tighter">
                  Premium Analytics
                </h2>
                <p className="text-purple-400 text-xs md:text-sm font-medium">
                  Advanced insights from your GitHub data
                </p>
              </div>
            </div>
            
            <div className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
              <span className="text-xs md:text-sm font-black text-white tracking-wider">
                ✨ PRO MEMBER
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <Tabs defaultValue="code-quality" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a] p-1.5 w-full min-w-max md:min-w-0 grid grid-cols-4 rounded-xl h-auto">
              
              <TabsTrigger 
                value="code-quality" 
                className="cursor-pointer data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#e0e0e0] text-[#666] hover:text-[#919191] font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
              >
                <Code className="w-4 h-4 mr-1.5" />
                CODE QUALITY
              </TabsTrigger>
              
              <TabsTrigger 
                value="repo-health"
                className="cursor-pointer data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-[#e0e0e0] text-[#666] hover:text-[#919191] font-bold text-xs tracking-wider transition-all duration-200 rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
              >
                <Shield className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">REPO HEALTH</span>
                <span className="sm:hidden">HEALTH</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="dev-patterns"
                disabled
                className="cursor-not-allowed opacity-50 text-[#666] font-bold text-xs tracking-wider rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
              >
                <Activity className="w-4 h-4 mr-1.5" />
                PATTERNS
              </TabsTrigger>
              
              <TabsTrigger 
                value="career"
                disabled
                className="cursor-not-allowed opacity-50 text-[#666] font-bold text-xs tracking-wider rounded-lg px-3 md:px-4 py-2.5 whitespace-nowrap"
              >
                <Target className="w-4 h-4 mr-1.5" />
                CAREER
              </TabsTrigger>
              
            </TabsList>
          </div>

          {/* Code Quality Tab - USERNAME PROP GEÇ */}
          <TabsContent value="code-quality" className="space-y-6 mt-6">
            {username ? (
              <CodeQualityCard username={username} />
            ) : (
              <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <p className="text-[#666]">No username provided</p>
              </div>
            )}
          </TabsContent>

          {/* Repository Health Tab - USERNAME PROP GEÇ */}
          <TabsContent value="repo-health" className="space-y-6 mt-6">
            {username ? (
              <RepoHealthCard username={username} />
            ) : (
              <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <p className="text-[#666]">No username provided</p>
              </div>
            )}
          </TabsContent>

          {/* Developer Patterns Tab */}
          <TabsContent value="dev-patterns" className="space-y-6 mt-6">
            <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-12 text-center">
              <Activity className="w-16 h-16 text-[#666] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">Developer Patterns</h3>
              <p className="text-[#666]">Coming soon...</p>
            </div>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6 mt-6">
            <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-12 text-center">
              <Target className="w-16 h-16 text-[#666] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">Career Insights</h3>
              <p className="text-[#666]">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // FREE user görünümü
  return (
    <>
      <div className="relative min-h-[600px]">
        {/* Upgrade Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#1f1f1f] border-2 border-purple-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-400">PREMIUM ANALYTICS</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-[#e0e0e0] tracking-tighter mb-2">
                Unlock Deep Insights
              </h2>
              <p className="text-[#919191]">
                Advanced analytics powered by your GitHub data
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: Code, title: "Code Quality Score", desc: "README, tests, CI/CD analysis" },
                { icon: Shield, title: "Repository Health", desc: "Maintenance & community metrics" },
                { icon: Activity, title: "Developer Patterns", desc: "Commit patterns & productivity" },
                { icon: Target, title: "Career Insights", desc: "Experience & specialization" }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#252525] rounded-lg p-4">
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
                <p className="text-xs text-purple-400 font-bold mb-2">ONE-TIME PURCHASE</p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-5xl font-black text-[#e0e0e0]">$4.99</span>
                </div>
                <p className="text-xs text-[#666]">Lifetime access • Pay once, use forever</p>
              </div>

              <div className="space-y-2 mb-4">
                {[
                  "All premium features included",
                  "Unlimited profile analysis",
                  "Advanced code quality metrics",
                  "Career readiness insights",
                  "Lifetime access - no subscription"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#919191]">
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
                    Get Lifetime Access
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-[#666] mt-3">
                💳 Secure payment via Stripe • ❌ No recurring charges
              </p>
            </div>

            {/* Learn More Button */}
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors mx-auto block font-medium"
            >
              Learn more about features →
            </button>
          </div>
        </div>

        {/* Blurred Background Content */}
        <div className="blur-sm pointer-events-none select-none opacity-40">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-[#e0e0e0] tracking-tighter">
                  Premium Analytics
                </h2>
                <p className="text-[#666] mt-1">Deep insights from your GitHub data</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40">
                <span className="text-sm font-bold text-purple-300">PRO</span>
              </div>
            </div>

            {/* Mock Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Code, title: "Code Quality", value: "8.5", subtitle: "Excellent", color: "from-blue-500 to-cyan-500" },
                { icon: Shield, title: "Repo Health", value: "92%", subtitle: "Very Healthy", color: "from-green-500 to-emerald-500" },
                { icon: Activity, title: "Productivity", value: "+15%", subtitle: "This Month", color: "from-purple-500 to-pink-500" }
              ].map((card, i) => (
                <div key={i} className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#e0e0e0] mb-2">{card.title}</h3>
                  <div className="text-4xl font-black text-[#e0e0e0] mb-1">{card.value}</div>
                  <div className="text-xs text-[#666]">{card.subtitle}</div>
                </div>
              ))}
            </div>

            {/* More Mock Content */}
            <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#e0e0e0]">Detailed Analysis</h3>
                  <p className="text-sm text-[#666]">Advanced metrics & insights</p>
                </div>
              </div>
              <div className="h-64 bg-[#1f1f1f] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-[#333] mb-2">📊</div>
                  <div className="text-[#444] text-lg">Charts & Analytics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Detail Modal */}
      {showFeaturesModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowFeaturesModal(false)}
        >
          <div 
            className="w-full max-w-3xl bg-[#1f1f1f] border-2 border-purple-500/30 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1f1f1f] border-b border-[#2a2a2a] p-6 flex items-center justify-between z-10">
              <div className="text-left ml-4">
                <h3 className="text-2xl font-black text-[#e0e0e0]">Premium Features</h3>
                <p className="text-sm text-[#666]">Everything included in your purchase</p>
              </div>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="w-10 h-10 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#666]" />
              </button>
            </div>

            {/* Modal Content */}
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
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#1f1f1f] border-t border-[#2a2a2a] p-6 z-10">
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
                    Get Started for $4.99
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