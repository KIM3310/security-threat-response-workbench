import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  Clock3,
  Copy,
  FileText,
  Gauge,
  Network,
  Route,
  Search,
  Server,
  Shield,
  Sparkles,
  Workflow,
} from 'lucide-react';
import generatedSnapshot from './data/generatedSnapshot.json';
import { scenarioEvidence } from './data/evidence';
import { defaultScenarioId, scenarios } from './data/scenarios';
import { orderAlarms, severityLabel, statusLabel } from './lib/format';
import {
  Alarm,
  ApplicationAsset,
  AutomationCard,
  DomainStatus,
  EvidenceCard,
  GeneratedSnapshot,
  Indicator,
  Metric,
  RoleMapping,
  RunbookStep,
  Severity,
  SnapshotCard,
  ServiceHop,
  TimelineEntry,
} from './types';

const toneIcon = {
  teal: <BadgeCheck className="metric-icon teal" aria-hidden="true" />,
  amber: <Gauge className="metric-icon amber" aria-hidden="true" />,
  coral: <CircleAlert className="metric-icon coral" aria-hidden="true" />,
} as const;

const sectionIcon = {
  domains: <Network className="section-icon" aria-hidden="true" />,
  servicePath: <Route className="section-icon" aria-hidden="true" />,
  alarms: <Activity className="section-icon" aria-hidden="true" />,
  timeline: <Clock3 className="section-icon" aria-hidden="true" />,
  automation: <Sparkles className="section-icon" aria-hidden="true" />,
  roleFit: <Workflow className="section-icon" aria-hidden="true" />,
  runbook: <BadgeCheck className="section-icon" aria-hidden="true" />,
  application: <FileText className="section-icon" aria-hidden="true" />,
  evidence: <Shield className="section-icon" aria-hidden="true" />,
} as const;

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

const snapshot = generatedSnapshot as GeneratedSnapshot;
const severityFilters: Array<{ label: string; value: 'all' | Severity }> = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' },
  { label: 'Info', value: 'info' },
];

function App() {
  const [activeScenarioId, setActiveScenarioId] = useState(defaultScenarioId);
  const [severityFilter, setSeverityFilter] = useState<'all' | Severity>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];
  const activeEvidence = scenarioEvidence[activeScenario.id];
  const orderedAlarms = orderAlarms(activeScenario.alarms);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());
  const filteredAlarms = orderedAlarms.filter((alarm) => {
    const severityMatches = severityFilter === 'all' || alarm.severity === severityFilter;
    const textMatches =
      deferredSearchQuery.length === 0 ||
      [alarm.title, alarm.signal, alarm.impact, alarm.domain, alarm.owner, alarm.nextAction]
        .join(' ')
        .toLowerCase()
        .includes(deferredSearchQuery);
    return severityMatches && textMatches;
  });

  useEffect(() => {
    setCopyState('idle');
  }, [activeScenarioId, severityFilter, searchQuery]);

  async function handleCopyBrief() {
    const brief = buildAnalystBrief(activeScenario, filteredAlarms, activeEvidence);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }

      await navigator.clipboard.writeText(brief);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  return (
    <div className="page-shell">
      <div className="page-grid" aria-hidden="true" />
      <main className="page-content">
        <section className="hero card-panel">
          <div className="hero-copy">
            <p className="eyebrow">Cloud Security Threat Response Portfolio Project</p>
            <h1>Security Threat Response Workbench</h1>
            <p className="hero-summary">
              Scenario-driven SOC surface for 24x365 event analysis, WAF and IDS triage, DDoS
              containment, vulnerability response, shift handoff, and analyst-first automation.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#scenario-board">
                Review the active threat lane
                <ArrowRight aria-hidden="true" />
              </a>
              <a className="secondary-action" href="#role-fit">
                Map this project to the role
              </a>
            </div>
            <div className="hero-chips" aria-label="Role alignment keywords">
              <span>24x365 security event triage</span>
              <span>WAF / IDS / DDoS analysis</span>
              <span>Cloud and portal service protection</span>
              <span>Shift handoff and knowledge sharing</span>
              <span>Python / Bash analyst automation</span>
            </div>
          </div>

          <aside className="hero-proof">
            <div className="proof-header">
              <Shield aria-hidden="true" />
              <div>
                <p className="proof-label">What this project proves</p>
                <h2>Threat-response judgment, not dashboard theater</h2>
              </div>
            </div>
            <ul className="proof-points">
              <li>
                Turns raw WAF, IDS, and DDoS signals into clear containment, escalation, and
                shift-handoff decisions.
              </li>
              <li>
                Shows how multi-service cloud operations protect login, payment, game, and
                console surfaces under one response model.
              </li>
              <li>
                Uses Python and Bash automation for normalization and verification instead of
                pretending a SIEM screenshot is enough.
              </li>
            </ul>
          </aside>
        </section>

        <section className="headline-strip">
          <HeadlineCard
            icon={<Gauge aria-hidden="true" />}
            label="Containment rate"
            value={activeScenario.availability}
            detail="Threats blocked, challenged, or isolated in the active lane"
          />
          <HeadlineCard
            icon={<Clock3 aria-hidden="true" />}
            label="Escalation latency"
            value={activeScenario.mttr}
            detail="Time from first signal to operator escalation or containment"
          />
          <HeadlineCard
            icon={<Route aria-hidden="true" />}
            label="Blocked ratio"
            value={activeScenario.trafficShift}
            detail="Malicious traffic pressure reduced by edge controls and routing changes"
          />
          <HeadlineCard
            icon={<Sparkles aria-hidden="true" />}
            label="Automation coverage"
            value={activeScenario.automationCoverage}
            detail="Detection tuning, handoff, and enrichment playbooks in use"
          />
        </section>

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

        <section className="two-column">
          <CardSection
            icon={sectionIcon.automation}
            kicker="Log-derived proof"
            title="Python-normalized watchboard"
            copy="Synthetic WAF, IDS, and DDoS logs are normalized into one review surface so the portfolio shows repeatable analysis habits, not only static screenshots."
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

          <CardSection
            icon={sectionIcon.runbook}
            kicker="Shift handoff"
            title="What the next analyst can act on immediately"
            copy="The handoff lane proves the behavior this job cares about: document, share, reduce rotation loss, and keep the next shift operationally ready."
          >
            <div className="snapshot-handoff-grid">
              {snapshot.handoff.map((item) => (
                <SnapshotCardView key={item.label} item={item} compact />
              ))}
            </div>
          </CardSection>
        </section>

        <section className="metric-grid">
          {activeScenario.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="two-column">
          <CardSection
            icon={sectionIcon.domains}
            kicker="Coverage board"
            title="Sensor and service posture"
            copy="Use this to show that threat response is wider than one dashboard: edge controls, east-west visibility, cloud workloads, and customer-facing services must stay in the same review loop."
          >
            <div className="domain-grid">
              {activeScenario.domains.map((domain) => (
                <DomainCard key={domain.name} domain={domain} />
              ))}
            </div>
          </CardSection>

          <CardSection
            icon={sectionIcon.servicePath}
            kicker="Attack path"
            title="Threat path and service exposure"
            copy="This is the shortest way to show service-aware triage: a signal matters only when you can explain how it moves from attacker activity to business-facing exposure."
          >
            <div className="path-list">
              {activeScenario.servicePath.map((hop, index) => (
                <PathHop key={hop.name} hop={hop} isLast={index === activeScenario.servicePath.length - 1} />
              ))}
            </div>
          </CardSection>
        </section>

        <section className="two-column">
          <CardSection
            icon={sectionIcon.evidence}
            kicker="Evidence pack"
            title="IOC and operator evidence"
            copy="This section sharpens the security story. It shows what the analyst would actually brief: attacker shape, business risk, containment choice, and the indicators worth carrying into the next shift."
          >
            <div className="evidence-grid">
              {activeEvidence.evidenceCards.map((item) => (
                <EvidenceCardView key={item.label} item={item} />
              ))}
            </div>
          </CardSection>

          <CardSection
            icon={sectionIcon.evidence}
            kicker="IOC watchlist"
            title="Signals worth preserving"
            copy="The watchlist helps the project read less like polished UI and more like response work that can be handed to another analyst or service owner."
          >
            <div className="indicator-list">
              {activeEvidence.indicators.map((indicator) => (
                <IndicatorCard key={`${indicator.type}-${indicator.value}`} indicator={indicator} />
              ))}
            </div>
          </CardSection>
        </section>

        <section className="two-column">
          <CardSection
            icon={sectionIcon.alarms}
            kicker="Security queue"
            title="Prioritized event triage"
            copy="The table is intentionally action-first: severity, signal, impact, and owner decision. That makes it easier to discuss 24x365 operational judgment in interviews."
          >
            <div className="filter-toolbar">
              <label className="search-field">
                <span className="search-label">
                  <Search aria-hidden="true" />
                  Quick filter
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search signal, owner, impact, or action"
                  aria-label="Filter security events"
                />
              </label>

              <div className="filter-group" aria-label="Severity filter">
                {severityFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={`filter-pill ${severityFilter === filter.value ? 'is-active' : ''}`}
                    onClick={() => setSeverityFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="filter-result-copy">
              Showing {filteredAlarms.length} of {orderedAlarms.length} events
            </p>

            {filteredAlarms.length > 0 ? (
              <div className="alarm-table" role="table" aria-label="Prioritized security event queue">
                <div className="alarm-table-header" role="row">
                  <span role="columnheader">Severity</span>
                  <span role="columnheader">Signal</span>
                  <span role="columnheader">Impact</span>
                  <span role="columnheader">Owner / Next action</span>
                </div>
                {filteredAlarms.map((alarm) => (
                  <AlarmRow key={alarm.id} alarm={alarm} />
                ))}
              </div>
            ) : (
              <div className="empty-state" role="status">
                <h3>No events match the current filter</h3>
                <p>Try a broader keyword or switch the severity filter back to `All`.</p>
              </div>
            )}
          </CardSection>

          <CardSection
            icon={sectionIcon.timeline}
            kicker="Shift log"
            title="Containment timeline"
            copy="A threat-response role is not only about seeing alerts. It is about deciding, communicating, reducing risk, and leaving the next shift with a clean operating picture."
          >
            <div className="timeline-list">
              {activeScenario.timeline.map((entry) => (
                <TimelineCard key={`${entry.time}-${entry.title}`} entry={entry} />
              ))}
            </div>
          </CardSection>
        </section>

        <section className="two-column">
          <CardSection
            icon={sectionIcon.runbook}
            kicker="Analyst runbook"
            title="Interview-friendly response steps"
            copy="This makes the project feel less like a dashboard and more like an operational product. Each step ties technical judgment to owner responsibility and expected outcome."
          >
            <div className="runbook-list">
              {activeScenario.runbook.map((entry) => (
                <RunbookCard key={`${entry.step}-${entry.owner}`} entry={entry} />
              ))}
            </div>
          </CardSection>

          <CardSection
            icon={sectionIcon.application}
            kicker="Application pack"
            title="Use this directly in your resume and interview"
            copy="These are the exact lines you can lift into your self-introduction, portfolio walkthrough, or role-specific resume bullets."
            action={
              <button type="button" className="copy-brief-button" onClick={handleCopyBrief}>
                <Copy aria-hidden="true" />
                {copyState === 'copied'
                  ? 'Analyst brief copied'
                  : copyState === 'failed'
                    ? 'Copy unavailable'
                    : 'Copy analyst brief'}
              </button>
            }
          >
            <div className="brief-preview">
              <p className="section-kicker">Brief preview</p>
              <p>{buildAnalystBrief(activeScenario, filteredAlarms, activeEvidence)}</p>
            </div>
            <div className="application-list">
              {activeScenario.applicationAssets.map((asset) => (
                <ApplicationAssetCard key={asset.label} asset={asset} />
              ))}
            </div>
          </CardSection>
        </section>

        <section className="two-column">
          <CardSection
            icon={sectionIcon.automation}
            kicker="Analyst assist"
            title="Detection tuning and response automation"
            copy="Automation here means faster, cleaner threat handling. The assist layer focuses on enrichment, prioritization, virtual patching, and handoff discipline."
          >
            <div className="automation-grid">
              {activeScenario.automations.map((automation) => (
                <AutomationCardView key={automation.title} card={automation} />
              ))}
            </div>
          </CardSection>

          <CardSection
            icon={sectionIcon.roleFit}
            kicker="Role fit"
            title="Why this maps to the posting"
            copy="This section keeps the project from drifting into generic DevOps or generic AI territory. It stays anchored to the actual cloud security threat-response lane."
            id="role-fit"
          >
            <div className="role-fit-list">
              {activeScenario.roleMappings.map((mapping) => (
                <RoleFitCard key={mapping.keyword} mapping={mapping} />
              ))}
            </div>
          </CardSection>
        </section>
      </main>
    </div>
  );
}

function buildAnalystBrief(
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

function OverviewCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
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

function CardSection({
  icon,
  kicker,
  title,
  copy,
  id,
  action,
  children,
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
  copy: string;
  id?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="card-panel section-card">
      <div className="section-heading">
        <div className="section-heading-main">
          {icon}
          <div>
            <p className="section-kicker">{kicker}</p>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="section-heading-side">
          <p className="section-copy">{copy}</p>
          {action ? <div className="section-action">{action}</div> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
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

function DomainCard({ domain }: { domain: DomainStatus }) {
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

function PathHop({ hop, isLast }: { hop: ServiceHop; isLast: boolean }) {
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

function AlarmRow({ alarm }: { alarm: Alarm }) {
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

function TimelineCard({ entry }: { entry: TimelineEntry }) {
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

function AutomationCardView({ card }: { card: AutomationCard }) {
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

function RoleFitCard({ mapping }: { mapping: RoleMapping }) {
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

function RunbookCard({ entry }: { entry: RunbookStep }) {
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

function ApplicationAssetCard({ asset }: { asset: ApplicationAsset }) {
  return (
    <article className="application-card">
      <p className="section-kicker">{asset.label}</p>
      <p className="application-copy">{asset.text}</p>
    </article>
  );
}

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

function EvidenceCardView({ item }: { item: EvidenceCard }) {
  return (
    <article className="evidence-card">
      <p className="section-kicker">{item.label}</p>
      <h3>{item.value}</h3>
      <p>{item.detail}</p>
    </article>
  );
}

function IndicatorCard({ indicator }: { indicator: Indicator }) {
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

export default App;
