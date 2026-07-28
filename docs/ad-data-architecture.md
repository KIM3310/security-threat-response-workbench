# Ad-Supported Resource and Aggregate Data Architecture

Repository: `security-threat-response-workbench`

## Public Resource Model

Free threat-response tabletop packet for alert triage and escalation practice.

- Audience: security analysts and tabletop exercise owners
- Central resource: https://kim3310-doeon-kim-portfolio.pages.dev/resources/security-threat-response-workbench/
- Live system: https://security-threat-response-workbench.pages.dev/
- Advertising boundary: ads allowed only on public tabletop resources; threat workbench, evidence, incident notes, and dashboards are ad-free
- Current ad state: code-ready on the central resource; serving depends on Google AdSense site approval and consent policy.

## Readiness Utility

The central resource turns the repository architecture into a practical review checklist:

- **Architecture Summary:** Repository-local proof surface for security operations and controlled automation, backed by Node/TypeScript runtime, GitHub Actions validation.
- **Runtime And Data Flow:** Primary domain: security operations and controlled automation.
- **Cloud Or Local Deployment Boundary:** Operating model: segmented ingest, least-privilege response services, audit trails, and emergency rollback boundaries
- **Deployment patterns:** Edge-first deployment model with server-side AI adapters and public-safe secrets handling Security control plane with audit logging, isolation boundaries, and response review gates
- **Control boundaries:** identity boundary and least-privilege service access environment separation for local, staging, and managed runtime paths secret storage outside source and deterministic fallback for missing credentials observability hooks for logs, metrics, traces, and audit events rollback path...

The checklist state remains in the visitor's browser and is not transmitted.

## Aggregate Data Boundary

- Data asset: anonymous aggregate threat-response topic interest and packet-open counts
- Sensitivity class: security-high-trust
- Allowed events: `resource_view`, `resource_cta_click`, `architecture_doc_open`, `privacy_support_open`
- Prohibited fields: `raw_input`, `url`, `referrer`, `title`, `user_id`, `session_id`, `ip_address`, `security_incident_detail`, `payment_detail`
- Consent defaults to off.
- DNT and Global Privacy Control fail closed.
- Events are reduced to repository, allowlisted event, public surface, and consent-policy version.
- Personal, sensitive, raw, event-level, or re-identifiable data is never offered for sale.

## Storage Path

```text
Public resource
  -> consent and privacy-signal gate
  -> Cloudflare Pages event API
  -> rate-limited daily aggregate counter
  -> public benchmark response
  -> Firebase public aggregate data mart
```

Cloudflare D1 holds operational counters. Firestore project `kim3310-free-tools` is the deny-by-default public aggregate data mart. Private inquiries remain isolated from telemetry.
