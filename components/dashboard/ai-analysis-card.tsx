"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, Brain, Zap, AlertCircle, TrendingUp, Target, Award, Rocket, ArrowRight, Code2, Layers, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIAnalysisCardProps {
  username: string;
}

export function AIAnalysisCard({ username }: AIAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<number | null>(null);
  const [isCached, setIsCached] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/pro/ai-analysis?username=${username}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate analysis');
      }

      setAnalysis(result.data.analysis);
      setGeneratedAt(result.data.generatedAt);
      setIsCached(result.data.cached);

      console.log(`✅ AI Analysis ${result.data.cached ? 'cached' : 'generated'}`);

    } catch (err: any) {
      console.error('AI Analysis Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header - LEFT ALIGNED */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#252525] border border-[#2a2a2a] rounded-2xl"
      >
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#8b5cf6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-start gap-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
                <motion.div 
                  className="absolute inset-0 rounded-2xl border-2 border-[#8b5cf6]"
                  animate={{ 
                    scale: [1, 1.2, 1.2, 1],
                    opacity: [0.5, 0, 0, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-[#1f1f1f] animate-pulse" />
            </motion.div>
            
            <div className="text-left">
              <h3 className="text-2xl font-black text-[#e0e0e0] mb-1 flex items-center gap-2">
                AI Career Analysis              
              </h3>
              <p className="text-sm text-[#666] text-left">
                Powered by Claude 3.5 Haiku • Deep Technical Insights
              </p>
            </div>

            {analysis && generatedAt && (
              <div className="absolute top-6 right-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#252525] border border-[#2a2a2a]">
                  <Clock className="w-3 h-3 text-[#8b5cf6]" />
                  <span className="text-xs text-[#919191]">{getTimeAgo(generatedAt)}</span>
                  {isCached && (
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      Cached
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Empty State - CENTERED */}
        {!analysis && !loading && !error && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#252525] border border-[#2a2a2a] rounded-2xl p-12"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                className="inline-block mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center shadow-2xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <h4 className="text-3xl md:text-4xl font-black text-[#e0e0e0] mb-3">
                Deep Technical Career Analysis
              </h4>
              <p className="text-lg text-[#919191] mb-8 max-w-2xl mx-auto">
                Get comprehensive analysis with technical strengths, growth opportunities, and a 90-day roadmap.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                {[
                  { icon: Brain, title: "Capability Deep Dive", desc: "6 core technical skills", color: "from-purple-500/20 to-purple-600/20", borderColor: "border-purple-500/30" },
                  { icon: TrendingUp, title: "Growth Roadmap", desc: "90-day action plan", color: "from-blue-500/20 to-blue-600/20", borderColor: "border-blue-500/30" },
                  { icon: Target, title: "Immediate Actions", desc: "5 tasks this week", color: "from-green-500/20 to-green-600/20", borderColor: "border-green-500/30" }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-br ${feature.color} border ${feature.borderColor} rounded-xl p-5`}
                  >
                    <feature.icon className="w-8 h-8 text-[#e0e0e0] mb-3 mx-auto" />
                    <h5 className="font-bold text-[#e0e0e0] mb-1">{feature.title}</h5>
                    <p className="text-sm text-[#919191]">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={generateAnalysis}
                size="lg"
                className="group bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white font-bold rounded-xl px-8 py-6 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate AI Analysis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <p className="text-sm text-[#666] mt-4">
                Takes ~5 seconds • Cached for 24 hours
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading - CENTERED */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-[#1f1f1f] to-[#252525] border border-[#2a2a2a] rounded-2xl p-12"
          >
            <div className="max-w-md mx-auto text-center">
              <motion.div 
                className="w-20 h-20 mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] opacity-20 blur-xl" />
                  <div className="absolute inset-0 rounded-2xl border-4 border-[#8b5cf6]/30" />
                  <div className="absolute inset-0 rounded-2xl border-4 border-[#8b5cf6] border-t-transparent" />
                  <Brain className="absolute inset-0 m-auto w-9 h-9 text-[#8b5cf6]" />
                </div>
              </motion.div>

              <h4 className="text-2xl font-bold text-[#e0e0e0] mb-2">Analyzing Profile</h4>
              <p className="text-[#919191] mb-6">Generating technical insights...</p>

              <div className="space-y-3">
                {[
                  { icon: Code2, text: "Development patterns" },
                  { icon: TrendingUp, text: "Technical capabilities" },
                  { icon: Target, text: "Recommendations" }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center justify-center gap-3 text-sm text-[#666]"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-[#8b5cf6]"
                    />
                    <step.icon className="w-4 h-4 text-[#8b5cf6]" />
                    <span>{step.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error - CENTERED */}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#1f1f1f] border border-[#ef4444]/30 rounded-2xl p-8"
          >
            <div className="max-w-md mx-auto text-center">
              <div className="w-14 h-14 rounded-xl bg-[#ef4444]/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-[#ef4444]" />
              </div>
              <h4 className="text-xl font-bold text-[#e0e0e0] mb-2">Analysis Failed</h4>
              <p className="text-[#919191] mb-6">{error}</p>
              <Button
                onClick={generateAnalysis}
                className="bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#ef4444]"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Analysis - LEFT ALIGNED! */}
        {analysis && !loading && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1f1f1f] to-[#252525] border border-[#2a2a2a] rounded-2xl p-8 md:p-10"
          >
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl md:text-3xl font-black text-[#e0e0e0] mt-10 mb-5 first:mt-0 pb-3 border-b border-[#2a2a2a] text-left" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl md:text-2xl font-bold text-[#e0e0e0] mt-7 mb-3 flex items-center gap-2 before:content-[''] before:w-1 before:h-6 before:bg-[#8b5cf6] before:rounded-full text-left" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-lg font-bold text-[#e0e0e0] mt-5 mb-2 text-left" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-[#b4b4b4] mb-3 leading-relaxed text-left" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="space-y-1.5 mb-4 text-left" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="space-y-1.5 mb-4 text-left" {...props} />
                  ),
                  li: ({ node, children, ...props }) => {
                    const content = children?.toString() || '';
                    const isCheckbox = content.includes('[ ]') || content.includes('[x]') || content.includes('[X]');
                    
                    if (isCheckbox) {
                      const isChecked = content.includes('[x]') || content.includes('[X]');
                      const text = content.replace(/\[(x|X| )\]\s*/, '');
                      
                      return (
                        <li className="flex items-start gap-3 text-[#b4b4b4] list-none ml-0" {...props}>
                          <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isChecked ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]' : 'border-[#3a3a3a]'
                          }`}>
                            {isChecked && (
                              <svg className="w-2.5 h-2.5 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="flex-1">{text}</span>
                        </li>
                      );
                    }
                    
                    return (
                      <li className="text-[#b4b4b4] ml-5 list-disc text-left" {...props}>{children}</li>
                    );
                  },
                  strong: ({ node, ...props }) => (
                    <strong className="text-[#e0e0e0] font-bold" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) => 
                    inline ? (
                      <code className="bg-[#8b5cf6]/10 text-[#a78bfa] px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-[#1a1a1a] text-[#e0e0e0] p-3 rounded-lg text-sm font-mono overflow-x-auto my-3" {...props} />
                    ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-[#8b5cf6] pl-4 py-1 text-[#919191] my-4 bg-[#8b5cf6]/5 italic text-left" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border border-[#2a2a2a]">
                      <table className="min-w-full text-left" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-[#252525]" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-4 py-2 text-left text-sm font-bold text-[#e0e0e0] border-b border-[#2a2a2a]" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="divide-y divide-[#2a2a2a]" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-[#252525]/50 transition-colors" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-4 py-2 text-sm text-[#b4b4b4] text-left" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-[#8b5cf6] hover:text-[#a78bfa] underline" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-0 h-px bg-gradient-to-r from-[#8b5cf6]/50 via-[#8b5cf6]/20 to-transparent" {...props} />
                  ),
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}