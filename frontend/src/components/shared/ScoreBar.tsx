import { useEffect, useState } from 'react';
import { getRiskGaugeColor } from '../../utils/riskCalculator';

interface ScoreBarProps {
  score: number;
  label?: string;
  showValue?: boolean;
  height?: string;
}

export default function ScoreBar({ score, label, showValue = true, height = 'h-2' }: ScoreBarProps) {
  const [displayed, setDisplayed] = useState(0);
  const color = getRiskGaugeColor(score);

  useEffect(() => {
    let frame = 0;
    const duration = 60;
    const animate = () => {
      frame++;
      setDisplayed(Math.round((frame / duration) * score));
      if (frame < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-gray-400 font-mono">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono font-bold" style={{ color }}>
              {displayed}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-white/5 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${displayed}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}
