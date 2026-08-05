# askAlpha Delivery Pack

**Current documentation revision:** 1.6

## Source-of-truth hierarchy

Read and apply the documents in this order:

1. `MASTER_PLAN_V1.md` — authoritative product scope, verified current baseline, architecture principles, roadmap, and release gates.
2. `PRODUCT_ORDER_AND_BACKLOG.md` — executable priorities, epics, work items, and acceptance criteria.
3. `QUALITY_GATES.md` — mandatory test, security, evidence, Beta, production, and stop-the-line controls.
4. `SAFETY_OBSERVABILITY_AUDIT_AND_QUALITY_ADDENDUM.md` — detailed contracts and rationale for safety, audit, trace, quality, sandbox, cache, and event processing.
5. `PRODUCT_REQUIREMENT_TRACEABILITY_MATRIX.md` — requirement-to-source/status/epic/gate/owner/evidence mapping.
6. `RUNTIME_MODEL_ROUTING_STRATEGY.md` — centralized model selection, bounded retry/reviewer behavior, and routing evidence.
7. `RUNTIME_USAGE_METERING_AND_CHARGEBACK.md` — planned per-call metering, showback, reconciliation, and future approved chargeback.
8. `../architecture/**` — current, MVP1, and target architecture views.
9. `../agents/COPILOT_AGENT_EXECUTION_PROMPT.md` — paste-ready private-repository execution workflow.

## Files

```text
docs/plans/
├── MASTER_PLAN_V1.md
├── PRODUCT_ORDER_AND_BACKLOG.md
├── QUALITY_GATES.md
├── SAFETY_OBSERVABILITY_AUDIT_AND_QUALITY_ADDENDUM.md
├── PRODUCT_REQUIREMENT_TRACEABILITY_MATRIX.md
├── RUNTIME_MODEL_ROUTING_STRATEGY.md
├── RUNTIME_USAGE_METERING_AND_CHARGEBACK.md
└── README.md

docs/agents/
└── COPILOT_AGENT_EXECUTION_PROMPT.md

docs/architecture/
├── README.md
├── current/
├── mvp1/
└── production/
```

## Revision 1.6

Revision 1.6 consolidates the POC review findings and the read-only private-repository architecture audit into all controlling documents.

### Verified current baseline added

- React is packaged static output served by FastAPI from the same Azure App Service artifact.
- Browser/API communication uses same-origin HTTPS JSON REST and SSE.
- Browser/MSAL obtains the Entra token; FastAPI validates the bearer JWT with Entra JWKS.
- Primary/fallback orchestrators and route-dependent agents are current.
- Azure OpenAI is called directly; no live enterprise LLM Gateway exists.
- Azure SQL supports analytics plus authorization/control/diagnostic responsibilities.
- Azure AI Search is conditional fallback metadata text search, not vector/hybrid retrieval.
- Managed Identity is current.
- Redis is configured but unused.
- User-query/export audit is absent and data-access audit is partial.
- Databricks, ADLS, Event Hubs, usage collector, durable outbox, LangSmith, Azure Sentinel, and Dynatrace are not current.
- Datadog has no current application-runtime integration.

### Product requirements consolidated

- complete user/query/data/export audit;
- automated golden and unseen-question evaluation;
- baseline reconciliation and hallucination thresholds;
- bounded reviewer/model loop;
- visualization sandbox hardening;
- in-process request/prompt/SQL safety contract;
- fine-grained row-level authorization;
- secure authorization-scope-aware cache;
- distinct audit, agent-trace, and model-usage streams;
- durable event processing and enterprise monitoring as planned/target capabilities;
- evidence indicators instead of uncalibrated confidence percentages;
- explicit broad-Beta and production release gates.

### Phase 0 boundary

These newly identified requirements do not automatically reopen the technically completed Phase 0. They are Broad-Beta or production requirements unless private evidence confirms a current security/correctness blocker.

## Documentation maintenance rules

- Current-state claims require private code/config/deployment/runtime evidence.
- Meeting statements and target diagrams are not implementation evidence.
- Update Mermaid source and Markdown preview together.
- Keep current, configured-unused, partial, planned, and target statuses explicit.
- Public documentation must not expose private code, secrets, credentials, or sensitive data.
- Every implementation PR references the traceability matrix and relevant quality gate.
- The public repository contains planning/documentation only; it does not prove private runtime implementation.

## Prior revisions

### Revision 1.5

Introduced the detailed safety, audit, trace, sandbox, automated-quality, secure-cache, Event Hubs, and release-gate addendum.

### Revision 1.4

Introduced governed runtime model usage, organizational attribution, showback, reconciliation, and future approved chargeback.
