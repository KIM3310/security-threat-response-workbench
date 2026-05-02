# Security Threat Response Workbench

Scenario-driven security operations workbench focused on continuous event response, edge and network signal analysis, vulnerability-response coordination, shift handoff, and Python/Bash operator automation.

System walkthrough pack: [`docs/technical-review-pack.md`](docs/technical-review-pack.md)

## Resource posture

No other resources are required to ship or demo this project well.

- no API keys
- no live SIEM tenant
- no commercial WAF or IDS appliance
- no external database
- no model provider dependency

That is intentional. The project is designed to be a fast, self-contained operational simulation, not a setup-heavy demo that depends on private infrastructure.

## Proof Boundary

- **Primary proof:** one safe control surface that ties edge signals, network alerts, shift handoff, and change-safe vulnerability response together
- **What is real here:** triage framing, prioritization language, runbook ownership, handoff behavior, detection-tuning posture, and service-aware security decisions
- **What is bounded here:** scenarios and logs are synthetic and deterministic; this is an operational simulation, not a live production feed

## Why this project exists

This repo is designed to make one technical story explicit:

1. Event response needs shift continuity, not only isolated alert cards.
2. Logs, alerts, and attack noise need to become containment, escalation, and handoff decisions.
3. Python and Bash automation can normalize evidence and reduce operator friction.
4. Mature response work includes documentation, continuity, and vulnerability follow-through, not only blocking one signal.

## Workbench Surfaces

- **Threat board:** three realistic response lanes
  - portal login credential-stuffing surge
  - game launch Layer-7 DDoS / bot flood
  - cloud console exploit probe / east-west IDS pivot
- **Python-normalized watchboard:** sample WAF, IDS, and DDoS logs normalized into operations-ready summaries
- **Shift handoff board:** rotation notes written so the next shift can continue without rediscovering context
- **Coverage board:** perimeter, application, internal detection, and workflow posture in one view
- **Attack path view:** how one signal moves from attacker entry to business exposure
- **Security queue:** prioritized event triage with owner and next move
- **Containment log:** shift timeline and escalation flow
- **Operator runbook:** owner-based response steps
- **Detection tuning board:** enrichment, validation, virtual patching, and handoff automation
- **Runtime pack:** deterministic routes and text surfaces used by the local UI

## Why it matches a cloud threat-response workflow

The UI and data model deliberately stay close to security operations concerns:

- `24x365` shift-oriented event review
- `WAF / IDS / DDoS` signals in one loop
- service-aware triage instead of abstract alert counts
- handoff notes and knowledge-sharing behavior
- temporary controls such as virtual patches
- scoped isolation instead of broad shutdown-by-default

This makes the project closer to a security threat-response workflow than a generic observability dashboard.

## Python / Bash proof

This repo also includes small automation utilities:

- `scripts/build_security_snapshot.py`
  - reads synthetic JSONL logs from `samples/logs/`
  - normalizes WAF, IDS, and DDoS events
  - generates `src/data/generatedSnapshot.json`
- `scripts/verify_snapshot.sh`
  - reruns the snapshot build
  - verifies the derived summary values
  - gives you a quick shift-ready verification path

That matters because repeatable analysis is more useful than one-off manual triage.

## Operator Fast Path

1. Open the default `Portal Login Credential-Stuffing Surge` scenario.
2. Read `Command focus` and `Operator decision`.
3. Check the `Python-normalized watchboard`.
4. Scan `Prioritized event triage`.
5. Read the `Shift handoff` cards.
6. Finish on the workflow summary.

This path shows threat triage, service awareness, documentation discipline, and automation habits quickly.

## Quick start

```bash
npm install
npm run prepare:sample
npm run dev
```

Open `http://127.0.0.1:5173`.

## Verify

```bash
npm run verify
```

## Cloudflare deploy

This project is set up for Cloudflare Workers Static Assets with SPA routing.

```bash
npx wrangler login
npm run cf:deploy
```

For a deployment packaging check without publishing:

```bash
npm run cf:deploy:dry
```

The Wrangler config lives in `wrangler.jsonc` and serves `./dist` with `single-page-application` fallback enabled.

## Project structure

```text
samples/logs/              synthetic WAF, IDS, DDoS JSONL events
scripts/build_security_snapshot.py
scripts/verify_snapshot.sh
src/
  App.tsx                  main threat-response surface
  data/scenarios.ts        scenario data tailored to security operations
  data/generatedSnapshot.json
  lib/format.ts            severity and status helpers
  test/                    UI and utility tests
```

## System Walkthrough Notes

Use this repo like this:

- **Start with the operating model** for 24x365 discipline, incident response, and handoff behavior
- **Then use this project** to show how those controls translate into cloud security threat response, not only network uptime
- **Then mention the Python/Bash snapshot scripts** as evidence that repetitive response analysis can be automated

## Suggested System Note

“이 프로젝트는 클라우드 보안위협대응 흐름을 위한 워크벤치입니다. WAF, IDS, DDoS 이벤트를 따로 보지 않고 서비스 영향, 인수인계, 가상 패치, 교대근무형 대응 흐름까지 한 화면에서 판단하도록 설계했습니다.”
