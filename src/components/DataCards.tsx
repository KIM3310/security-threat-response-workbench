import { BadgeCheck, CircleAlert, Gauge, Sparkles } from 'lucide-react';
import { severityLabel, statusLabel } from '../lib/format';
import type {
  Alarm,
  ApplicationAsset,
  AutomationCard,
  DomainStatus,
  EvidenceCard,
  Indicator,
  Metric,
  RoleMapping,
  RunbookStep,
  ServiceHop,
  TimelineEntry,
} from '../types';

const toneIcon = {
  teal: <BadgeCheck className="metric-icon teal" aria-hidden="true" />,
  amber: <Gauge className="metric-icon amber" aria-hidden="true" />,
  coral: <CircleAlert className="metric-icon coral" aria-hidden="true" />,
} as const;

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className={`metric-card ${metric.tone}`}>
      <div className="metric-card-header">
        {toneIcon[metric.tone]}
        <p>{metric.label}</p>
      </div>
      <h2>{metric.value}</h2>
      <p>{metric.detail}</p>
    </article>
  );
}

export function DomainCard({ domain }: { domain: DomainStatus }) {
  return (
    <article className={`domain-card ${domain.status}`}>
      <div className="domain-card-header">
        <div>
          <p className="domain-layer">{domain.layer}</p>
          <h3>{domain.name}</h3>
        </div>
        <span className={`status-pill ${domain.status}`}>{statusLabel(domain.status)}</span>
      </div>
      <p className="domain-availability">{domain.availability}</p>
      <p className="domain-detail">{domain.detail}</p>
    </article>
  );
}

export function PathHop({ hop, isLast }: { hop: ServiceHop; isLast: boolean }) {
  return (
    <div className="path-hop">
      <div className={`path-node ${hop.status}`}>
        <span className={`status-pill ${hop.status}`}>{statusLabel(hop.status)}</span>
        <p className="path-segment">{hop.segment}</p>
        <h3>{hop.name}</h3>
        <p className="path-detail">{hop.detail}</p>
      </div>
      {!isLast ? <div className="path-connector" aria-hidden="true" /> : null}
    </div>
  );
}

export function AlarmRow({ alarm }: { alarm: Alarm }) {
  return (
    <div className="alarm-row" role="row">
      <div role="cell">
        <span className={`severity-pill ${alarm.severity}`}>{severityLabel(alarm.severity)}</span>
      </div>
      <div role="cell" className="alarm-primary">
        <p className="alarm-domain">{alarm.domain}</p>
        <h3>{alarm.title}</h3>
        <p>{alarm.signal}</p>
      </div>
      <div role="cell" className="alarm-impact">
        <p>{alarm.impact}</p>
      </div>
      <div role="cell" className="alarm-owner">
        <p className="alarm-owner-name">{alarm.owner}</p>
        <p>{alarm.nextAction}</p>
        <span>{alarm.eta}</span>
      </div>
    </div>
  );
}

export function TimelineCard({ entry }: { entry: TimelineEntry }) {
  return (
    <article className={`timeline-card ${entry.state}`}>
      <div className="timeline-time">{entry.time}</div>
      <div className="timeline-body">
        <div className="timeline-header">
          <h3>{entry.title}</h3>
          <span className={`timeline-pill ${entry.state}`}>{entry.state}</span>
        </div>
        <p>{entry.detail}</p>
        <span className="timeline-owner">{entry.owner}</span>
      </div>
    </article>
  );
}

export function AutomationCardView({ card }: { card: AutomationCard }) {
  return (
    <article className="automation-card">
      <div className="automation-card-header">
        <Sparkles className="section-icon" aria-hidden="true" />
        <div>
          <p className="section-kicker">Automation lane</p>
          <h3>{card.title}</h3>
        </div>
      </div>
      <p className="automation-value">{card.value}</p>
      <p className="automation-summary">{card.summary}</p>
      <p className="automation-outcome">{card.outcome}</p>
    </article>
  );
}

export function RoleFitCard({ mapping }: { mapping: RoleMapping }) {
  return (
    <article className="role-fit-card">
      <div className="role-fit-header">
        <BadgeCheck className="section-icon" aria-hidden="true" />
        <h3>{mapping.keyword}</h3>
      </div>
      <p>{mapping.proof}</p>
    </article>
  );
}

export function RunbookCard({ entry }: { entry: RunbookStep }) {
  return (
    <article className="runbook-card">
      <div className="runbook-step">{entry.step}</div>
      <div className="runbook-body">
        <div className="runbook-header">
          <p className="timeline-owner">{entry.owner}</p>
          <h3>{entry.action}</h3>
        </div>
        <p>{entry.outcome}</p>
      </div>
    </article>
  );
}

export function ApplicationAssetCard({ asset }: { asset: ApplicationAsset }) {
  return (
    <article className="application-card">
      <p className="section-kicker">{asset.label}</p>
      <p className="application-copy">{asset.text}</p>
    </article>
  );
}

export function EvidenceCardView({ item }: { item: EvidenceCard }) {
  return (
    <article className="evidence-card">
      <p className="section-kicker">{item.label}</p>
      <h3>{item.value}</h3>
      <p>{item.detail}</p>
    </article>
  );
}

export function IndicatorCard({ indicator }: { indicator: Indicator }) {
  return (
    <article className="indicator-card">
      <div className="indicator-header">
        <div>
          <p className="section-kicker">{indicator.type}</p>
          <h3>{indicator.value}</h3>
        </div>
        <span className="indicator-tag">{indicator.tag}</span>
      </div>
      <p>{indicator.note}</p>
    </article>
  );
}
