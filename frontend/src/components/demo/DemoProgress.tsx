import { useDemoStore } from '../../store/demoStore';

const STEP_ICONS: Record<string, string> = {
  phishing: '🎣',
  leak: '💧',
  anomaly: '⚡',
  deepfake: '🎭',
  network: '🌐',
  logs: '📋',
  fusion: '🔗',
};

export default function DemoProgress() {
  const { status, currentStep, completedSteps, totalSteps } = useDemoStore();

  if (status === 'idle') return null;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm text-cyber-green font-bold">
          {status === 'running' ? '⟳ EXECUTING DEMO SCENARIO' : status === 'complete' ? '✓ DEMO COMPLETE' : '✗ DEMO ERROR'}
        </div>
        <div className="font-mono text-xs text-gray-500">
          STEP {currentStep}/{totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-cyber-green transition-all duration-500"
          style={{ width: `${progress}%`, boxShadow: '0 0 8px #00FF8860' }}
        />
      </div>

      {/* Steps list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {completedSteps.map((step, i) => {
          const icon = step.detector ? STEP_ICONS[step.detector] || '◉' : '◉';
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-cyber-bg border border-cyber-border animate-slide-in"
            >
              <span className="text-base shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-cyber-green font-semibold">
                  {String(step.step).padStart(2, '0')} — {step.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
              </div>
              <span className="text-cyber-green text-sm shrink-0">✓</span>
            </div>
          );
        })}

        {status === 'running' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-green/5 border border-cyber-green/20">
            <span className="w-4 h-4 rounded-full border-2 border-cyber-green/30 border-t-cyber-green animate-spin shrink-0" />
            <span className="font-mono text-xs text-cyber-green">Processing...</span>
          </div>
        )}
      </div>

      {status === 'complete' && (
        <div className="text-center font-mono text-xs text-cyber-green bg-cyber-green/10 rounded-lg py-2 border border-cyber-green/20">
          ✓ Critical Incident KCF-001 generated — view in Incidents
        </div>
      )}
    </div>
  );
}
