# askAlpha — Product Order and Prioritized Backlog

**Purpose:** Convert the master roadmap into an executable product order for engineering teams and GitHub Copilot agents.

## Priority model

- **P0 — Mandatory for safe execution:** blocks broader development or production readiness.
- **P1 — Production-safe core:** required before trusted production use.
- **P2 — Scale and operability:** required for wider adoption and efficiency.
- **P3 — Advanced experience:** valuable after the core is stable.

---

## Epic 0 — Delivery governance and repository quality system — P0

### Outcome

Every change is planned, reviewed, testable, reversible, and traceable.

### Work items

1. Add source-of-truth roadmap documents under `docs/plans/`.
2. Add `CODEOWNERS` for auth, authorization, SQL policy, metadata contracts, deployment, and frontend security.
3. Add pull-request template with design, risk, tests, evidence, migration, and rollback sections.
4. Add issue templates for feature, defect, security, metadata change, and data-product onboarding.
5. Add architecture decision record template and index.
6. Add branch protection and required CI checks.
7. Add traceability and RAID log templates.
8. Define release gates and environment promotion rules.

### Acceptance criteria

- Main branch cannot be changed without required checks and reviews.
- Each cross-cutting change has an ADR or references an existing decision.
- Each PR shows acceptance evidence and rollback.
- Documentation ownership is explicit.

---

## Epic 1 — Dedicated login and authentication experience — P0

### Problem

The application currently enters the landing page directly and does not provide a dedicated login experience.

### User outcome

An unauthenticated user sees a secure, clear login page and reaches the application only after authentication state is resolved.

### Functional scope

- New login route/page.
- Auth bootstrap state: initializing, unauthenticated, redirecting, authenticated, error.
- Enterprise MSAL sign-in using existing configuration.
- Sign-out and post-sign-out route.
- Silent token acquisition/refresh and expired-session recovery.
- Friendly errors for configuration, consent, token, network, and authorization failures.
- Route protection for landing, chat, reports, diagnostics, and admin pages.
- Preserve safe mock-auth workflow for local/dev/test/CI only.
- Display user identity and effective-access summary after sign-in without leaking sensitive group data.
- Accessibility: keyboard, focus, labels, error announcements, responsive layout.

### Security scope

- Do not store access tokens in unsafe browser storage unless explicitly approved.
- Validate issuer, audience, scope, signature/JWKS, and required claims in backend.
- Prohibit mock headers in hosted production.
- Prevent protected API calls while auth state is unresolved.
- Review CSP and Microsoft login/connect origins.

### Tests

- Unit tests for auth state and route guards.
- Integration tests for authenticated/unauthenticated routing.
- Backend token validation and mock-mode restrictions.
- Session expiration and sign-out tests.
- Accessibility tests for login page.

### Acceptance criteria

- Direct navigation to protected pages routes to login.
- Authenticated users reach the requested route after login.
- Unauthorized users receive a safe blocked experience.
- Existing `/api/config` and `/api/auth/profile` behavior remains compatible or is versioned.
- No mock-auth path is enabled in production configuration.

---

## Epic 2 — Golden baseline and compatibility harness — P0

### Outcome

Current approved behavior is measurable before refactoring.

### Work items

- Inventory built-in questions, intents, recipes, roles, source tables, fallbacks, charts, and reports.
- Select 25–50 high-value golden questions.
- Add variants for dates, limits, segments, synonyms, rankings, KPIs, charts, no-data, ambiguity, and unauthorized access.
- Capture answer shape, source/recipe, plan/route, SQL hash, key metrics, and authorization result.
- Add legacy-versus-new canary comparison.
- Store reviewed golden outputs as versioned test fixtures where appropriate.

### Acceptance criteria

- Baseline can be executed locally and in CI.
- Changes to golden outputs require explicit review.
- The harness distinguishes intentional from accidental change.

---

## Epic 3 — Governed metadata registry — P1

### Outcome

Questions, roles, intents, data products, sources, datasets, fields, joins, KPIs, glossary terms, examples, instructions, recipes, and templates are loaded through one governed interface.

### Work items

- Define registry domain model and JSON schema/Pydantic contracts.
- Wrap existing JSON/YAML through `MetadataRegistryService`.
- Add metadata version, owner, lifecycle state, effective dates, and validation status.
- Add import, validate, preview, publish, rollback, export, and dry-run functions.
- Repoint roles/questions/registry endpoints.
- Add version-aware registry cache interface.
- Add metadata audit and trace markers.
- Add source/catalog/schema/dialect/capability metadata.
- Add business glossary, example/evaluation, and instruction-policy records.
- Add bulk incremental schema discovery/import with ownership and masked profiling controls.
- Add conflict detection and impact analysis for overlapping definitions and schema changes.

### Acceptance criteria

- Invalid metadata is rejected before runtime use.
- Metadata rollback is tested.
- API response compatibility is proven.
- New roles/questions/intents can be published without frontend code changes.
- Hundreds-of-table imports can be validated incrementally and retrieved through bounded candidate selection.

---

## Epic 4 — Semantic query plan and routing contract — P1

### Outcome

Every analytical request has an inspectable plan before data execution.

### Work items

- Define typed `SemanticQueryPlan`.
- Separate conversation, clarification, analytical answer, report, visualization, metadata/KPI definition, and out-of-scope routes.
- Resolve authorized candidate datasets before selection.
- Add confidence and clarification thresholds.
- Move phrase-only routing toward metadata-backed candidates with legacy fallback.
- Validate selected fields, joins, grain, time policy, KPI, and output intent.

### Acceptance criteria

- No supported analytical answer executes without a valid plan.
- Low-confidence requests ask for clarification.
- Plan traces are available to authorized diagnostics.

---

## Epic 5 — KPI catalog and business-rule governance — P1

### Outcome

Business metrics are certified, owned, versioned, and consistently applied.

### Work items

- Define KPI record: owner, formula, grain, exclusions, caveats, version, effective dates, status, examples, tests.
- Migrate high-value deposit KPIs first.
- Externalize source-system, segment, status, channel, FDIC, threshold, and label mappings where practical.
- Add KPI reconciliation tests.
- Require review workflow for KPI changes.

### Acceptance criteria

- Certified KPI definitions are reused across routes and outputs.
- Conflicting definitions cannot both be published for the same effective scope without an explicit rule.
- KPI version is present in answer traces.

---

## Epic 6 — Output template registry and dynamic question sets — P1

### Outcome

Presentation behavior evolves without prompt sprawl or hardcoded frontend lists.

### Work items

- Define templates for brief answer, executive report, comparison, ranking, trend, clarification, no-data, blocked, and error.
- Keep deterministic renderers for security-sensitive formatting.
- Move labels, sections, chart hints, caveats, and role-specific detail into validated metadata.
- Generate suggested questions from role, authorization, published metadata, and successful patterns.
- Filter all suggestions before they reach the user.

### Acceptance criteria

- Templates are versioned and validated.
- Dynamic suggestions never expose unauthorized domains.
- Existing response shapes remain compatible or are versioned.

---

## Epic 6A — Business glossary, examples, and instruction governance — P1

### Outcome

Authorized SMEs can improve interpretation and query quality through governed financial terminology, examples, negative examples, and scoped instructions without changing application code.

### Work items

- Define glossary records with definitions, synonyms, acronyms, scope, related KPIs, exclusions, owner, effective dates, and certification.
- Define example/evaluation records with expected intent, source, dataset, fields, joins, grain, filters, output, and negative constraints.
- Define instruction records with scope, precedence, owner, effective dates, and allowed behavior classes.
- Generate regression cases from published examples.
- Detect conflicting definitions, examples, and instructions before publish.
- Prevent metadata instructions from overriding runtime security and safety policies.

### Acceptance criteria

- Approved terminology and examples change routing/planning without code deployment.
- Every published example is traceable to an evaluation result.
- Conflicts and unsafe instruction attempts are rejected.

---

## Epic 7A — Multi-source data access and Databricks SQL — P1

### Outcome

The same governed semantic-plan and safety architecture can execute on SQL Server and Databricks SQL without source-specific branching in the orchestrator.

### Work items

- Define `DataSourceAdapter`, `DataSourceRegistry`, and capability contracts.
- Refactor current SQL Server access into `SqlServerAdapter` with parity tests.
- Implement `DatabricksSqlAdapter` using approved SQL Warehouse connectivity and identity.
- Define T-SQL and Databricks SQL dialect compilers.
- Make semantic plans source-neutral and source selection metadata-driven.
- Add source-qualified authorization and source-specific validators.
- Add diagnostics, timeout, cancellation, retry, query correlation, and audit per source.
- Support portable recipes and explicit source-specific implementations where unavoidable.
- Block cross-source joins in the first release.

### Acceptance criteria

- SQL Server golden behavior is preserved through the adapter.
- A pilot Databricks data product passes functional, security, performance, and audit tests.
- Adding a future source does not require changes to core orchestrator contracts.
- Unsupported dialect features fail with a governed clarification or blocked response.

---

## Epic 7 — Authorization beyond login — P1

### Outcome

Users can discover and query only authorized objects at every step.

### Work items

- Resolve effective permissions from Entra groups and governed mappings.
- Filter roles, questions, metadata, datasets, fields, routes, suggestions, and debug details.
- Validate physical SQL references against effective permissions.
- Add field-level capability if required by data classification.
- Add deny-all handling.
- Add admin effective-access preview and audit.

### Acceptance criteria

- Unauthorized object names do not leak through errors, suggestions, registry payloads, or traces.
- Deny-all users cannot execute analytical SQL.
- Access changes are auditable and testable.

---

## Epic 8 — SQL and data safety hardening — P1

### Outcome

Neither LLM output nor metadata can bypass read-only, authorization, grain, or business safeguards.

### Work items

- AST-based single-statement SELECT/WITH validation.
- Approved object and join graph checks.
- Duplicate-balance and snapshot-account safeguards.
- Parameter/literal safety rules.
- Route-specific row, column, join, scan, timeout, retry, and report-depth limits.
- Query cancellation and bounded retries.
- Security regression corpus.

### Acceptance criteria

- Bypass tests fail safely.
- High-risk questions use deterministic governed recipes unless explicitly approved otherwise.
- All SQL executions record validation evidence without logging sensitive values.

---

## Epic 9 — Observability, audit, and answer-quality system — P1

### Outcome

Operators can defend, diagnose, and improve each answer.

### Work items

- Structured trace model.
- Redaction policy and tests.
- Dashboards for latency, failures, no-route, clarification, fallback, SQL validation, auth denial, metadata load, and cost.
- Answer coverage and quality checks.
- Feedback tied to trace ID.
- Incident runbooks and ownership.

### Acceptance criteria

- Every production answer is traceable to metadata/KPI/plan versions.
- Logs contain no unauthorized content.
- Alerts and runbooks are validated through an incident simulation.

---

## Epic 9A — Runtime token metering, organizational attribution, and billback — P1/P2

### Outcome

Every actual model API call is metered, all calls are aggregated to the originating request, usage is attributed through the authenticated user's effective team hierarchy, and trustworthy showback/reconciliation data is available before formal chargeback is enabled.

### Work items

- Implement shared `ModelUsageCollector`, typed `ModelUsageEvent`, and `RequestUsageSummary` contracts around the Azure OpenAI/model gateway.
- Capture provider-observed input, output, total, and supported token-category counts for streaming and non-streaming calls.
- Record every retry, repair, fallback, escalation, shadow, and reviewer call with a unique `model_call_id`.
- Derive the subject from validated backend identity; resolve and snapshot user -> team -> department/line of business -> cost center.
- Add durable outbox delivery, retry, dead-letter monitoring, idempotency, and duplicate prevention.
- Add append-only event storage, request summaries, daily aggregates, and monthly user/team/department/cost-center/model/agent/route aggregates.
- Add versioned effective-dated model price catalog, estimated-cost calculation, and explicit `estimated/reconciled/final/excluded` status.
- Add protected usage/reporting/reconciliation/export APIs with least privilege and audit.
- Add missing-usage and unattributed-hierarchy exception queues and alerts.
- Roll out in stages: metering -> showback -> provider-bill reconciliation -> approved chargeback.
- Add monthly freeze, approval, adjustment, dispute, export, and close controls before billback is enabled.
- Follow the detailed contract in `docs/plans/RUNTIME_USAGE_METERING_AND_CHARGEBACK.md`.

### Acceptance criteria

- Every real provider call creates exactly one idempotent event or a visible recoverable delivery failure.
- A request summary includes all successful and unsuccessful model calls triggered by that request.
- Client-supplied identity, team, cost-center, token, or cost values cannot influence authoritative records.
- Historical attribution preserves the hierarchy snapshot effective at call time.
- Usage facts contain no raw prompts, responses, SQL literals, result rows, secrets, or access tokens.
- Event, request, daily, and monthly totals reconcile.
- Missing provider usage and unattributed hierarchy are observable exceptions, not silently estimated/defaulted values.
- Price and allocation rules are versioned, effective-dated, auditable, and rollback-capable.
- Showback is reviewed before chargeback; formal chargeback requires provider-bill reconciliation and named Finance/Platform/Product/Security approvals.
- Metering/reporting failure does not fail the user request, and undelivered events remain durably recoverable.

---

## Epic 10 — Deployment and runtime hardening — P1

### Outcome

The application behaves consistently after deployment, not only locally.

### Work items

- Confirm App Service startup, static build packaging, health/readiness endpoints, managed identity, SQL MSI, OpenAI auth, and environment precedence.
- Add deployment smoke tests for health, config, roles, questions, auth profile, and an authorized chat flow.
- Validate private endpoint/VNet/DNS/firewall requirements.
- Add dependency and secret scanning.
- Add release rollback and configuration validation.
- Separate sandbox and production deployment assumptions.

### Acceptance criteria

- Smoke tests pass in target environment.
- Startup failure gives actionable non-secret diagnostics.
- Rollback is demonstrated.

---

## Epic 11 — Performance, aggregation, and complexity policy — P2

### Outcome

The product meets route-specific SLAs at predictable cost.

### Work items

- Baseline p50/p95 by route.
- Complexity estimator.
- Confirmation/deferred-report path for heavy requests.
- Curated aggregate layer with freshness and reconciliation.
- Concurrency, timeout, cancellation, retry, circuit-breaker, and backpressure controls.
- Performance/load testing.
- Use metered request-level token/cost totals as inputs to complexity, budget, and model-routing policies.

### Acceptance criteria

- SLA and capacity targets are met.
- Heavy requests cannot monopolize the service.
- Aggregate answers reconcile with source data.
- Cost per successful answer/report and cost by organizational hierarchy are measurable.

---

## Epic 12 — Cache strategy — P2

### Outcome

Caching improves measured performance without weakening permissions or freshness.

### Work items

- Metadata, authz, schema, result, and frontend/API cache boundaries.
- Versioned and authorization-scoped cache keys.
- Invalidation and stale-data behavior.
- Redis integration only after benchmark and security review.
- Cache observability and kill switch.

### Acceptance criteria

- No cross-user or stale-permission leakage.
- Measured latency/cost improvement justifies operational complexity.

---

## Epic 13 — Governed self-service data-product onboarding — P2

### Outcome

Approved domains can be onboarded through repeatable controls.

### Work items

- Self-service Metadata Studio with role-specific authoring and approval views.
- Bulk and incremental schema discovery/import for hundreds of tables.
- Searchable catalog partitioned by domain, source, ownership, and authorization.
- Editors for tables, fields, joins, grains, glossary terms, financial definitions, KPIs, examples, negative examples, instructions, question templates, and output templates.
- Automated schema, metadata, auth, KPI, join, freshness, dialect, and regression validation.
- Test console showing candidate selection, semantic plan, compiled SQL, safety/auth checks, expected output, and golden differences.
- Maker-checker approval, separation of duties, audit, effective dates, publish, rollback, emergency disable, and retirement.
- Schema-drift detection, impact analysis, stale-example detection, and owner notification.
- Ownership and support model.
- Retrieval narrowing so models receive only bounded authorized candidate metadata.

### Acceptance criteria

- A pilot data product is onboarded without core-orchestrator branching.
- A representative bulk import proves scale, search, validation, approval, publish, rollback, and drift handling.
- Business SMEs can publish approved glossary terms and examples without code deployment.
- User-authored instructions cannot override security, authorization, privacy, SQL safety, or audit controls.
- All release gates pass.

---

## Epic 14 — Advanced visualization and Power BI — P3

### Outcome

Users can move from chat answers to richer governed analytical experiences.

### Work items

- Power BI integration design.
- Rich chart interactions.
- Export and dashboard workflows.
- Visualization traceability and authorization.

### Acceptance criteria

- Visualization does not bypass data access controls.
- Exports retain traceability and approved formatting.

---

## Recommended first three increments

### Increment 1

- Epic 0 repository quality system.
- Epic 1 login page and auth route guard.
- Epic 2 baseline harness foundation.

### Increment 2

- Complete Epic 2 golden baseline.
- Start Epic 3 metadata registry wrapper.
- Repoint roles/questions while preserving fallbacks.
- Implement Epic 9A Slice A: shared per-call token instrumentation and request-level aggregation behind a feature flag.

### Increment 3

- Complete initial Epic 3 publish/rollback flow.
- Start Epic 4 semantic query plan contract.
- Add initial observability markers from Epic 9.
- Implement Epic 9A Slice B/C: authenticated hierarchy snapshot, price catalog, daily/monthly aggregates, and showback-only reporting.
