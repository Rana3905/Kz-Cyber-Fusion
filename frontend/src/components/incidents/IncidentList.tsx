import { useEffect } from 'react';
import { useIncidentStore } from '../../store/incidentStore';
import IncidentCard from './IncidentCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import ErrorAlert from '../shared/ErrorAlert';

export default function IncidentList() {
  const { incidents, loading, error, fetchIncidents } = useIncidentStore();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  if (loading) return <LoadingSpinner label="Loading incidents..." />;
  if (error) return <ErrorAlert message={error} />;
  if (incidents.length === 0) {
    return (
      <EmptyState
        icon="◎"
        title="No incidents detected"
        description="Run the SMS Blaster demo to generate your first incident."
      />
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
}
