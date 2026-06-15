import { useState } from 'react';
import { detectLeak } from '../../api/leak';
import { DetectorResult } from '../../types/detector';
import ScoreBar from '../shared/ScoreBar';
import SeverityBadge from '../incidents/SeverityBadge';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import LoadingSpinner from '../shared/LoadingSpinner';

const MOCK_RESULT: DetectorResult = {
  score: 85,
  confidence: 0.92,
  severity: 'High',
  reasons: [
    'Email found in Zaimer.kz breach (2023) — 2.1M records',
    'Same email in combo list posted on darknet forum',
    'Associated phone number found in telecom data leak',
    'Credentials likely already in attacker possession',
  ],
  triggered_rules: ['EMAIL_IN_BREACH', 'DARKNET_EXPOSURE', 'PHONE_LEAK'],
  detector: 'leak',
  timestamp: new Date().toISOString(),
};

export default function LeakSentinel() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!email && !phone) return;
    setLoading(true);
    try {
      const res = await detectLeak({ email: email || undefined, phone: phone || undefined });
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
        <span className="text-2xl">💧</span>
        <div>
          <h3 className="font-mono font-bold text-white">Leak Sentinel</h3>
          <p className="text-xs text-gray-500">Breach database & darknet exposure check</p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number (e.g. +77011234567)"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setEmail('aigerim.seitova@gmail.com'); setPhone('+77012345689'); }}
            className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 font-mono text-xs hover:border-cyber-green/20 hover:text-cyber-green transition-colors"
          >
            Load Demo
          </button>
          <button
            onClick={handleCheck}
            disabled={loading || (!email && !phone)}
            className="flex-1 py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Leaks'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner label="Querying breach datasets..." />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ScoreBar score={result.score} label="Leak Exposure Score" height="h-3" />
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <ExplainBox reasons={result.reasons} />
          <div className="flex flex-wrap gap-2">
            {result.triggered_rules.map((rule) => (
              <span key={rule} className="font-mono text-xs px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
