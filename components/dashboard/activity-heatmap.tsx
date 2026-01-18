'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export function ActivityHeatmap() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await fetch('/api/github/contributions');
      const result = await response.json();
      setData(result.contributions);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (count: number) => {
    if (count === 0) return 'bg-black/5 dark:bg-[#161b22]'; // Light: neutral gray, Dark: dark gray
    if (count < 3) return 'bg-black/10 dark:bg-[#0e4429]'; // Light: light gray, Dark: dark green
    if (count < 6) return 'bg-black/20 dark:bg-[#006d32]'; // Light: medium gray, Dark: medium green
    if (count < 9) return 'bg-black/30 dark:bg-[#26a641]'; // Light: darker gray, Dark: bright green
    return 'bg-black/40 dark:bg-[#39d353]'; // Light: darkest gray, Dark: brightest green
  };

  const dayLabels = ['Mon', 'Wed', 'Fri'];

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#050307] rounded-xl border border-black/10 dark:border-[#131c26] p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-black/10 dark:bg-[#131c26] rounded w-1/3"></div>
          <div className="h-32 bg-black/10 dark:bg-[#131c26] rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-[#050307] rounded-xl border border-black/10 dark:border-[#131c26] p-8">
        <p className="text-black/60 dark:text-[#666] font-mono text-sm">Failed to load contribution data</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#050307] rounded-xl border border-black/10 dark:border-[#131c26] p-8 relative">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-black/60 dark:text-[#666] tracking-wider mb-2">
          ACTIVITY HEATMAP
        </h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-black dark:text-[#e0e0e0]">
            {data.totalContributions.toLocaleString()}
          </p>
          <p className="text-sm text-black/60 dark:text-[#666]">contributions in the last year</p>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="inline-flex gap-[2px]">
          {/* Day labels */}
          <div className="flex flex-col justify-around text-[10px] text-black/60 dark:text-[#666] font-mono mr-2 py-1">
            {dayLabels.map((day) => (
              <div key={day} className="h-3">{day}</div>
            ))}
          </div>

          {/* Heatmap grid */}
          {data.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.contributionDays.map((day) => (
                <motion.div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${getColor(day.contributionCount)} cursor-pointer transition-all duration-200`}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  onMouseEnter={(e) => {
                    setHoveredDay(day);
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-6 text-[10px] text-black/60 dark:text-[#666] font-mono">
        <span>Less</span>
        <div className="flex gap-[2px]">
          <div className="w-3 h-3 bg-black/5 dark:bg-[#161b22] rounded-sm"></div>
          <div className="w-3 h-3 bg-black/10 dark:bg-[#0e4429] rounded-sm"></div>
          <div className="w-3 h-3 bg-black/20 dark:bg-[#006d32] rounded-sm"></div>
          <div className="w-3 h-3 bg-black/30 dark:bg-[#26a641] rounded-sm"></div>
          <div className="w-3 h-3 bg-black/40 dark:bg-[#39d353] rounded-sm"></div>
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            left: mousePosition.x + 10,
            top: mousePosition.y - 60,
            pointerEvents: 'none',
          }}
          className="bg-white dark:bg-[#050307] border border-black/10 dark:border-[#131c26] rounded-lg px-4 py-3 shadow-2xl z-50"
        >
          <div className="text-black dark:text-[#e0e0e0] font-bold text-sm mb-1">
            {hoveredDay.contributionCount} {hoveredDay.contributionCount === 1 ? 'contribution' : 'contributions'}
          </div>
          <div className="text-black/60 dark:text-[#666] text-xs font-mono">
            {new Date(hoveredDay.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}