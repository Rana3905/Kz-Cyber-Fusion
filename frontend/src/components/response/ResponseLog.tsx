import { ResponseAction } from '../../types/response';
import { formatTime } from '../../utils/formatters';

interface ResponseLogProps {
  actions: ResponseAction[];
}

export default function ResponseLog({ actions }: ResponseLogProps) {
  const completed = actions.filter((a) => a.status === 'completed' || a.status === 'failed');

  if (completed.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 font-mono text-xs">
        No actions executed yet.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {completed.map((action) => (
        <div
          key={action.id}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border font-mono text-xs ${
            action.status === 'completed'
              ? 'border-cyber-low/20 bg-cyber-low/5 text-cyber-low'
              : 'border-cyber-critical/20 bg-cyber-critical/5 text-cyber-critical'
          }`}
        >
          <span>{action.status === 'completed' ? '✓' : '✗'}</span>
          <span className="flex-1">{action.label}</span>
          <span className="text-gray-600">{action.target}</span>
          {action.executed_at && (
            <span className="text-gray-600">{formatTime(action.executed_at)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
