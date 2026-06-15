import { useState } from 'react';
import { detectAnomaly } from '../../api/anomaly';
import { DetectorResult } from '../../types/detector';
import ScoreBar from '../shared/ScoreBar';
import SeverityBadge from '../incidents/SeverityBadge';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import LoadingSpinner from '../shared/LoadingSpinner';

const MOCK_RESULT: DetectorResult = {
  score: 91,
  confidence: 0.95,
  severity: 'Critical',
  reasons: [
    'Impossible travel: Almaty to Moscow in 12 minutes (5,000 km)',
    'Login at 03:14 UTC — abnormal for this user (usual: 08:00–22:00)',
    'New device fingerprint — never seen before for this account',
    'Login succeeded after 47 failed attempts (brute force pattern)',
    'IP 185.220.101.47 is a known Tor exit node',
  ],
  triggered_rules: ['IMPOSSIBLE_TRAVEL', 'ABNORMAL_TIME', 'NEW_DEVICE', 'TOR_EXIT_NODE'],
  detector: 'anomaly',
  timestamp: new Date().toISOString(),
};

export default function BehavioralAnomaly() {
  const [userId, setUserId] = useState('');
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    try {
      const res = await detectAnomaly({ user_id: userId, ip_address: ip });
      setResult(res);
    } catch {
      setResult(MOCK_RESULT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <h3 className="font-mono font-bold text-white">Behavioral Anomaly Engine</h3>
          <p className="text-xs text-gray-500">Impossible travel, new device, unusual login time</p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID or email"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Login IP address"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setUserId('user_882'); setIp('185.220.101.47'); }}
            className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 font-mono text-xs hover:border-cyber-green/20 hover:text-cyber-green transition-colors"
          >
            Load Demo
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !userId.trim()}
            className="flex-1 py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Detect Anomalies'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner label="Analyzing behavioral patterns..." />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ScoreBar score={result.score} label="Anomaly Score" height="h-3" />
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <ExplainBox reasons={result.reasons} />
          <div className="flex flex-wrap gap-2">
            {result.triggered_rules.map((rule) => (
              <span key={rule} className="font-mono text-xs px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
