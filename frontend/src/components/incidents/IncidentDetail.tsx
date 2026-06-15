import { Incident } from '../../types/incident';
import RiskGauge from './RiskGauge';
import SeverityBadge from './SeverityBadge';
import CorrelationTimeline from './CorrelationTimeline';
import ScoreBar from '../shared/ScoreBar';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';

interface IncidentDetailProps {
  incident: Incident;
}

const DETECTOR_LABELS: Record<string, string> = {
  phishing: '🎣 Phishing Shield',
  leak: '💧 Leak Sentinel',
  anomaly: '⚡ Behavioral Anomaly',
  deepfake: '🎭 Deepfake Guard',
  network: '🌐 Network Monitor',
  logs: '📋 Log Intelligence',
};

export default function IncidentDetail({ incident }: IncidentDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
        <div className="flex items-start gap-6">
          <RiskGauge score={incident.risk_score} size={120} />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="font-mono text-sm text-gray-500">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <ConfidenceBadge confidence={incident.confidence} />
              <span className={`font-mono text-xs uppercase ${
                incident.status === 'open' ? 'text-cyber-critical' :
                incident.status === 'investigating' ? 'text-cyber-medium' : 'text-cyber-low'
              }`}>● {incident.status}</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">{incident.title}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm font-mono">
              <div className="text-gray-500">Email: <span className="text-gray-300">{incident.affected_entity.email}</span></div>
              <div className="text-gray-500">Phone: <span className="text-gray-300">{incident.affected_entity.phone}</span></div>
              <div className="text-gray-500">IP: <span className="text-cyber-critical">{incident.affected_entity.ip}</span></div>
              <div className="text-gray-500">Device: <span className="text-gray-300">{incident.affected_entity.device}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detector scores */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Detector Results</h3>
        <div className="space-y-3">
          {Object.entries(incident.detector_results).map(([key, result]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="font-mono text-xs text-gray-400 w-44 shrink-0">
                {DETECTOR_LABELS[key] || key}
              </span>
              <div className="flex-1">
                <ScoreBar score={result.score} height="h-2" showValue={false} />
              </div>
              <span className="font-mono text-sm font-bold w-8 text-right" style={{ color: result.score >= 80 ? '#FF4444' : result.score >= 60 ? '#FF8C00' : '#FFD700' }}>
                {result.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <ExplainBox
        title="AI Fusion Analysis"
        reasons={incident.explanation.split('. ').filter(Boolean)}
      />

      {/* Recommended actions */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Recommended Actions</h3>
        <ol className="space-y-2">
          {incident.recommended_actions.map((action, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
              <span className="font-mono text-xs text-cyber-green w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Timeline */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-6">Attack Timeline</h3>
        <CorrelationTimeline events={incident.timeline} />
      </div>
    </div>
  );
}
