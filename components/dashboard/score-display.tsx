"use client";

import { useSession } from "next-auth/react";
import { Lock, TrendingUp, Award, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ScoreDisplayProps {
  score: number;
  percentile: number;
  username: string;
}

interface ComponentScore {
  score: number;
  weight: number;
  source: 'pro' | 'fallback';
  description: string;
  details?: string;
}

export function ScoreDisplay({ score, percentile, username }: ScoreDisplayProps) {
  const { data: session } = useSession();
  const user = session?.user as { plan?: string } | undefined;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [components, setComponents] = useState<{
    readmeQuality?: ComponentScore;
    repoHealth?: ComponentScore;
    devPatterns?: ComponentScore;
    careerInsights?: ComponentScore;
  } | null>(null);
  const [scoringMethod, setScoringMethod] = useState<'pro' | 'fallback'>('fallback');

  // Fetch detailed score components
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        if (data.profile?.scoreComponents) {
          setComponents(data.profile.scoreComponents);
          setScoringMethod(data.profile.scoringMethod || 'fallback');
        }
      } catch (error) {
        console.error('Failed to fetch score components:', error);
      }
    };

    fetchComponents();

    // Listen for score updates
    const handleScoreUpdate = () => {
      fetchComponents();
    };

    window.addEventListener('proAnalysisComplete', handleScoreUpdate);
    return () => window.removeEventListener('proAnalysisComplete', handleScoreUpdate);
  }, []);

  // Determine grade based on score
  const getGrade = (score: number): { grade: string; color: string; label: string; bgColor: string } => {
    if (score >= 95) return { 
      grade: 'S', 
      color: 'from-yellow-400 to-orange-500', 
      label: 'Elite',
      bgColor: 'bg-yellow-500/10'
    };
    if (score >= 85) return { 
      grade: 'A', 
      color: 'from-green-400 to-emerald-500', 
      label: 'Excellent',
      bgColor: 'bg-green-500/10'
    };
    if (score >= 70) return { 
      grade: 'B', 
      color: 'from-blue-400 to-cyan-500', 
      label: 'Good',
      bgColor: 'bg-blue-500/10'
    };
    if (score >= 55) return { 
      grade: 'C', 
      color: 'from-purple-400 to-pink-500', 
      label: 'Average',
      bgColor: 'bg-purple-500/10'
    };
    if (score >= 40) return { 
      grade: 'D', 
      color: 'from-orange-400 to-red-500', 
      label: 'Below Average',
      bgColor: 'bg-orange-500/10'
    };
    return { 
      grade: 'F', 
      color: 'from-red-400 to-red-600', 
      label: 'Needs Work',
      bgColor: 'bg-red-500/10'
    };
  };

  const gradeInfo = getGrade(score);

  // Component icons and colors
  const componentConfig = {
    readmeQuality: { icon: '📝', name: 'README Quality', color: 'text-blue-400' },
    repoHealth: { icon: '🏥', name: 'Repository Health', color: 'text-green-400' },
    devPatterns: { icon: '🔄', name: 'Developer Patterns', color: 'text-purple-400' },
    careerInsights: { icon: '💼', name: 'Career Insights', color: 'text-yellow-400' },
  };

  const getComponentGrade = (componentScore: number): { grade: string; color: string } => {
    if (componentScore >= 85) return { grade: 'A', color: 'text-green-400' };
    if (componentScore >= 70) return { grade: 'B', color: 'text-blue-400' };
    if (componentScore >= 55) return { grade: 'C', color: 'text-purple-400' };
    if (componentScore >= 40) return { grade: 'D', color: 'text-orange-400' };
    return { grade: 'F', color: 'text-red-400' };
  };

  return (
    <div className="relative bg-[#050307] border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm overflow-hidden">
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradeInfo.color} opacity-5`} />
      
      {/* PRO Badge (only for PRO users) */}
      {user?.plan === "PRO" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-full px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-bold text-purple-300 tracking-wider">PRO</span>
          </div>
        </motion.div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xs font-bold text-white/40 tracking-wider mb-1">
              DEVELOPER SCORE
            </h3>
            <p className="text-sm text-white/60">
              {scoringMethod === 'pro' ? 'Based on PRO analytics' : 'Based on GitHub activity'}
            </p>
          </div>
          <Award className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${gradeInfo.color} bg-clip-text text-transparent`} />
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Score Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-6xl md:text-7xl font-black text-white tracking-tighter"
          >
            {score}
          </motion.div>

          {/* ✅ FIXED: Grade Badge with proper styling */}
          <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full ${gradeInfo.bgColor} border-2 border-white/20`}>
            <span className={`text-3xl font-black bg-gradient-to-br ${gradeInfo.color} bg-clip-text text-transparent`}>
              {gradeInfo.grade}
            </span>
            <span className="text-sm font-bold text-white">
              {gradeInfo.label}
            </span>
          </div>
        </div>

        {/* Percentile Info */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
          <TrendingUp className="w-4 h-4 text-white/40" />
          <p className="text-sm text-white/60">
            Top <span className="font-bold text-white">{100 - percentile}%</span> of developers
          </p>
        </div>

        {/* ✅ NEW: Score Breakdown Toggle */}
        {components && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
            >
              <span className="font-medium cursor-pointer">Why this score?</span>
              {showBreakdown ? (
                <ChevronUp className="w-4 h-4 group-hover:transform group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 group-hover:transform group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>

            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {/* Component Breakdown */}
                    {Object.entries(components).map(([key, component]) => {
                      const config = componentConfig[key as keyof typeof componentConfig];
                      const componentGrade = getComponentGrade(component.score);
                      
                      return (
                        <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xl">{config.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className={`text-sm font-bold ${config.color}`}>
                                    {config.name}
                                  </h4>
                                  <span className={`text-xs font-black ${componentGrade.color}`}>
                                    {componentGrade.grade}
                                  </span>
                                </div>
                                <p className="text-xs text-white/40 mt-0.5">
                                  {component.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                              <div className="text-lg font-black text-white">
                                {component.score}
                              </div>
                              <div className="text-xs text-white/40">
                                {component.weight}% weight
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${component.score}%` }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className={`h-full bg-gradient-to-r ${gradeInfo.color}`}
                            />
                          </div>

                          {/* Source indicator */}
                          {component.source === 'fallback' && component.details && (
                            <p className="text-xs text-purple-400/60 mt-2 italic">
                              💡 {component.details}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {/* Calculation Formula */}
                    <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-xs text-white/40 text-center">
                        Final Score = {components.readmeQuality && `(${components.readmeQuality.score} × 20%)`}
                        {components.repoHealth && ` + (${components.repoHealth.score} × 25%)`}
                        {components.devPatterns && ` + (${components.devPatterns.score} × 30%)`}
                        {components.careerInsights && ` + (${components.careerInsights.score} × 25%)`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Upgrade hint for FREE users */}
        {user?.plan !== "PRO" && scoringMethod === 'fallback' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <p className="text-xs text-center text-white/40">
              Upgrade to <span className="text-purple-400 font-semibold">PRO</span> for detailed analytics
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}