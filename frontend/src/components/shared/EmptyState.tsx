interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = '◎', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl text-gray-600 mb-4">{icon}</div>
      <h3 className="font-mono text-gray-400 font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-sm max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
