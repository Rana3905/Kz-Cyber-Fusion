import { useIncidentStore } from '../../store/incidentStore';
import { formatDateTime } from '../../utils/formatters';

export default function TopBar() {
  const { incidents } = useIncidentStore();
  const criticalCount = incidents.filter((i) => i.severity === 'Critical' && i.status === 'open').length;
  const now = new Date().toISOString();

  return (
    <header className="h-14 bg-cyber-card border-b border-cyber-border flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <span className="font-mono text-xs text-gray-500">SOC COMMAND CENTER</span>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-cyber-critical animate-pulse"></span>
            <span className="font-mono text-xs text-cyber-critical font-bold">
              {criticalCount} CRITICAL ALERT{criticalCount !== 1 ? 'S' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="font-mono text-xs text-gray-500">
          {formatDateTime(now)}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-slow"></span>
          <span className="font-mono text-xs text-cyber-green">LIVE</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center text-cyber-green text-sm font-mono">
          A
        </div>
      </div>
    </header>
  );
}
