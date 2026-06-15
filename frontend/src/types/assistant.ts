export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AssistantAskRequest {
  incident_id?: string;
  question: string;
  context?: string;
}

export interface AssistantAskResponse {
  answer: string;
  confidence: number;
  sources: string[];
  suggested_questions: string[];
}
