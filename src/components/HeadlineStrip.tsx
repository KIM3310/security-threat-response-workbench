import type { ReactNode } from 'react';
import { Clock3, Gauge, Route, Sparkles } from 'lucide-react';
import type { Scenario } from '../types';

function HeadlineCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="headline-card">
      <div className="headline-icon">{icon}</div>
      <div>
        <p className="headline-label">{label}</p>
        <h2>{value}</h2>
        <p className="headline-detail">{detail}</p>
      </div>
    </article>
  );
}

export function HeadlineStrip({ scenario }: { scenario: Scenario }) {
  return (
    <section className="headline-strip">
      <HeadlineCard
        icon={<Gauge aria-hidden="true" />}
        label="Containment rate"
        value={scenario.availability}
        detail="Threats blocked, challenged, or isolated in the active lane"
      />
      <HeadlineCard
        icon={<Clock3 aria-hidden="true" />}
        label="Escalation latency"
        value={scenario.mttr}
        detail="Time from first signal to operator escalation or containment"
      />
      <HeadlineCard
        icon={<Route aria-hidden="true" />}
        label="Blocked ratio"
        value={scenario.trafficShift}
        detail="Malicious traffic pressure reduced by edge controls and routing changes"
      />
      <HeadlineCard
        icon={<Sparkles aria-hidden="true" />}
        label="Automation coverage"
        value={scenario.automationCoverage}
        detail="Detection tuning, handoff, and enrichment playbooks in use"
      />
    </section>
  );
}
