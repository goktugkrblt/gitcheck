"use client";

import { Code, TrendingUp, Target, Zap, Shield, Users, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProTabProps {
  isPro?: boolean; // Kullanıcı pro mu değil mi
}

export function ProTab({ isPro = false }: ProTabProps) {
  // Free user görünümü (teaser)
  if (!isPro) {
    return (
      <div className="space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-400">UNLOCK PREMIUM</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-[#e0e0e0] tracking-tighter">
            Get Insights GitHub
            <br />
            Doesn't Provide
          </h2>
          
          <p className="text-lg text-[#919191] max-w-2xl mx-auto">
            Deep code analysis, career guidance, and advanced metrics to accelerate your developer journey
          </p>
        </div>

        {/* Locked Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Code,
              title: "Code Quality Score",
              description: "ESLint violations, complexity analysis, best practices",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: TrendingUp,
              title: "Velocity Trends",
              description: "Productivity tracking, burnout detection, peak hours",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Target,
              title: "Career Readiness",
              description: "Role matching, skill gaps, interview preparation",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Zap,
              title: "Impact Score",
              description: "Downstream usage, package adoption, influence",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: Shield,
              title: "Security Analysis",
              description: "Vulnerabilities, outdated deps, security score",
              color: "from-red-500 to-rose-500"
            },
            {
              icon: Users,
              title: "Team Analytics",
              description: "Collaboration insights, review quality, velocity",
              color: "from-cyan-500 to-blue-500"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="relative bg-[#252525] border border-[#2a2a2a] rounded-xl p-6 overflow-hidden group"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-[2px] bg-[#1f1f1f]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-sm font-bold text-purple-400">UPGRADE TO UNLOCK</p>
                </div>
              </div>

              {/* Content */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-bold text-[#e0e0e0] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#666]">{feature.description}</p>

              {/* Lock icon */}
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-[#666]" />
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-8">
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-6 text-center">
            Why Upgrade?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
            {[
              "Unlimited repository analysis",
              "Historical trend tracking",
              "Advanced code quality metrics",
              "Career readiness assessment",
              "Priority support",
              "Early access to new features",
              "API access",
              "Custom reports"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                <span className="text-[#919191]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-purple-400 font-bold">LIMITED TIME OFFER</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-6xl font-black text-[#e0e0e0]">$9</span>
                <div className="text-left">
                  <div className="text-[#919191]">per month</div>
                  <div className="text-[#666] text-sm">billed monthly</div>
                </div>
              </div>
            </div>

            <p className="text-[#666]">
              🎁 7-day free trial • 💳 No credit card required • ❌ Cancel anytime
            </p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-[#666]">
              Join <span className="text-purple-400 font-bold">500+</span> developers already using GitTrack Pro
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { metric: "500+", label: "Pro Users" },
            { metric: "10K+", label: "Repos Analyzed" },
            { metric: "4.9/5", label: "User Rating" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-[#e0e0e0] mb-1">{stat.metric}</div>
              <div className="text-sm text-[#666]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pro user görünümü (gerçek içerik)
  return (
    <div className="space-y-8">
      {/* Pro Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#e0e0e0] tracking-tighter">
            Premium Analytics
          </h2>
          <p className="text-[#666] mt-1">Advanced insights and metrics</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40">
          <span className="text-sm font-bold text-purple-300">PRO MEMBER</span>
        </div>
      </div>

      {/* Real Pro Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Code Quality */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-3xl font-black text-[#e0e0e0]">8.5<span className="text-[#666] text-xl">/10</span></span>
          </div>
          <h3 className="font-bold text-[#e0e0e0] mb-2">Code Quality</h3>
          <p className="text-sm text-[#666] mb-4">Your code is clean with room for improvement</p>
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </div>

        {/* Velocity */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span className="text-3xl font-black text-green-400">+15%</span>
          </div>
          <h3 className="font-bold text-[#e0e0e0] mb-2">Velocity Trend</h3>
          <p className="text-sm text-[#666] mb-4">Your productivity increased this month</p>
          <Button variant="outline" size="sm" className="w-full">
            View Trends
          </Button>
        </div>

        {/* Career */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-6 h-6 text-purple-400" />
            <span className="text-3xl font-black text-[#e0e0e0]">75<span className="text-[#666] text-xl">%</span></span>
          </div>
          <h3 className="font-bold text-[#e0e0e0] mb-2">Career Ready</h3>
          <p className="text-sm text-[#666] mb-4">Ready for Senior Frontend role</p>
          <Button variant="outline" size="sm" className="w-full">
            Get Recommendations
          </Button>
        </div>
      </div>

      {/* More sections for pro users... */}
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#666]">More pro features coming soon...</p>
      </div>
    </div>
  );
}
