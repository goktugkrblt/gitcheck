"use client";

import { Code, BarChart3, Boxes, Info } from "lucide-react";
import { LanguageChart } from "./language-chart";

interface SkillsTabProps {
  profileData: any;
}

export function SkillsTab({ profileData }: SkillsTabProps) {
  if (!profileData) {
    return (
      <div className="bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-[#131c26] p-1 text-center">
        <Code className="w-12 h-12 text-black/60 dark:text-[#666] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-black dark:text-[#e0e0e0] mb-2">No Skills Data</h3>
        <p className="text-black/60 dark:text-[#666] text-sm">Please analyze your profile first</p>
      </div>
    );
  }

  const languages = profileData.languages || {};
  const frameworks = profileData.frameworks || {};
  
  const languageEntries = Object.entries(languages)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10);

  const frameworkEntries = Object.entries(frameworks)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 8);

  const totalBytes = Object.values(languages).reduce((sum: number, bytes: any) => sum + bytes, 0);

  // Framework logo mapping with SVGs
  const getFrameworkLogo = (framework: string) => {
    const logos: Record<string, React.ReactElement> = {
      'React': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)"/>
        </svg>
      ),
      'Next.js': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
          <path d="M9 9L17 17M17 9V15M17 9H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'Vue.js': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M2 4L12 20L22 4H18L12 14L6 4H2Z" fill="#42B883"/>
          <path d="M6 4L12 14L18 4H14.5L12 8L9.5 4H6Z" fill="#35495E"/>
        </svg>
      ),
      'Angular': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 2L3 6L4.5 18L12 22L19.5 18L21 6L12 2Z" fill="#DD0031"/>
          <path d="M12 2V22L19.5 18L21 6L12 2Z" fill="#C3002F"/>
          <path d="M12 5L8 17H10L11 14H13L14 17H16L12 5Z" fill="white"/>
        </svg>
      ),
      'Tailwind CSS': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 6C9.33 6 7.67 7.33 7 10C8 8.67 9.17 8.17 10.5 8.5C11.26 8.67 11.81 9.23 12.41 9.84C13.45 10.9 14.64 12 17 12C19.67 12 21.33 10.67 22 8C21 9.33 19.83 9.83 18.5 9.5C17.74 9.33 17.19 8.77 16.59 8.16C15.55 7.1 14.36 6 12 6ZM7 12C4.33 12 2.67 13.33 2 16C3 14.67 4.17 14.17 5.5 14.5C6.26 14.67 6.81 15.23 7.41 15.84C8.45 16.9 9.64 18 12 18C14.67 18 16.33 16.67 17 14C16 15.33 14.83 15.83 13.5 15.5C12.74 15.33 12.19 14.77 11.59 14.16C10.55 13.1 9.36 12 7 12Z" fill="#06B6D4"/>
        </svg>
      ),
      'Bootstrap': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z" fill="#7952B3"/>
          <path d="M11 7H13.5C14.328 7 15 7.672 15 8.5C15 9.328 14.328 10 13.5 10H11V7ZM11 11H14C14.828 11 15.5 11.672 15.5 12.5C15.5 13.328 14.828 14 14 14H11V11Z" fill="white"/>
        </svg>
      ),
      'Django': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <rect x="4" y="3" width="4" height="18" rx="1" fill="#092E20"/>
          <rect x="10" y="3" width="4" height="12" rx="1" fill="#092E20"/>
          <circle cx="16" cy="8" r="2" fill="#092E20"/>
        </svg>
      ),
      'Express': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M4 12L20 6M4 12L20 18M4 12H20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      'NestJS': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <circle cx="12" cy="12" r="9" fill="#E0234E"/>
          <path d="M12 7C14 7 15 8 15 10C15 12 14 13 12 13C10 13 9 12 9 10C9 8 10 7 12 7Z" fill="white"/>
          <path d="M12 14L9 17H15L12 14Z" fill="white"/>
        </svg>
      ),
      'Laravel': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M3 12L8 9L13 12L18 9L21 11V17L18 19L13 16L8 19L3 17V12Z" fill="#FF2D20"/>
        </svg>
      ),
      'Spring Boot': (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <circle cx="12" cy="12" r="9" stroke="#6DB33F" strokeWidth="2" fill="none"/>
          <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12" stroke="#6DB33F" strokeWidth="2"/>
        </svg>
      ),
    };

    return logos[framework] || (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-black dark:text-[#e0e0e0] tracking-tighter mb-2">
          Your Tech Stack
        </h2>
        <p className="text-black/60 dark:text-[#666]">
          Languages and technologies you work with
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">          
        {/* LANGUAGES */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">LANGUAGES</h3>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-black/60 dark:text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Number of programming languages detected across your repositories
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-black dark:text-[#e0e0e0] mb-1">
            {Object.keys(languages).length}
          </p>
          <p className="text-xs text-black/60 dark:text-[#666]">Programming languages</p>
        </div>

        {/* FRAMEWORKS */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">FRAMEWORKS</h3>
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-black/60 dark:text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Frameworks and libraries detected from package.json, requirements.txt, and dependency files
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-black dark:text-[#e0e0e0] mb-1">
            {Object.keys(frameworks).length}
          </p>
          <p className="text-xs text-black/60 dark:text-[#666]">Frameworks & libraries</p>
        </div>

        {/* GISTS */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider">GISTS</h3>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-black/60 dark:text-[#666]" />
              <div className="relative group/tooltip">
                <Info className="h-3.5 w-3.5 text-black/60 dark:text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-black/95 border border-purple-500/30 rounded-lg text-xs text-black/80 dark:text-white/80 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Code snippets and quick shares you've created on GitHub Gist
                </div>
              </div>
            </div>
          </div>
          <p className="text-3xl font-black text-black dark:text-[#e0e0e0] mb-1">
            {profileData.gistsCount || 0}
          </p>
          <p className="text-xs text-black/60 dark:text-[#666]">Code snippets</p>
        </div>
      </div>

      {/* Framework Detection */}
      {frameworkEntries.length > 0 && (
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6">
          <h3 className="text-xl font-bold text-black dark:text-[#e0e0e0] mb-6 flex items-center gap-2">
            <Boxes className="h-5 w-5" />
            Framework Detection
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {frameworkEntries.map(([framework, count]: any) => (
              <div
                key={framework}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-lg p-4 hover:border-[#666] transition-colors group"
              >
                <div className="mb-3 flex items-center justify-center text-black/80 dark:text-white/80 group-hover:text-black dark:text-white transition-colors">
                  {getFrameworkLogo(framework)}
                </div>
                <div className="text-sm font-bold text-black dark:text-[#e0e0e0] mb-1 truncate text-center">
                  {framework}
                </div>
                <div className="text-xs text-black/60 dark:text-[#666] text-center">
                  {count} {count === 1 ? 'repo' : 'repos'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language Chart */}
      <LanguageChart languages={languages} />

      {/* Top Languages List */}
      {languageEntries.length > 0 && (
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#131c26] rounded-xl p-6">
          <h3 className="text-xl font-bold text-black dark:text-[#e0e0e0] mb-6">Language Breakdown</h3>
          <div className="space-y-3">
            {languageEntries.map(([lang, bytes]: any, i: number) => {
              const percentage = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0;
              return (
                <div key={lang} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-xs font-bold text-black/60 dark:text-[#666]">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-black dark:text-[#e0e0e0] truncate">{lang}</span>
                      <span className="text-xs text-black/60 dark:text-[#666] ml-2">{percentage}%</span>
                    </div>
                    <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2">
                      <div 
                        className="bg-[#666] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}