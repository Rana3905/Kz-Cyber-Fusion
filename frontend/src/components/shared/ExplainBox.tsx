interface ExplainBoxProps {
  title?: string;
  reasons: string[];
  className?: string;
}

export default function ExplainBox({ title = 'Why was this triggered?', reasons, className = '' }: ExplainBoxProps) {
  return (
    <div className={`rounded-lg border border-cyber-blue/20 bg-cyber-blue/5 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-cyber-blue text-sm">ℹ</span>
        <span className="text-cyber-blue font-mono text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <ul className="space-y-2">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-cyber-blue mt-0.5 shrink-0">▸</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
