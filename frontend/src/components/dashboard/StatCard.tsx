interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  subtext?: string;
  pulse?: boolean;
}

export default function StatCard({ label, value, icon, color = '#00FF88', subtext, pulse }: StatCardProps) {
  return (
    <div
      className="bg-cyber-card border border-cyber-border rounded-lg p-5 hover:border-opacity-60 transition-all duration-200"
      style={{ borderColor: `${color}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {pulse && (
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        )}
      </div>
      <div className="font-mono font-bold text-3xl mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
      {subtext && <div className="font-mono text-xs text-gray-600 mt-1">{subtext}</div>}
    </div>
  );
}
