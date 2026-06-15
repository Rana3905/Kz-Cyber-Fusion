import { Severity } from '../../types/incident';
import { getSeverityBg } from '../../utils/riskCalculator';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export default function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const bg = getSeverityBg(severity);
  const text = size === 'sm' ? 'text-xs' : 'text-xs';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border font-mono font-bold ${text} ${bg}`}>
      {severity.toUpperCase()}
    </span>
  );
}
