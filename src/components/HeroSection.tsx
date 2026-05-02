import { ArrowRight, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="hero card-panel">
      <div className="hero-copy">
        <p className="eyebrow">Cloud Security Response Workbench</p>
        <h1>Security Threat Response Workbench</h1>
        <p className="hero-summary">
          Scenario-driven SOC surface for 24x365 event analysis, WAF and IDS triage, DDoS
          containment, vulnerability response, shift handoff, and operator-first automation.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#scenario-board">
            Review the active threat lane
            <ArrowRight aria-hidden="true" />
          </a>
          <a className="secondary-action" href="#role-fit">
            Open operating map
          </a>
        </div>
        <div className="hero-chips" aria-label="Surface keywords">
          <span>24x365 security event triage</span>
          <span>WAF / IDS / DDoS analysis</span>
          <span>Cloud and portal service protection</span>
          <span>Shift handoff and knowledge sharing</span>
          <span>Python / Bash operator automation</span>
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
  );
}
