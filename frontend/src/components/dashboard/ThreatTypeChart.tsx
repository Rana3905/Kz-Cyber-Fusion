import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Phishing', value: 38, color: '#FF4444' },
  { name: 'Leak', value: 22, color: '#FF8C00' },
  { name: 'Anomaly', value: 18, color: '#FFD700' },
  { name: 'Deepfake', value: 10, color: '#00BFFF' },
  { name: 'Network', value: 8, color: '#9B59B6' },
  { name: 'Logs', value: 4, color: '#00FF88' },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-cyber-card border border-cyber-border rounded-lg px-3 py-2">
        <div className="font-mono text-xs font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].name}
        </div>
        <div className="font-mono text-xs text-gray-400">{payload[0].value} alerts</div>
      </div>
    );
  }
  return null;
};

export default function ThreatTypeChart() {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
      <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Threat Distribution</div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={6}
            formatter={(value) => (
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
