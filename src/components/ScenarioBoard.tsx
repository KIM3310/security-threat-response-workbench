import { startTransition } from 'react';
import { Activity, BadgeCheck, Server, Shield, Workflow } from 'lucide-react';
import { scenarios } from '../data/scenarios';
import type { Scenario, Severity } from '../types';

const deliveryPosture = [
  {
    title: 'No vendor SIEM dependency',
    detail:
      'The review flow is deterministic and self-contained, so the portfolio proof works without a live SIEM tenant or managed appliance.',
  },
  {
    title: 'Python and Bash included',
    detail:
      'Synthetic WAF, IDS, and DDoS logs are normalized with Python and verified with Bash so the repo proves hands-on automation, not just UI polish.',
  },
  {
    title: 'No external datasets',
    detail:
      'Attack scenarios, handoff notes, and virtual-patch decisions are packaged inside the repo, which keeps the project reviewer-safe and easy to ship.',
  },
] as const;

function OverviewCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <article className="overview-card">
      <div className="overview-header">
        {icon}
        <p className="section-kicker">{title}</p>
      </div>
      <p className="overview-value">{value}</p>
    </article>
  );
}

function DeliveryCard({ title, detail }: { title: string; detail: string }) {
  return (
    <article className="delivery-card">
      <div className="delivery-card-header">
        <BadgeCheck className="section-icon" aria-hidden="true" />
        <h3>{title}</h3>
      </div>
      <p>{detail}</p>
    </article>
  );
}

export function ScenarioBoard({
  activeScenario,
  setActiveScenarioId,
  setSeverityFilter,
  setSearchQuery,
}: {
  activeScenario: Scenario;
  setActiveScenarioId: (id: string) => void;
  setSeverityFilter: (value: 'all' | Severity) => void;
  setSearchQuery: (value: string) => void;
}) {
  return (
    <>
      <section id="scenario-board" className="card-panel scenario-board">
        <div className="section-heading">
          <div className="section-heading-main">
            <Server className="section-icon" aria-hidden="true" />
            <div>
              <p className="section-kicker">Threat board</p>
              <h2>Pick the strongest response lane</h2>
            </div>
          </div>
          <p className="section-copy">
            Every scenario is deterministic and reviewer-safe, but the decision language stays
            close to a cloud threat-response shift: portal edge, payment abuse, DDoS
            mitigation, IDS escalation, virtual patching, handoff, and false-positive control.
          </p>
        </div>

        <div className="scenario-tabs" role="tablist" aria-label="Security threat response scenarios">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              role="tab"
              aria-selected={scenario.id === activeScenario.id}
              className={`scenario-tab ${scenario.id === activeScenario.id ? 'is-active' : ''}`}
              onClick={() => {
                startTransition(() => {
                  setActiveScenarioId(scenario.id);
                  setSeverityFilter('all');
                  setSearchQuery('');
                });
              }}
            >
              <span className="scenario-tab-title">{scenario.title}</span>
              <span className="scenario-tab-summary">{scenario.summary}</span>
              <span className="scenario-tab-fit">{scenario.strongestFor}</span>
            </button>
          ))}
        </div>

        <div className="scenario-overview-grid">
          <OverviewCard
            title="Command focus"
            value={activeScenario.commandFocus}
            icon={<Activity className="section-icon" aria-hidden="true" />}
          />
          <OverviewCard
            title="Operator decision"
            value={activeScenario.operatorDecision}
            icon={<Workflow className="section-icon" aria-hidden="true" />}
          />
        </div>

        <div className="reviewer-note-box">
          <p className="section-kicker">Recruiter fast take</p>
          <ul>
            {activeScenario.recruiterNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card-panel scenario-board">
        <div className="section-heading">
          <div className="section-heading-main">
            <Shield className="section-icon" aria-hidden="true" />
            <div>
              <p className="section-kicker">Delivery posture</p>
              <h2>No extra resources required</h2>
            </div>
          </div>
          <p className="section-copy">
            This project is intentionally self-contained so you can ship it fast for the
            application. It does not need a live WAF tenant, IDS appliance, or cloud console to
            work as a credible threat-response proof.
          </p>
        </div>
        <div className="delivery-grid">
          {deliveryPosture.map((item) => (
            <DeliveryCard key={item.title} title={item.title} detail={item.detail} />
          ))}
        </div>
      </section>
    </>
  );
}
