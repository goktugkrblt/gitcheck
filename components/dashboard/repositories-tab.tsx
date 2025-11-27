"use client";

import { Package, Star, GitFork, TrendingUp, Code, Calendar, Scale } from "lucide-react";
import { TopRepos } from "./top-repos";
import { LicenseChart } from "./license-chart";

interface RepositoriesTabProps {
  profileData: any;
}

export function RepositoriesTab({ profileData }: RepositoriesTabProps) {
  if (!profileData) {
    return (
      <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-8 text-center">
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

  // YENİ: License Distribution
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">TOTAL REPOS</h3>
            <Package className="h-4 w-4 text-[#666]" />
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{profileData.totalRepos || 0}</p>
          <p className="text-xs text-[#666]">
            {originalCount} original, {forkCount} forked
          </p>
        </div>

        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">TOTAL STARS</h3>
            <Star className="h-4 w-4 text-[#666]" />
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{profileData.totalStars || 0}</p>
          <p className="text-xs text-[#666]">
            ~{avgStars} stars/repo avg
          </p>
        </div>

        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">TOTAL FORKS</h3>
            <GitFork className="h-4 w-4 text-[#666]" />
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{profileData.totalForks || 0}</p>
          <p className="text-xs text-[#666]">
            Community engagement
          </p>
        </div>

        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#666] tracking-wider">LICENSED</h3>
            <Scale className="h-4 w-4 text-[#666]" />
          </div>
          <p className="text-3xl font-black text-[#e0e0e0] mb-1">{licensedCount}</p>
          <p className="text-xs text-[#666]">
            {topRepos.length > 0 ? Math.round((licensedCount / topRepos.length) * 100) : 0}% with licenses
          </p>
        </div>
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

      {/* Language Distribution */}
      {Object.keys(languageRepos).length > 0 && (
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-6">Repositories by Language</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(languageRepos)
              .sort(([, a]: any, [, b]: any) => b - a)
              .map(([lang, count]: any) => (
                <div key={lang} className="bg-[#1f1f1f] rounded-lg p-4 border border-[#2a2a2a]">
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

      {/* YENİ: License Distribution */}
      {Object.keys(licenseDistribution).length > 0 && (
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">License Distribution</h3>
            <p className="text-xs text-[#666]">
              {licensedCount} of {topRepos.length} repositories have licenses
            </p>
          </div>
          <LicenseChart licenses={licenseDistribution} />
        </div>
      )}

      {/* Recently Updated */}
      {recentRepos.length > 0 && (
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-6">Recently Updated</h3>
          <div className="space-y-3">
            {recentRepos.map((repo: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-lg border border-[#2a2a2a] hover:border-[#333] transition-colors">
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