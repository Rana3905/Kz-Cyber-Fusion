import { DetectorResult, LeakInput } from '../types/detector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function detectLeak(input: LeakInput): Promise<DetectorResult> {
  const res = await fetch(`${API_URL}/api/detect/leak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Leak detection failed');
  return json.data;
}
