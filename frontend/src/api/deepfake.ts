import { DetectorResult, DeepfakeInput } from '../types/detector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function detectDeepfake(input: DeepfakeInput): Promise<DetectorResult> {
  const res = await fetch(`${API_URL}/api/detect/deepfake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Deepfake detection failed');
  return json.data;
}
