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
  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const scorePercentage = data.overallScore; // Already 0-100

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
                {data.overallScore.toFixed(2)}
              </div>
              <div className="text-4xl text-[#666] mb-4">/100</div>
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

      {/* Story Section - MOVED TO TOP! */}
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

      {/* Metrics Grid with explanatory text */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#666]" />
            <h4 className="font-bold text-[#e0e0e0]">Length</h4>
          </div>
          <div className="text-2xl font-black text-[#e0e0e0]">
            {data.details.length.toLocaleString()}
          </div>
          <div className="text-xs text-[#666] mb-2">characters</div>
          <p className="text-xs text-[#666] leading-relaxed text-left">
            Comprehensive docs (1500+ chars) show depth and help users understand your project better.
          </p>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#666]" />
            <h4 className="font-bold text-[#e0e0e0]">Sections</h4>
          </div>
          <div className="text-2xl font-black text-[#e0e0e0]">
            {data.details.sections}
          </div>
          <div className="text-xs text-[#666] mb-2">key sections</div>
          <p className="text-xs text-[#666] leading-relaxed text-left">
            Well-organized structure with Installation, Usage, and Features sections improves readability.
          </p>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#666]" />
            <h4 className="font-bold text-[#e0e0e0]">Badges</h4>
          </div>
          <div className="text-2xl font-black text-[#e0e0e0]">
            {data.details.badges}
          </div>
          <div className="text-xs text-[#666] mb-2">status badges</div>
          <p className="text-xs text-[#666] leading-relaxed text-left">
            Build status, version, and license badges signal active maintenance and professionalism.
          </p>
        </div>
      </div>

      {/* Quality Insights - Fine-grained scores with decimals */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <h4 className="font-bold text-[#e0e0e0] mb-2">Readability</h4>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black text-blue-400">
              {data.insights.readability.toFixed(2)}
            </div>
            <div className="text-sm text-[#666] mb-1">/100</div>
          </div>
          <p className="text-xs text-[#666] mt-2 leading-relaxed text-left">
            How easy your docs are to understand - code examples (40%), clear structure (35%), and navigation (15%) matter most.
          </p>
          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              style={{ width: `${data.insights.readability}%` }}
            />
          </div>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <h4 className="font-bold text-[#e0e0e0] mb-2">Completeness</h4>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black text-green-400">
              {data.insights.completeness.toFixed(2)}
            </div>
            <div className="text-sm text-[#666] mb-1">/100</div>
          </div>
          <p className="text-xs text-[#666] mt-2 leading-relaxed text-left">
            Coverage of essential sections (50%) like Installation/Usage/Features, plus content depth (25%) and references (15%).
          </p>
          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: `${data.insights.completeness}%` }}
            />
          </div>
        </div>

        <div className="bg-[#050307] border border-[#131c26] rounded-xl p-6">
          <h4 className="font-bold text-[#e0e0e0] mb-2">Professionalism</h4>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black text-purple-400">
              {data.insights.professionalism.toFixed(2)}
            </div>
            <div className="text-sm text-[#666] mb-1">/100</div>
          </div>
          <p className="text-xs text-[#666] mt-2 leading-relaxed text-left">
            Polish and attention to detail - badges (40%), visual aids (35%), and structured tables (25%) show care.
          </p>
          <div className="w-full h-2 bg-[#050307] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${data.insights.professionalism}%` }}
            />
          </div>
        </div>
      </div>

      {/* Documentation Elements - Detailed with explanations */}
      <div className="bg-[#050307] border border-[#131c26] rounded-xl p-8">
        <h3 className="text-xl font-black text-[#e0e0e0] mb-2">Documentation Elements</h3>
        <p className="text-sm text-[#666] mb-6 text-left">
          Essential components that make your README professional and helpful
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              label: 'Code Examples',
              value: data.details.codeBlocks,
              count: data.details.codeBlocks,
              description: 'Shows how to actually use your project - critical for adoption'
            },
            {
              label: 'External Links',
              value: data.details.links,
              count: data.details.links,
              description: 'References to docs, tutorials, or related projects add depth'
            },
            {
              label: 'Images/Diagrams',
              value: data.details.images,
              count: data.details.images,
              description: 'Screenshots and diagrams improve visual understanding'
            },
            {
              label: 'Data Tables',
              value: data.details.tables,
              count: data.details.tables,
              description: 'Organized presentation of features, options, or comparisons'
            },
            {
              label: 'Table of Contents',
              value: data.details.toc,
              count: null,
              description: 'Quick navigation for long READMEs (6+ sections)'
            },
            {
              label: 'Status Badges',
              value: data.details.badges,
              count: data.details.badges,
              description: 'Build status, version, coverage show active maintenance'
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col gap-2 p-4 rounded-lg bg-[#050307] border border-[#131c26]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.value ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#666] flex-shrink-0" />
                  )}
                  <span className={`text-sm font-bold ${item.value ? 'text-[#e0e0e0]' : 'text-[#666]'}`}>
                    {item.label}
                  </span>
                </div>
                {item.count !== null && (
                  <span className="text-sm font-black text-[#919191]">
                    {item.count}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#666] leading-relaxed text-left pl-8">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

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