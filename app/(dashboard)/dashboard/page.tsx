import { StatsCard } from "@/components/dashboard/stats-card";
import { ScoreDisplay } from "@/components/dashboard/score-display";
import { Star, GitFork, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageChart } from "@/components/dashboard/language-chart";
import { TopRepos } from "@/components/dashboard/top-repos";

export default function DashboardPage() {
  // Şimdilik mock data
  const hasProfile = true;
  const mockData = {
    score: 7.8,
    percentile: 85,
    totalRepos: 42,
    totalStars: 1234,
    totalForks: 89,
    languages: {
      TypeScript: 45.2,
      JavaScript: 30.5,
      Python: 15.3,
      Go: 5.2,
      Rust: 3.8,
    },
    topRepos: [
      {
        name: "awesome-project",
        stars: 234,
        forks: 45,
        language: "TypeScript",
        description: "A really cool project that does amazing things",
      },
      {
        name: "api-server",
        stars: 156,
        forks: 23,
        language: "Go",
        description: "High-performance API server",
      },
      {
        name: "ml-toolkit",
        stars: 89,
        forks: 12,
        language: "Python",
        description: "Machine learning utilities and helpers",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's your GitHub profile overview.
          </p>
        </div>
      </div>

      {!hasProfile ? (
        <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <TrendingUp className="h-16 w-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">
              Analyze Your GitHub Profile
            </h2>
            <p className="text-gray-400">
              Get insights into your coding activity, discover your strengths,
              and see how you compare to other developers.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Analysis
            </Button>
            <p className="text-xs text-gray-500">
              ✨ Free analysis • No credit card required
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ScoreDisplay
                score={mockData.score}
                percentile={mockData.percentile}
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatsCard
                title="Total Repositories"
                value={mockData.totalRepos}
                icon={Package}
                description="Public repositories"
              />
              <StatsCard
                title="Total Stars"
                value={mockData.totalStars}
                icon={Star}
                description="Stars received"
              />
              <StatsCard
                title="Total Forks"
                value={mockData.totalForks}
                icon={GitFork}
                description="Repository forks"
              />
              <StatsCard
                title="Profile Score"
                value={mockData.score.toFixed(1)}
                icon={TrendingUp}
                description="Out of 10.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguageChart languages={mockData.languages} />
            <TopRepos repos={mockData.topRepos} />
          </div>
        </>
      )}
    </div>
  );
}