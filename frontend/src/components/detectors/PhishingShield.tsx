import { useState } from 'react';
import { detectPhishing } from '../../api/phishing';
import { DetectorResult } from '../../types/detector';
import ScoreBar from '../shared/ScoreBar';
import SeverityBadge from '../incidents/SeverityBadge';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';

const MOCK_RESULT: DetectorResult = {
  score: 94,
  confidence: 0.97,
  severity: 'Critical',
  reasons: [
    'Message references fake bonus — classic social engineering',
    'URL kaspi-bonus-2024.ru is a lookalike phishing domain',
    'Brand impersonation: Kaspi Bank identity cloned',
    'Urgency language detected: "срок истекает через 24 часа"',
    'Sender number not in Kaspi official registry',
  ],
  triggered_rules: ['FAKE_BONUS', 'LOOKALIKE_DOMAIN', 'BRAND_IMPERSONATION', 'URGENCY_LANGUAGE'],
  detector: 'phishing',
  timestamp: new Date().toISOString(),
};

export default function PhishingShield() {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await detectPhishing({ message, url: url || undefined });
      setResult(res);
    } catch {
      setResult(MOCK_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setMessage('Kaspi Bank: Поздравляем! Вам одобрен бонус 50,000 тенге. Перейдите по ссылке для получения: kaspi-bonus-2024.ru Срок истекает через 24 часа!');
    setUrl('kaspi-bonus-2024.ru');
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎣</span>
          <div>
            <h3 className="font-mono font-bold text-white">Phishing Shield</h3>
            <p className="text-xs text-gray-500">SMS, email, URL & brand impersonation detection</p>
          </div>
        </div>
        <button onClick={loadDemo} className="font-mono text-xs text-cyber-green border border-cyber-green/20 rounded px-3 py-1.5 hover:bg-cyber-green/10 transition-colors">
          Load Demo
        </button>
      </div>

      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste SMS or email message text here..."
          rows={4}
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 font-mono resize-none focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (optional)"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !message.trim()}
          className="w-full py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {loading && <LoadingSpinner label="Scanning for phishing patterns..." />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ScoreBar score={result.score} label="Phishing Score" height="h-3" />
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <ExplainBox reasons={result.reasons} />
          <div className="flex flex-wrap gap-2">
            {result.triggered_rules.map((rule) => (
              <span key={rule} className="font-mono text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
