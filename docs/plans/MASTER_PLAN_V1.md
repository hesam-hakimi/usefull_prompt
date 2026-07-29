# askAlpha — Master Product and Delivery Plan v1

**Status:** Proposed source of truth — revision 1.1  
**Audience:** Product owner, architecture, engineering, security, data, QA, operations, and GitHub Copilot coding agents  
**Document intent:** Define the product roadmap, execution phases, governance model, quality gates, and project-management controls required to move askAlpha from a sandbox/MVP assistant toward a production-ready governed analytics product.

---

## 1. Executive Summary

askAlpha is an internal analytics assistant for Consumer Deposit Portfolio questions. The current implementation combines a deterministic, governed primary path with an LLM-assisted generated-SQL fallback path.

The current solution already contains important enterprise foundations:

- React/Vite user interface with streaming chat, reports, tables, charts, diagnostics, and access-management screens.
- FastAPI backend with typed DTOs and server-sent events.
- Azure SQL as the primary data path.
- Curated semantic plans and governed SQL recipes for high-risk and common questions.
- Azure OpenAI-backed routing, writing, visualization, and fallback SQL generation.
- SQL read-only enforcement, business safeguards, row/column limits, and authorization-aware validation.
- Enterprise Entra/MSAL authentication support, mock authentication for safe non-production environments, managed identity for Azure services, and access-management mappings.
- Diagnostic endpoints, audit markers, answer-coverage validation, and deterministic response renderers.

The main product risk is not lack of features. It is that too much runtime behavior is still encoded in static JSON/YAML files and Python logic, while production controls, metadata governance, test coverage, operational ownership, and release discipline are not yet consistently enforced as one system.

The roadmap therefore follows one rule:

> Preserve current working behavior first, move decisions behind governed metadata and explicit contracts second, and remove legacy paths only after parity, security, quality, and operational evidence are proven.

The dedicated login page is part of Phase 0 because the site currently enters the landing page directly. Authentication bootstrap, unauthenticated routing, sign-in state, error handling, sign-out, and session recovery must become an explicit product experience rather than an implicit background behavior.

---

## 2. Scope and Product Boundaries

### 2.1 In scope

- Governed analytics for approved Consumer Deposit Portfolio data products.
- Deterministic answers for high-value and high-risk questions.
- Controlled generated-SQL fallback when curated routes cannot answer a request.
- Role-aware and authorization-aware questions, metadata, routing, SQL, and outputs.
- Dynamic metadata-backed question catalogs, intents, datasets, fields, joins, KPIs, synonyms, recipes, roles, templates, and policies.
- Structured outputs: narrative answers, KPI cards, tables, charts, report blocks, downloadable report content, and trace/debug details when authorized.
- Enterprise authentication, access management, auditability, observability, performance controls, cost controls, and deployment hardening.
- Repeatable onboarding of additional approved data products without code changes for ordinary metadata additions.
- Governed self-service onboarding for hundreds of tables through schema discovery, metadata authoring, validation, approval, publish, rollback, and drift management.
- Business glossary, financial terminology, examples, negative examples, instructions, and evaluation cases managed as governed versioned metadata.
- Multi-source query execution through source-neutral contracts, beginning with SQL Server and Databricks SQL.

### 2.2 Explicitly out of scope for the production-safe core

- Cross-domain autonomous research across unrelated enterprise data domains.
- Unrestricted natural-language-to-SQL over unknown schemas.
- Direct write operations against business data.
- Full Power BI integration as a production-readiness blocker.
- Unreviewed agent autonomy that can deploy, alter metadata, or change permissions without governed approval.
- Production use of KMAI sandbox data or infrastructure where enterprise production controls are required.

### 2.3 Future consideration

- Power BI integration.
- Rich dashboard export workflows.
- Cross-domain semantic planning after each domain is independently governed.
- Long-running asynchronous analytical reports.
- Broader agent collaboration only where it improves measurable quality or throughput.

---

## 3. Current-State Architecture

### 3.1 Runtime shape

```text
User
  -> React / Vite SPA
  -> FastAPI API and SSE streaming
  -> Primary Orchestrator
       -> authorization context
       -> semantic source plan / intent registry
       -> governed SQL recipe or registered dataset
       -> Azure SQL through SqlDataStore
       -> deterministic renderer
       -> executive writer / coverage validator
  -> optional Fallback Orchestrator
       -> intent router
       -> metadata retriever / Azure AI Search grounding
       -> requirement clarification
       -> report planner or SQL generator
       -> SQL safety and authorization validation
       -> database executor
       -> error triage / bounded repair
       -> report writer / response renderer
```

### 3.2 Important current realities

- Azure SQL is the primary answer path.
- Azure AI Search is currently a narrow fallback metadata-retrieval mechanism, not the main answer engine.
- Redis is configured or reserved but is not wired into the live primary runtime.
- The primary path is intentionally deterministic where possible.
- The fallback path is LLM-assisted but remains bounded by SQL and authorization controls.
- Some agent classes and older JSON/SQLite paths exist but are not wired into the current live main path.
- Built-in questions, intents, dataset mappings, table allowlists, semantic plans, business rules, synonyms, and frontend role options are only partially externalized.
- A first compatibility slice has already introduced dynamic role loading and related API/tests while retaining legacy fallbacks.

### 3.3 Major hardcoded decision areas to retire gradually

- Built-in suggested question catalog.
- Intent-to-dataset mappings and required columns.
- SQL dataset/table allowlists.
- Semantic recipe selection and phrase triggers.
- Business mappings such as source system, segment, status, channel, FDIC, thresholds, and limits.
- Free-form synonym dictionaries.
- Frontend role lists.
- Local/demo JSON dataset conventions.
- Output labels, sections, chart hints, and response templates.

These must not all be removed at once. Each is migrated behind a governed abstraction with compatibility fallback, parity tests, and a rollback path.

---

## 4. Constraints and Assumptions

### 4.1 KMAI sandbox constraints

The KMAI environment is a self-service Azure sandbox intended for experimentation, prototyping, and early-stage development. The delivery plan must respect the following:

- Approved privacy assessment and governance requirements apply.
- No customer data, sensitive data above the permitted internal classification, or production-data movement into the sandbox.
- Teams own troubleshooting, spend monitoring, access onboarding, and deprovisioning.
- There is no centralized operational support for the sandbox.
- Sandbox spend is considered regrettable/experimental spend and must be monitored.
- Production-grade use requires the appropriate enterprise intake and a supported production environment.
- Tenant-specific AD groups and managed identities are used for access to infrastructure components.

### 4.2 Product assumptions requiring repository validation

- Existing API response shapes must remain compatible during early phases.
- Current deterministic recipes are the correctness baseline.
- Enterprise authentication uses existing Entra/MSAL integration rather than introducing a new identity provider.
- SQL Server remains the first supported production database path, but core orchestration and semantic planning must be source-neutral.
- Databricks SQL is the next supported analytical execution engine and must be introduced through adapters and dialect compilers rather than backend-specific orchestration branches.
- Azure AI Search remains optional for fallback metadata until a stronger retrieval design is approved.
- Power BI is a later enhancement and does not block the production-safe core.

Any coding agent must verify these assumptions against the current branch before implementation.

---

## 5. Target Architecture Principles

1. **Governed before dynamic.** Dynamic behavior must come from validated, versioned, publishable metadata.
2. **Deterministic before generative.** Prefer curated recipes and typed renderers for common or high-risk questions.
3. **Plan before SQL.** Every analytical answer must have an inspectable semantic query plan.
4. **Authorization at every boundary.** Filter metadata, routing candidates, SQL objects, traces, errors, suggestions, and outputs.
5. **Read-only by construction.** Generated SQL must remain single-statement, SELECT/WITH-only, allowlisted, bounded, and policy-validated.
6. **No silent ambiguity.** Low-confidence routing or conflicting metadata must trigger clarification, not a confident guess.
7. **Compatibility-first migration.** Keep old paths behind feature flags until parity is proven.
8. **Observability is a product feature.** Every answer must be traceable without exposing sensitive content.
9. **Quality is gated, not requested.** Tests, security checks, architecture checks, and release evidence are mandatory.
10. **Small reversible changes.** Agents work in focused branches and pull requests with clear rollback.
11. **Operational ownership is explicit.** Every service, KPI, aggregate, metadata domain, and alert has an owner.
12. **Cost and performance are bounded.** Every route has limits for rows, columns, joins, scans, retries, context, execution time, and report depth.
13. **Source-neutral orchestration.** The orchestrator operates on semantic plans and data-source contracts, not SQL Server-specific classes or syntax.
14. **Self-service is governed.** Users may author metadata, examples, glossary terms, and instructions only through validated draft/review/publish workflows; runtime safety policies cannot be overridden by metadata.
15. **Metadata is operational data.** Metadata changes require ownership, audit, versioning, impact analysis, regression evidence, rollback, and service-level expectations.

---

## 6. Delivery Model and Phase Sequence

### Phase 0 — Baseline, governance, and login/auth foundation

**Objective:** Establish a safe execution baseline and make authentication a visible, testable product flow.

**Deliverables**

- Golden baseline of current built-in questions and representative variants.
- Current behavior inventory covering primary, fallback, authorization, charts, reports, and error paths.
- Feature-flag framework for all migration slices.
- Dedicated login page and authentication bootstrap flow.
- Unauthenticated route guard so users do not enter the landing page before auth state is resolved.
- Sign-in, sign-out, token acquisition, silent refresh/recovery, expired-session handling, and friendly auth-error states.
- Enterprise Entra/MSAL reuse; mock auth remains restricted to safe local/dev/test/CI environments.
- Accessibility baseline for login and main navigation.
- Security threat model and data-flow diagram.
- Repository contribution rules, branch protections, CODEOWNERS, PR template, issue templates, and definition-of-done checklist.
- Initial CI pipeline: backend tests, frontend tests, lint, build, secret scan, dependency scan, and basic static analysis.
- Environment matrix for local, sandbox/dev, test, and future production.

**Exit criteria**

- Anonymous users cannot access protected application content.
- Login works with enterprise configuration and safe mock mode.
- Existing authenticated flows continue to work.
- Baseline tests reproduce current approved behavior.
- No production secrets or data are introduced.
- Phase 0 evidence is attached to a pull request and approved by product, security, and engineering owners.

---

### Phase 1 — Metadata registry foundation and compatibility migration

**Objective:** Create one governed metadata boundary while preserving current API and runtime behavior.

**Deliverables**

- `MetadataRegistryService` contract covering:
  - roles
  - question templates
  - semantic intents
  - datasets and fields
  - source/view/materialized mappings
  - approved joins and grains
  - synonyms
  - recipe metadata
  - output template keys
  - metadata version and status
  - data products, domains, owners, and support contacts
  - data sources, connection profiles, catalogs, schemas, and SQL dialects
  - business glossary terms and financial definitions
  - positive examples, paraphrases, negative examples, and expected semantic plans
  - configurable instructions and business rules with explicit precedence
- Initial file-backed implementation loading existing JSON/YAML as seed/fallback assets.
- Versioned metadata schema validation.
- Cache interface with version-aware invalidation, but no production Redis dependency yet.
- `/api/questions`, `/api/roles`, and `/api/registry` backed by the registry service without response-shape breaks.
- Dynamic frontend roles and questions with legacy fallback.
- Registry hit/miss, source, version, and validation trace markers.
- Metadata publication states: draft, validated, published, retired.
- Import/preview/validate/publish/rollback command-line workflow.
- Bulk schema discovery and import contract for hundreds of tables, including incremental refresh, ownership assignment, and masked sample profiling where approved.
- Conflict detection for duplicate glossary terms, KPI definitions, joins, instructions, and effective-date overlaps.

**Exit criteria**

- Golden questions pass through both legacy and registry paths.
- API contract tests prove compatibility.
- Invalid metadata cannot be published or loaded silently.
- A rollback to the previous metadata version is demonstrated.
- Ordinary role/question/intent additions do not require frontend code changes.
- A bulk import of representative schemas can be validated without loading all schemas into model context.
- Runtime retrieval narrows metadata by authorization, domain, source, and intent before any model call.

---

### Phase 2 — Semantic query plan, governed routing, KPI catalog, and output templates

**Objective:** Make question interpretation and output composition inspectable, deterministic, and metadata-driven.

**Deliverables**

- Typed `SemanticQueryPlan` contract:
  - user ask
  - classified route
  - intent
  - authorized candidate datasets
  - selected dataset/source
  - fields
  - filters
  - joins
  - grain
  - time window
  - KPI formulas
  - limits
  - output intent
  - confidence and clarification reason
- Plan validation before SQL generation or recipe execution.
- Migration of semantic recipe metadata from Python constants to registry records while keeping deterministic SQL/renderers in code where appropriate.
- Governed KPI catalog with owner, formula, grain, exclusions, caveats, effective version, certification status, and test examples.
- Explicit conversational-versus-report router.
- Output template registry for brief answer, executive report, comparison, ranking, trend, clarification, no-data, blocked, and error responses.
- Dynamic question sets generated only from authorized published metadata.
- Confidence thresholds and clarification policies.
- Governed business glossary registry for financial terms, acronyms, exclusions, related KPIs, scope, owner, and effective dates.
- Example and evaluation registry containing user questions, paraphrases, expected intent/dataset/plan, negative examples, expected output, and test status.
- Instruction and business-rule registry with precedence, scope, effective dates, owner, and explicit prohibition on overriding authorization, SQL safety, privacy, or audit controls.

**Exit criteria**

- Every analytical response has an inspectable plan ID and metadata version.
- Ambiguous questions do not silently select a dataset.
- Certified KPI definitions are consistently reused.
- Output labels, sections, and chart hints can change through metadata without changing core orchestration code.
- Current response shapes remain compatible or are versioned explicitly.
- Published examples and glossary changes automatically create or update regression cases.
- Conflicting financial definitions or instructions cannot be silently published.

---

### Phase 3 — Multi-source execution and Databricks SQL enablement

**Objective:** Remove SQL Server coupling from orchestration and support Databricks SQL through a controlled adapter and dialect architecture.

**Deliverables**

- Source-neutral `DataSourceAdapter` contract for execute, cancel, health, schema discovery, object listing, query metadata, and capability reporting.
- `DataSourceRegistry` that resolves a published `source_id` to an adapter, auth profile, catalog/schema, dialect, limits, and capability matrix.
- Refactor the current SQL store into `SqlServerAdapter` without changing approved behavior.
- Add `DatabricksSqlAdapter` using the approved Databricks SQL Warehouse connectivity and enterprise identity pattern.
- Source-neutral semantic plans; no SQL Server syntax in plan contracts.
- SQL dialect compiler/renderer for T-SQL and Databricks SQL, including limits, identifier quoting, date functions, null behavior, parameters, and supported capabilities.
- Source-qualified authorization using `source_id + catalog/database + schema + object + field`.
- Source-specific SQL validation layered under common read-only, authorization, privacy, and business safeguards.
- Diagnostics, timeout, cancellation, retry, query-history correlation, and audit by data source.
- Curated recipe support with portable plans first and source-specific SQL implementations only where necessary.
- Cross-source joins explicitly blocked in the first release unless a separately approved architecture is delivered.

**Exit criteria**

- Existing SQL Server golden tests pass through the adapter abstraction with no material behavior regression.
- A representative Databricks data product passes authentication, authorization, semantic-plan, query, result-shape, timeout, and audit tests.
- The orchestrator contains no source-specific branching for normal execution.
- Dialect conformance tests cover supported functions and reject unsupported constructs safely.
- A new source type can be added without changing core orchestration contracts.

---

### Phase 4 — Authorization and SQL/data safety hardening

**Objective:** Make safe access independent of prompt quality and route choice.

**Deliverables**

- Authorization filtering at metadata retrieval and suggestion generation.
- Effective permission model for domain, dataset, view, table, field, direct entity, and product-group-derived access.
- Deny-all behavior for users with no effective permissions.
- SQL object extraction using AST parsing and comparison with effective permissions.
- Approved join graph and grain rules.
- Duplicate-balance prevention and snapshot-account safeguards.
- Configurable limits by route: max rows, columns, joins, estimated scan, runtime, retries, report queries, chart points, and prompt context.
- Parameterization or safe literal handling for generated SQL.
- Trace and error redaction policy.
- Security headers, CSP review, CORS policy, CSRF assessment, token storage review, and frontend dependency review.
- Admin-access mutation audit with before/after values and actor identity.
- Security regression suite covering unauthorized metadata disclosure, SQL references, debug payloads, suggestions, and error messages.

**Exit criteria**

- Unauthorized users cannot discover restricted objects through any UI/API/debug path.
- SQL safety tests cover bypass attempts, multi-statement input, comments, DDL/DML, SELECT INTO, unsafe functions, unauthorized objects, and join duplication.
- Security review produces no unresolved critical/high findings.
- Authz and SQL policy failures are observable and auditable without leaking sensitive data.

---

### Phase 5 — Quality engineering, observability, and operational readiness

**Objective:** Make answer quality and runtime health measurable, repeatable, and supportable.

**Deliverables**

- Golden question regression suite with 25–50 highest-value questions first, then broader variants.
- Test dimensions: synonyms, dates, ranges, top-N, rankings, segments, source systems, KPIs, charts, ambiguous asks, no-data, stale data, unauthorized users, and fallback behavior.
- Answer-quality evaluation contract for correctness, completeness, grounding, coverage, clarity, and policy compliance.
- CI canary tests comparing legacy and metadata-backed paths.
- Structured traces containing metadata version, KPI version, auth scope hash, route, plan, validation result, query hash, row count, latency, retry count, fallback use, and final coverage status.
- Redacted operational dashboards for latency, success rate, fallback rate, no-route rate, clarification rate, SQL validation failures, auth denials, metadata load failures, and cost indicators.
- Health/readiness/startup probes.
- Incident runbooks, on-call ownership, rollback procedure, dependency-failure behavior, and data-source outage behavior.
- Service-level objectives and error budgets.
- Data freshness and reconciliation checks for source views and aggregates.

**Exit criteria**

- Critical golden questions pass defined correctness thresholds.
- SLO dashboards and alerts are operational in the target environment.
- A rollback and incident simulation are completed.
- No unredacted prompts, SQL, metadata, or result data appear in unauthorized logs.
- Release evidence is reproducible from CI artifacts.

---

### Phase 6 — Performance, scale, and cost efficiency

**Objective:** Meet agreed SLAs without weakening correctness or security.

**Deliverables**

- Route-level performance baseline and capacity model.
- Complexity estimator before SQL execution.
- User confirmation or deferred-report mode when complexity thresholds are exceeded.
- Curated aggregate tables/views for repeated executive questions.
- Freshness SLA, owner, grain, reconciliation, and lineage for every aggregate.
- Layered cache design:
  - metadata cache
  - authorization cache
  - schema cache
  - query-result cache only after privacy and staleness controls are approved
  - frontend/API registry cache
- Cache keys include metadata version, KPI version, authorization scope hash, normalized query/plan hash, time window, and freshness marker.
- Bounded concurrency, timeouts, cancellation, retries, circuit breakers, and backpressure.
- Cost instrumentation for OpenAI tokens/calls, Azure SQL execution, AI Search fallback, storage, and cache.
- Performance tests for concurrent users and representative large result sets.

**Exit criteria**

- Agreed p50/p95 latency and success targets are met for each route class.
- No cache path can leak old permissions or cross-user results.
- Cost per successful answer and per report is measurable.
- Aggregate answers reconcile with source views within approved tolerance.

---

### Phase 7 — Productization, governed self-service, and bulk onboarding

**Objective:** Allow governed expansion without turning every change into a software release.

**Deliverables**

- Admin UI for metadata import, preview, validation, comparison, publish, rollback, and audit.
- Workflow approvals for metadata, KPI, join, output-template, and authorization changes.
- Data-product onboarding checklist and automated validation pack.
- Schema-drift detection and impact analysis.
- Ownership catalog and operational contacts.
- Dynamic question sets based on role, authorized datasets, published patterns, recent successful asks, and business context.
- Versioned API and metadata contracts for additional domains.
- User feedback capture linked to trace IDs and golden-test candidates.
- Product analytics for adoption, unanswered questions, clarification rates, and frequently requested capabilities.

**Exit criteria**

- A new approved data product can be onboarded through the governed workflow with minimal or no core-code changes.
- Metadata and KPI owners can safely publish and roll back changes.
- Domain onboarding passes security, quality, operational, and performance gates.

---

### Phase 8 — Advanced visualization and external analytical integration

**Objective:** Extend presentation after the production-safe analytical core is stable.

**Deliverables**

- Power BI integration design and security review.
- Rich chart actions from chat.
- Dashboard/report export workflows.
- Versioned visualization specifications.
- Cross-domain semantic planning only after individual domains meet governance standards.

**Exit criteria**

- Visualization integrations do not bypass authorization or data policies.
- Exported assets are traceable to metadata/KPI/query versions.
- Performance and cost remain within approved limits.

---

## 7. Workstreams and Ownership

| Workstream | Primary responsibility | Required collaborators |
|---|---|---|
| Product and domain | Scope, priority, KPI meaning, acceptance | Data owners, business SMEs, engineering |
| Architecture | Contracts, boundaries, ADRs, technical coherence | Security, backend, frontend, platform |
| Metadata and data | Registry model, joins, grain, schema, freshness | Domain SMEs, QA, security |
| Backend orchestration | Plans, routing, recipes, fallback, APIs | Data, LLM, security, QA |
| Frontend experience | Login, auth state, chat, reports, admin UX, accessibility | Backend, security, product |
| Security and authorization | Threat model, identity, authz, SQL policy, redaction | Platform, backend, frontend, data |
| Quality engineering | Golden tests, contract tests, integration tests, performance | All engineering workstreams |
| Platform and DevOps | CI/CD, environments, secrets, identity, monitoring, rollback | Security, operations, engineering |
| Operations | SLOs, incident process, runbooks, support ownership | Platform, product, engineering |
| Documentation | Source-of-truth docs, ADRs, runbooks, release evidence | All workstreams |

Every phase must name accountable owners before implementation begins.

---

## 8. Project-Management Controls

### 8.1 Required artifacts

- Product roadmap and release goals.
- Prioritized backlog with acceptance criteria.
- Architecture decision records.
- Risk, assumption, issue, and dependency log.
- Traceability matrix from requirement to design, code, test, and release evidence.
- Environment and deployment matrix.
- Data/KPI ownership catalog.
- Security threat model.
- Test strategy and golden-question inventory.
- Operational readiness checklist.
- Release notes and rollback plan.

### 8.2 Delivery cadence

- Two-week delivery increments are recommended.
- Each increment must produce a demonstrable, testable compatibility slice.
- Architecture and security review happens before coding for cross-cutting changes.
- Backlog refinement includes product, architecture, security, data, QA, and engineering.
- A release candidate cannot be declared solely because implementation is complete.

### 8.3 Definition of Ready

A work item is ready only when:

- Business outcome and user are clear.
- Scope and out-of-scope are explicit.
- Dependencies and owners are named.
- Data classification and authorization impact are known.
- API/metadata compatibility impact is documented.
- Acceptance criteria and test approach exist.
- Rollback/feature-flag approach is defined.
- Required architecture/security decisions are approved.

### 8.4 Definition of Done

A work item is done only when:

- Code and documentation are updated.
- Unit, integration, contract, security, regression, and relevant performance tests pass.
- Telemetry and redaction are implemented.
- Feature flag and rollback are validated.
- Accessibility and user-facing error states are addressed where applicable.
- No secrets, unsafe defaults, or production data are introduced.
- Review comments are resolved.
- Acceptance evidence is attached to the PR.
- Product and required technical owners approve.

### 8.5 Pull-request policy

- No direct changes to the protected main branch.
- One focused objective per PR.
- Small reversible diffs preferred.
- Mandatory code-owner review for security, authorization, metadata contracts, SQL policy, and deployment.
- Every PR includes scope, design summary, risk, tests, evidence, migration, rollback, and follow-up items.
- Agents may not merge their own PRs.

---

## 9. Non-Functional Requirements

### Security

- Enterprise authentication required in hosted production.
- Mock auth prohibited outside approved safe environments.
- Least privilege and deny-all default.
- Managed identity preferred over secrets.
- No unrestricted database credentials or API keys in source control.
- Data and trace redaction by default.

### Reliability

- Explicit timeouts, retries, cancellation, fallback boundaries, and circuit breakers.
- Health/readiness probes and dependency status.
- Idempotent metadata publication and rollback.
- Graceful degradation when AI Search, OpenAI, cache, or optional visualization services fail.

### Performance

- Route-specific SLAs instead of one global target.
- Complexity estimation and bounded query execution.
- Streaming progress must not hide backend timeouts or stalled work.

### Scalability and metadata operations

- Support at least 500 registered tables in the initial scale target, with the exact production target confirmed through capacity testing.
- Metadata search and candidate resolution must remain bounded by authorization, domain, source, and intent.
- Bulk imports must be incremental, resumable, idempotent, and auditable.
- Schema drift must identify affected joins, KPIs, examples, recipes, templates, and golden tests before publish.
- Metadata publication must not require application redeployment for ordinary governed changes.

### Maintainability

- Typed contracts at service boundaries.
- No new business mappings embedded directly in prompts or orchestration branches when metadata is appropriate.
- Deprecation plan for legacy files and inactive agents.
- Code ownership and ADRs for cross-cutting choices.

### Usability and accessibility

- Dedicated login experience.
- Clear loading, clarification, confirmation, blocked, no-data, and error states.
- Keyboard navigation, focus management, accessible labels, and contrast checks.
- Explanations appropriate to user role without exposing restricted details.

### Cost management

- Budget alerts and usage dashboards.
- Token and model-tier selection policy.
- AI Search and cache used only when justified by measured value.
- No assumption that Redis improves performance until integrated and benchmarked.

---

## 10. Key Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect dataset or KPI selected with high confidence | Wrong business answer | Semantic plan, confidence threshold, clarification, certified KPI catalog, golden tests |
| Authorization applied too late | Data disclosure | Filter metadata and routes early; validate SQL objects again before execution |
| Metadata becomes a new uncontrolled codebase | Silent production errors | Schema validation, ownership, publish workflow, versioning, rollback, audit |
| Big-bang removal of hardcoded logic | Regression and outages | Compatibility slices, feature flags, canary comparison, parity tests |
| Generated SQL bypasses business rules | Wrong financial numbers | AST validation, approved joins/grain, deterministic recipes for high-risk questions |
| Login/auth is implicit or inconsistent | Poor UX and insecure access | Dedicated login page, route guard, explicit state machine, auth tests |
| KMAI sandbox mistaken for supported production | Compliance and support gap | Environment boundary, production intake, no prod data, explicit operational model |
| Redis or AI Search adopted without evidence | Cost and complexity | Measure first, phased integration, clear ownership and failure mode |
| Agents produce broad unreviewed changes | Quality and security defects | Focused prompts, branch isolation, mandatory tests, PR review, no self-merge |
| Documentation drifts from code | Incorrect implementation guidance | Docs-as-code checks, owners, version markers, PR updates required |

---

## 11. Release Gates

A release cannot proceed unless all applicable gates pass:

1. **Product gate:** agreed scope and acceptance evidence.
2. **Architecture gate:** contracts and ADRs approved.
3. **Security gate:** identity, authorization, SQL policy, dependency, and threat-model checks pass.
4. **Data gate:** approved sources, joins, grain, KPIs, freshness, and reconciliation.
5. **Quality gate:** automated tests and golden regressions pass.
6. **Performance gate:** route SLAs and capacity evidence pass.
7. **Operational gate:** dashboards, alerts, runbooks, rollback, and ownership exist.
8. **Compliance gate:** environment and data usage comply with KMAI/enterprise rules.
9. **Deployment gate:** smoke tests pass in the target environment.
10. **Documentation gate:** source-of-truth and release notes reflect the change.

---

## 12. Immediate Next Actions

1. Confirm target repository access and establish a documentation branch.
2. Confirm SQL Server and Databricks SQL connectivity/authentication patterns for sandbox and target production environments.
3. Approve the source-neutral adapter and dialect ADR before implementing Databricks support.
4. Define the self-service role model and maker-checker approval matrix.
5. Select a pilot domain containing enough tables, joins, glossary terms, examples, and KPIs to test bulk onboarding and retrieval narrowing.


1. Confirm the repository and target branch for this source-of-truth plan.
2. Create a documentation branch and PR containing this plan, the product backlog, the quality gates, and the Copilot execution prompt.
3. Reconcile this document against the live repository and record differences rather than silently editing assumptions.
4. Execute Phase 0 first, with the login/auth flow as the first user-visible slice.
5. Build the golden baseline before broad metadata migration.
6. Create initial ADRs for:
   - metadata registry storage and publication
   - semantic query plan contract
   - login/auth routing model
   - compatibility flags and rollback
   - observability/redaction standard
7. Convert Phase 0 and Phase 1 into GitHub epics/issues with dependencies and acceptance criteria.

---

## 13. Source-of-Truth Rule

After approval, this document supersedes scattered roadmap notes for delivery sequencing. Older plans remain historical references. Technical documentation continues to describe the current implementation; this plan describes the approved target and migration path.

Changes to phase scope, security controls, metadata contracts, or release gates require an approved pull request and recorded decision rationale.
