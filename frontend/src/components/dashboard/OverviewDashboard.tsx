import { useIncidentStore } from '../../store/incidentStore';
import { useAlertStore } from '../../store/alertStore';
import StatCard from './StatCard';
import LiveAlertFeed from './LiveAlertFeed';
import RiskTrendChart from './RiskTrendChart';
import ThreatTypeChart from './ThreatTypeChart';
import CityAlertCards from './CityAlertCards';
import DemoButton from '../demo/DemoButton';
import DemoProgress from '../demo/DemoProgress';
import DemoScenario from '../demo/DemoScenario';

export default function OverviewDashboard() {
  const { incidents } = useIncidentStore();
  const { alerts } = useAlertStore();

  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const openCount = incidents.filter((i) => i.status === 'open').length;
  const phishingAlerts = alerts.filter((a) => a.detector === 'Phishing Shield').length;
  const leakAlerts = alerts.filter((a) => a.detector === 'Leak Sentinel').length;
  const anomalyAlerts = alerts.filter((a) => a.detector === 'Behavioral Anomaly').length;
  const deepfakeAlerts = alerts.filter((a) => a.detector === 'Deepfake Guard').length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">KZ Cyber Fusion — AI Shield Intelligence Platform</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          MONITORING ACTIVE
        </div>
      </div>

      {/* DEMO BUTTON — most prominent element */}
      <div className="bg-cyber-card border border-cyber-green/20 rounded-xl p-6">
        <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-cyber-green">▸</span> Demo Scenario — Kazakhstan SMS Blaster Fraud
        </div>
        <DemoButton />
        <div className="mt-4 space-y-4">
          <DemoProgress />
          <DemoScenario />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Incidents" value={incidents.length} icon="◉" color="#00FF88" />
        <StatCard label="Critical Incidents" value={criticalCount} icon="⚠" color="#FF4444" pulse={criticalCount > 0} />
        <StatCard label="Open Cases" value={openCount} icon="◈" color="#FF8C00" />
        <StatCard label="Total Alerts" value={alerts.length} icon="◆" color="#00BFFF" pulse={alerts.length > 0} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Phishing Alerts" value={phishingAlerts} icon="🎣" color="#FF4444" subtext="AI Phishing Shield" />
        <StatCard label="Leak Matches" value={leakAlerts} icon="💧" color="#FF8C00" subtext="Leak Sentinel" />
        <StatCard label="Anomalies" value={anomalyAlerts} icon="⚡" color="#FFD700" subtext="Behavioral Engine" />
        <StatCard label="Deepfakes" value={deepfakeAlerts} icon="🎭" color="#9B59B6" subtext="Deepfake Guard" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RiskTrendChart />
        </div>
        <ThreatTypeChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveAlertFeed />
        </div>
        <CityAlertCards />
      </div>
    </div>
  );
}
