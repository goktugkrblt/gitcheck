import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <Card className="bg-white dark:bg-[#050307] border-black/10 dark:border-[#131c26] hover:border-[#333] transition-all duration-300 p-6 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-mono text-black/60 dark:text-[#666] tracking-wider">{title}</p>
          <p className="text-3xl font-black text-black dark:text-[#e0e0e0] tracking-tighter">
            {value}
          </p>
          <p className="text-xs text-black/50 dark:text-[#919191] font-light">{description}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[#131c26] group-hover:bg-black/10 dark:group-hover:bg-[#303030] flex items-center justify-center transition-colors duration-300">
          <Icon className="h-6 w-6 text-black/50 dark:text-[#919191] group-hover:text-[#b0b0b0] transition-colors duration-300" />
        </div>
      </div>
      
      {trend && (
        <div className={`mt-4 text-xs font-mono ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </Card>
  );
}