interface EvidenceSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export default function EvidenceSection({ title, children, icon = '◈' }: EvidenceSectionProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyber-border">
        <span className="text-cyber-green text-sm">{icon}</span>
        <h3 className="font-mono text-xs text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}
