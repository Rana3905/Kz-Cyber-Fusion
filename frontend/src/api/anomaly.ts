import { DetectorResult, AnomalyInput } from '../types/detector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function detectAnomaly(input: AnomalyInput): Promise<DetectorResult> {
  const res = await fetch(`${API_URL}/api/detect/anomaly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Anomaly detection failed');
  return json.data;
}
