import { ResponseTriggerRequest, ResponseTriggerResult } from '../types/response';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function triggerResponse(input: ResponseTriggerRequest): Promise<ResponseTriggerResult> {
  const res = await fetch(`${API_URL}/api/response/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Response trigger failed');
  return json.data;
}
