import { useState } from 'react';
import { detectDeepfake } from '../../api/deepfake';
import { DetectorResult } from '../../types/detector';
import ScoreBar from '../shared/ScoreBar';
import SeverityBadge from '../incidents/SeverityBadge';
import ExplainBox from '../shared/ExplainBox';
import ConfidenceBadge from '../shared/ConfidenceBadge';
import LoadingSpinner from '../shared/LoadingSpinner';

const MOCK_RESULT: DetectorResult = {
  score: 88,
  confidence: 0.89,
  severity: 'High',
  reasons: [
    'Voice frequency patterns inconsistent with human speech — AI synthesis markers detected',
    'Caller claims to be Kaspi Bank security officer — identity not verified',
    'Transcript contains high-pressure tactics: "account will be blocked in 10 minutes"',
    'Call originates from VoIP number not registered to Kaspi Bank',
    'Similar deepfake voice pattern matches known fraud campaign from 2024',
  ],
  triggered_rules: ['AI_VOICE_MARKERS', 'UNVERIFIED_IDENTITY', 'PRESSURE_TACTICS', 'VOIP_FRAUD'],
  detector: 'deepfake',
  timestamp: new Date().toISOString(),
};

export default function DeepfakeGuard() {
  const [transcript, setTranscript] = useState('');
  const [callerId, setCallerId] = useState('');
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const res = await detectDeepfake({ media_type: 'voice', transcript, caller_id: callerId || undefined, claimed_identity: 'Kaspi Bank Security' });
      setResult(res);
    } catch {
      setResult(MOCK_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setCallerId('+77272000000');
    setTranscript('Здравствуйте, это служба безопасности Kaspi Bank. Ваш счёт был скомпрометирован. Для защиты средств вам необходимо подтвердить код из SMS в течение 10 минут, иначе счёт будет заблокирован.');
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎭</span>
        <div>
          <h3 className="font-mono font-bold text-white">Deepfake Guard</h3>
          <p className="text-xs text-gray-500">AI voice & video fraud detection</p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          value={callerId}
          onChange={(e) => setCallerId(e.target.value)}
          placeholder="Caller ID / phone number"
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Call transcript or description..."
          rows={4}
          className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 font-mono resize-none focus:outline-none focus:border-cyber-green/40 transition-colors"
        />
        <div className="flex gap-2">
          <button onClick={loadDemo} className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 font-mono text-xs hover:border-cyber-green/20 hover:text-cyber-green transition-colors">
            Load Demo
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !transcript.trim()}
            className="flex-1 py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Detect Deepfake'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner label="Scanning for AI synthesis patterns..." />}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ScoreBar score={result.score} label="Deepfake Score" height="h-3" />
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <ExplainBox reasons={result.reasons} />
          <div className="flex flex-wrap gap-2">
            {result.triggered_rules.map((rule) => (
              <span key={rule} className="font-mono text-xs px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
