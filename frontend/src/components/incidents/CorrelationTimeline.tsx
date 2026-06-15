import { TimelineEvent } from '../../types/incident';
import SeverityBadge from './SeverityBadge';
import { formatTime } from '../../utils/formatters';
import { getSeverityColor } from '../../utils/riskCalculator';

interface CorrelationTimelineProps {
  events: TimelineEvent[];
}

const DETECTOR_ICONS: Record<string, string> = {
  phishing: '🎣',
  leak: '💧',
  anomaly: '⚡',
  deepfake: '🎭',
  network: '🌐',
  logs: '📋',
  fusion: '🔗',
};

export default function CorrelationTimeline({ events }: CorrelationTimelineProps) {
  if (!events || events.length === 0) {
    return <div className="text-gray-500 font-mono text-sm py-4">No timeline events.</div>;
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[88px] top-0 bottom-0 w-px bg-cyber-border" />

      <div className="space-y-4">
        {events.map((event, i) => {
          const color = getSeverityColor(event.severity);
          const icon = event.detector ? DETECTOR_ICONS[event.detector] || '◉' : '◉';
          return (
            <div key={i} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Time */}
              <div className="w-20 text-right shrink-0 pt-1">
                <span className="font-mono text-xs text-gray-500">{formatTime(event.time)}</span>
              </div>

              {/* Node */}
              <div className="relative z-10 shrink-0 mt-0.5">
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center bg-cyber-bg"
                  style={{ borderColor: color, boxShadow: `0 0 6px ${color}60` }}
                />
              </div>

              {/* Event */}
              <div className="flex-1 bg-cyber-card border border-cyber-border rounded-lg px-4 py-3 hover:border-cyber-green/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">{icon}</span>
                    <span className="text-sm text-gray-200">{event.event}</span>
                  </div>
                  <SeverityBadge severity={event.severity} size="sm" />
                </div>
                {event.detector && (
                  <div className="mt-1 font-mono text-xs text-gray-600 capitalize">{event.detector}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
