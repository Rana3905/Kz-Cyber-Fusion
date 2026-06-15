import { Incident } from '../types/incident';
import { DemoResult } from '../api/demo';

export const DEMO_STEPS = [
  { step: 1, name: 'Fake Bank SMS Detected', description: 'Intercepted Kaspi Bank phishing SMS with fake bonus link', detector: 'phishing' },
  { step: 2, name: 'Phishing URL Analyzed', description: 'URL kaspi-bonus-2024.ru flagged as phishing domain', detector: 'phishing' },
  { step: 3, name: 'Credential Leak Found', description: 'Email aigerim.seitova@gmail.com found in 2 breach datasets', detector: 'leak' },
  { step: 4, name: 'Suspicious Login Detected', description: 'Login from Moscow, RU at 03:14 UTC — impossible travel from Almaty', detector: 'anomaly' },
  { step: 5, name: 'Deepfake Call Identified', description: 'Incoming call claiming to be Kaspi Bank officer — AI voice detected', detector: 'deepfake' },
  { step: 6, name: 'C2 Network Traffic Found', description: 'Outbound traffic to 185.220.101.47 on port 4444 — C2 beacon pattern', detector: 'network' },
  { step: 7, name: 'Log Anomalies Found', description: '47 failed auth attempts followed by successful login from new device', detector: 'logs' },
  { step: 8, name: 'Cyber Fusion Correlation', description: 'All signals correlated — Critical Financial Fraud Incident generated', detector: 'fusion' },
];

export const MOCK_INCIDENT: Incident = {
  id: 'KCF-001',
  title: 'Coordinated Financial Fraud — SMS Blaster + Deepfake + Account Takeover',
  risk_score: 97,
  severity: 'Critical',
  confidence: 0.96,
  status: 'open',
  affected_entity: {
    email: 'aigerim.seitova@gmail.com',
    phone: '+7 701 ***-**89',
    ip: '185.220.101.47',
    device: 'Unknown Android (new)',
  },
  detector_results: {
    phishing: { score: 94, severity: 'Critical', confidence: 0.97, triggered: true },
    leak: { score: 85, severity: 'High', confidence: 0.92, triggered: true },
    anomaly: { score: 91, severity: 'Critical', confidence: 0.95, triggered: true },
    deepfake: { score: 88, severity: 'High', confidence: 0.89, triggered: true },
    network: { score: 80, severity: 'High', confidence: 0.84, triggered: true },
    logs: { score: 82, severity: 'High', confidence: 0.86, triggered: true },
  },
  timeline: [
    { time: new Date(Date.now() - 3600000 * 3).toISOString(), event: 'Phishing SMS sent from fake base station', severity: 'Critical', detector: 'phishing' },
    { time: new Date(Date.now() - 3600000 * 2.8).toISOString(), event: 'Victim clicked phishing link kaspi-bonus-2024.ru', severity: 'Critical', detector: 'phishing' },
    { time: new Date(Date.now() - 3600000 * 2.5).toISOString(), event: 'Email found in Zaimer.kz breach dataset', severity: 'High', detector: 'leak' },
    { time: new Date(Date.now() - 3600000 * 2).toISOString(), event: 'Deepfake voice call from fake Kaspi Bank officer', severity: 'High', detector: 'deepfake' },
    { time: new Date(Date.now() - 3600000 * 1.5).toISOString(), event: 'Login from Moscow RU — impossible travel detected', severity: 'Critical', detector: 'anomaly' },
    { time: new Date(Date.now() - 3600000 * 1).toISOString(), event: '47 failed auth attempts → brute force pattern', severity: 'High', detector: 'logs' },
    { time: new Date(Date.now() - 3600000 * 0.5).toISOString(), event: 'C2 beacon to 185.220.101.47:4444 detected', severity: 'High', detector: 'network' },
    { time: new Date(Date.now() - 3600000 * 0.1).toISOString(), event: 'Cyber Fusion: Critical incident correlated', severity: 'Critical', detector: 'fusion' },
  ],
  explanation: 'This incident represents a coordinated multi-vector financial fraud attack. The attacker used an SMS blaster (fake base station) to send phishing messages impersonating Kaspi Bank. The victim\'s credentials were already present in leaked datasets, enabling rapid account compromise. A deepfake voice call was used to social-engineer the victim into approving a transaction. Impossible travel login from Moscow confirms account takeover. The attack follows the KZ Financial Fraud Pattern: phishing → credential stuffing → social engineering → account takeover.',
  recommended_actions: [
    'Block IP 185.220.101.47 immediately',
    'Freeze account for aigerim.seitova@gmail.com',
    'Force password reset on all associated accounts',
    'Flag all transactions from unknown device in last 6 hours',
    'Notify AFM fraud investigation team',
    'Issue KZ-CERT incident report',
    'Escalate to telecom for SMS blaster source tracing',
  ],
  created_at: new Date().toISOString(),
};

export function buildMockDemoResult(): DemoResult {
  return {
    scenario: 'Kazakhstan SMS Blaster Fraud',
    steps: DEMO_STEPS.map((s, i) => ({
      ...s,
      timestamp: new Date(Date.now() - (DEMO_STEPS.length - i) * 1000).toISOString(),
    })),
    incident: MOCK_INCIDENT,
    total_duration_ms: 8200,
  };
}

export const MOCK_ALERTS = [
  { id: 'a1', message: 'Phishing SMS detected — Kaspi Bank impersonation', severity: 'Critical' as const, detector: 'Phishing Shield', timestamp: new Date(Date.now() - 60000).toISOString(), entity: 'aigerim.seitova@gmail.com' },
  { id: 'a2', message: 'Credential leak — email found in breach dataset', severity: 'High' as const, detector: 'Leak Sentinel', timestamp: new Date(Date.now() - 120000).toISOString(), entity: '+7701***89' },
  { id: 'a3', message: 'Impossible travel — Almaty → Moscow in 12 minutes', severity: 'Critical' as const, detector: 'Behavioral Anomaly', timestamp: new Date(Date.now() - 180000).toISOString(), entity: '185.220.101.47' },
  { id: 'a4', message: 'Deepfake voice call detected — fake bank officer', severity: 'High' as const, detector: 'Deepfake Guard', timestamp: new Date(Date.now() - 240000).toISOString(), entity: '+77272000000' },
  { id: 'a5', message: 'C2 beacon traffic — port 4444 outbound', severity: 'High' as const, detector: 'Network Monitor', timestamp: new Date(Date.now() - 300000).toISOString(), entity: '185.220.101.47' },
  { id: 'a6', message: 'Brute force: 47 failed logins in 3 minutes', severity: 'High' as const, detector: 'Log Intelligence', timestamp: new Date(Date.now() - 360000).toISOString(), entity: 'user_882' },
];
