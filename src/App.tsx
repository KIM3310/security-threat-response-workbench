import { useEffect, useState, useDeferredValue } from 'react';
import {
  BadgeCheck,
  Clock3,
  Copy,
  FileText,
  Route,
  Shield,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { scenarioEvidence } from './data/evidence';
import { defaultScenarioId, scenarios } from './data/scenarios';
import { orderAlarms } from './lib/format';
import { buildAnalystBrief } from './lib/buildAnalystBrief';
import type { Severity } from './types';

import { HeroSection } from './components/HeroSection';
import { HeadlineStrip } from './components/HeadlineStrip';
import { ScenarioBoard } from './components/ScenarioBoard';
import { CardSection } from './components/CardSection';
import { AlarmSection } from './components/AlarmSection';
import {
  WatchboardSection,
  HandoffSection,
  CoverageSection,
} from './components/SnapshotSection';
import {
  MetricCard,
  PathHop,
  TimelineCard,
  AutomationCardView,
  CapabilityFitCard,
  RunbookCard,
  ApplicationAssetCard,
  EvidenceCardView,
  IndicatorCard,
} from './components/DataCards';

const sectionIcon = {
  servicePath: <Route className="section-icon" aria-hidden="true" />,
  timeline: <Clock3 className="section-icon" aria-hidden="true" />,
  automation: <Sparkles className="section-icon" aria-hidden="true" />,
  capabilityFit: <Workflow className="section-icon" aria-hidden="true" />,
  runbook: <BadgeCheck className="section-icon" aria-hidden="true" />,
  application: <FileText className="section-icon" aria-hidden="true" />,
  evidence: <Shield className="section-icon" aria-hidden="true" />,
} as const;

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
        <HeroSection />

        <HeadlineStrip scenario={activeScenario} />

        <ScenarioBoard
          activeScenario={activeScenario}
          setActiveScenarioId={setActiveScenarioId}
          setSeverityFilter={setSeverityFilter}
          setSearchQuery={setSearchQuery}
        />

        <section className="two-column">
          <WatchboardSection />
          <HandoffSection />
        </section>

        <section className="metric-grid">
          {activeScenario.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="two-column">
          <CoverageSection scenario={activeScenario} />

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
            copy="This section sharpens the security story. It shows what the operator would actually brief: attacker shape, business risk, containment choice, and the indicators worth carrying into the next shift."
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
          <AlarmSection
            filteredAlarms={filteredAlarms}
            orderedAlarms={orderedAlarms}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <CardSection
            icon={sectionIcon.timeline}
            kicker="Shift log"
            title="Containment timeline"
            copy="Threat response is not only about seeing alerts. It is about deciding, communicating, reducing risk, and leaving the next shift with a clean operating picture."
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
            kicker="Operator runbook"
            title="Response steps with clear ownership"
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
            kicker="Operations pack"
            title="Exportable operations notes"
            copy="Reusable notes for handoff summaries, architecture reviews, and system walkthroughs."
            action={
              <button type="button" className="copy-brief-button" onClick={handleCopyBrief}>
                <Copy aria-hidden="true" />
                {copyState === 'copied'
                  ? 'Operator brief copied'
                  : copyState === 'failed'
                    ? 'Copy unavailable'
                    : 'Copy operator brief'}
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
            kicker="Operator assist"
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
            icon={sectionIcon.capabilityFit}
            kicker="Capability fit"
            title="Capabilities this surface demonstrates"
            copy="This section keeps the system from drifting into generic DevOps or generic AI territory. It stays anchored to the cloud security threat-response lane."
            id="capability-fit"
          >
            <div className="capability-fit-list">
              {activeScenario.roleMappings.map((mapping) => (
                <CapabilityFitCard key={mapping.keyword} mapping={mapping} />
              ))}
            </div>
          </CardSection>
        </section>
      </main>
    </div>
  );
}

export default App;
