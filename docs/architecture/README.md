# askAlpha Architecture Pack

This package contains three versioned architecture views:

1. **Current Deployment and Runtime Architecture** — repository-verified against the private application branch evidence available on 2026-08-04.
2. **MVP1 SpruceX Architecture** — planned state after access, network, identity, data-product, audit, and quality gates are satisfied.
3. **Target Enterprise Production Architecture** — approval-dependent enterprise target.

## Source-of-truth rule

Architecture status must always use one of these labels:

- **Current / implemented** — supported by private-repository code, configuration, packaging, deployment, and wired runtime evidence.
- **Observed in POC** — demonstrated or stated in a meeting, but not yet fully code/deployment verified.
- **Configured but unused** — configuration exists, but no live runtime client/dependency/path is wired.
- **Partially implemented** — only a subset of the required control exists.
- **Planned / MVP** — required or designed for the next delivery stage.
- **Target / future state** — enterprise design subject to approval and implementation.
- **Open for confirmation** — evidence is insufficient or conflicting.

A meeting statement, roadmap item, or architecture diagram is not proof of current implementation.

## Verified current baseline

The current private-runtime audit confirmed:

- React is built into static assets under `src/frontend/build`.
- React static assets and FastAPI are packaged and deployed together in one Azure App Service artifact.
- FastAPI/Uvicorn serves both the SPA and API.
- Browser/API communication is same-origin HTTPS using JSON REST and SSE streaming.
- MSAL runs in the browser; the browser obtains an Entra token and sends a bearer token to FastAPI.
- FastAPI validates JWTs through Entra JWKS and trusted claim checks.
- Primary and fallback orchestrators are live; agents are route-dependent.
- Azure OpenAI is called directly; no enterprise LLM Gateway is present in the live code path.
- Azure SQL is used for analytics plus authorization/control/diagnostic responsibilities.
- Azure AI Search is conditional fallback metadata text search, not the main analytical path and not vector/hybrid retrieval.
- User-assigned Managed Identity is configured for Azure service access.
- Redis is configured but unused by the runtime.
- User-query audit and export audit are absent; data-access audit is partial.
- Event Hubs, Databricks, ADLS, usage collector, durable outbox, LangSmith, Azure Sentinel, and Dynatrace are not current runtime components.
- Datadog has a generic workflow option but no current application-runtime integration.

The current view records the complete evidence boundary and a “do not show as current” list.

## Structure

```text
docs/architecture/
├── README.md
├── current/
│   ├── current_architecture.md
│   └── current_architecture.mmd
├── mvp1/
│   ├── mvp1_architecture.md
│   └── mvp1_architecture.mmd
└── production/
    ├── production_architecture.md
    └── production_architecture.mmd
```

## View purpose

### Current

Use for factual infrastructure/runtime discussions, Phase 0 evidence, and present-state reviews. It includes deployable boundaries, wired dependencies, exact identity flow, current REST/SSE behavior, current agent/orchestrator path, current diagnostics, and confirmed gaps.

### MVP1

Use for SpruceX and initial business-pilot planning. It adds Databricks/ADLS connectivity, minimum durable audit, automated evaluation, and pilot quality/security gates while preserving the verified application boundary.

### Production

Use for enterprise target-state discussion. It adds controlled ingress, fine-grained authorization, semantic planning, secure caching, hardened visualization execution, distinct audit/trace/usage streams, durable outbox, Event Hubs, Databricks event processing, ADLS history, enterprise monitoring, showback, and future approved chargeback.

## Diagram maintenance rules

1. Update the `.mmd` Mermaid source and matching `.md` preview together.
2. Never add a standalone service when the evidence only supports in-process logic.
3. Correct identity-arrow direction: browser/MSAL obtains the token from Entra; browser sends bearer token to FastAPI; FastAPI validates with Entra JWKS.
4. Show both JSON REST and SSE when describing browser/API communication.
5. Do not show a separate React runtime when React is packaged static output served by FastAPI.
6. Do not label Azure SQL only as application data; include its current control/authorization/diagnostic roles.
7. Show Azure AI Search as conditional fallback metadata grounding unless a broader path is implemented and verified.
8. Keep current, MVP, and target services visually and textually distinct.
9. Revalidate the current view after material private-repository or deployment changes.
