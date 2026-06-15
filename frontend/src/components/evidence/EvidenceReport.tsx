import { useEffect, useState } from 'react';
import { EvidencePackage } from '../../types/evidence';
import { getEvidence } from '../../api/evidence';
import { useDemoStore } from '../../store/demoStore';
import { MOCK_INCIDENT } from '../../utils/demoData';
import EvidenceSection from './EvidenceSection';
import ExportButton from './ExportButton';
import RiskGauge from '../incidents/RiskGauge';
import SeverityBadge from '../incidents/SeverityBadge';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import ScoreBar from '../shared/ScoreBar';
import CorrelationTimeline from '../incidents/CorrelationTimeline';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';

interface EvidenceReportProps {
  incidentId: string;
}

const DETECTOR_LABELS: Record<string, string> = {
  phishing: '🎣 Phishing Shield',
  leak: '💧 Leak Sentinel',
  anomaly: '⚡ Behavioral Anomaly',
  deepfake: '🎭 Deepfake Guard',
  network: '🌐 Network Monitor',
  logs: '📋 Log Intelligence',
};

export default function EvidenceReport({ incidentId }: EvidenceReportProps) {
  const [evidence, setEvidence] = useState<EvidencePackage | null>(null);
  const [loading, setLoading] = useState(true);
  const { incident: demoIncident } = useDemoStore();

  useEffect(() => {
    setLoading(true);
    getEvidence(incidentId)
      .then(setEvidence)
      .catch(() => {
        // Build mock evidence from demo incident or static mock
        const src = demoIncident || MOCK_INCIDENT;
        setEvidence({
          id: `EVD-${incidentId}`,
          incident_id: incidentId,
          created_at: new Date().toISOString(),
          incident_summary: src.title,
          risk_score: src.risk_score,
          confidence_score: src.confidence,
          severity: src.severity,
          affected_entity: src.affected_entity,
          timeline: src.timeline,
          detector_results: src.detector_results as EvidencePackage['detector_results'],
          recommended_actions: src.recommended_actions,
          explainability_notes: src.explanation.split('. ').filter(Boolean),
        });
      })
      .finally(() => setLoading(false));
  }, [incidentId, demoIncident]);

  if (loading) return <LoadingSpinner label="Loading evidence package..." />;
  if (!evidence) return null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Report header */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <RiskGauge score={evidence.risk_score} size={90} />
            <div>
              <div className="font-mono text-xs text-gray-500 mb-1">EVIDENCE PACKAGE — {evidence.id}</div>
              <h2 className="text-lg font-semibold text-white mb-3">{evidence.incident_summary}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <SeverityBadge severity={evidence.severity} />
                <ConfidenceBadge confidence={evidence.confidence_score} />
                <span className="font-mono text-xs text-gray-500">
                  Generated: {formatDateTime(evidence.created_at)}
                </span>
              </div>
            </div>
          </div>
          <ExportButton incidentId={incidentId} />
        </div>
      </div>

      {/* Affected entity */}
      <EvidenceSection title="Affected Entity" icon="👤">
        <div className="grid grid-cols-2 gap-3 font-mono text-sm">
          <div>
            <span className="text-gray-500">Email: </span>
            <span className="text-gray-200">{evidence.affected_entity.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Phone: </span>
            <span className="text-gray-200">{evidence.affected_entity.phone}</span>
          </div>
          <div>
            <span className="text-gray-500">IP: </span>
            <span className="text-cyber-critical">{evidence.affected_entity.ip}</span>
          </div>
          <div>
            <span className="text-gray-500">Device: </span>
            <span className="text-gray-200">{evidence.affected_entity.device}</span>
          </div>
        </div>
      </EvidenceSection>

      {/* Detector results */}
      <EvidenceSection title="Detection Evidence" icon="◈">
        <div className="space-y-3">
          {Object.entries(evidence.detector_results).map(([key, result]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="font-mono text-xs text-gray-400 w-44 shrink-0">
                {DETECTOR_LABELS[key] || key}
              </span>
              <div className="flex-1">
                <ScoreBar score={result.score} height="h-2" showValue={false} />
              </div>
              <span
                className="font-mono text-sm font-bold w-8 text-right"
                style={{ color: result.score >= 80 ? '#FF4444' : result.score >= 60 ? '#FF8C00' : '#FFD700' }}
              >
                {result.score}
              </span>
              <SeverityBadge severity={result.severity} size="sm" />
            </div>
          ))}
        </div>
      </EvidenceSection>

      {/* Explainability */}
      <EvidenceSection title="AI Explainability Notes" icon="ℹ">
        <ol className="space-y-2">
          {evidence.explainability_notes.map((note, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <span className="font-mono text-xs text-cyber-green shrink-0 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ol>
      </EvidenceSection>

      {/* Recommended actions */}
      <EvidenceSection title="Recommended Actions" icon="⚡">
        <ol className="space-y-2">
          {evidence.recommended_actions.map((action, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
              <span className="font-mono text-xs text-cyber-green w-5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              {action}
            </li>
          ))}
        </ol>
      </EvidenceSection>

      {/* Timeline */}
      <EvidenceSection title="Attack Timeline" icon="🕐">
        <CorrelationTimeline events={evidence.timeline} />
      </EvidenceSection>
    </div>
  );
}
