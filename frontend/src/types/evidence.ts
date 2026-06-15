import { Severity } from './incident';
import { DetectorResult } from './detector';

export interface EvidencePackage {
  id: string;
  incident_id: string;
  created_at: string;
  incident_summary: string;
  risk_score: number;
  confidence_score: number;
  severity: Severity;
  affected_entity: {
    email: string;
    phone: string;
    ip: string;
    device: string;
  };
  timeline: Array<{
    time: string;
    event: string;
    severity: Severity;
  }>;
  detector_results: Record<string, DetectorResult>;
  recommended_actions: string[];
  explainability_notes: string[];
  analyst_notes?: string;
}
