export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';

export interface AffectedEntity {
  email: string;
  phone: string;
  ip: string;
  device: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
  severity: Severity;
  detector?: string;
}

export interface Incident {
  id: string;
  title: string;
  risk_score: number;
  severity: Severity;
  confidence: number;
  status: IncidentStatus;
  affected_entity: AffectedEntity;
  detector_results: Record<string, DetectorSummary>;
  timeline: TimelineEvent[];
  explanation: string;
  recommended_actions: string[];
  created_at: string;
}

export interface DetectorSummary {
  score: number;
  severity: Severity;
  confidence: number;
  triggered: boolean;
}
