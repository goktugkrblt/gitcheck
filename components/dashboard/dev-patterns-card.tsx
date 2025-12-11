"use client";

import { 
  TrendingUp,
  Clock,
  Zap,
  Users,
  Code,
  Target,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface DevPatternsData {
  overallScore: number;
  grade: string;
  patterns: {
    commitPatterns: {
      score: number;
      hourlyActivity: number[];
      weeklyActivity: number[];
      peakHours: number[];
      peakDays: string[];
      commitMessageQuality: number;
      consistency: number;
    };
    codeQuality: {
      score: number;
      branchManagement: number;
      commitSize: number;
      reviewEngagement: number;
      documentationHabits: number;
    };
    workLifeBalance: {
      score: number;
      weekendActivity: number;
      nightCoding: number;
      burnoutRisk: number;
      sustainablePace: number;
    };
    collaboration: {
      score: number;
      soloVsTeam: number;
      prResponseTime: number;
      reviewParticipation: number;
      crossRepoWork: number;
    };
    technology: {
      score: number;
      modernFrameworks: number;
      cuttingEdge: number;
      legacyMaintenance: number;
      learningCurve: number;
    };
    productivity: {
      score: number;
      peakHours: number[];
      deepWorkSessions: number;
      contextSwitching: number;
      flowState: number;
    };
  };
  insights: {
    strengths: string[];
    patterns: string[];
    recommendations: string[];
  };
  developerPersona: string;
}

interface DevPatternsCardProps {
  data: DevPatternsData;  // ✅ username → data
}

export function DevPatternsCard({ data }: DevPatternsCardProps) {
  // ✅ REMOVE ALL: useState, useEffect, fetchDevPatterns, loading, error

  const scorePercentage = (data.overallScore / 10) * 100;

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

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="relative overflow-hidden bg-[#252525] border border-[#2a2a2a] rounded-2xl p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${getScoreBgColor(data.overallScore)} opacity-50`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 sm:items-center">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreColor(data.overallScore)} flex items-center justify-center shadow-lg`}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#e0e0e0] mb-1">
                  Developer Patterns
                </h3>
                <p className="text-sm text-[#666]">
                  Deep insights into your coding behavior
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-center">
              <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getScoreBgColor(data.overallScore)} border border-[#2a2a2a]`}>
                <span className={`text-2xl font-black bg-gradient-to-r ${getScoreColor(data.overallScore)} bg-clip-text text-transparent`}>
                  {data.grade}
                </span>
              </div>

              <div className="hidden sm:block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-[#2a2a2a]">
                <span className="text-sm font-bold text-purple-400">
                  {data.developerPersona}
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
              <div className="text-4xl text-[#666] mb-4">/10</div>
            </div>

            {/* Circular Progress */}
            <div className="hidden sm:block relative w-32 h-32">
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
                  stroke="url(#gradient-dev)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 3.51} 351`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-dev" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`${data.overallScore >= 8 ? 'text-green-500' : data.overallScore >= 6 ? 'text-blue-500' : data.overallScore >= 4 ? 'text-yellow-500' : 'text-red-500'}`} stopColor="currentColor" />
                    <stop offset="100%" className={`${data.overallScore >= 8 ? 'text-emerald-500' : data.overallScore >= 6 ? 'text-cyan-500' : data.overallScore >= 4 ? 'text-orange-500' : 'text-pink-500'}`} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-[#e0e0e0]">{Math.round(scorePercentage)}%</span>
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

      {/* TODO: 24-Hour Heatmap */}
      {/* TODO: 6 Metric Cards */}
      {/* TODO: Weekly Pattern Chart */}
      {/* TODO: Insights */}
      
      <div className="text-center text-[#666] py-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Commit Patterns */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#666]" />
                <h4 className="font-bold text-[#e0e0e0]">Commit Patterns</h4>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">{data.patterns.commitPatterns.score}</span>
                <span className="text-sm text-[#666]">/10</span>
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Peak Hours</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.commitPatterns.peakHours.join(', ')}:00
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Most Active</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.commitPatterns.peakDays[0]}
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Consistency</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.commitPatterns.consistency}%
                </span>
            </div>
            </div>

            <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(data.patterns.commitPatterns.score)} transition-all duration-1000`}
                style={{ width: `${(data.patterns.commitPatterns.score / 10) * 100}%` }}
            />
            </div>
        </div>

        {/* 2. Code Quality */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-[#666]" />
                <h4 className="font-bold text-[#e0e0e0]">Code Quality</h4>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">{data.patterns.codeQuality.score}</span>
                <span className="text-sm text-[#666]">/10</span>
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Branch Mgmt</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.codeQuality.branchManagement}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Commit Size</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.codeQuality.commitSize}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Documentation</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.codeQuality.documentationHabits}%
                </span>
            </div>
            </div>

            <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(data.patterns.codeQuality.score)} transition-all duration-1000`}
                style={{ width: `${(data.patterns.codeQuality.score / 10) * 100}%` }}
            />
            </div>
        </div>

        {/* 3. Work-Life Balance */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#666]" />
                <h4 className="font-bold text-[#e0e0e0]">Work-Life Balance</h4>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">{data.patterns.workLifeBalance.score}</span>
                <span className="text-sm text-[#666]">/10</span>
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Weekend Activity</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.workLifeBalance.weekendActivity}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Night Coding</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.workLifeBalance.nightCoding}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Burnout Risk</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.workLifeBalance.burnoutRisk}%
                </span>
            </div>
            </div>

            <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(data.patterns.workLifeBalance.score)} transition-all duration-1000`}
                style={{ width: `${(data.patterns.workLifeBalance.score / 10) * 100}%` }}
            />
            </div>
        </div>

        {/* 4. Collaboration */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#666]" />
                <h4 className="font-bold text-[#e0e0e0]">Collaboration</h4>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">{data.patterns.collaboration.score}</span>
                <span className="text-sm text-[#666]">/10</span>
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Solo vs Team</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.collaboration.soloVsTeam}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">PR Response</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.collaboration.prResponseTime}h
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Review Rate</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.collaboration.reviewParticipation}%
                </span>
            </div>
            </div>

            <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(data.patterns.collaboration.score)} transition-all duration-1000`}
                style={{ width: `${(data.patterns.collaboration.score / 10) * 100}%` }}
            />
            </div>
        </div>

        {/* 5. Technology */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#666]" />
                <h4 className="font-bold text-[#e0e0e0]">Technology</h4>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">{data.patterns.technology.score}</span>
                <span className="text-sm text-[#666]">/10</span>
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Modern Stack</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.technology.modernFrameworks}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Cutting Edge</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.technology.cuttingEdge}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Learning Curve</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.technology.learningCurve}%
                </span>
            </div>
            </div>

            <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(data.patterns.technology.score)} transition-all duration-1000`}
                style={{ width: `${(data.patterns.technology.score / 10) * 100}%` }}
            />
            </div>
        </div>

        {/* 6. Productivity */}
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#666]" />
                <h4 className="font-bold text-[#e0e0e0]">Productivity</h4>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">{data.patterns.productivity.score}</span>
                <span className="text-sm text-[#666]">/10</span>
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Deep Work</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.productivity.deepWorkSessions} sessions
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Context Switch</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.productivity.contextSwitching}%
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Flow State</span>
                <span className="font-bold text-[#e0e0e0]">
                {data.patterns.productivity.flowState}%
                </span>
            </div>
            </div>

            <div className="w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
            <div 
                className={`h-full bg-gradient-to-r ${getScoreColor(data.patterns.productivity.score)} transition-all duration-1000`}
                style={{ width: `${(data.patterns.productivity.score / 10) * 100}%` }}
            />
            </div>
        </div>
        
        </div>
        {/* Legend */}  
</div>
     {/* 24-Hour Activity Heatmap - TAM GENİŞLİK */}
<div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
  <div className="flex items-center gap-3 mb-6">
    <Clock className="w-6 h-6 text-purple-400" />
    <div>
      <h3 className="text-xl font-black text-[#e0e0e0]">24-Hour Activity Pattern</h3>
      <p className="text-sm text-[#666]">Your coding activity throughout the day</p>
    </div>
  </div>

  {/* Heatmap Grid */}
  <div className="space-y-2">
    <div className="grid grid-cols-24 gap-1">
      {data.patterns.commitPatterns.hourlyActivity.map((activity, hour) => {
        const intensity = activity / 100;
        const isPeak = data.patterns.commitPatterns.peakHours.includes(hour);
        
        return (
          <div
            key={hour}
            className="relative group"
          >
            <div
              className={`
                h-16 rounded transition-all duration-200
                ${isPeak ? 'ring-2 ring-purple-400' : ''}
                ${activity === 0 ? 'bg-[#1f1f1f]' : ''}
              `}
              style={{
                backgroundColor: activity > 0 
                  ? `rgba(168, 85, 247, ${0.2 + intensity * 0.8})` 
                  : undefined
              }}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {hour}:00 - {activity}%
            </div>
          </div>
        );
      })}
    </div>

    {/* Hour Labels */}
    <div className="grid grid-cols-24 gap-1 text-xs text-[#666] text-center mt-2">
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="font-mono">
          {i % 3 === 0 ? i : ''}
        </div>
      ))}
    </div>
  </div>

  {/* Legend */}
  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[#2a2a2a]">
    <div className="flex items-center gap-2 text-sm text-[#666]">
      <div className="w-4 h-4 rounded bg-[#1f1f1f] border border-[#2a2a2a]" />
      <span>No activity</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-[#666]">
      <div className="w-4 h-4 rounded bg-purple-500/30" />
      <span>Low</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-[#666]">
      <div className="w-4 h-4 rounded bg-purple-500/60" />
      <span>Medium</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-[#666]">
      <div className="w-4 h-4 rounded bg-purple-500" />
      <span>High</span>
    </div>
  </div>
</div>

{/* Insights Section - 3 SÜTUN */}
<div className="grid md:grid-cols-3 gap-6">
  {/* Strengths */}
  {data.insights.strengths.length > 0 && (
    <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <h4 className="text-lg font-black text-[#e0e0e0]">Strengths</h4>
      </div>
      <div className="text-left space-y-2">
        {data.insights.strengths.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-[#919191]">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Patterns */}
  {data.insights.patterns.length > 0 && (
    <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h4 className="text-lg font-black text-[#e0e0e0]">Your Patterns</h4>
      </div>
      <div className="text-left space-y-2">
        {data.insights.patterns.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-[#919191]">
            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
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
      <div className="text-left space-y-2">
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