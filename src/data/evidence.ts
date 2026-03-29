import { EvidenceCard, Indicator } from '../types';

export interface ScenarioEvidence {
  evidenceCards: EvidenceCard[];
  indicators: Indicator[];
  analystBriefLead: string;
  analystBriefClose: string;
}

export const scenarioEvidence: Record<string, ScenarioEvidence> = {
  'credential-stuffing': {
    evidenceCards: [
      {
        label: 'Primary attacker signal',
        value: 'Distributed login retry wave',
        detail:
          'Failed login volume and ASN churn rose together, which points to coordinated credential reuse rather than normal user friction.',
      },
      {
        label: 'Immediate business risk',
        value: 'Account takeover + sign-in friction',
        detail:
          'The key risk is not only bad traffic volume. It is real-user sign-in degradation plus a smaller set of high-confidence takeover cases.',
      },
      {
        label: 'Best containment move',
        value: 'Narrow challenge tuning',
        detail:
          'Tighten challenge posture around the attack lane while preserving a very narrow exception review instead of rolling back globally.',
      },
      {
        label: 'What the next shift needs',
        value: 'Rule posture + false-positive watch',
        detail:
          'The rotation note must preserve current thresholds, affected carrier segment, and which user complaints are truly security-relevant.',
      },
    ],
    indicators: [
      {
        type: 'ASN cluster',
        value: 'AS15169 / AS16509 / AS14061',
        tag: 'Bot rotation',
        note: 'Source rotation across a small repeated ASN set suggests shared automation infrastructure.',
      },
      {
        type: 'Path',
        value: '/portal/login',
        tag: 'Primary target',
        note: 'High retry concentration stayed on the login path with spillover toward password-reset discovery.',
      },
      {
        type: 'Header pattern',
        value: 'x-forwarded-for churn + no session cookie reuse',
        tag: 'Credential stuffing',
        note: 'The request shape stayed closer to scripted retries than to legitimate mobile-user behavior.',
      },
      {
        type: 'MITRE ATT&CK',
        value: 'T1110',
        tag: 'Credential Access',
        note: 'The lane maps well to brute-force and credential-stuffing style account access attempts.',
      },
    ],
    analystBriefLead:
      'Portal login abuse is active but controlled. The main job is to preserve sign-in continuity while keeping challenge posture strong enough to prevent takeover spread.',
    analystBriefClose:
      'Do not relax the rule set broadly. The next shift should continue with the current ASN tuning and review only the narrow carrier exception lane.',
  },
  'game-ddos': {
    evidenceCards: [
      {
        label: 'Primary attacker signal',
        value: 'Layer-7 flood on launch entry',
        detail:
          'GET flood pressure and retry spillover moved with launch timing, indicating a service disruption objective rather than casual scanning.',
      },
      {
        label: 'Immediate business risk',
        value: 'Player launch failure',
        detail:
          'The core measure is player success rate. If mitigation weakens too early, traffic pressure becomes visible revenue and reputation impact.',
      },
      {
        label: 'Best containment move',
        value: 'Mitigate first, tune with KPIs',
        detail:
          'Keep mitigation active and only adjust thresholds when player success proves the edge can absorb the next burst safely.',
      },
      {
        label: 'What the next shift needs',
        value: 'Threshold history + blackhole trigger',
        detail:
          'The next analyst needs current edge thresholds, the blackhole boundary, and exactly what traffic slope should trigger escalation.',
      },
    ],
    indicators: [
      {
        type: 'Flood type',
        value: 'HTTP GET cache-bypass wave',
        tag: 'L7 DDoS',
        note: 'Repeated random query strings show intent to evade cache efficiency and amplify origin pressure.',
      },
      {
        type: 'Target path',
        value: '/launch/start',
        tag: 'Primary target',
        note: 'The launch entry page absorbed the first wave before retry traffic shifted toward login handoff.',
      },
      {
        type: 'Fallback signal',
        value: 'login handoff retries',
        tag: 'Bot spillover',
        note: 'Attack traffic looked for a softer choke point after outer mitigation was raised.',
      },
      {
        type: 'MITRE ATT&CK',
        value: 'T1498',
        tag: 'Impact',
        note: 'The service disruption pattern maps closely to network and application denial-of-service objectives.',
      },
    ],
    analystBriefLead:
      'Game launch traffic is still healthy because mitigation is ahead of the bot swarm. Keep decisions tied to player success, not only request volume.',
    analystBriefClose:
      'The next shift should inherit the exact threshold posture and blackhole trigger. No relaxation should happen until the retry slope stays below baseline for another watch window.',
  },
  'console-exploit': {
    evidenceCards: [
      {
        label: 'Primary attacker signal',
        value: 'Exploit probe plus one validated east-west chain',
        detail:
          'Most internet probing stayed noisy, but one IDS survivor suggests a possible internal pivot and deserves priority over the perimeter noise.',
      },
      {
        label: 'Immediate business risk',
        value: 'Admin console exposure',
        detail:
          'This lane risks privileged console access and change-side mistakes if the response is too broad or too slow.',
      },
      {
        label: 'Best containment move',
        value: 'Virtual patch + scoped isolation',
        detail:
          'Keep the console online behind a temporary WAF rule and isolate only the workload tied to the validated IDS chain.',
      },
      {
        label: 'What the next shift needs',
        value: 'Patch owner + unfreeze criteria',
        detail:
          'The next analyst must know who owns the permanent fix, what rollback exists, and which exact condition allows change work to resume.',
      },
    ],
    indicators: [
      {
        type: 'Route',
        value: '/console/admin/export',
        tag: 'Exposed surface',
        note: 'Exploit attempts stayed concentrated on one administrative export path covered by the virtual patch.',
      },
      {
        type: 'Behavior chain',
        value: 'SMB + suspicious child process',
        tag: 'Validated pivot',
        note: 'The lateral movement suspicion comes from correlated host behavior, not from one noisy IDS packet match alone.',
      },
      {
        type: 'Temporary control',
        value: 'WAF-VPATCH-990',
        tag: 'Virtual patch',
        note: 'The temporary WAF rule is a containment control, not a substitute for patch ownership and rollback planning.',
      },
      {
        type: 'MITRE ATT&CK',
        value: 'T1190 / T1021',
        tag: 'Initial Access + Lateral Movement',
        note: 'The lane maps to exposed application exploitation followed by possible internal remote-service movement.',
      },
    ],
    analystBriefLead:
      'The console exploit wave is mostly noisy probing, but one validated east-west chain keeps this from being a perimeter-only event. Response should stay scoped and evidence-driven.',
    analystBriefClose:
      'Leave the virtual patch online, keep the isolated workload frozen, and do not resume risky changes until patch ownership and unfreeze criteria are explicitly documented.',
  },
};
