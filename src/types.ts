export type MetricTone = 'teal' | 'amber' | 'coral';
export type Severity = 'critical' | 'major' | 'minor' | 'info';
export type StatusTone = 'healthy' | 'watch' | 'degraded' | 'critical';
export type TimelineState = 'done' | 'active' | 'queued';

export interface Metric {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
}

export interface DomainStatus {
  name: string;
  layer: string;
  status: StatusTone;
  availability: string;
  detail: string;
}

export interface Alarm {
  id: string;
  severity: Severity;
  domain: string;
  title: string;
  impact: string;
  signal: string;
  owner: string;
  nextAction: string;
  eta: string;
}

export interface ServiceHop {
  name: string;
  segment: string;
  status: StatusTone;
  detail: string;
}

export interface TimelineEntry {
  time: string;
  title: string;
  detail: string;
  owner: string;
  state: TimelineState;
}

export interface AutomationCard {
  title: string;
  value: string;
  summary: string;
  outcome: string;
}

export interface RoleMapping {
  keyword: string;
  proof: string;
}

export interface RunbookStep {
  step: string;
  owner: string;
  action: string;
  outcome: string;
}

export interface ApplicationAsset {
  label: string;
  text: string;
}

export interface EvidenceCard {
  label: string;
  value: string;
  detail: string;
}

export interface Indicator {
  type: string;
  value: string;
  tag: string;
  note: string;
}

export interface SnapshotCard {
  label: string;
  value: string;
  detail: string;
}

export interface GeneratedSnapshotMeta {
  generatedAt: string;
  sourceFiles: number;
  shiftWindow: string;
}

export interface GeneratedSnapshot {
  meta: GeneratedSnapshotMeta;
  summary: SnapshotCard[];
  lanes: SnapshotCard[];
  patterns: SnapshotCard[];
  handoff: SnapshotCard[];
}

export interface Scenario {
  id: string;
  title: string;
  summary: string;
  strongestFor: string;
  commandFocus: string;
  operatorDecision: string;
  availability: string;
  mttr: string;
  trafficShift: string;
  automationCoverage: string;
  metrics: Metric[];
  domains: DomainStatus[];
  servicePath: ServiceHop[];
  alarms: Alarm[];
  timeline: TimelineEntry[];
  automations: AutomationCard[];
  runbook: RunbookStep[];
  applicationAssets: ApplicationAsset[];
  roleMappings: RoleMapping[];
  recruiterNotes: string[];
}
