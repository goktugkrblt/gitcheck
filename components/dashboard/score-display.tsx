import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  score: number;
  percentile?: number;
}

export function ScoreDisplay({ score, percentile }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "#10b981"; // green
    if (score >= 6) return "#3b82f6"; // blue
    if (score >= 4) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9) return "ELITE";
    if (score >= 8) return "EXCELLENT";
    if (score >= 7) return "GREAT";
    if (score >= 6) return "GOOD";
    if (score >= 5) return "AVERAGE";
    return "BEGINNER";
  };

  const getTier = (percentile: number) => {
    if (percentile <= 10) return { 
      label: "ELITE", 
      bg: "bg-purple-500/20",
      border: "border-purple-400",
      text: "text-purple-400",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]"
    };
    if (percentile <= 25) return { 
      label: "EXCELLENT", 
      bg: "bg-green-500/20",
      border: "border-green-400",
      text: "text-green-400",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]"
    };
    if (percentile <= 50) return { 
      label: "GOOD", 
      bg: "bg-blue-500/20",
      border: "border-blue-400",
      text: "text-blue-400",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]"
    };
    if (percentile <= 75) return { 
      label: "AVERAGE", 
      bg: "bg-yellow-500/20",
      border: "border-yellow-400",
      text: "text-yellow-400",
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.4)]"
    };
    return { 
      label: "RISING", 
      bg: "bg-gray-500/20",
      border: "border-gray-400",
      text: "text-gray-300",
      glow: "shadow-[0_0_20px_rgba(156,163,175,0.3)]"
    };
  };

  const displayPercentile = percentile !== undefined && percentile !== null && percentile > 0
    ? percentile
    : null;

  const tier = displayPercentile ? getTier(displayPercentile) : null;

  const color = getScoreColor(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <Card className="bg-[#252525] border-[#2a2a2a] p-8 h-full flex justify-center align-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <p className="text-xs font-mono text-[#666] tracking-wider mb-2">YOUR SCORE</p>
          <h3 className="text-2xl font-black text-[#e0e0e0] tracking-tighter">
            {getScoreBadge(score)}
          </h3>
        </div>

        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-[#e0e0e0] tracking-tighter">
              {score.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-[#666]">/ 10.0</span>
          </div>
        </div>

        {displayPercentile !== null && tier ? (
          <div className="text-center w-full space-y-3">
            {/* Tier Badge */}
            <div className="inline-flex">
              <div className={`px-6 py-2 rounded-full ${tier.bg} border-2 ${tier.border} ${tier.glow} transition-all duration-300`}>
                <span className={`text-sm font-black tracking-wider ${tier.text}`}>
                  {tier.label} TIER
                </span>
              </div>
            </div>

            {/* Better Than Statement */}
            <div className="space-y-1">
              <div className="text-xs text-[#666] font-mono tracking-wider">YOU RANK HIGHER THAN</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black text-[#e0e0e0]">
                  {100 - displayPercentile}%
                </span>
                <span className="text-sm text-[#666]">of developers</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2a2a] border border-[#333]">
              <span className="text-xs font-mono text-[#666]">Calculating ranking...</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}