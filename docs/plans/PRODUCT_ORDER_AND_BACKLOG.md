# askAlpha — Product Order and Prioritized Backlog

**Status:** Revision 1.6 — executable backlog aligned to the verified current runtime and enterprise roadmap

## Priority model

- **P0 — Immediate governance or current-risk blocker:** required to close the active stage safely.
- **P1 — Broad-Beta / production-safe core:** mandatory before restricted-data adoption.
- **P2 — Scale, operability, and governed self-service:** required for wider enterprise use.
- **P3 — Advanced experience:** valuable after the core is stable.

## Current baseline that the backlog must preserve

- React static assets and FastAPI deploy together in one Azure App Service package.
- Browser/API communication uses same-origin HTTPS JSON REST and SSE.
- MSAL obtains the Entra token in the browser; FastAPI validates bearer JWTs with Entra JWKS.
- Primary and fallback orchestrators are live; agents are route-dependent.
- Azure OpenAI is called directly; no live enterprise LLM Gateway exists.
- Azure SQL is current for analytics plus authorization/control/diagnostics.
- Azure AI Search is conditional fallback metadata text search.
- Redis is configured but unused.
- User-query and export auditing are absent; data-access audit is partial.
- Databricks, ADLS, Event Hubs, usage collector, durable outbox, LangSmith, Azure Sentinel, and Dynatrace are planned/absent rather than current.

No epic may silently replace or contradict this baseline without repository evidence, an ADR, compatibility tests, and rollback.

---

## Epic 0 — Phase 0 formal closure and repository governance — P0

### Outcome

The technically validated foundation is formally approved and merged without unrelated roadmap/product changes entering the private application PR.

### Work items

- Confirm final private-PR scope and clean working tree.
- Configure active branch ruleset/protection.
- Confirm effective `CODEOWNERS` from the base branch.
- Record exact required GitHub Check names from successful runs.
- Attach final validation evidence to the PR.
- Resolve skips/warnings and `model_used: not_observed` disposition.
- Record Product, Security, Architecture/Engineering, Data, QA, Platform/DevOps, and Operations approvals.
- Merge through the repository-approved method and record merge SHA.

### Acceptance criteria

- No open Phase 0 blocker.
- Required checks are green on the final SHA.
- Repository controls are active.
- All approval evidence is recorded.
- Phase 1 work is not mixed into Phase 0 closure.

---

## Epic 1 — Current architecture evidence and documentation integrity — P0

### Outcome

Every current-state claim is supported by private code/config/deployment evidence and kept separate from POC observations and target design.

### Work items

- Maintain the verified deployment/runtime architecture.
- Automate or repeat a read-only architecture audit after material runtime changes.
- Track component status as current, observed, configured-unused, partial, planned, target, or open.
- Keep `.mmd` sources and Markdown previews synchronized.
- Add a “do not show as current” checklist to architecture reviews.
- Correct identity-arrow direction and REST/SSE communication in all diagrams.
- Document private evidence references without exposing private source contents or secrets in the public repository.

### Acceptance criteria

- No target component is presented as current.
- React is not shown as a separate deployed runtime unless implementation changes.
- Azure SQL and Azure AI Search roles match wired paths.
- Architecture changes require evidence and review.

---

## Epic 2 — Golden baseline and compatibility harness — P0/P1

### Outcome

Current approved behavior is measurable before refactoring or data-platform migration.

### Work items

- Maintain reviewed golden questions and representative paraphrases.
- Capture route, semantic plan, source, SQL hash/constraints, key metrics, output shape, and authorization outcome.
- Add deterministic-versus-fallback comparison.
- Add JSON and SSE contract coverage.
- Add SQL Server parity baseline before adapter refactor.
- Record the current approximately four-table POC boundary separately from enterprise-scale expectations.

### Acceptance criteria

- Baseline executes locally and in CI.
- Changes to expected outputs require review.
- Intentional and accidental differences are distinguishable.

---

## Epic 3 — Governed metadata registry and provenance — P1

### Outcome

Questions, roles, sources, datasets, fields, joins, KPIs, glossary, examples, instructions, recipes, templates, and policies use one governed interface.

### Work items

- Define typed registry contracts and validation schemas.
- Wrap current JSON/YAML and current metadata sources as seed/fallback inputs.
- Record provenance for EDC, data models, Bitbucket assets, historical queries, and imported technical metadata.
- Add owner, source reference, import time, effective dates, lifecycle state, validation, approval, version, and retirement status.
- Add import, preview, validate, publish, rollback, export, and dry-run functions.
- Add conflict detection and impact analysis.
- Add bounded authorized candidate retrieval before model calls.
- Add version-aware registry caching interface without making Redis a current dependency.

### Acceptance criteria

- Invalid or conflicting metadata cannot be published.
- Metadata rollback is demonstrated.
- Ordinary metadata additions do not require frontend code changes.
- Provenance is visible and auditable.

---

## Epic 4 — Semantic query plan and routing contract — P1

### Outcome

Every analytical execution has an inspectable, authorized plan before SQL or recipe execution.

### Work items

- Define typed `SemanticQueryPlan` fields for route, source, dataset, fields, filters, joins, grain, time, KPI, limits, output intent, evidence, and clarification.
- Resolve authorized candidates before source selection.
- Separate conversational, analytical, report, visualization, definition, clarification, and blocked routes.
- Add ambiguity and clarification thresholds.
- Preserve deterministic recipes for high-risk/common questions.
- Emit plan ID, metadata/KPI versions, and safe diagnostics.

### Acceptance criteria

- No supported analytical execution occurs without a valid plan.
- Low-confidence or conflicting requests clarify rather than guess.
- Plan traces do not expose unauthorized metadata.

---

## Epic 5 — KPI, glossary, examples, and instruction governance — P1

### Outcome

Business meaning is owned, versioned, testable, and reusable.

### Work items

- Define KPI formula, grain, exclusions, caveats, owner, certification, examples, and effective dates.
- Define glossary terms, synonyms, acronyms, exclusions, and scope.
- Define positive/negative examples and expected semantic plans.
- Define scoped instructions with precedence and prohibited override classes.
- Generate regression tests from published examples.
- Reconcile certified KPIs with trusted source queries/reports.

### Acceptance criteria

- Conflicting definitions cannot be silently published.
- Metadata instructions cannot weaken authentication, authorization, privacy, SQL safety, limits, redaction, audit, or model policy.
- KPI version appears in answer evidence.

---

## Epic 6 — Source-neutral data access and Databricks pilot — P1

### Outcome

SQL Server/Azure SQL and Databricks SQL execute through controlled adapters without normal-path source-specific orchestration branches.

### Work items

- Define `DataSourceAdapter`, `DataSourceRegistry`, dialect, capability, health, cancellation, and diagnostics contracts.
- Refactor the current SQL path into a SQL Server/Azure SQL adapter with parity tests.
- Implement approved Databricks SQL connectivity and workload identity.
- Add T-SQL and Databricks SQL compilers/validators.
- Add source-qualified authorization.
- Pilot one governed data product.
- Block cross-source joins initially.

### Acceptance criteria

- SQL Server baseline passes through the adapter.
- Pilot Databricks data product passes auth, plan, SQL, result, audit, timeout, cancellation, quality, and performance tests.
- Adding a future source does not change core orchestration contracts.

---

## Epic 7 — Fine-grained authorization and row-level security — P1 / Broad-Beta gate

### Outcome

Users can discover, query, aggregate, visualize, report, cache, and export only authorized data.

### Work items

- Resolve effective permissions from validated identity, application-assigned group object IDs, governed mappings, and approved direct entitlements.
- Filter roles, questions, metadata, sources, datasets, fields, routes, suggestions, errors, traces, and exports.
- Add dataset/table/field/row scope model.
- Add Azure SQL trusted session context and RLS where applicable.
- Define Databricks user-passthrough/security-view/row-filter/ABAC strategy.
- Add deny-all behavior.
- Add cross-user/scope isolation tests.

### Acceptance criteria

- Missing entitlement returns no data.
- Restrictions apply before aggregates and outputs.
- Unauthorized object names do not leak.
- Access changes are versioned, auditable, and propagated within the approved SLA.

---

## Epic 8 — In-process request, prompt, SQL, and data safety — P1

### Outcome

Neither user input, model output, metadata, nor route choice can bypass safety controls.

### Current fact

Current validation is in-process application logic; there is no standalone validation service. SQL safety occurs after SQL generation and before execution.

### Work items

- Formalize request/Pydantic/auth/config/prompt-data validation stages.
- Add harmful/unsupported/prompt-injection detection and reason codes.
- Prove blocked requests do not trigger unnecessary model calls where policy supports pre-model rejection.
- Add AST-based single-statement `SELECT/WITH` validation.
- Add object/join/grain, duplicate-balance, snapshot, parameter/literal, and function policies.
- Add row/column/join/scan/time/retry/context/model-call/cost limits.
- Add safe clarification/fallback behavior.

### Acceptance criteria

- Bypass corpus fails safely.
- Validation behavior is traceable without sensitive content.
- Documentation does not depict in-process logic as a separately deployed service.

---

## Epic 8B — Visualization sandbox hardening — P1 / Broad-Beta gate

### Outcome

Code-generated visualization cannot escape the approved execution boundary or expose sensitive data.

### Work items

- Default-deny network access.
- Restricted filesystem and working directory.
- Approved library/import allowlist.
- CPU, memory, process, and execution-time limits.
- Input/output size and format validation.
- Artifact sanitization, naming, retention, and cleanup.
- No credentials, environment secrets, host mounts, subprocess shells, or arbitrary package installation.
- Malicious-code and data-exfiltration regression corpus.

### Acceptance criteria

- Network/filesystem/process escape tests fail safely.
- Artifacts are authorized, sanitized, and traceable.
- Timeout/resource exhaustion cannot degrade the service beyond approved guardrails.

---

## Epic 9 — Complete user, data-access, and export audit — P1 / Broad-Beta gate

### Outcome

Sensitive activity is attributable without storing unnecessary sensitive content.

### Current fact

User-query and export audit are absent. Data-access audit is partial: authz decisions and access-management changes are logged, but there is no complete durable data-read audit stream.

### Work items

- Define immutable audit event schema.
- Capture trusted subject, request/trace ID, authorization version/scope hash, operation, source/dataset/objects/fields, result status/size, export action, time, environment, and app version.
- Add durable write/retry/failure behavior.
- Protect audit search/export with least privilege and audit its use.
- Define retention, legal/compliance, redaction, and records-management policy.
- Integrate with an approved enterprise SIEM/monitoring destination.
- Correlate but do not merge with agent traces and model usage.

### Acceptance criteria

- Operators can determine who asked, accessed, and exported what.
- Export cannot complete without the required audit record or approved failure policy.
- Audit records contain no tokens, secrets, or raw result rows unless explicitly approved.
- Missing audit delivery is visible and recoverable.

---

## Epic 10 — Automated answer-quality, hallucination, and reconciliation system — P1 / Broad-Beta gate

### Outcome

Quality is measured automatically and blocks unsafe rollout.

### Current fact

POC quality review was largely manual and hallucinations were acknowledged.

### Work items

- Golden and unseen-question datasets.
- Expected route/source/plan/SQL constraints/output metrics.
- Trusted report/source-query reconciliation.
- Hallucination/error taxonomy and severity.
- Release thresholds by route/risk.
- Manual-review and adjudication queue.
- Trend dashboard and regression alerts.
- Canary comparison and rollback.
- Evidence indicators: auth, plan, SQL safety, source coverage, freshness, reviewer outcome, reconciliation.

### Acceptance criteria

- Approved thresholds pass before broad Beta.
- Material baseline mismatch is stop-the-line.
- Uncalibrated confidence percentages are not shown as correctness evidence.

---

## Epic 11 — Agent/LLM traceability and bounded reviewer loop — P1

### Outcome

Operators can explain the route and decision process without exposing sensitive content or allowing unbounded iteration.

### Work items

- Structured trace model and redaction policy.
- Agent transitions, plan versions, validation outcomes, model calls, retry/repair/escalation, reviewer feedback, and stop reason.
- Reviewer limits: attempts, elapsed time, token/cost budget, allowed repairs, safe fallback.
- Protected diagnostics and trace access.
- Integration with an approved agent-tracing platform only after security/lifecycle review.

### Acceptance criteria

- Every production answer has a trace ID and safe evidence.
- Reviewer loops are bounded and tested.
- Trace failure does not expose sensitive data or silently remove required audit.

---

## Epic 12 — Runtime model policy, usage metering, and showback — P1/P2

### Outcome

Every actual model call is centrally routed, metered once, aggregated to the originating request, and attributed from trusted identity.

### Work items

- Versioned `RuntimeModelPolicy`; agents cannot choose models independently.
- Record retry, repair, fallback, escalation, shadow, and reviewer calls.
- Provider-observed streaming/non-streaming usage extraction.
- Trusted user → team → department/LOB → cost-center snapshot.
- Durable outbox, idempotency, retry, dead-letter, and replay.
- Event, request, daily, and monthly aggregates.
- Effective-dated price catalog and explicit estimated/reconciled/final status.
- Metering → showback → provider-bill reconciliation → approved chargeback.

### Acceptance criteria

- Exactly one event or visible recoverable failure per provider call.
- Request totals include all linked calls.
- Client-supplied identity/usage/cost cannot influence authoritative facts.
- Metering failure does not fail chat.
- Showback precedes chargeback.

---

## Epic 13 — Secure scope-aware caching — P2, or P1 when required for Beta SLO

### Outcome

Caching improves measured performance without cross-scope leakage or stale authorization.

### Work items

- Separate metadata, entitlement, semantic-plan, result, and frontend/API cache boundaries.
- Key result cache by environment, source, dataset, plan/query hash, authorization-scope hash, authorization version, row/column policy, metadata/KPI, data freshness, and output shape.
- Enforce authorization before cache lookup/write.
- Add TTL, version invalidation, event invalidation, kill switch, and cache observability.
- Add Redis/managed cache only after benchmark, security, and lifecycle approval.

### Acceptance criteria

- No cross-user/cross-scope leakage.
- Access changes prevent old entries from matching.
- Measured latency/cost benefit justifies complexity.

---

## Epic 14 — Governed self-service data-product onboarding — P2

### Outcome

Approved domains can onboard and maintain data products without ordinary core-code changes.

### Work items

- Metadata Admin Studio.
- Bulk/incremental schema discovery for at least 500 tables.
- Editors for datasets, fields, joins, grains, KPI, glossary, examples, instructions, questions, and templates.
- Semantic/SQL preview and test console.
- Maker-checker approval and separation of duties.
- Publish, rollback, emergency disable, retirement.
- Drift detection, impact analysis, stale-example detection, owner notification.

### Acceptance criteria

- Pilot data product is onboarded without core-orchestrator branching.
- Bulk import, validation, approval, publish, rollback, and drift handling are demonstrated.
- Self-authored metadata cannot override runtime safety.

---

## Epic 15 — Deployment, observability, resilience, and operations — P1/P2

### Outcome

The service behaves consistently in the approved environment and is supportable.

### Work items

- App Service startup/static packaging/smoke tests.
- Private endpoint, DNS, VNet, firewall, and workload identity validation.
- Health/readiness, SLOs, alerts, runbooks, ownership, and incident simulation.
- Backup, recovery, canary, rollback, capacity, backpressure, cancellation, circuit breaker.
- Approved enterprise monitoring/SIEM integration.
- Separate current Datadog workflow option from actual runtime monitoring implementation.

### Acceptance criteria

- Environment smoke tests pass.
- Rollback and incident response are demonstrated.
- No current-integration claim is made without live evidence.

---

## Epic 16 — Advanced visualization, reports, and Power BI integration — P3

### Outcome

Users can move from conversational answers to richer governed experiences without bypassing authorization or audit.

### Work items

- Rich interactive chart design.
- Governed report templates.
- Approved export workflows with audit.
- Power BI integration ADR and security model.
- Visualization traceability and accessibility.

### Acceptance criteria

- Visualization/export does not bypass data policy.
- Power BI remains complementary rather than treated as replaced.
- Illustrative/fabricated demo data is clearly labeled.

---

## Recommended implementation order

### Increment A — Close and stabilize

- Epic 0 Phase 0 closure.
- Epic 1 current architecture evidence.
- Epic 2 baseline maintenance.

### Increment B — Broad-Beta safety foundation

- Epic 7 authorization model.
- Epic 8 safety hardening.
- Epic 8B visualization sandbox.
- Epic 9 complete audit.
- Epic 10 automated quality.
- Epic 11 bounded trace/reviewer controls.

### Increment C — Metadata and pilot data platform

- Epic 3 registry/provenance.
- Epic 4 semantic plan.
- Epic 5 KPI/glossary/examples.
- Epic 6 Databricks pilot.

### Increment D — Scale and operations

- Epic 12 model policy/metering/showback.
- Epic 13 secure cache.
- Epic 14 self-service.
- Epic 15 production operations.
- Epic 16 advanced experience.
