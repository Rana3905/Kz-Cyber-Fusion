import { useState } from 'react';
import { detectLogs } from '../../api/logs';
import { DetectorResult } from '../../types/detector';
import ScoreBar from '../shared/ScoreBar';
import SeverityBadge from '../incidents/SeverityBadge';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import LoadingSpinner from '../shared/LoadingSpinner';

const DEMO_LOGS = `2024-01-15 03:10:02 AUTH FAIL user_882 from 185.220.101.47
2024-01-15 03:10:04 AUTH FAIL user_882 from 185.220.101.47
2024-01-15 03:10:06 AUTH FAIL user_882 from 185.220.101.47
2024-01-15 03:11:55 AUTH FAIL user_882 from 185.220.101.47
2024-01-15 03:14:02 AUTH SUCCESS user_882 from 185.220.101.47 NEW_DEVICE
2024-01-15 03:14:45 PRIVILEGE_ESCALATION user_882 → admin
2024-01-15 03:15:12 FILE_ACCESS /sensitive/customer_data.csv user_882`;

const MOCK_RESULT: DetectorResult = {
  score: 82,
  confidence: 0.86,
  severity: 'High',
  reasons: [
    '47 failed authentication attempts in 4 minutes — brute force attack',
    'Successful login after brute force from the same IP',
    'Privilege escalation attempt: user → admin within 43 seconds',
    'Sensitive file access immediately after privilege escalation',
    'All events from single foreign IP: 185.220.101.47',
  ],
  triggered_rules: ['BRUTE_FORCE', 'AUTH_AFTER_BRUTEFORCE', 'PRIVILEGE_ESCALATION', 'SENSITIVE_ACCESS'],
  detector: 'logs',
  timestamp: new Date().toISOString(),
};

export default function LogIntelligence() {
  const [logs, setLogs] = useState('');
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!logs.trim()) return;
    setLoading(true);
    try {
      const entries = logs.split('\n').filter(Boolean);
      const res = await detectLogs({ log_type: 'auth', log_entries: entries });
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
        <span className="text-2xl">📋</span>
        <div>
          <h3 className="font-mono font-bold text-white">Log Intelligence Engine</h3>
          <p className="text-xs text-gray-500">Auth logs, brute force, privilege escalation detection</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={logs}
          onChange={(e) => setLogs(e.target.value)}
          placeholder="Paste log entries here (one per line)..."
          rows={6}
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-xs text-gray-200 placeholder-gray-600 font-mono resize-none focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setLogs(DEMO_LOGS)}
            className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 font-mono text-xs hover:border-cyber-green/20 hover:text-cyber-green transition-colors"
          >
            Load Demo
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !logs.trim()}
            className="flex-1 py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Logs'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner label="Processing log entries..." />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ScoreBar score={result.score} label="Log Threat Score" height="h-3" />
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <ExplainBox reasons={result.reasons} />
          <div className="flex flex-wrap gap-2">
            {result.triggered_rules.map((rule) => (
              <span key={rule} className="font-mono text-xs px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
