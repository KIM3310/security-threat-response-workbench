import { BadgeCheck, Network, Sparkles } from 'lucide-react';
import generatedSnapshot from '../data/generatedSnapshot.json';
import type { GeneratedSnapshot, SnapshotCard, Scenario } from '../types';
import { CardSection } from './CardSection';
import { DomainCard } from './DataCards';

const sectionIcon = {
  automation: <Sparkles className="section-icon" aria-hidden="true" />,
  runbook: <BadgeCheck className="section-icon" aria-hidden="true" />,
};

const snapshot = generatedSnapshot as GeneratedSnapshot;

function SnapshotCardView({
  item,
  compact,
}: {
  item: SnapshotCard;
  compact?: boolean;
}) {
  return (
    <article className={`snapshot-card ${compact ? 'compact' : ''}`}>
      <p className="section-kicker">{item.label}</p>
      <h3>{item.value}</h3>
      <p>{item.detail}</p>
    </article>
  );
}

function SnapshotList({
  title,
  items,
}: {
  title: string;
  items: SnapshotCard[];
}) {
  return (
    <div className="snapshot-list">
      <div className="snapshot-list-header">
        <p className="section-kicker">{title}</p>
      </div>
      {items.map((item) => (
        <SnapshotCardView key={`${title}-${item.label}`} item={item} compact />
      ))}
    </div>
  );
}

export function WatchboardSection() {
  return (
    <CardSection
      icon={sectionIcon.automation}
      kicker="Log-derived proof"
      title="Python-normalized watchboard"
      copy="Synthetic WAF, IDS, and DDoS logs are normalized into one review surface so the system shows repeatable analysis habits, not only static screenshots."
      action={
        <div className="section-meta">
          <span className="meta-chip">{snapshot.meta.generatedAt}</span>
          <span className="meta-chip">{snapshot.meta.sourceFiles} log files</span>
          <span className="meta-chip">{snapshot.meta.shiftWindow}</span>
        </div>
      }
    >
      <div className="snapshot-grid">
        {snapshot.summary.map((item) => (
          <SnapshotCardView key={item.label} item={item} />
        ))}
      </div>
      <div className="snapshot-list-grid">
        <SnapshotList title="Detector lanes" items={snapshot.lanes} />
        <SnapshotList title="Top attack patterns" items={snapshot.patterns} />
      </div>
    </CardSection>
  );
}

export function HandoffSection() {
  return (
    <CardSection
      icon={sectionIcon.runbook}
      kicker="Shift handoff"
      title="What the next shift can act on immediately"
      copy="The handoff lane proves the behavior this workflow cares about: document, share, reduce rotation loss, and keep the next shift operationally ready."
    >
      <div className="snapshot-handoff-grid">
        {snapshot.handoff.map((item) => (
          <SnapshotCardView key={item.label} item={item} compact />
        ))}
      </div>
    </CardSection>
  );
}

export function CoverageSection({ scenario }: { scenario: Scenario }) {
  return (
    <CardSection
      icon={<Network className="section-icon" aria-hidden="true" />}
      kicker="Coverage board"
      title="Sensor and service posture"
      copy="Use this to show that threat response is wider than one dashboard: edge controls, east-west visibility, cloud workloads, and customer-facing services must stay in the same review loop."
    >
      <div className="domain-grid">
        {scenario.domains.map((domain) => (
          <DomainCard key={domain.name} domain={domain} />
        ))}
      </div>
    </CardSection>
  );
}
