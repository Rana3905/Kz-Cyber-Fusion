import { useDemoStore } from '../../store/demoStore';
import { useAlertStore } from '../../store/alertStore';
import { useIncidentStore } from '../../store/incidentStore';
import { runDemo } from '../../api/demo';
import { buildMockDemoResult, DEMO_STEPS, MOCK_ALERTS } from '../../utils/demoData';

export default function DemoButton() {
  const { status, setStatus, setCurrentStep, addCompletedStep, setResult, setError, reset } = useDemoStore();
  const { addAlert } = useAlertStore();
  const { addIncident } = useIncidentStore();

  const isRunning = status === 'running';

  const handleRun = async () => {
    if (isRunning) return;
    reset();
    setStatus('running');

    try {
      // Try real API first, fall back to mock
      let result;
      try {
        result = await runDemo();
      } catch {
        result = buildMockDemoResult();
      }

      // Animate steps one by one
      for (let i = 0; i < result.steps.length; i++) {
        const step = result.steps[i];
        setCurrentStep(i + 1);
        addCompletedStep(step);

        // Add alert for each step
        if (MOCK_ALERTS[i]) {
          addAlert(MOCK_ALERTS[i]);
        }

        await new Promise((r) => setTimeout(r, 1000));
      }

      setResult(result);
      addIncident(result.incident);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Demo failed');
    }
  };

  return (
    <button
      onClick={handleRun}
      disabled={isRunning}
      className={`
        relative group w-full flex items-center justify-center gap-3
        px-8 py-5 rounded-xl font-mono font-bold text-lg
        border-2 transition-all duration-300
        ${isRunning
          ? 'border-cyber-green/40 text-cyber-green/60 cursor-not-allowed bg-cyber-green/5'
          : 'border-cyber-green text-cyber-green bg-cyber-green/10 hover:bg-cyber-green/20 hover:shadow-cyber-strong cursor-pointer animate-glow'
        }
      `}
    >
      {isRunning ? (
        <>
          <span className="w-5 h-5 rounded-full border-2 border-cyber-green/30 border-t-cyber-green animate-spin" />
          <span>RUNNING DEMO...</span>
        </>
      ) : (
        <>
          <span className="text-2xl">🛡️</span>
          <span>Run Kazakhstan SMS Blaster Demo</span>
          <span className="absolute right-4 text-cyber-green/40 group-hover:text-cyber-green transition-colors text-sm">▶</span>
        </>
      )}
      {/* Glow pulse */}
      {!isRunning && (
        <span className="absolute inset-0 rounded-xl border-2 border-cyber-green/20 animate-ping pointer-events-none" />
      )}
    </button>
  );
}
