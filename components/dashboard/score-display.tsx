"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Zap, AlertCircle, Lock, Sparkles } from "lucide-react";
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
  locked: boolean;
  analysisRequired: boolean;
}

export function ScoreDisplay({ score: initialScore, percentile: initialPercentile, username }: ScoreDisplayProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate score on mount
  useEffect(() => {
    calculateScore();
  }, [username]);

  // Listen for PRO analysis completion event
  useEffect(() => {
    const handleProAnalysisComplete = () => {
      console.log('🔔 PRO analysis completed, refreshing score...');
      calculateScore();
    };

    // Listen for custom event
    window.addEventListener('proAnalysisComplete', handleProAnalysisComplete);

    return () => {
      window.removeEventListener('proAnalysisComplete', handleProAnalysisComplete);
    };
  }, [username]);

  const calculateScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/score");
      const data = await res.json();

      if (data.success) {
        // Check if score is locked (FREE user)
        if (data.locked) {
          setScoreData({
            overallScore: 0,
            grade: '?',
            strengths: [],
            improvements: [],
            isPro: false,
            locked: true,
            analysisRequired: false,
          });
          return;
        }

        // Check if analysis is required (PRO user without analysis)
        if (data.analysisRequired) {
          setScoreData({
            overallScore: 0,
            grade: '?',
            strengths: [],
            improvements: [],
            isPro: true,
            locked: false,
            analysisRequired: true,
          });
          return;
        }

        // PRO user with analysis - show score
        setScoreData({
          overallScore: data.score.overallScore,
          grade: data.score.grade,
          strengths: data.score.strengths,
          improvements: data.score.improvements,
          isPro: true,
          locked: false,
          analysisRequired: false,
        });
      } else {
        throw new Error(data.error || "Failed to calculate score");
      }
    } catch (err: any) {
      console.error("Failed to calculate score:", err);
      setError(err.message);
      
      // Fallback to locked state
      setScoreData({
        overallScore: 0,
        grade: '?',
        strengths: [],
        improvements: ["Unable to load score"],
        isPro: false,
        locked: true,
        analysisRequired: false,
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
    if (grade === '?') return "text-[#666]";
    return "text-red-400";
  };

  // ✅ Function to navigate to PRO tab
  const handleUpgradeClick = () => {
    console.log('🎯 Dispatching navigateToProTab event...');
    
    // Dispatch custom event that Dashboard will listen to
    window.dispatchEvent(new CustomEvent('navigateToProTab'));
    
    console.log('✅ Event dispatched');
  };

  if (loading) {
    return (
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-8 h-full flex items-center justify-center">
        <div className="text-[#666] font-mono text-sm">CALCULATING SCORE...</div>
      </div>
    );
  }

  const displayScore = scoreData?.overallScore ?? 0;
  const displayGrade = scoreData?.grade ?? '?';
  const isLocked = scoreData?.locked ?? false;
  const analysisRequired = scoreData?.analysisRequired ?? false;

  return (
    <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6 md:p-8 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-[#666] tracking-wider mb-1">DEVELOPER SCORE</h3>
          <p className="text-xs text-[#666]">
            {scoreData?.isPro ? "PRO Analysis" : "Premium Feature"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={calculateScore}
          disabled={loading || isLocked}
          className="text-[#666] hover:text-[#e0e0e0] hover:bg-[#2a2a2a] -mr-2"
          title="Recalculate score"
        >
          <Zap className="w-4 h-4" />
        </Button>
      </div>

      {/* Score Circle */}
      <div className="flex-1 flex items-center justify-center mb-6 relative">
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
            {!isLocked && (
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
            )}
            {isLocked && (
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="url(#lockedGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="10 5"
                className="animate-pulse"
              />
            )}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={displayScore >= 90 ? "#10b981" : displayScore >= 75 ? "#3b82f6" : displayScore >= 60 ? "#f59e0b" : "#ef4444"} />
                <stop offset="100%" stopColor={displayScore >= 90 ? "#059669" : displayScore >= 75 ? "#2563eb" : displayScore >= 60 ? "#d97706" : "#dc2626"} />
              </linearGradient>
              <linearGradient id="lockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score text - Show blurred XX when locked OR analysis required */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              {(isLocked || analysisRequired) ? (
                <>
                  <div className="text-4xl md:text-5xl font-black text-[#444] blur-sm select-none">
                    88
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-[#444] blur-sm select-none">
                    ?
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl md:text-5xl font-black text-[#e0e0e0]">
                    {displayScore}
                  </div>
                  <div className={`text-2xl md:text-3xl font-black ${getGradeColor(displayGrade)}`}>
                    {displayGrade}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Blur overlay for locked state OR analysis required */}
        {(isLocked || analysisRequired) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-[#1f1f1f]/95 via-purple-900/20 to-pink-900/20 flex flex-col items-center justify-center rounded-xl border-2 border-purple-500/30"
          >
            <div className="text-center px-6">
              {/* Animated lock icon */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
                className="mb-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/50">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Minimal description */}
              <p className="text-[#919191] text-xs mb-4">
                {isLocked ? "Unlock with PRO analysis" : "Run PRO analysis to see your score"}
              </p>
              
              {/* Clickable text instead of button */}
              <button
                onClick={handleUpgradeClick}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-bold hover:from-purple-300 hover:to-pink-300 transition-all cursor-pointer"
              >
                {isLocked ? "→ Get PRO Access" : "→ Go to PRO Tab"}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Strengths (only for unlocked PRO users) */}
      {!isLocked && scoreData?.strengths && scoreData.strengths.length > 0 && (
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
      {error && !isLocked && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-400">{error}</div>
          </div>
        </div>
      )}

      {/* CTA Messages - Only show when no overlay is visible */}
      {!isLocked && !analysisRequired && scoreData?.improvements && scoreData.improvements.length > 0 && (
        <div className="mt-auto pt-4 p-3 bg-[#2a2a2a] border border-[#333] rounded-lg">
          <div className="text-xs text-[#919191]">
            {scoreData.improvements[0]}
          </div>
        </div>
      )}
    </div>
  );
}