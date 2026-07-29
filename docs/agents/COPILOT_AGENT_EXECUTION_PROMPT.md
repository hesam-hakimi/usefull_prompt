# GitHub Copilot Agent — Master Execution Prompt

Copy the prompt below into GitHub Copilot Agent mode after these documents are committed to the repository.

---

You are implementing the askAlpha roadmap in this repository.

## Authoritative documents

Read these files completely before proposing or changing code:

1. `docs/plans/MASTER_PLAN_V1.md`
2. `docs/plans/PRODUCT_ORDER_AND_BACKLOG.md`
3. `docs/plans/QUALITY_GATES.md`
4. `docs/plans/RUNTIME_MODEL_ROUTING_STRATEGY.md`
5. `docs/plans/RUNTIME_USAGE_METERING_AND_CHARGEBACK.md`
6. `docs/TECHNICAL_DOCUMENTATION.md` or the current equivalent technical document
7. Repository contribution instructions, CODEOWNERS, ADRs, and existing test documentation

Treat `MASTER_PLAN_V1.md` as the delivery source of truth. Treat the technical documentation and live code as the source of truth for current behavior. When they disagree, do not guess: record the discrepancy and propose the smallest safe correction.

## Current assignment

Implement only the issue or phase explicitly named by the user. Do not start later phases or unrelated refactors.

For the first execution slice, prioritize:

1. repository quality controls required by Epic 0;
2. the dedicated login/authentication experience in Epic 1;
3. baseline/golden test preparation in Epic 2.

The application currently enters the landing page directly. Add an explicit login/auth bootstrap experience without replacing the existing Entra/MSAL identity approach.

## Required workflow

1. Inspect the repository before writing a plan.
2. Identify the live entrypoints, active runtime paths, existing tests, and inactive/legacy code.
3. State assumptions and unresolved questions that materially affect scope, security, compatibility, deployment, privacy, or financial reporting.
4. Produce a focused implementation plan with files, contracts, tests, migration, feature flag, and rollback.
5. Create or use a dedicated feature branch.
6. Implement the smallest compatibility slice that delivers the requested outcome.
7. Add or update tests before declaring completion.
8. Run all relevant backend and frontend tests, lint, build, and security checks available in the repository.
9. Update documentation and ADRs in the same change.
10. Open a pull request with evidence. Do not merge it.

## Architecture rules

- Preserve the deterministic primary path.
- Keep generated SQL in the bounded fallback path unless an approved design says otherwise.
- Do not remove current JSON/YAML/Python fallbacks until parity and rollback are proven.
- Move ordinary questions, roles, intents, datasets, fields, joins, KPIs, synonyms, recipe metadata, and output-template mappings behind a governed registry rather than adding new hardcoded branches.
- Keep SQL safety, identifier validation, authorization enforcement, and deterministic sensitive formatting in code.
- Require a typed semantic query plan before analytical SQL execution.
- Do not silently choose a dataset for ambiguous questions.
- Filter unauthorized metadata and routing candidates before they reach the model or UI, and validate SQL authorization again before execution.
- Keep API response compatibility unless the issue explicitly authorizes a versioned contract change.
- Redis and Azure AI Search are not assumed to be primary runtime dependencies. Verify live wiring before changing them.
- Do not introduce a new orchestration framework solely for novelty. Add planner/agent complexity only when it solves an approved requirement and is covered by tests and observability.

## Scale, self-service, and multi-source rules

- Design the metadata platform for hundreds of tables; never send the full catalog to an LLM. Narrow candidates by authorization, domain, source, intent, and capability first.
- Support governed authoring of glossary terms, financial definitions, examples, negative examples, expected semantic plans, KPIs, instructions, questions, and output templates.
- All authoring follows draft -> validate -> test -> approve -> publish -> monitor -> rollback/retire.
- Metadata instructions may influence interpretation and presentation but may never override auth, privacy, SQL safety, row/scan/time limits, redaction, or audit.
- Use a source-neutral `DataSourceAdapter` and `DataSourceRegistry`. Refactor SQL Server behind an adapter before adding Databricks SQL.
- Keep semantic plans independent of SQL dialect. Compile validated plans into T-SQL or Databricks SQL through explicit dialect components.
- Do not add `if backend == ...` branches to the orchestrator for normal source execution.
- Qualify authorization and audit by source, catalog/database, schema, object, and field.
- Block cross-source joins in the first release.
- Add parity, dialect-conformance, source-auth, cancellation, timeout, and query-correlation tests.
- Bulk metadata import must be incremental, idempotent, resumable, auditable, and safe for schema drift.

## KMAI runtime model-routing requirements

The GPT-5.1, GPT-5.2, and GPT-5.5 requirement applies to the askAlpha server agentic flow, not to the existing VS Code or GitHub Copilot development agents. Do not create or replace `.github/agents` profiles for this requirement.

- Implement a centralized, versioned `RuntimeModelPolicy` and resolver.
- The orchestrator selects the runtime model; individual agents do not choose their own deployment.
- Preserve deterministic model-free routes where possible.
- Start with GPT-5.1 for benchmark-approved low-risk routing and clarification steps, GPT-5.2 for standard generation and writing, and GPT-5.5 for governed complex or high-risk escalation and review.
- Make model aliases, fallbacks, thresholds, attempts, timeouts, token budgets, rollout percentage, and escalation triggers configurable.
- Do not silently downgrade high-risk work during model outage unless policy explicitly permits it.
- Add golden, shadow, canary, fallback, timeout, and rollback tests before changing the default production route.
- Model selection never bypasses metadata filtering, authorization, semantic-plan validation, SQL policy, limits, or output redaction.

## Runtime token metering and chargeback requirements

Implement this as shared server-side instrumentation around the Azure OpenAI/model client or gateway. Do not add separate inconsistent accounting logic to every agent.

- Create typed `ModelUsageEvent` and `RequestUsageSummary` contracts.
- Emit one idempotent usage event for every actual provider call, including failed calls, retries, repairs, fallbacks, escalations, shadow calls, and reviewer calls.
- Capture provider-observed input, output, total, and supported token-category counts for streaming and non-streaming responses.
- For streaming, finalize usage from the final chunk/response metadata; record `partial` or `not_observed` when unavailable.
- Never silently estimate missing usage. Explicit estimates must be labeled and excluded from reconciled/final chargeback unless approved.
- Correlate model-call ID, request ID, trace ID, agent, route, policy version, requested/actual model, attempt, reason, latency, validation outcome, and status.
- Derive the authenticated subject from validated backend identity context. Never trust browser-supplied user/team/department/cost-center values.
- Resolve an effective-dated hierarchy and snapshot user -> team -> department/line of business -> cost center on each usage event.
- Store identity display details separately from the usage fact table unless governance approves otherwise.
- Do not store raw prompts, responses, SQL literals, result rows, raw claims, access tokens, or secrets in usage facts.
- Persist through a durable outbox or equivalent retry mechanism so reporting-store failure does not fail the user request and undelivered events remain recoverable and alertable.
- Enforce unique `model_call_id` to prevent duplicate charging.
- Add a versioned, effective-dated model price catalog; do not hardcode rates in orchestration logic.
- Produce event, request, daily, and monthly aggregates by user, team, department, cost center, model, agent, route, policy version, and environment.
- Implement protected reporting/export APIs with least privilege, server-side filters, pagination, date limits, and audit logs.
- Roll out in stages: metering -> showback -> provider-bill reconciliation -> approved chargeback.
- Do not label estimated cost as final financial chargeback. Chargeback requires Finance, Platform, Product, Security/privacy, and relevant owner approval.
- Closed monthly allocations require auditable adjustments rather than direct edits.
- Add reconciliation tests proving call events sum to request totals and request totals sum to daily/monthly aggregates.

## Login/auth requirements

- Add a dedicated login route/page.
- Use an explicit auth state machine: initializing, unauthenticated, redirecting, authenticated, error.
- Do not render protected landing/chat/report/admin content while authentication is unresolved.
- Reuse existing MSAL/Entra configuration and backend token validation.
- Preserve mock auth only for approved local/dev/test/CI-safe environments.
- Add protected-route handling, post-login return route, sign-out, expired-session recovery, and safe user-facing errors.
- Do not expose raw token, group, issuer, audience, or configuration details in the UI or logs.
- Include accessibility and responsive behavior.
- Add frontend and backend tests for all auth states and environment restrictions.

## Quality and security rules

- Never commit secrets, tokens, credentials, customer data, or production data.
- Never weaken SQL read-only or authorization guards to make a test pass.
- Never log raw prompts, SQL literals, result data, tokens, or sensitive claims without an approved redaction design.
- Never enable mock auth in hosted production.
- Never add broad wildcard authorization.
- Never let usage metering or reporting trust client attribution.
- Never make chargeback calculations immutable before showback, reconciliation, dispute, and approval controls exist.
- Never self-approve or self-merge.
- Stop and report if the requested implementation would bypass a release gate or contradict a documented security, privacy, records-management, or financial-control requirement.

## Test expectations

At minimum, add tests appropriate to the slice:

- unit tests;
- API/DTO contract tests;
- integration tests for the changed runtime path;
- security and authorization regression tests;
- frontend route/auth tests for user-facing auth changes;
- golden/parity tests when routing, metadata, SQL, KPI, rendering, model selection, or usage accounting changes;
- streaming and non-streaming token extraction tests;
- retry/fallback/escalation request-total tests;
- identity spoofing, hierarchy snapshot, outbox, idempotency, redaction, pricing, aggregation, reconciliation, and export-authorization tests;
- build/lint/type checks;
- deployment smoke tests when runtime configuration changes.

## Pull request format

Use this structure:

### Summary
What changed and why.

### Scope
Included and explicitly excluded work.

### Current-to-target behavior
How behavior changes while preserving compatibility.

### Architecture and security
Contracts, authorization, SQL/data safety, identity attribution, privacy, redaction, pricing, and ADR references.

### Files changed
Each important file and its purpose.

### Tests and evidence
Commands, results, screenshots, traces, usage/reconciliation evidence, and regression comparisons.

### Migration and feature flag
How the change is enabled safely.

### Rollback
Exact rollback steps.

### Risks and follow-ups
Known limitations and later work.

## Completion standard

Do not report the work as complete unless:

- acceptance criteria are met;
- relevant tests pass;
- documentation is updated;
- observability, usage metering, identity attribution, and redaction are addressed where applicable;
- migration and rollback are proven;
- no unrelated dirty files are included;
- showback/chargeback status is accurately labeled;
- the pull request is ready for human review.
