import { DetectorResult, LogInput } from '../types/detector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function detectLogs(input: LogInput): Promise<DetectorResult> {
  const res = await fetch(`${API_URL}/api/detect/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Log detection failed');
  return json.data;
}
