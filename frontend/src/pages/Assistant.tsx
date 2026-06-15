import AIAssistant from '../components/assistant/AIAssistant';
import { useDemoStore } from '../store/demoStore';

export default function Assistant() {
  const { incident } = useDemoStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">AI SOC Assistant</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">
          Ask questions about incidents in plain language
          {incident && (
            <span className="ml-2 text-cyber-green">· Analyzing {incident.id}</span>
          )}
        </p>
      </div>

      {!incident && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyber-border bg-cyber-card">
          <span className="text-cyber-medium">ℹ</span>
          <span className="text-sm text-gray-400">
            Run the <span className="text-cyber-green font-mono">SMS Blaster Demo</span> from the Overview page to load an incident for analysis.
          </span>
        </div>
      )}

      <AIAssistant />
    </div>
  );
}
