import { AssistantAskRequest, AssistantAskResponse } from '../types/assistant';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function askAssistant(input: AssistantAskRequest): Promise<AssistantAskResponse> {
  const res = await fetch(`${API_URL}/api/assistant/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Assistant request failed');
  return json.data;
}
