"use client";

import { Package, Star, GitFork, TrendingUp, Code, Calendar, Scale, Info } from "lucide-react";
import { TopRepos } from "./top-repos";

interface RepositoriesTabProps {
  profileData: any;
}

export function RepositoriesTab({ profileData }: RepositoriesTabProps) {
  if (!profileData) {
    return (
      <div className="bg-white/5 rounded-xl border border-[#131c26] p-1 text-center">
        <Package className="w-12 h-12 text-[#666] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">No Repository Data</h3>
        <p className="text-[#666] text-sm">Please analyze your profile first</p>
      </div>
    );
  }

  const topRepos = (profileData.topRepos as any[]) || [];
  const forkCount = topRepos.filter((r: any) => r.isFork).length;
  const originalCount = topRepos.length - forkCount;
  const forkRatio = topRepos.length > 0 ? Math.round((forkCount / topRepos.length) * 100) : 0;
  
  const mostStarred = topRepos.length > 0
    ? topRepos.reduce((max: any, repo: any) => 
        (repo.stars || 0) > (max.stars || 0) ? repo : max
      , topRepos[0])
    : null;

  const recentRepos = [...topRepos]
    .filter((repo: any) => repo.updatedAt && !isNaN(new Date(repo.updatedAt).getTime()))
    .sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const languageRepos: Record<string, number> = {};
  topRepos.forEach((repo: any) => {
    if (repo.language) {
      languageRepos[repo.language] = (languageRepos[repo.language] || 0) + 1;
    }
  });

  // License Distribution
  const licenseDistribution: Record<string, number> = {};
  let licensedCount = 0;
  
  topRepos.forEach((repo: any) => {
    if (repo.license) {
      licensedCount++;
      licenseDistribution[repo.license] = (licenseDistribution[repo.license] || 0) + 1;
    }
  });

  const unlicensedCount = topRepos.length - licensedCount;
  if (unlicensedCount > 0) {
    licenseDistribution["No License"] = unlicensedCount;
  }

  const avgStars = topRepos.length > 0 
    ? Math.round(topRepos.reduce((sum: number, r: any) => sum + (r.stars || 0), 0) / topRepos.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-[#e0e0e0] tracking-tighter mb-2">
          Your Repositories
        </h2>
        <p className="text-[#666]">
          Deep dive into your {profileData.totalRepos || 0} repositories
        </p>
      </div>
      {/* Most Starred Repo Highlight */}
      {mostStarred && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-yellow-400 mb-1">⭐ MOST STARRED REPOSITORY</h3>
              <p className="text-xl font-black text-[#e0e0e0] mb-2 truncate">
                {mostStarred.name}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-[#919191]">
                  <Star className="w-4 h-4 text-[#666]" />
                  {mostStarred.stars || 0} stars
                </span>
                {mostStarred.language && (
                  <span className="flex items-center gap-1 text-[#919191]">
                    <Code className="w-4 h-4 text-[#666]" />
                    {mostStarred.language}
                  </span>
                )}
              </div>
              {mostStarred.description && (
                <p className="text-[#666] text-sm mt-2 line-clamp-2">
                  {mostStarred.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL REPOS */}
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">TOTAL REPOS</h3>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Total number of repositories including original projects and forks
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{profileData.totalRepos || 0}</p>
          <p className="text-xs text-[#666]">
            {originalCount} original, {forkCount} forked
          </p>
        </div>

        {/* TOTAL STARS */}
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">TOTAL STARS</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Total stars received across all repositories. Shows community appreciation!
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{profileData.totalStars || 0}</p>
          <p className="text-xs text-[#666]">
            ~{avgStars} stars/repo avg
          </p>
        </div>

        {/* TOTAL FORKS */}
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">TOTAL FORKS</h3>
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Number of times your repositories have been forked. Indicates code reusability!
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{profileData.totalForks || 0}</p>
          <p className="text-xs text-[#666]">
            Community engagement
          </p>
        </div>

        {/* LICENSED */}
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">LICENSED</h3>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Repositories with open source licenses. Proper licensing is important for collaboration!
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{licensedCount}</p>
          <p className="text-xs text-[#666]">
            {topRepos.length > 0 ? Math.round((licensedCount / topRepos.length) * 100) : 0}% with licenses
          </p>
        </div>
      </div>      

      {/* Language Distribution */}
      {Object.keys(languageRepos).length > 0 && (
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-6">Repositories by Language</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(languageRepos)
              .sort(([, a]: any, [, b]: any) => b - a)
              .map(([lang, count]: any) => (
                <div key={lang} className="bg-white/5 rounded-lg p-4 border border-[#131c26]">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-[#666]" />
                    <span className="text-sm font-bold text-[#e0e0e0]">{lang}</span>
                  </div>
                  <p className="text-2xl font-black text-[#e0e0e0]">{count}</p>
                  <p className="text-xs text-[#666]">
                    {topRepos.length > 0 ? Math.round((count / topRepos.length) * 100) : 0}% of repos
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* License Distribution */}
      {Object.keys(licenseDistribution).length > 0 && (
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">License Distribution</h3>
            <p className="text-xs text-[#666]">
              {licensedCount} of {topRepos.length} repositories have licenses
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(licenseDistribution)
              .sort(([, a]: any, [, b]: any) => b - a)
              .map(([license, count]: any) => (
                <div key={license} className="bg-white/5 rounded-lg p-4 border border-[#131c26]">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-[#666]" />
                    <span className="text-sm font-bold text-[#e0e0e0]">{license}</span>
                  </div>
                  <p className="text-2xl font-black text-[#e0e0e0]">{count}</p>
                  <p className="text-xs text-[#666]">
                    {topRepos.length > 0 ? Math.round((count / topRepos.length) * 100) : 0}% of repos
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recently Updated */}
      {recentRepos.length > 0 && (
        <div className="bg-white/5 border border-[#131c26] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-6">Recently Updated</h3>
          <div className="space-y-3">
            {recentRepos.map((repo: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-[#131c26] hover:border-[#333] transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Package className="w-4 h-4 text-[#666] flex-shrink-0" />
                  <span className="text-[#e0e0e0] font-medium truncate">{repo.name}</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {repo.language && (
                    <span className="text-xs text-[#666] hidden sm:block">{repo.language}</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-[#666]">
                    <Calendar className="w-3 h-3" />
                    {new Date(repo.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Repositories */}
      {topRepos.length > 0 && (
        <TopRepos repos={topRepos} />
      )}
    </div>
  );
}