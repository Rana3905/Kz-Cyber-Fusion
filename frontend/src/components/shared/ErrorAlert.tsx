interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="rounded-lg border border-cyber-critical/30 bg-cyber-critical/10 p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="text-cyber-critical mt-0.5">⚠</span>
        <div>
          <div className="font-mono text-xs text-cyber-critical font-semibold mb-1">SYSTEM ERROR</div>
          <div className="text-sm text-gray-300">{message}</div>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 text-sm shrink-0">
          ✕
        </button>
      )}
    </div>
  );
}
