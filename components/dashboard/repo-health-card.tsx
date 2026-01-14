"use client";

import { 
  Shield, 
  GitCommit, 
  GitPullRequest, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react";

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
    story?: string;
  };
  trend: 'improving' | 'stable' | 'declining';
}

interface RepoHealthCardProps {
  data: RepoHealthData;  // ✅ username → data
}

export function RepoHealthCard({ data }: RepoHealthCardProps) {
  // ✅ REMOVE ALL: useState, useEffect, fetchRepoHealth, loading, error

  const scorePercentage = data.overallScore; // Already 0-100

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
      <div className="relative overflow-hidden bg-[#050307] border border-[#131c26] rounded-2xl p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${getScoreBgColor(data.overallScore)} opacity-50`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 sm:items-center">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreColor(data.overallScore)} flex items-center justify-center shadow-lg`}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#e0e0e0] mb-1">
                  Repository Health
                </h3>
                <p className="text-sm text-[#666]">
                  Comprehensive project maintenance analysis
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-center">
              <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getScoreBgColor(data.overallScore)} border border-[#131c26]`}>
                <span className={`text-2xl font-black bg-gradient-to-r ${getScoreColor(data.overallScore)} bg-clip-text text-transparent`}>
                  {data.grade}
                </span>
              </div>

              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#050307] border border-[#131c26]`}>
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
                {data.overallScore.toFixed(2)}
              </div>
              <div className="text-4xl text-[#666] mb-4">/100</div>
            </div>

            {/* Circular Progress - SADECE BURASI YÜZDE */}
            <div className="hidden sm:block relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-[#050307]"
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
                <span className="text-2xl font-black text-[#e0e0e0]">{Math.round(scorePercentage)}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#050307] rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.overallScore)} transition-all duration-1000 ease-out relative`}
              style={{ width: `${scorePercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid - HER ŞEY /10 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Maintenance */}
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GitCommit className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Maintenance</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.maintenance.score}</span>
              <span className="text-sm text-[#666]">/10</span>
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

          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.maintenance.score)} transition-all duration-1000`}
              style={{ width: `${(data.metrics.maintenance.score / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Issue Management */}
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Issue Management</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.issueManagement.score}</span>
              <span className="text-sm text-[#666]">/10</span>
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

          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.issueManagement.score)} transition-all duration-1000`}
              style={{ width: `${(data.metrics.issueManagement.score / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Pull Requests */}
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GitPullRequest className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Pull Requests</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.pullRequests.score}</span>
              <span className="text-sm text-[#666]">/10</span>
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

          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.pullRequests.score)} transition-all duration-1000`}
              style={{ width: `${(data.metrics.pullRequests.score / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Activity */}
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#666]" />
              <h4 className="font-bold text-[#e0e0e0]">Project Activity</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#e0e0e0]">{data.metrics.activity.score}</span>
              <span className="text-sm text-[#666]">/10</span>
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

          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(data.metrics.activity.score)} transition-all duration-1000`}
              style={{ width: `${(data.metrics.activity.score / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Story Section - NEW! */}
      {data.insights.story && (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-black text-[#e0e0e0]">Health Assessment</h4>
          </div>
          <p className="text-sm text-[#e0e0e0] leading-relaxed text-left">
            {data.insights.story}
          </p>
        </div>
      )}

      {/* Insights */}
     {/* Insights - 3 BÖLÜM */}
     <div className="grid md:grid-cols-3 gap-6">
        {/* Strengths - YENİ EKLENEN */}
        {data.insights.strengths.length > 0 && (
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
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
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Concerns</h4>
            </div>
            <div className="space-y-2">
              {data.insights.concerns.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#919191] text-left">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.insights.recommendations.length > 0 && (
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
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