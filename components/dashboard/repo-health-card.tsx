"use client";

import { useState, useEffect } from "react";
import { 
  Shield, 
  GitCommit, 
  GitPullRequest, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Loader2, 
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  GitBranch,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientCache, ProCacheKeys } from "@/lib/client-cache";

interface RepoHealthData {
  overallScore: number;
  grade: string;
  metrics: {
    maintenance: {
      score: number;
      commitFrequency: number;
      lastCommitDays: number;
      activeDaysRatio: number;
    };
    issueManagement: {
      score: number;
      averageResolutionDays: number;
      openClosedRatio: number;
      totalIssues: number;
      closedIssues: number;
    };
    pullRequests: {
      score: number;
      mergeRate: number;
      averageMergeDays: number;
      totalPRs: number;
      mergedPRs: number;
    };
    activity: {
      score: number;
      contributorCount: number;
      staleBranches: number;
      stalePRs: number;
    };
  };
  insights: {
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
  trend: 'improving' | 'stable' | 'declining';
}

interface RepoHealthCardProps {
  username: string;
}

export function RepoHealthCard({ username }: RepoHealthCardProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RepoHealthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRepoHealth = async () => {
    // 🚀 ÖNCE SESSION STORAGE'DAN YÜKLE
    const cached = ClientCache.get<RepoHealthData>(ProCacheKeys.repoHealth(username));
    if (cached) {
      console.log("⚡ INSTANT LOAD: Repo Health from session storage!");
      setData(cached);
      setLoading(false);
      return;
    }

    // Cache yoksa API'den çek
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pro/repo-health');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch repository health');
      }

      setData(result.data.repoHealth);
      
      // 💾 SESSION STORAGE'A KAYDET
      ClientCache.set(ProCacheKeys.repoHealth(username), result.data.repoHealth);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Repository health fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchRepoHealth();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-12">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
          <p className="text-[#666] text-sm">Analyzing repository health...</p>
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
            onClick={fetchRepoHealth}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
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

  const scorePercentage = data.overallScore;

  // Score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-green-500/10 to-emerald-500/10";
    if (score >= 60) return "from-blue-500/10 to-cyan-500/10";
    if (score >= 40) return "from-yellow-500/10 to-orange-500/10";
    return "from-red-500/10 to-pink-500/10";
  };

  const getTrendIcon = () => {
    if (data.trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (data.trend === 'declining') return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-yellow-400" />;
  };

  const getTrendText = () => {
    if (data.trend === 'improving') return 'Improving';
    if (data.trend === 'declining') return 'Declining';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (data.trend === 'improving') return 'text-green-400';
    if (data.trend === 'declining') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="space-y-6">
      {/* Main Health Score Card */}
      <div className="relative overflow-hidden bg-[#252525] border border-[#2a2a2a] rounded-2xl p-8">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getScoreBgColor(data.overallScore)} opacity-50`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreColor(data.overallScore)} flex items-center justify-center shadow-lg`}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#e0e0e0] mb-1">
                  Repository Health
                </h3>
                <p className="text-sm text-[#666]">
                  Comprehensive project maintenance analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getScoreBgColor(data.overallScore)} border border-[#2a2a2a]`}>
                <span className={`text-2xl font-black bg-gradient-to-r ${getScoreColor(data.overallScore)} bg-clip-text text-transparent`}>
                  {data.grade}
                </span>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[#252525] border border-[#2a2a2a]`}>
                {getTrendIcon()}
                <span className={`text-sm font-bold ${getTrendColor()}`}>
                  {getTrendText()}
                </span>
              </div>
            </div>
          </div>

          {/* Giant Score Display */}
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-end gap-3">
              <div className={`text-8xl font-black bg-gradient-to-r ${getScoreColor(data.overallScore)} bg-clip-text text-transparent`}>
                {data.overallScore}
              </div>
              <div className="text-4xl text-[#666] mb-4">/100</div>
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
                  stroke="url(#gradient-health)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 3.51} 351`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-health" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`${data.overallScore >= 80 ? 'text-green-500' : data.overallScore >= 60 ? 'text-blue-500' : data.overallScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`} stopColor="currentColor" />
                    <stop offset="100%" className={`${data.overallScore >= 80 ? 'text-emerald-500' : data.overallScore >= 60 ? 'text-cyan-500' : data.overallScore >= 40 ? 'text-orange-500' : 'text-pink-500'}`} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-[#e0e0e0]">{scorePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.overallScore)} transition-all duration-1000 ease-out relative`}
              style={{ width: `${scorePercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Maintenance */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GitCommit className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Maintenance</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.maintenance.score}</span>
              <span className="text-sm text-[#666]">/100</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Commit Frequency</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.maintenance.commitFrequency}/week</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Last Commit</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.maintenance.lastCommitDays} days ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Active Days</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.maintenance.activeDaysRatio}%</span>
            </div>
          </div>

          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.maintenance.score)} transition-all duration-1000`}
              style={{ width: `${data.metrics.maintenance.score}%` }}
            />
          </div>
        </div>

        {/* Issue Management */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Issue Management</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.issueManagement.score}</span>
              <span className="text-sm text-[#666]">/100</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Avg Resolution Time</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.issueManagement.averageResolutionDays} days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Close Rate</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.issueManagement.openClosedRatio}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Total Issues</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.issueManagement.totalIssues} ({data.metrics.issueManagement.closedIssues} closed)</span>
            </div>
          </div>

          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.issueManagement.score)} transition-all duration-1000`}
              style={{ width: `${data.metrics.issueManagement.score}%` }}
            />
          </div>
        </div>

        {/* Pull Requests */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GitPullRequest className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Pull Requests</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.pullRequests.score}</span>
              <span className="text-sm text-[#666]">/100</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Merge Rate</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.pullRequests.mergeRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Avg Merge Time</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.pullRequests.averageMergeDays} days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Total PRs</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.pullRequests.totalPRs} ({data.metrics.pullRequests.mergedPRs} merged)</span>
            </div>
          </div>

          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.pullRequests.score)} transition-all duration-1000`}
              style={{ width: `${data.metrics.pullRequests.score}%` }}
            />
          </div>
        </div>

        {/* Activity */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Project Activity</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.activity.score}</span>
              <span className="text-sm text-[#666]">/100</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Contributors</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.activity.contributorCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Stale Branches</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.activity.staleBranches}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Stale PRs</span>
              <span className="font-bold text-[#e0e0e0]">{data.metrics.activity.stalePRs}</span>
            </div>
          </div>

          <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.activity.score)} transition-all duration-1000`}
              style={{ width: `${data.metrics.activity.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Strengths */}
        {data.insights.strengths.length > 0 && (
          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Strengths</h4>
            </div>
            <div className="space-y-2">
              {data.insights.strengths.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#919191]">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concerns */}
        {data.insights.concerns.length > 0 && (
          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Concerns</h4>
            </div>
            <div className="space-y-2">
              {data.insights.concerns.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#919191]">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.insights.recommendations.length > 0 && (
          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Recommendations</h4>
            </div>
            <div className="space-y-2 text-left">
              {data.insights.recommendations.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#919191]">
                  <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}