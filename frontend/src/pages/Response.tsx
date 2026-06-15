import ResponsePanel from '../components/response/ResponsePanel';
import { useDemoStore } from '../store/demoStore';
import { Link } from 'react-router-dom';

export default function Response() {
  const { incident } = useDemoStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Automated Response</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">
          Execute defensive actions for active incidents
        </p>
      </div>

      {!incident && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyber-border bg-cyber-card">
          <span className="text-cyber-medium">ℹ</span>
          <span className="text-sm text-gray-400">
            Run the <Link to="/" className="text-cyber-green hover:underline">SMS Blaster Demo</Link> to load an incident and enable response actions.
          </span>
        </div>
      )}

      <ResponsePanel />
    </div>
  );
}
