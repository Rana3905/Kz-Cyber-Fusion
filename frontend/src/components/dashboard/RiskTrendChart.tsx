import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', risk: 12 },
  { time: '03:00', risk: 18 },
  { time: '06:00', risk: 15 },
  { time: '09:00', risk: 34 },
  { time: '12:00', risk: 28 },
  { time: '15:00', risk: 45 },
  { time: '18:00', risk: 62 },
  { time: '21:00', risk: 89 },
  { time: 'Now', risk: 97 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-cyber-card border border-cyber-border rounded-lg px-3 py-2">
        <div className="font-mono text-xs text-gray-400">{label}</div>
        <div className="font-mono text-sm font-bold text-cyber-green">{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default function RiskTrendChart() {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
      <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Risk Score Trend — 24h</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#00FF88"
            strokeWidth={2}
            dot={{ fill: '#00FF88', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#00FF88', stroke: '#00FF8840', strokeWidth: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
