import { useDemoStore } from '../../store/demoStore';
import { Link } from 'react-router-dom';
import IncidentCard from '../incidents/IncidentCard';

export default function DemoScenario() {
  const { status, incident } = useDemoStore();

  if (status !== 'complete' || !incident) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 font-mono text-xs text-gray-500 uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-cyber-critical animate-pulse" />
        Generated Incident
      </div>
      <IncidentCard incident={incident} />
      <div className="flex gap-3">
        <Link
          to={`/incidents/${incident.id}`}
          className="flex-1 text-center py-2.5 rounded-lg border border-cyber-green/30 text-cyber-green font-mono text-sm hover:bg-cyber-green/10 transition-colors"
        >
          View Full Incident
        </Link>
        <Link
          to={`/evidence/${incident.id}`}
          className="flex-1 text-center py-2.5 rounded-lg border border-cyber-border text-gray-400 font-mono text-sm hover:border-cyber-green/20 hover:text-cyber-green transition-colors"
        >
          Evidence Report
        </Link>
      </div>
    </div>
  );
}
