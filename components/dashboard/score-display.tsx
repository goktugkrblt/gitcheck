"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScoreDisplayProps {
  score: number;
  percentile: number; // Keep for backwards compatibility
  username?: string;
}

interface ScoreData {
  overallScore: number;
  grade: string;
  strengths: string[];
  improvements: string[];
  isPro: boolean;
}

export function ScoreDisplay({ score: initialScore, percentile: initialPercentile, username }: ScoreDisplayProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate score on mount
  useEffect(() => {
    calculateScore();
  }, [username]);

  const calculateScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/score");
      const data = await res.json();

      if (data.success) {
        setScoreData({
          overallScore: data.score.overallScore,
          grade: data.score.grade,
          strengths: data.score.strengths,
          improvements: data.score.improvements,
          isPro: data.isPro,
        });
      } else {
        throw new Error(data.error || "Failed to calculate score");
      }
    } catch (err: any) {
      console.error("Failed to calculate score:", err);
      setError(err.message);
      
      // Fallback to initial values
      setScoreData({
        overallScore: initialScore || 0,
        grade: getGradeFromScore(initialScore || 0),
        strengths: [],
        improvements: ["Analyze your profile to get your score"],
        isPro: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeFromScore = (score: number): string => {
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'S') return "text-green-400";
    if (grade === 'A') return "text-blue-400";
    if (grade === 'B') return "text-cyan-400";
    if (grade === 'C') return "text-yellow-400";
    if (grade === 'D') return "text-orange-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-8 h-full flex items-center justify-center">
        <div className="text-[#666] font-mono text-sm">CALCULATING SCORE...</div>
      </div>
    );
  }

  const displayScore = scoreData?.overallScore ?? initialScore ?? 0;
  const displayGrade = scoreData?.grade ?? getGradeFromScore(displayScore);

  return (
    <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-[#666] tracking-wider mb-1">DEVELOPER SCORE</h3>
          <p className="text-xs text-[#666]">
            Based on your GitHub activity
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={calculateScore}
          disabled={loading}
          className="text-[#666] hover:text-[#e0e0e0] hover:bg-[#2a2a2a] -mr-2"
          title="Recalculate score"
        >
          <Zap className="w-4 h-4" />
        </Button>
      </div>

      {/* Score Circle */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative">
          {/* Background circle */}
          <svg className="w-40 h-40 md:w-48 md:h-48 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="#2a2a2a"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayScore / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                strokeDasharray: "283",
                strokeDashoffset: "0",
              }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={displayScore >= 90 ? "#10b981" : displayScore >= 75 ? "#3b82f6" : displayScore >= 60 ? "#f59e0b" : "#ef4444"} />
                <stop offset="100%" stopColor={displayScore >= 90 ? "#059669" : displayScore >= 75 ? "#2563eb" : displayScore >= 60 ? "#d97706" : "#dc2626"} />
              </linearGradient>
            </defs>
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-[#e0e0e0]">
                {displayScore}
              </div>
              <div className={`text-2xl md:text-3xl font-black ${getGradeColor(displayGrade)}`}>
                {displayGrade}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {scoreData?.strengths && scoreData.strengths.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-[#2a2a2a] mb-4">
          <div className="text-xs font-bold text-[#666] tracking-wider mb-2">STRENGTHS</div>
          {scoreData.strengths.slice(0, 2).map((strength, i) => (
            <div key={i} className="flex items-start gap-2">
              <Award className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-[#919191]">{strength}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-400">{error}</div>
          </div>
        </div>
      )}

      {/* CTA Messages */}
      {!scoreData?.isPro ? (
        <div className="mt-auto pt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
          <div className="text-xs text-purple-400 font-bold mb-1">🚀 UNLOCK HIGHER SCORE</div>
          <div className="text-xs text-[#919191]">
            Upgrade to PRO and analyze your code quality, repo health & career insights to boost your score.
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-4 p-3 bg-[#2a2a2a] border border-[#333] rounded-lg">
          <div className="text-xs text-[#919191]">
            💡 Visit the <span className="text-purple-400 font-bold">PRO tab</span> to run analysis and update your score with detailed insights.
          </div>
        </div>
      )}
    </div>
  );
}