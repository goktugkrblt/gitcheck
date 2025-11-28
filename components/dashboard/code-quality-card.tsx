"use client";

import { useState, useEffect } from "react";
import { Code, CheckCircle, AlertCircle, Loader2, Sparkles, TrendingUp, FileText, Link, Hash, MessageSquare, Image, Table, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientCache, ProCacheKeys } from "@/lib/client-cache";

interface ReadmeQuality {
  score: number;
  grade: string;
  details: {
    length: number;
    lengthScore: number;
    sections: number;
    sectionsScore: number;
    badges: number;
    badgesScore: number;
    codeBlocks: number;
    codeBlocksScore: number;
    links: number;
    linksScore: number;
    images: number;
    imagesScore: number;
    tables: number;
    tablesScore: number;
    toc: boolean;
    tocScore: number;
  };
  strengths: string[];
  improvements: string[];
  insights: {
    readability: number;
    completeness: number;
    professionalism: number;
  };
}

interface CodeQualityData {
  readmeQuality: ReadmeQuality;
}

interface CodeQualityCardProps {
  username: string;
}

export function CodeQualityCard({ username }: CodeQualityCardProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CodeQualityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCodeQuality = async () => {
    // 🚀 ÖNCE SESSION STORAGE'DAN YÜKLE
    const cached = ClientCache.get<CodeQualityData>(ProCacheKeys.codeQuality(username));
    if (cached) {
      console.log("⚡ INSTANT LOAD: Code Quality from session storage!");
      setData(cached);
      setLoading(false);
      return;
    }

    // Cache yoksa API'den çek
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pro/code-quality');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch code quality');
      }

      setData(result.data);
      
      // 💾 SESSION STORAGE'A KAYDET
      ClientCache.set(ProCacheKeys.codeQuality(username), result.data);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Code quality fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchCodeQuality();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-12">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-[#666] text-sm">Analyzing your code quality...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#252525] border border-red-500/20 rounded-xl p-12">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">Analysis Failed</h3>
          <p className="text-[#666] mb-6">{error}</p>
          <Button 
            onClick={fetchCodeQuality}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
          >
            Retry Analysis
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { readmeQuality } = data;
  const scorePercentage = (readmeQuality.score / 10) * 100;

  // Score color & gradient
  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-emerald-500";
    if (score >= 6) return "from-blue-500 to-cyan-500";
    if (score >= 4) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "from-green-500/10 to-emerald-500/10";
    if (score >= 6) return "from-blue-500/10 to-cyan-500/10";
    if (score >= 4) return "from-yellow-500/10 to-orange-500/10";
    return "from-red-500/10 to-pink-500/10";
  };

  const metrics = [
    {
      icon: FileText,
      label: "Length",
      score: readmeQuality.details.lengthScore,
      value: readmeQuality.details.length,
      unit: "chars",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: Hash,
      label: "Sections",
      score: readmeQuality.details.sectionsScore,
      value: readmeQuality.details.sections,
      unit: "headings",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: Sparkles,
      label: "Badges",
      score: readmeQuality.details.badgesScore,
      value: readmeQuality.details.badges,
      unit: "badges",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      icon: MessageSquare,
      label: "Code",
      score: readmeQuality.details.codeBlocksScore,
      value: readmeQuality.details.codeBlocks,
      unit: "blocks",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      icon: Link,
      label: "Links",
      score: readmeQuality.details.linksScore,
      value: readmeQuality.details.links,
      unit: "links",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: Image,
      label: "Images",
      score: readmeQuality.details.imagesScore,
      value: readmeQuality.details.images,
      unit: "images",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      icon: Table,
      label: "Tables",
      score: readmeQuality.details.tablesScore,
      value: readmeQuality.details.tables,
      unit: "tables",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: List,
      label: "TOC",
      score: readmeQuality.details.tocScore,
      value: readmeQuality.details.toc ? "Yes" : "No",
      unit: "",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="relative overflow-hidden bg-[#252525] border border-[#2a2a2a] rounded-2xl p-8">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getScoreBgColor(readmeQuality.score)} opacity-50`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreColor(readmeQuality.score)} flex items-center justify-center shadow-lg`}>
                <Code className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#e0e0e0] mb-1">
                  README Quality Analysis
                </h3>
                <p className="text-sm text-[#666]">
                  Professional documentation assessment
                </p>
              </div>
            </div>

            <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getScoreBgColor(readmeQuality.score)} border border-[#2a2a2a]`}>
              <span className={`text-2xl font-black bg-gradient-to-r ${getScoreColor(readmeQuality.score)} bg-clip-text text-transparent`}>
                {readmeQuality.grade}
              </span>
            </div>
          </div>

          {/* Giant Score Display */}
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-end gap-3">
              <div className={`text-8xl font-black bg-gradient-to-r ${getScoreColor(readmeQuality.score)} bg-clip-text text-transparent`}>
                {readmeQuality.score}
              </div>
              <div className="text-4xl text-[#666] mb-4">/10</div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-[#1f1f1f]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 3.51} 351`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`${readmeQuality.score >= 8 ? 'text-green-500' : readmeQuality.score >= 6 ? 'text-blue-500' : readmeQuality.score >= 4 ? 'text-yellow-500' : 'text-red-500'}`} stopColor="currentColor" />
                    <stop offset="100%" className={`${readmeQuality.score >= 8 ? 'text-emerald-500' : readmeQuality.score >= 6 ? 'text-cyan-500' : readmeQuality.score >= 4 ? 'text-orange-500' : 'text-pink-500'}`} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-[#e0e0e0]">{Math.round(scorePercentage)}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#1f1f1f] rounded-full overflow-hidden mb-8">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(readmeQuality.score)} transition-all duration-1000 ease-out relative`}
              style={{ width: `${scorePercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#333] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className="w-4 h-4 text-[#666]" />
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black text-[#e0e0e0]">{metric.score}</span>
                    <span className="text-sm text-[#666]">/10</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#666] mb-1 tracking-wider">{metric.label.toUpperCase()}</div>
                <div className="text-sm text-[#919191]">
                  <span className="font-bold text-[#e0e0e0]">{metric.value}</span> {metric.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-bold text-[#e0e0e0]">Readability</h4>
          </div>
          <div className="text-3xl font-black text-[#e0e0e0] mb-2">
            {readmeQuality.insights.readability}%
          </div>
          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${readmeQuality.insights.readability}%` }}
            />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="font-bold text-[#e0e0e0]">Completeness</h4>
          </div>
          <div className="text-3xl font-black text-[#e0e0e0] mb-2">
            {readmeQuality.insights.completeness}%
          </div>
          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${readmeQuality.insights.completeness}%` }}
            />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-bold text-[#e0e0e0]">Professionalism</h4>
          </div>
          <div className="text-3xl font-black text-[#e0e0e0] mb-2">
            {readmeQuality.insights.professionalism}%
          </div>
          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${readmeQuality.insights.professionalism}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        {readmeQuality.strengths.length > 0 && (
          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Strengths</h4>
            </div>
            <div className="space-y-3">
              {readmeQuality.strengths.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#919191] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {readmeQuality.improvements.length > 0 && (
          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Improvements</h4>
            </div>
            <div className="space-y-3">
              {readmeQuality.improvements.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10"
                >
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#919191] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}