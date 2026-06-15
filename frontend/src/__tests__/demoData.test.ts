import { describe, it, expect } from 'vitest';
import { buildMockDemoResult, DEMO_STEPS, MOCK_INCIDENT, MOCK_ALERTS } from '../utils/demoData';

describe('demoData', () => {
  it('DEMO_STEPS has 8 steps', () => {
    expect(DEMO_STEPS).toHaveLength(8);
  });

  it('each step has required fields', () => {
    DEMO_STEPS.forEach((step) => {
      expect(step.step).toBeGreaterThan(0);
      expect(step.name).toBeTruthy();
      expect(step.description).toBeTruthy();
    });
  });

  it('MOCK_INCIDENT has all required fields', () => {
    expect(MOCK_INCIDENT.id).toBe('KCF-001');
    expect(MOCK_INCIDENT.risk_score).toBeGreaterThanOrEqual(80);
    expect(MOCK_INCIDENT.severity).toBe('Critical');
    expect(MOCK_INCIDENT.affected_entity.email).toBeTruthy();
    expect(MOCK_INCIDENT.timeline.length).toBeGreaterThan(0);
    expect(MOCK_INCIDENT.recommended_actions.length).toBeGreaterThan(0);
  });

  it('buildMockDemoResult returns valid result', () => {
    const result = buildMockDemoResult();
    expect(result.scenario).toBeTruthy();
    expect(result.steps).toHaveLength(DEMO_STEPS.length);
    expect(result.incident).toBeDefined();
    expect(result.incident.id).toBe('KCF-001');
  });

  it('MOCK_ALERTS has alerts with severity values', () => {
    MOCK_ALERTS.forEach((alert) => {
      expect(['Low', 'Medium', 'High', 'Critical']).toContain(alert.severity);
      expect(alert.message).toBeTruthy();
      expect(alert.detector).toBeTruthy();
    });
  });
});
