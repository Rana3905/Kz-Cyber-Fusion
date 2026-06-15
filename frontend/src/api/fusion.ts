import { Incident } from '../types/incident';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface FusionRequest {
  entity_email?: string;
  entity_phone?: string;
  entity_ip?: string;
  time_window_minutes?: number;
  detector_results?: Record<string, unknown>;
}

export async function correlate(input: FusionRequest): Promise<Incident> {
  const res = await fetch(`${API_URL}/api/fusion/correlate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Fusion failed');
  return json.data;
}
