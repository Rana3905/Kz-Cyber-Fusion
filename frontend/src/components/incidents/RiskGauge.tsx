import { useEffect, useState } from 'react';
import { getRiskGaugeColor } from '../../utils/riskCalculator';

interface RiskGaugeProps {
  score: number;
  size?: number;
}

export default function RiskGauge({ score, size = 100 }: RiskGaugeProps) {
  const [displayed, setDisplayed] = useState(0);
  const color = getRiskGaugeColor(score);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayed / 100) * circumference;

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
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s', filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold text-white" style={{ fontSize: size * 0.22, color }}>
          {displayed}
        </span>
        <span className="font-mono text-gray-500" style={{ fontSize: size * 0.1 }}>
          /100
        </span>
      </div>
    </div>
  );
}
