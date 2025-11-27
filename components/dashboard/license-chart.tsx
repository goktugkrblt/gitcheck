"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface LicenseChartProps {
  licenses: Record<string, number>;
}

const LICENSE_COLORS: Record<string, string> = {
  "mit": "#10b981",
  "apache-2.0": "#3b82f6",
  "gpl-3.0": "#8b5cf6",
  "bsd-3-clause": "#f59e0b",
  "isc": "#06b6d4",
  "No License": "#6b7280",
};

const getColorForLicense = (license: string, index: number): string => {
  if (LICENSE_COLORS[license]) return LICENSE_COLORS[license];
  
  const colors = ["#ec4899", "#f97316", "#84cc16", "#14b8a6", "#6366f1"];
  return colors[index % colors.length];
};

export function LicenseChart({ licenses }: LicenseChartProps) {
  const data = Object.entries(licenses).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-[#666] text-sm">
        No license data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry: any) => {
            const percent = entry.percent || 0;
            return percent > 0.05 ? `${entry.name} ${(percent * 100).toFixed(0)}%` : "";
          }}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getColorForLicense(entry.name, index)}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f1f1f', 
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            color: '#e0e0e0'
          }}
          formatter={(value: number, name: string) => [`${value} repos`, name]}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span style={{ color: '#919191', fontSize: '12px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}