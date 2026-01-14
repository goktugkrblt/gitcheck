"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Star,
  TrendingUp
} from "lucide-react";

interface CodeQualityCardProps {
  data: {
    overallScore: number;
    grade: string;
    details: {
      length: number;
      sections: number;
      badges: number;
      codeBlocks: number;
      links: number;
      images: number;
      tables: number;
      toc: boolean;
    };
    strengths: string[];
    improvements: string[];
    story?: string;
    insights: {
      readability: number;
      completeness: number;
      professionalism: number;
    };
  };
}

export function CodeQualityCard({ data }: CodeQualityCardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    if (grade.startsWith('D')) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-emerald-500";
    if (score >= 6) return "from-blue-500 to-cyan-500";
    if (score >= 4) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const scorePercentage = (data.overallScore / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Score Card */}
      <div className="relative overflow-hidden bg-[#050307] border border-[#131c26] rounded-2xl p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(data.overallScore)} opacity-5`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreColor(data.overallScore)} flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-left font-black text-[#e0e0e0] mb-1">
                  README Quality
                </h3>
                <p className="text-sm text-[#666] text-left">
                  Documentation score based on completeness and structure
                </p>
              </div>
            </div>

            <div className="px-6 py-3 rounded-full bg-[#050307] border border-[#131c26]">
                <span className="text-2xl font-black text-[#e0e0e0]">
                    {data.grade}
                </span>
                </div>
          </div>

          {/* Giant Score Display */}
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-end gap-3">
              <div className={`text-8xl font-black bg-gradient-to-r ${getScoreColor(data.overallScore)} bg-clip-text text-transparent`}>
                {data.overallScore.toFixed(1)}
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
                  className="text-[#050307]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient-readme)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 3.51} 351`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-readme" x1="0%" y1="0%" x2="100%" y2="100%">
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

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#666]" />
            <h4 className="font-bold text-[#e0e0e0]">Length</h4>
          </div>
          <div className="text-2xl font-black text-[#e0e0e0]">
            {data.details.length.toLocaleString()}
          </div>
          <div className="text-xs text-[#666]">characters</div>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#666]" />
            <h4 className="font-bold text-[#e0e0e0]">Sections</h4>
          </div>
          <div className="text-2xl font-black text-[#e0e0e0]">
            {data.details.sections}
          </div>
          <div className="text-xs text-[#666]">key sections</div>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#666]" />
            <h4 className="font-bold text-[#e0e0e0]">Badges</h4>
          </div>
          <div className="text-2xl font-black text-[#e0e0e0]">
            {data.details.badges}
          </div>
          <div className="text-xs text-[#666]">status badges</div>
        </div>
      </div>

      {/* Insights Cards - ALL /10 FOR CONSISTENCY */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <h4 className="font-bold text-[#e0e0e0] mb-2">Readability</h4>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black text-blue-400">
              {data.insights.readability}
            </div>
            <div className="text-sm text-[#666] mb-1">/10</div>
          </div>
          <p className="text-xs text-[#666] mt-2 leading-relaxed text-left">
            How easy your docs are to understand - clear structure and code examples boost this.
          </p>
          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              style={{ width: `${(data.insights.readability / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <h4 className="font-bold text-[#e0e0e0] mb-2">Completeness</h4>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black text-green-400">
              {data.insights.completeness}
            </div>
            <div className="text-sm text-[#666] mb-1">/10</div>
          </div>
          <p className="text-xs text-[#666] mt-2 leading-relaxed text-left">
            Coverage of key info - installation, usage, examples. More sections = higher score.
          </p>
          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: `${(data.insights.completeness / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <h4 className="font-bold text-[#e0e0e0] mb-2">Professionalism</h4>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black text-purple-400">
              {data.insights.professionalism}
            </div>
            <div className="text-sm text-[#666] mb-1">/10</div>
          </div>
          <p className="text-xs text-[#666] mt-2 leading-relaxed text-left">
            Polish matters - badges, images, tables show attention to detail and active maintenance.
          </p>
          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${(data.insights.professionalism / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Documentation Checklist */}
      <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
        <h3 className="text-xl font-black text-[#e0e0e0] mb-6">Documentation Elements</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Code Blocks', value: data.details.codeBlocks, count: data.details.codeBlocks },
            { label: 'External Links', value: data.details.links, count: data.details.links },
            { label: 'Images/Diagrams', value: data.details.images, count: data.details.images },
            { label: 'Data Tables', value: data.details.tables, count: data.details.tables },
            { label: 'Table of Contents', value: data.details.toc, count: null },
            { label: 'Status Badges', value: data.details.badges, count: data.details.badges },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#050307]">
              <div className="flex items-center gap-3">
                {item.value ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#666] flex-shrink-0" />
                )}
                <span className={`text-sm ${item.value ? 'text-[#e0e0e0]' : 'text-[#666]'}`}>
                  {item.label}
                </span>
              </div>
              {item.count !== null && (
                <span className="text-sm font-bold text-[#919191]">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Story Section - NEW! */}
      {data.story && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-black text-[#e0e0e0]">What This Means</h4>
          </div>
          <p className="text-sm text-[#e0e0e0] leading-relaxed text-left">
            {data.story}
          </p>
        </div>
      )}

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        {data.strengths.length > 0 && (
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {data.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#919191] text-left">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {data.improvements.length > 0 && (
          <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h4 className="text-lg font-black text-[#e0e0e0]">Improvements</h4>
            </div>
            <ul className="space-y-2">
              {data.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#919191] text-left">
                  <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}