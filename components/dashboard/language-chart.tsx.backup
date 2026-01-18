import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface LanguageChartProps {
  languages: Record<string, number>;
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
];

export function LanguageChart({ languages }: LanguageChartProps) {
  const data = Object.entries(languages)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  if (data.length === 0) {
    return (
      <Card className="bg-[#050307] border-[#131c26] p-8">
        <h3 className="text-xl font-black text-[#e0e0e0] tracking-tighter mb-6">
          LANGUAGE DISTRIBUTION
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
        LANGUAGE DISTRIBUTION
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#050307', 
              border: '1px solid #131c26',
              borderRadius: '8px',
              color: '#e0e0e0',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            itemStyle={{
              color: '#e0e0e0',
              fontFamily: 'monospace'
            }}
            labelStyle={{
              color: '#919191',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ 
              color: '#919191',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}