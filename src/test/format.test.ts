import { describe, expect, it } from 'vitest';
import { scenarios } from '../data/scenarios';
import { orderAlarms, severityLabel, statusLabel } from '../lib/format';

describe('format helpers', () => {
  it('orders alarms from highest severity to lowest severity', () => {
    const ordered = orderAlarms(scenarios[1].alarms);
    expect(ordered[0].severity).toBe('critical');
    expect(ordered[ordered.length - 1].severity).toBe('minor');
  });

  it('returns readable labels for severity and status', () => {
    expect(severityLabel('major')).toBe('MAJOR');
    expect(statusLabel('degraded')).toBe('Degraded');
  });
});
