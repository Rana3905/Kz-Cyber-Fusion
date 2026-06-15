import { DetectorResult, PhishingInput } from '../types/detector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function detectPhishing(input: PhishingInput): Promise<DetectorResult> {
  const res = await fetch(`${API_URL}/api/detect/phishing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Phishing detection failed');
  return json.data;
}
