import { Alarm, Severity, StatusTone } from '../types';

const severityRank: Record<Severity, number> = {
  critical: 0,
  major: 1,
  minor: 2,
  info: 3,
};

export const orderAlarms = (alarms: Alarm[]) =>
  [...alarms].sort((left, right) => {
    const severityGap = severityRank[left.severity] - severityRank[right.severity];
    if (severityGap !== 0) return severityGap;
    return left.domain.localeCompare(right.domain);
  });

export const severityLabel = (severity: Severity) => severity.toUpperCase();

export const statusLabel = (status: StatusTone) => {
  switch (status) {
    case 'healthy':
      return 'Healthy';
    case 'watch':
      return 'Watch';
    case 'degraded':
      return 'Degraded';
    case 'critical':
      return 'Critical';
  }
};
