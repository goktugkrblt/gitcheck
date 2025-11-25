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

  const color = getScoreColor(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <Card className="bg-[#252525] border-[#2a2a2a] p-8 h-full">
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

        {percentile !== undefined && (
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2a2a] border border-[#333]">
              <span className="text-xs font-mono text-[#666]">TOP</span>
              <span className="text-lg font-black text-[#e0e0e0]">
                {percentile}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}