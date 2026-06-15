import { useAlertStore } from '../../store/alertStore';
import { getSeverityColor } from '../../utils/riskCalculator';
import { formatRelativeTime } from '../../utils/formatters';

export default function LiveAlertFeed() {
  const { alerts } = useAlertStore();

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg">
      <div className="flex items-center justify-between px-5 py-3 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Live Alert Feed</span>
        </div>
        <span className="font-mono text-xs text-gray-600">{alerts.length} alerts</span>
      </div>

      <div className="divide-y divide-cyber-border max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-600 font-mono text-sm">
            Monitoring... No alerts yet.
          </div>
        ) : (
          alerts.map((alert) => {
            const color = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                className="flex items-start gap-0 animate-slide-in hover:bg-white/2 transition-colors"
              >
                {/* Severity border */}
                <div className="w-1 shrink-0 self-stretch rounded-l" style={{ backgroundColor: color }} />
                <div className="flex-1 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm text-gray-200 mb-0.5">{alert.message}</div>
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span style={{ color }} className="font-semibold">{alert.severity}</span>
                        <span className="text-gray-600">{alert.detector}</span>
                        {alert.entity && <span className="text-gray-600">{alert.entity}</span>}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-gray-600 shrink-0">
                      {formatRelativeTime(alert.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
