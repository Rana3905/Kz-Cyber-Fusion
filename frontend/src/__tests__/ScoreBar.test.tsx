import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreBar from '../components/shared/ScoreBar';

describe('ScoreBar', () => {
  it('renders with a label', () => {
    render(<ScoreBar score={75} label="Test Score" />);
    expect(screen.getByText('Test Score')).toBeTruthy();
  });

  it('renders without crashing for score 0', () => {
    const { container } = render(<ScoreBar score={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing for score 100', () => {
    const { container } = render(<ScoreBar score={100} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('hides value when showValue is false', () => {
    render(<ScoreBar score={50} showValue={false} />);
    expect(screen.queryByText('50')).toBeNull();
  });
});
