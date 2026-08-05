# askAlpha Architecture Prompt Index

Use these prompts only as helpers. The versioned files under `docs/architecture/**` and the source-of-truth documents under `docs/plans/**` control the architecture.

## Available prompts

- `P1.md` — verify and generate the **Current** architecture from private-repository evidence.
- `P2.md` — generate the **MVP1 SpruceX planned** architecture from the verified current baseline.
- `P3` — generate the **Target Enterprise Production** architecture with explicit approval-dependent components.

## Non-negotiable rules

1. Never update current architecture from roadmap or meeting statements alone.
2. Use status labels: current, technically validated, observed in POC, configured-unused, partial, planned, target, open.
3. Correct identity direction:
   - browser/MSAL obtains token from Entra;
   - browser sends bearer token to FastAPI;
   - FastAPI validates using Entra JWKS.
4. Show JSON REST and SSE.
5. Show React as packaged static output served by FastAPI unless implementation changes.
6. Show Azure SQL with analytics plus authorization/control/diagnostic roles.
7. Show Azure AI Search as conditional fallback metadata text search in the current view.
8. Do not show a standalone validation service when validation is in-process.
9. Do not show Redis, Databricks, ADLS, Event Hubs, usage collector, durable outbox, LangSmith, Sentinel, Dynatrace, or Datadog runtime monitoring as current without live evidence.
10. Update each `.mmd` source and matching `.md` preview together.

## Save locations

```text
docs/architecture/current/current_architecture.mmd
docs/architecture/current/current_architecture.md

docs/architecture/mvp1/mvp1_architecture.mmd
docs/architecture/mvp1/mvp1_architecture.md

docs/architecture/production/production_architecture.mmd
docs/architecture/production/production_architecture.md
```

## Required validation response

After changing a diagram, report only:

- files changed;
- Mermaid validation result;
- evidence status changes;
- unresolved assumptions/approvals;
- items that must not be shown as current.
