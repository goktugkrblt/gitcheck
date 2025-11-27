"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Target, Package, Star, GitBranch, GitPullRequest, Users, Zap } from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

interface CompareTabProps {
  userProfile: any;
}

export function CompareTab({ userProfile }: CompareTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (userProfile) {
      fetchComparison();
    }
  }, [userProfile]);

  const fetchComparison = async () => {
    try {
      const res = await fetch("/api/comparison/stats");
      
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      
      const json = await res.json();
      
      const userValues = {
        repositories: userProfile.totalRepos || 0,
        stars: userProfile.totalStars || 0,
        commits: userProfile.totalCommits || 0,
        pullRequests: userProfile.totalPRs || 0,
        followers: userProfile.followersCount || 0,
        streak: userProfile.currentStreak || 0,
      };

      const normalizeValue = (value: number, max: number) => {
        if (max === 0) return 0;
        return Math.min(100, Math.round((value / max) * 100));
      };

      const normalizedUser = {
        repositories: normalizeValue(userValues.repositories, json.maxValues.repositories),
        stars: normalizeValue(userValues.stars, json.maxValues.stars),
        commits: normalizeValue(userValues.commits, json.maxValues.commits),
        pullRequests: normalizeValue(userValues.pullRequests, json.maxValues.pullRequests),
        followers: normalizeValue(userValues.followers, json.maxValues.followers),
        streak: normalizeValue(userValues.streak, json.maxValues.streak),
      };

      setData({
        user: userValues,
        average: json.average,
        top10: json.top10,
        totalUsers: json.totalUsers,
        normalized: {
          user: normalizedUser,
          average: json.normalized.average,
          top10: json.normalized.top10,
        },
      });
    } catch (error) {
      console.error("Failed to fetch comparison:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-8 text-center">
        <Target className="w-12 h-12 text-[#666] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">No Profile Data</h3>
        <p className="text-[#666] text-sm">Please analyze your profile first</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#919191] font-mono text-sm">Loading comparison...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-8 text-center">
        <Target className="w-12 h-12 text-[#666] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">Failed to Load Comparison</h3>
        <p className="text-[#666] text-sm">Please try refreshing the page</p>
      </div>
    );
  }

  const radarData = [
    {
      metric: "Repos",
      You: data.normalized.user.repositories,
      Average: data.normalized.average.repositories,
      "Top 10%": data.normalized.top10.repositories,
    },
    {
      metric: "Stars",
      You: data.normalized.user.stars,
      Average: data.normalized.average.stars,
      "Top 10%": data.normalized.top10.stars,
    },
    {
      metric: "Commits",
      You: data.normalized.user.commits,
      Average: data.normalized.average.commits,
      "Top 10%": data.normalized.top10.commits,
    },
    {
      metric: "PRs",
      You: data.normalized.user.pullRequests,
      Average: data.normalized.average.pullRequests,
      "Top 10%": data.normalized.top10.pullRequests,
    },
    {
      metric: "Followers",
      You: data.normalized.user.followers,
      Average: data.normalized.average.followers,
      "Top 10%": data.normalized.top10.followers,
    },
    {
      metric: "Streak",
      You: data.normalized.user.streak,
      Average: data.normalized.average.streak,
      "Top 10%": data.normalized.top10.streak,
    },
  ];

  const comparisons = [
    { 
      label: "Repositories", 
      user: data.user.repositories, 
      avg: data.average.repositories, 
      top: data.top10.repositories,
      icon: Package,
      color: "text-[#666]" 
    },
    { 
      label: "Stars", 
      user: data.user.stars, 
      avg: data.average.stars, 
      top: data.top10.stars,
      icon: Star,
      color: "text-[#666]" 
    },
    { 
      label: "Commits", 
      user: data.user.commits, 
      avg: data.average.commits, 
      top: data.top10.commits,
      icon: GitBranch,
      color: "text-[#666]" 
    },
    { 
      label: "Pull Requests", 
      user: data.user.pullRequests, 
      avg: data.average.pullRequests, 
      top: data.top10.pullRequests,
      icon: GitPullRequest,
      color: "text-[#666]" 
    },
    { 
      label: "Followers", 
      user: data.user.followers, 
      avg: data.average.followers, 
      top: data.top10.followers,
      icon: Users,
      color: "text-[#666]" 
    },
    { 
      label: "Streak", 
      user: data.user.streak, 
      avg: data.average.streak, 
      top: data.top10.streak,
      icon: Zap,
      color: "text-[#666]" 
    },
  ];

  const getComparisonIcon = (user: number, avg: number) => {
    if (avg === 0) return <Minus className="w-4 h-4 text-yellow-400" />;
    if (user > avg * 1.2) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (user < avg * 0.8) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-yellow-400" />;
  };

  const getComparisonText = (user: number, avg: number) => {
    if (avg === 0) return "No comparison data";
    const diff = Math.round(((user - avg) / avg) * 100);
    if (diff > 20) return `${diff}% above average`;
    if (diff < -20) return `${Math.abs(diff)}% below average`;
    return "Around average";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-[#e0e0e0] tracking-tighter">
          How You Stack Up
        </h2>
        <p className="text-[#666]">
          Benchmarked against <span className="text-[#e0e0e0] font-bold">{data.totalUsers.toLocaleString()}</span> developers on Gitrack
        </p>
      </div>

      {/* Radar Chart */}
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-bold text-[#e0e0e0] mb-6 text-center">Performance Overview</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#2a2a2a" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#666', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#666' }} />
            <Radar name="You" dataKey="You" stroke="#e0e0e0" fill="#e0e0e0" fillOpacity={0.3} strokeWidth={2} />
            <Radar name="Average" dataKey="Average" stroke="#666" fill="#666" fillOpacity={0.2} />
            <Radar name="Top 10%" dataKey="Top 10%" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
            <Legend wrapperStyle={{ color: '#919191' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f1f1f', 
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#e0e0e0'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#333] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className="text-sm font-bold text-[#666]">{item.label}</h4>
                </div>
                {getComparisonIcon(item.user, item.avg)}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-black text-[#e0e0e0]">{item.user.toLocaleString()}</span>
                    <span className="text-xs text-[#666]">You</span>
                  </div>
                  <p className="text-xs text-[#666]">{getComparisonText(item.user, item.avg)}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#2a2a2a]">
                  <div>
                    <div className="text-[#666]">Average</div>
                    <div className="text-[#919191] font-bold">{item.avg.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#666]">Top 10%</div>
                    <div className="text-purple-400 font-bold">{item.top.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
