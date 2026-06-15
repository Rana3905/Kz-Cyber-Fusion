import { Link } from 'react-router-dom';
import { Incident } from '../../types/incident';
import SeverityBadge from './SeverityBadge';
import RiskGauge from './RiskGauge';
import { formatRelativeTime } from '../../utils/formatters';

interface IncidentCardProps {
  incident: Incident;
}

const STATUS_STYLES: Record<string, string> = {
  open: 'text-cyber-critical',
  investigating: 'text-cyber-medium',
  resolved: 'text-cyber-low',
};

export default function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Link to={`/incidents/${incident.id}`}>
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 hover:border-cyber-green/30 hover:shadow-cyber transition-all duration-200 cursor-pointer group">
        <div className="flex items-start gap-4">
          <RiskGauge score={incident.risk_score} size={70} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-mono text-xs text-gray-500">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <span className={`font-mono text-xs uppercase ${STATUS_STYLES[incident.status]}`}>
                ● {incident.status}
              </span>
            </div>
            <h3 className="text-sm text-gray-200 font-semibold mb-2 group-hover:text-cyber-green transition-colors line-clamp-2">
              {incident.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono flex-wrap">
              <span>📧 {incident.affected_entity.email}</span>
              <span>🕐 {formatRelativeTime(incident.created_at)}</span>
              <span>{Object.keys(incident.detector_results).length} detectors triggered</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
