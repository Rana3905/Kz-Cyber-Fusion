import PhishingShield from '../components/detectors/PhishingShield';
import LeakSentinel from '../components/detectors/LeakSentinel';
import BehavioralAnomaly from '../components/detectors/BehavioralAnomaly';
import DeepfakeGuard from '../components/detectors/DeepfakeGuard';
import NetworkMonitor from '../components/detectors/NetworkMonitor';
import LogIntelligence from '../components/detectors/LogIntelligence';

export default function Detectors() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Detection Modules</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">6 AI-powered threat detectors — test each individually</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PhishingShield />
        <LeakSentinel />
        <BehavioralAnomaly />
        <DeepfakeGuard />
        <NetworkMonitor />
        <LogIntelligence />
      </div>
    </div>
  );
}
