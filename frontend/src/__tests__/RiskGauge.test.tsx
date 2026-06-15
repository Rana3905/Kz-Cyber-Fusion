import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import RiskGauge from '../components/incidents/RiskGauge';

describe('RiskGauge', () => {
  it('renders SVG gauge', () => {
    const { container } = render(<RiskGauge score={97} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders at default size 100', () => {
    const { container } = render(<RiskGauge score={50} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('100');
    expect(svg?.getAttribute('height')).toBe('100');
  });

  it('renders at custom size', () => {
    const { container } = render(<RiskGauge score={50} size={120} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('120');
  });

  it('renders without crashing for score 0', () => {
    const { container } = render(<RiskGauge score={0} />);
    expect(container.firstChild).toBeTruthy();
  });
});
