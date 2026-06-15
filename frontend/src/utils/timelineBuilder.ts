import { TimelineEvent } from '../types/incident';

export function sortTimeline(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
}

export function groupTimelineByHour(events: TimelineEvent[]): Record<string, TimelineEvent[]> {
  return events.reduce((groups, event) => {
    const hour = new Date(event.time).toISOString().slice(0, 13);
    if (!groups[hour]) groups[hour] = [];
    groups[hour].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);
}
