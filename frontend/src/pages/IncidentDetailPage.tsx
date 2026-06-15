import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIncidentStore } from '../store/incidentStore';
import { useDemoStore } from '../store/demoStore';
import IncidentDetail from '../components/incidents/IncidentDetail';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedIncident, loading, fetchIncident } = useIncidentStore();
  const { incident: demoIncident } = useDemoStore();

  useEffect(() => {
    if (id) fetchIncident(id);
  }, [id, fetchIncident]);

  // Use demo incident as fallback
  const incident = selectedIncident || (demoIncident?.id === id ? demoIncident : null);

  if (loading) return <LoadingSpinner label="Loading incident..." />;

  if (!incident) {
    return (
      <EmptyState
        icon="◎"
        title="Incident not found"
        description="This incident may not exist or the backend is not running."
        action={
          <Link to="/incidents" className="font-mono text-xs text-cyber-green border border-cyber-green/20 rounded px-4 py-2 hover:bg-cyber-green/10 transition-colors">
            ← Back to Incidents
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/incidents" className="font-mono text-xs text-gray-500 hover:text-cyber-green transition-colors">
          ← Incidents
        </Link>
        <span className="text-gray-700">/</span>
        <span className="font-mono text-xs text-gray-400">{incident.id}</span>
      </div>
      <IncidentDetail incident={incident} />
    </div>
  );
}
