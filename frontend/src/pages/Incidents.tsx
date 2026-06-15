import { useIncidentStore } from '../store/incidentStore';
import IncidentList from '../components/incidents/IncidentList';

export default function Incidents() {
  const { incidents } = useIncidentStore();
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const openCount = incidents.filter((i) => i.status === 'open').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Incidents</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">
            {incidents.length} total · {criticalCount} critical · {openCount} open
          </p>
        </div>
      </div>

      {criticalCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyber-critical/30 bg-cyber-critical/5">
          <span className="w-2 h-2 rounded-full bg-cyber-critical animate-pulse shrink-0" />
          <span className="font-mono text-xs text-cyber-critical font-bold">
            {criticalCount} CRITICAL INCIDENT{criticalCount !== 1 ? 'S' : ''} REQUIRE IMMEDIATE ATTENTION
          </span>
        </div>
      )}

      <IncidentList />
    </div>
  );
}
