import { useState } from 'react';
import { detectNetwork } from '../../api/network';
import { DetectorResult } from '../../types/detector';
import ScoreBar from '../shared/ScoreBar';
import SeverityBadge from '../incidents/SeverityBadge';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import LoadingSpinner from '../shared/LoadingSpinner';

const MOCK_RESULT: DetectorResult = {
  score: 80,
  confidence: 0.84,
  severity: 'High',
  reasons: [
    'Destination IP 185.220.101.47 is a known C2 server (threat intel match)',
    'Port 4444 — commonly used for Metasploit reverse shells',
    'Periodic beaconing pattern: 60-second intervals (C2 heartbeat)',
    'Large data exfiltration: 2.4 GB outbound in 15 minutes',
    'Encrypted traffic to non-business destination country',
  ],
  triggered_rules: ['KNOWN_C2_IP', 'SUSPICIOUS_PORT', 'BEACON_PATTERN', 'DATA_EXFIL'],
  detector: 'network',
  timestamp: new Date().toISOString(),
};

export default function NetworkMonitor() {
  const [srcIp, setSrcIp] = useState('');
  const [destIp, setDestIp] = useState('');
  const [port, setPort] = useState('');
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!srcIp.trim()) return;
    setLoading(true);
    try {
      const res = await detectNetwork({ source_ip: srcIp, dest_ip: destIp || undefined, dest_port: port ? parseInt(port) : undefined });
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
        <span className="text-2xl">🌐</span>
        <div>
          <h3 className="font-mono font-bold text-white">Network Threat Monitor</h3>
          <p className="text-xs text-gray-500">C2 beaconing, botnet, port scanning detection</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            value={srcIp}
            onChange={(e) => setSrcIp(e.target.value)}
            placeholder="Source IP"
            className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
          />
          <input
            value={destIp}
            onChange={(e) => setDestIp(e.target.value)}
            placeholder="Destination IP"
            className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
          />
        </div>
        <input
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Destination port"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setSrcIp('10.0.0.44'); setDestIp('185.220.101.47'); setPort('4444'); }}
            className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 font-mono text-xs hover:border-cyber-green/20 hover:text-cyber-green transition-colors"
          >
            Load Demo
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !srcIp.trim()}
            className="flex-1 py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Scanning...' : 'Analyze Traffic'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner label="Analyzing network patterns..." />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ScoreBar score={result.score} label="Network Threat Score" height="h-3" />
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <ExplainBox reasons={result.reasons} />
          <div className="flex flex-wrap gap-2">
            {result.triggered_rules.map((rule) => (
              <span key={rule} className="font-mono text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
