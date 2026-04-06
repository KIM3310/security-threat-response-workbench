import { scenarioEvidence } from '../data/evidence';
import { scenarios } from '../data/scenarios';
import { severityLabel } from './format';
import type { Alarm } from '../types';

export function buildAnalystBrief(
  scenario: (typeof scenarios)[number],
  alarms: Alarm[],
  evidence: (typeof scenarioEvidence)[string],
) {
  const topAlarms = alarms
    .slice(0, 2)
    .map((alarm) => `${severityLabel(alarm.severity)} ${alarm.title}: ${alarm.nextAction}`);
  const topIndicators = evidence.indicators
    .slice(0, 2)
    .map((indicator) => `${indicator.type} ${indicator.value} (${indicator.tag})`);

  return [
    `[${scenario.title}]`,
    evidence.analystBriefLead,
    `Current decision: ${scenario.operatorDecision}`,
    `Top events: ${topAlarms.join(' | ')}`,
    `Watchlist: ${topIndicators.join(' | ')}`,
    evidence.analystBriefClose,
  ].join('\n');
}
