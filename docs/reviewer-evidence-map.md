# Review Guide - Security Threat Response Workbench

Updated: 2026-05-30

Use this page as the short path through the repository. It keeps the review grounded in the code, docs, commands, and boundaries that are already present.

## Summary

| Field | Notes |
|---|---|
| Lane | B2B security operations tabletop |
| Core idea | Self-contained response simulation for WAF, IDS, DDoS, vulnerability coordination, and shift handoff. |
| Primary reader | SOC teams, cloud security teams, MSPs, and infrastructure owners. |
| Stack | TypeScript/JavaScript |

## Open First

1. Start with the README fast path and architecture section.
2. Open `docs/service-launch-playbook.md` only when reviewing the product or service angle.
3. Check the commands below before making claims about quality.
4. Skim the CI workflows and fixture data before deeper implementation review.
5. Read the boundaries section before presenting the project externally.

## Checks

| Purpose | Command |
|---|---|
| Full local gate | `npm run verify` |
| Test suite | `npm test` |
| Typecheck | `npm run typecheck` |
| Production build | `npm run build` |

## CI

- .github/workflows/architecture-blueprint.yml
- .github/workflows/ci.yml
- .github/workflows/dependency-review.yml
- .github/workflows/repository-health.yml
- .github/workflows/repository-surface.yml
- .github/workflows/secret-scan.yml

## Evidence

- package scripts and web/runtime checks
- npm run verify passes
- Snapshot builder works
- No-key simulation is clear

## Review Notes

| Possible offer | Working scope assumption |
|---|---|
| Tabletop exercise | Scope after reviewer intake |
| Response workflow starter | Scope after reviewer intake |
| Managed security handoff board | Scope after reviewer intake |

## Boundaries

- Synthetic signals only
- Not a live SIEM replacement
- Customer controls need integration

## Useful Metrics

- Triage time
- Handoff quality
- Runbook action coverage
