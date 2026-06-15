import { formatConfidence } from '../../utils/formatters';

interface ConfidenceBadgeProps {
  confidence: number;
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const pct = confidence * 100;
  const color = pct >= 90 ? 'text-cyber-green border-cyber-green/30 bg-cyber-green/10'
    : pct >= 70 ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
    : 'text-gray-400 border-gray-400/30 bg-gray-400/10';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono text-xs ${color}`}>
      <span>CONF</span>
      <span className="font-bold">{formatConfidence(confidence)}</span>
    </span>
  );
}
