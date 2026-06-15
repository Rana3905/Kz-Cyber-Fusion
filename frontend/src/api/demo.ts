import { Incident } from '../types/incident';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DemoStep {
  step: number;
  name: string;
  description: string;
  detector?: string;
  result?: Record<string, unknown>;
  timestamp: string;
}

export interface DemoResult {
  scenario: string;
  steps: DemoStep[];
  incident: Incident;
  total_duration_ms: number;
}

export async function runDemo(): Promise<DemoResult> {
  const res = await fetch(`${API_URL}/api/demo/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'sms_blaster' }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Demo run failed');
  return json.data;
}
