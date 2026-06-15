import { ActionType, ActionStatus } from '../../types/response';

interface ActionButtonProps {
  actionType: ActionType;
  label: string;
  description: string;
  status: ActionStatus;
  onClick: () => void;
}

const ACTION_ICONS: Record<ActionType, string> = {
  block_ip: '🚫',
  freeze_account: '🔒',
  force_password_reset: '🔑',
  flag_transaction: '🚩',
  notify_analyst: '📢',
  create_ticket: '🎫',
  escalate_to_afm: '⬆️',
};

const STATUS_STYLES: Record<ActionStatus, string> = {
  pending: 'border-cyber-border text-gray-400 hover:border-cyber-green/30 hover:text-cyber-green',
  executing: 'border-cyber-medium/40 text-cyber-medium cursor-not-allowed',
  completed: 'border-cyber-low/30 text-cyber-low bg-cyber-low/5 cursor-default',
  failed: 'border-cyber-critical/30 text-cyber-critical',
};

export default function ActionButton({ actionType, label, description, status, onClick }: ActionButtonProps) {
  const icon = ACTION_ICONS[actionType];
  const style = STATUS_STYLES[status];
  const isDisabled = status === 'executing' || status === 'completed';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg border bg-transparent transition-all duration-200 text-left ${style}`}
    >
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm font-semibold">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
      <div className="shrink-0 font-mono text-xs">
        {status === 'pending' && <span className="text-gray-600">▶ Execute</span>}
        {status === 'executing' && (
          <span className="w-4 h-4 rounded-full border-2 border-cyber-medium/30 border-t-cyber-medium animate-spin block" />
        )}
        {status === 'completed' && <span className="text-cyber-low">✓ Done</span>}
        {status === 'failed' && <span className="text-cyber-critical">✗ Failed</span>}
      </div>
    </button>
  );
}
