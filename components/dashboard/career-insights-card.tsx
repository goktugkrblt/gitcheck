"use client";

import { motion } from "framer-motion";
import { 
  Target, 
  TrendingUp, 
  Code, 
  Users, 
  Zap,
  BookOpen,
  Briefcase,
  Award,
  CheckCircle,
  Star,
  Eye,
  Activity,
  Layers
} from "lucide-react";

interface CareerInsightsCardProps {
  data: {
    overallScore: number;
    skills: {
      technicalBreadth: number;
      documentation: number;
      collaboration: number;
      projectManagement: number;
      codeQuality: number;
      productivity: number;
    };
    professionalMetrics: {
      portfolioStrength: number;
      marketValue: string;
      visibility: number;
      consistency: number;
    };
    profileType: string;
    strengths: string[];
    recommendations: string[];
    story?: string;
    grade: string;
  };
}

export function CareerInsightsCard({ data }: CareerInsightsCardProps) {
  // 🛡️ SAFETY GUARDS: Provide defaults if data is incomplete
  const safeData = {
    overallScore: data?.overallScore || 0,
    skills: data?.skills || {
      technicalBreadth: 0,
      documentation: 0,
      collaboration: 0,
      projectManagement: 0,
      codeQuality: 0,
      productivity: 0,
    },
    professionalMetrics: data?.professionalMetrics || {
      portfolioStrength: 0,
      marketValue: 'Developing',
      visibility: 0,
      consistency: 0,
    },
    profileType: data?.profileType || 'Solo Developer',
    strengths: data?.strengths || [],
    recommendations: data?.recommendations || [],
    story: data?.story || '',
    grade: data?.grade || 'N/A',
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getMarketValueColor = (value: string) => {
    if (value === 'Highly Competitive') return 'text-purple-400';
    if (value === 'Competitive') return 'text-blue-400';
    if (value === 'Developing') return 'text-yellow-400';
    return 'text-[#666]';
  };

  const scorePercentage = safeData.overallScore; // Already 0-100
  const levelColor = getScoreColor(safeData.overallScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Header Card */}
      <div className="relative overflow-hidden bg-[#050307] border border-[#131c26] rounded-2xl p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${levelColor} opacity-5`} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${levelColor} flex items-center justify-center shadow-lg`}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-left font-black text-[#e0e0e0] mb-1">
                  Career Insights
                </h3>
                <p className="text-sm text-[#666] text-left">
                  Professional developer profile analysis
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${levelColor} border border-[#131c26]`}>
                <span className="text-2xl font-black text-white">
                  {safeData.grade}
                </span>
              </div>              
            </div>
          </div>

          {/* Giant Score Display */}
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-end gap-3">
              <div className={`text-8xl font-black bg-gradient-to-r ${getScoreColor(safeData.overallScore)} bg-clip-text text-transparent`}>
                {safeData.overallScore.toFixed(2)}
              </div>
              <div className="text-4xl text-[#666] mb-4">/100</div>
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
                  className="text-[#050307]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient-career)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 3.51} 351`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-career" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`${safeData.overallScore >= 80 ? 'text-green-500' : safeData.overallScore >= 60 ? 'text-blue-500' : safeData.overallScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`} stopColor="currentColor" />
                    <stop offset="100%" className={`${safeData.overallScore >= 80 ? 'text-emerald-500' : safeData.overallScore >= 60 ? 'text-cyan-500' : safeData.overallScore >= 40 ? 'text-orange-500' : 'text-pink-500'}`} stopColor="currentColor" />
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
              className={`h-full bg-gradient-to-r ${getScoreColor(safeData.overallScore)} transition-all duration-1000 ease-out relative`}
              style={{ width: `${scorePercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      

      {/* Skills Grid - ALL 6 SKILLS */}
      <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-black text-[#e0e0e0]">Skill Assessment</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Technical Breadth */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Technical Breadth</span>
              </div>
              <span className="text-lg font-bold text-[#e0e0e0]">
                {safeData.skills.technicalBreadth.toFixed(2)}/100
              </span>
            </div>
            <div className="h-3 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${safeData.skills.technicalBreadth}%` }}
              />
            </div>
          </div>

          {/* Documentation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Documentation</span>
              </div>
              <span className="text-lg font-bold text-[#e0e0e0]">
                {safeData.skills.documentation.toFixed(2)}/100
              </span>
            </div>
            <div className="h-3 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${safeData.skills.documentation}%` }}
              />
            </div>
          </div>

          {/* Collaboration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Collaboration</span>
              </div>
              <span className="text-lg font-bold text-[#e0e0e0]">
                {safeData.skills.collaboration.toFixed(2)}/100
              </span>
            </div>
            <div className="h-3 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${safeData.skills.collaboration}%` }}
              />
            </div>
          </div>

          {/* Project Management */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Project Management</span>
              </div>
              <span className="text-lg font-bold text-[#e0e0e0]">
                {safeData.skills.projectManagement.toFixed(2)}/100
              </span>
            </div>
            <div className="h-3 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${safeData.skills.projectManagement}%` }}
              />
            </div>
          </div>

          {/* Code Quality - NEW */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Code Quality</span>
              </div>
              <span className="text-lg font-bold text-[#e0e0e0]">
                {safeData.skills.codeQuality.toFixed(2)}/100
              </span>
            </div>
            <div className="h-3 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${safeData.skills.codeQuality}%` }}
              />
            </div>
          </div>

          {/* Productivity - NEW */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Productivity</span>
              </div>
              <span className="text-lg font-bold text-[#e0e0e0]">
                {safeData.skills.productivity.toFixed(2)}/100
              </span>
            </div>
            <div className="h-3 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${safeData.skills.productivity}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Metrics */}
      <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-black text-[#e0e0e0]">Professional Metrics</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Portfolio Strength */}
          <div className="bg-[#050307] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Portfolio Strength</span>
              </div>
              <span className="text-2xl font-black text-[#e0e0e0]">
                {safeData.professionalMetrics.portfolioStrength.toFixed(2)}/100
              </span>
            </div>
            <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${safeData.professionalMetrics.portfolioStrength}%` }}
              />
            </div>
            <p className="text-xs text-[#666] mt-3 leading-relaxed text-left">
              Overall portfolio quality - tech diversity, consistency, impact, and visibility combined.
            </p>
          </div>

          {/* Visibility */}
          <div className="bg-[#050307] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Visibility</span>
              </div>
              <span className="text-2xl font-black text-[#e0e0e0]">
                {safeData.professionalMetrics.visibility.toFixed(2)}/100
              </span>
            </div>
            <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${safeData.professionalMetrics.visibility}%` }}
              />
            </div>
            <p className="text-xs text-[#666] mt-3 leading-relaxed text-left">
              Your GitHub presence - docs, reviews, and collaboration make you discoverable.
            </p>
          </div>

          {/* Consistency */}
          <div className="bg-[#050307] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Consistency</span>
              </div>
              <span className="text-2xl font-black text-[#e0e0e0]">
                {safeData.professionalMetrics.consistency.toFixed(2)}/100
              </span>
            </div>
            <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${safeData.professionalMetrics.consistency}%` }}
              />
            </div>
            <p className="text-xs text-[#666] mt-3 leading-relaxed text-left">
              Long-term commitment - daily contributions, active maintenance, and sustainable pace.
            </p>
          </div>

          {/* Market Value */}
          <div className="bg-[#050307] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#666]" />
                <span className="text-sm font-medium text-[#919191]">Market Value</span>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-black ${getMarketValueColor(safeData.professionalMetrics.marketValue)} mb-2`}>
                {safeData.professionalMetrics.marketValue}
              </div>
              <p className="text-xs text-[#666]">Based on your skill profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Type & Strengths */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Type */}
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-black text-[#e0e0e0]">Developer Profile</h3>
          </div>
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 mb-3">
              <span className="text-2xl font-black text-purple-400">{safeData.profileType}</span>
            </div>
            <p className="text-sm text-[#666] mt-4">
              Your work style and collaboration patterns
            </p>
          </div>
        </div>

        {/* Strengths */}
        {safeData.strengths.length > 0 && (
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-black text-[#e0e0e0]">Top Strengths</h3>
            </div>
            <ul className="space-y-3">
              {safeData.strengths.slice(0, 4).map((strength, index) => (
                <li key={index} className="flex items-start gap-3 text-left">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#919191] leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Story Section - NEW! */}
      {safeData.story && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-black text-[#e0e0e0]">Your Career Narrative</h3>
          </div>
          <p className="text-sm text-[#e0e0e0] leading-relaxed text-left">
            {safeData.story}
          </p>
        </div>
      )}

      {/* Recommendations */}
      {safeData.recommendations.length > 0 && (
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-black text-[#e0e0e0]">Growth Recommendations</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {safeData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 bg-[#050307] rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-400">{index + 1}</span>
                </div>
                <span className="text-sm text-[#919191] leading-relaxed text-left">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}