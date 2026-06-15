import { Severity } from '../types/incident';

export function getSeverityFromScore(score: number): Severity {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case 'Critical': return '#FF4444';
    case 'High': return '#FF8C00';
    case 'Medium': return '#FFD700';
    case 'Low': return '#00FF88';
  }
}

export function getSeverityBg(severity: Severity): string {
  switch (severity) {
    case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
}

export function getRiskGaugeColor(score: number): string {
  if (score >= 80) return '#FF4444';
  if (score >= 60) return '#FF8C00';
  if (score >= 40) return '#FFD700';
  return '#00FF88';
}

export function combineScores(scores: number[], weights?: number[]): number {
  if (scores.length === 0) return 0;
  if (!weights) {
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  const total = weights.reduce((a, b) => a + b, 0);
  const weighted = scores.reduce((sum, score, i) => sum + score * (weights[i] || 1), 0);
  return Math.round(weighted / total);
}
