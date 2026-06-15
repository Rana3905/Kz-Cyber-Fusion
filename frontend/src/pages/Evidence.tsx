import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../store/demoStore';
import EvidenceReport from '../components/evidence/EvidenceReport';
import EmptyState from '../components/shared/EmptyState';

export default function Evidence() {
  const { id } = useParams<{ id: string }>();
  const { incident } = useDemoStore();

  const incidentId = id || incident?.id;

  if (!incidentId) {
    return (
      <EmptyState
        icon="◈"
        title="No incident selected"
        description="Run the SMS Blaster demo and then open an evidence report."
        action={
          <Link to="/" className="font-mono text-xs text-cyber-green border border-cyber-green/20 rounded px-4 py-2 hover:bg-cyber-green/10 transition-colors">
            Go to Overview
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to={`/incidents/${incidentId}`} className="font-mono text-xs text-gray-500 hover:text-cyber-green transition-colors">
          ← {incidentId}
        </Link>
        <span className="text-gray-700">/</span>
        <span className="font-mono text-xs text-gray-400">Evidence Report</span>
      </div>
      <div>
        <h1 className="text-xl font-semibold text-white">Evidence Package</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">Analyst-ready evidence report for {incidentId}</p>
      </div>
      <EvidenceReport incidentId={incidentId} />
    </div>
  );
}
