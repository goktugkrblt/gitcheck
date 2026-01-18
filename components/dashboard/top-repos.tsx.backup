import { Card } from "@/components/ui/card";
import { Star, GitFork, Code2 } from "lucide-react";

interface TopRepo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
}

interface TopReposProps {
  repos: TopRepo[];
}

export function TopRepos({ repos }: TopReposProps) {
  if (repos.length === 0) {
    return (
      <Card className="bg-[#050307] border-[#131c26] p-8">
        <h3 className="text-xl font-black text-[#e0e0e0] tracking-tighter mb-6">
          TOP REPOSITORIES
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-[#666] font-mono text-sm">NO DATA</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#050307] border-[#131c26] p-8">
      <h3 className="text-xl font-black text-[#e0e0e0] tracking-tighter mb-6">
        TOP REPOSITORIES
      </h3>
      <div className="space-y-4">
        {repos.map((repo, index) => (
          <div
            key={index}
            className="group p-4 rounded-xl bg-[#131c26] border border-[#333] hover:border-[#404040] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#919191]" />
                <h4 className="font-bold text-[#e0e0e0] group-hover:text-white transition-colors">
                  {repo.name}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#666]">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {repo.forks}
                </span>
              </div>
            </div>
            {repo.description && (
              <p className="text-sm text-[#919191] mb-2 line-clamp-2 font-light">
                {repo.description}
              </p>
            )}
            {repo.language && (
              <span className="inline-block px-2 py-1 text-xs font-mono bg-[#333] text-[#919191] rounded">
                {repo.language}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}