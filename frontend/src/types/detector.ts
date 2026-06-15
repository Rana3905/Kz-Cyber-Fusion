import { Severity } from './incident';

export interface DetectorResult {
  score: number;
  confidence: number;
  severity: Severity;
  reasons: string[];
  triggered_rules: string[];
  detector: string;
  timestamp: string;
}

export interface PhishingInput {
  message: string;
  url?: string;
  sender?: string;
}

export interface LeakInput {
  email?: string;
  phone?: string;
  username?: string;
}

export interface AnomalyInput {
  user_id: string;
  ip_address: string;
  device_id?: string;
  login_time?: string;
  location?: string;
}

export interface DeepfakeInput {
  media_type: 'voice' | 'video';
  caller_id?: string;
  transcript?: string;
  claimed_identity?: string;
}

export interface NetworkInput {
  source_ip: string;
  dest_ip?: string;
  dest_port?: number;
  protocol?: string;
  bytes_out?: number;
}

export interface LogInput {
  log_type: 'auth' | 'firewall' | 'system' | 'application';
  log_entries: string[];
  source_ip?: string;
  user_id?: string;
}
