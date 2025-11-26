"use client";

import { Code, BarChart3 } from "lucide-react";
import { LanguageChart } from "./language-chart";

interface SkillsTabProps {
  profileData: any;
}

export function SkillsTab({ profileData }: SkillsTabProps) {
  if (!profileData) {
    return (
      <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-8 text-center">
        <Code className="w-12 h-12 text-[#666] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">No Skills Data</h3>
        <p className="text-[#666] text-sm">Please analyze your profile first</p>
      </div>
    );
  }

  const languages = profileData.languages || {};
  const languageEntries = Object.entries(languages)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10);

  const totalBytes = Object.values(languages).reduce((sum: number, bytes: any) => sum + bytes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-[#e0e0e0] tracking-tighter mb-2">
          Your Tech Stack
        </h2>
        <p className="text-[#666]">
          Languages and technologies you work with
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">          
          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#666] tracking-wider">LANGUAGES</h3>
              <Code className="h-4 w-4 text-[#666]" />
            </div>
            <p className="text-3xl font-black text-[#e0e0e0] mb-1">
              {Object.keys(languages).length}
            </p>
            <p className="text-xs text-[#666]">Technologies used</p>
          </div>

          <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#666] tracking-wider">GISTS</h3>
              <Code className="h-4 w-4 text-[#666]" />
            </div>
            <p className="text-3xl font-black text-[#e0e0e0] mb-1">
              {profileData.gistsCount || 0}
            </p>
            <p className="text-xs text-[#666]">Public only</p>
            <p className="text-xs text-[#666]">Code snippets</p>
          </div>
        </div>

      {/* Language Chart */}
      <LanguageChart languages={languages} />

      {/* Top Languages List */}
      {languageEntries.length > 0 && (
        <div className="bg-[#252525] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#e0e0e0] mb-6">Language Breakdown</h3>
          <div className="space-y-3">
            {languageEntries.map(([lang, bytes]: any, i: number) => {
              const percentage = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0;
              return (
                <div key={lang} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-xs font-bold text-[#666]">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#e0e0e0] truncate">{lang}</span>
                      <span className="text-xs text-[#666] ml-2">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[#1f1f1f] rounded-full h-2">
                      <div 
                        className="bg-[#666] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  {/* KB kısmı kaldırıldı */}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
