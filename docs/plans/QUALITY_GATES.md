# askAlpha — Quality Gates and Acceptance Standard

This document defines the controls that make quality enforceable for human developers and GitHub Copilot agents.

## 1. Mandatory engineering rules

1. Never implement directly on the protected default branch.
2. Never remove a legacy path before parity, telemetry, rollback, and approval exist.
3. Never introduce a new business mapping in a prompt or orchestration branch when it belongs in governed metadata.
4. Never execute unvalidated generated SQL.
5. Never expose unauthorized schema, metadata, prompts, SQL, result values, group claims, or traces.
6. Never enable mock authentication in a hosted production environment.
7. Never claim Redis, AI Search, an agent, model usage, or token usage is active/observed unless verified in the live path.
8. Never change an API response shape silently.
9. Never merge a PR that lacks tests, evidence, documentation, and rollback.
10. Agents may create branches and PRs but may not self-approve or self-merge.
11. Never trust a client-supplied user, team, department, or cost-center identifier for usage attribution.
12. Never silently estimate missing provider token usage or treat estimated cost as reconciled/final chargeback.
13. Never store raw prompts, responses, SQL literals, result rows, secrets, or access tokens in usage-metering fact records.

## 2. Test pyramid

### Unit tests

- Registry schema and validation.
- Auth state machine and route guards.
- Authorization resolution.
- SQL AST and business safeguards.
- Semantic-plan validation.
- Renderers and output templates.
- Cache-key and invalidation logic.
- Redaction.
- Provider usage extraction for supported streaming and non-streaming response shapes.
- `ModelUsageEvent` and request-summary serialization/validation.
- Effective-dated user/team/department/cost-center hierarchy resolution.
- Price-catalog version selection and token-cost calculation.
- Usage-event idempotency and duplicate prevention.

### Contract tests

- `/api/config`
- `/api/auth/profile`
- `/api/questions`
- `/api/roles`
- `/api/registry`
- `/api/chat`
- `/api/chat/stream`
- diagnostics endpoints
- access-management endpoints
- protected usage-summary, user/team/department/model, reconciliation, and export endpoints

### Integration tests

- Entra-shaped auth adapter using test fixtures.
- Azure SQL store initialization and read-only execution.
- Registry loading, publication, and rollback.
- Primary deterministic answer path.
- Fallback generated-SQL path.
- SQL Server and Databricks adapter execution, timeout, cancellation, diagnostics, and audit.
- Bulk schema discovery/import, resume/idempotency, validation, publish, rollback, and drift detection.
- Self-service maker-checker workflow and separation-of-duties enforcement.
- SSE progress and final response.
- Access-management change and audit.
- Multi-agent request with several model calls, retries, repair, fallback, escalation, and review.
- Streaming final-usage capture, cancellation, timeout, and partial/not-observed usage behavior.
- Durable outbox retry, dead-letter recovery, and duplicate delivery.
- Authentication-derived user attribution and effective hierarchy snapshot.
- Event-to-request-to-daily/monthly aggregate reconciliation.
- Protected showback/chargeback reporting and export audit.

### Security tests

- Mock auth rejected in unsafe environments.
- Invalid issuer/audience/scope/signature.
- Missing or malformed group claims.
- Unauthorized table/view/field.
- SQL comments, multiple statements, DDL/DML, commands, SELECT INTO, unsafe functions.
- Duplicate-balance joins.
- Sensitive debug/log leakage.
- CSP/CORS/auth redirect configuration.
- Dependency and secret scans.
- Attempts to override safety/authorization through metadata instructions.
- Source-qualified authorization across catalog/database, schema, table/view, and field.
- Cross-source join attempts when the capability is disabled.
- Client attempts to spoof subject, team, department, cost center, model, token count, or cost.
- Unauthorized access to per-user usage, exports, price catalogs, reconciliation, and closed chargeback periods.
- Usage records and exports checked for prompts, responses, SQL literals, raw claims, secrets, tokens, and result data.
- Closed monthly chargeback records reject direct edits and require auditable adjustments.

### Golden regression tests

Cover at minimum:

- balances and trends
- product/account analytics
- retail/commercial/other segment breakdowns
- concentration and FDIC mix
- originations and attrition
- deposits versus withdrawals
- date and time-window variations
- rankings and top-N
- ambiguous asks
- no-data cases
- unauthorized users
- visualization requests
- report requests
- fallback confirmation and clarification
- glossary synonyms, acronyms, conflicting definitions, and effective-date changes
- positive and negative examples with expected semantic plans
- SQL Server/Databricks parity for portable recipes
- expected runtime agent/model route and bounded escalation
- expected number of model calls and request-level token/cost accounting behavior

### Performance tests

- Route-level p50/p95.
- Concurrent authenticated users.
- Large but permitted result sets.
- Cancellation and timeout behavior.
- OpenAI/Azure SQL/AI Search dependency latency.
- Cache on/off comparison when introduced.
- Registry performance with hundreds of tables and bounded candidate retrieval.
- Bulk import and schema-drift processing time.
- SQL Server versus Databricks route-level latency and cost evidence.
- Usage instrumentation overhead on streaming and non-streaming requests.
- Outbox backlog, delivery latency, throughput, and recovery.
- Aggregate refresh and protected reporting latency at target retention/volume.

## 3. Runtime model-routing and usage-metering quality controls

- Follow `docs/plans/RUNTIME_MODEL_ROUTING_STRATEGY.md` for model selection inside the KMAI server agentic flow.
- Follow `docs/plans/RUNTIME_USAGE_METERING_AND_CHARGEBACK.md` for per-call metering, hierarchy attribution, aggregation, showback, reconciliation, and chargeback.
- Runtime agents may not select their own model; the orchestrator resolves a versioned policy.
- GPT-5.1 is limited to benchmark-approved low-risk tasks such as intent classification, clarification, normalization, and error classification.
- GPT-5.2 is the default generative workhorse for registry routing, bounded SQL generation, visualization, and ordinary report writing.
- GPT-5.5 is reserved for documented ambiguity, complexity, sensitive KPI, repeated validation failure, executive review, and other high-risk triggers.
- Deterministic recipes remain model-free where possible.
- Model escalation never bypasses authorization, semantic-plan validation, SQL policy, row, scan, time, token, or request-cost limits, or redaction.
- Retry and escalation counts are bounded by policy.
- High-risk requests must not silently downgrade to an unapproved weaker fallback during service failure.
- Model-policy changes require versioning, canary evidence, and rollback.
- Every actual provider model call—including retry, repair, fallback, escalation, shadow, and review—creates one idempotent usage event or a visible recoverable delivery failure.
- Each usage event records policy version, requested/actual model, agent, route, reason, attempt, provider-observed token counts, usage status, latency, validation outcome, attribution snapshot, and cost status without sensitive content.
- A user request summary includes every linked model call, not only the successful final call.
- User/team/department/cost-center attribution is derived from trusted authenticated backend context and effective-dated hierarchy data.
- Missing usage or missing hierarchy is a monitored exception; it is not silently assigned or estimated.
- Showback is required before chargeback. Formal chargeback requires price/hierarchy approval and reconciliation to provider billing.
- Metering-store failures must not fail the user response, but undelivered events must be durably retried, alerted, and recoverable.

## 4. Pull-request evidence checklist

Every implementation PR must include:

- Requirement/issue link.
- Scope and out-of-scope.
- Current behavior and intended behavior.
- Architecture or ADR reference.
- Security and authorization impact.
- Data/KPI impact.
- API/metadata compatibility impact.
- Usage-metering, identity-attribution, privacy, retention, price-catalog, and chargeback impact when applicable.
- Files changed and why.
- Tests added and results.
- Screenshots for user-facing changes.
- Trace/log evidence with redaction.
- Migration and feature flag.
- Rollback steps.
- Known limitations and follow-ups.

## 5. Phase gates

### Phase 0 gate

- Dedicated login and protected routing work.
- Baseline/golden harness exists.
- CI and contribution controls are active.
- Threat model is reviewed.
- Runtime model policy contract, baseline benchmark, trace fields, and rollback are defined.
- Usage-metering requirements are documented, including authenticated attribution and no-raw-content rules.

### Phase 1 gate

- Registry validates, versions, publishes, and rolls back.
- Compatibility tests pass.
- Dynamic roles/questions do not require frontend code changes.

### Phase 2 gate

- Every analytical answer has a valid semantic plan.
- Ambiguity is surfaced.
- KPI and template versions are traceable.

### Multi-source gate

- SQL Server parity passes through the adapter abstraction.
- Databricks pilot passes auth, plan, dialect, query, timeout, cancellation, result, and audit tests.
- Core orchestration has no normal-path source-specific branches.
- Cross-source joins are blocked unless separately approved.

### Phase 3 gate

- Unauthorized metadata and SQL are blocked.
- SQL security corpus passes.
- No unresolved critical/high security findings.

### Phase 4 gate

- Golden quality thresholds pass.
- SLO dashboards, alerts, runbooks, and rollback are tested.
- Logs and traces are redacted.
- Per-call usage events reconcile to request summaries and missing-usage exceptions are observable.
- Per-user details and exports are protected and audited.

### Phase 5 gate

- Performance and cost targets pass.
- Cache isolation/freshness tests pass if cache is enabled.
- Aggregates reconcile.
- Request, daily, monthly, user, team, department, cost-center, model, agent, and route totals reconcile to event-level usage.
- Price catalog and cost calculations are versioned, effective-dated, and rollback-capable.
- Showback has been reviewed by Finance/Platform and representative team owners.
- Chargeback remains disabled until provider-bill reconciliation and required approvals pass.

### Production release gate

- Product, architecture, security, data, QA, platform, operations, and Finance approvals where chargeback is in scope.
- Supported production environment confirmed.
- Compliance, privacy, records-management, and data-classification requirements satisfied.
- Deployment smoke tests pass.
- Rollback is ready.
- Source-of-truth documentation is updated.

## 6. Quality metrics

Track at least:

- Golden-answer pass rate.
- Answer coverage rate.
- Clarification rate.
- No-route rate.
- Fallback rate.
- SQL validation failure rate.
- Authorization denial rate.
- p50/p95 latency by route.
- Error and timeout rate.
- Metadata load/publish failure rate.
- Bulk onboarding throughput and validation failure rate.
- Schema-drift detection and unresolved impact count.
- Candidate metadata count per model call.
- Source/dialect execution success rate.
- Data freshness failures.
- Cost per successful answer/report.
- Quality, structured-output validity, p50/p95 latency, input/output tokens, retries, and cost by runtime agent, model, and policy version.
- Model escalation, fallback, timeout, and safe-stop rates.
- Percentage of provider calls with observed, partial, not-observed, or estimated usage.
- Usage-event delivery success, outbox age, dead-letter count, and duplicate-prevention count.
- Unattributed user/team/department/cost-center usage rate.
- Event-to-request and request-to-aggregate reconciliation variance.
- Estimated-to-provider-bill variance and unresolved reconciliation items.
- User/team/department budget variance and anomaly count.
- Showback disputes, chargeback adjustments, and approval-cycle time.
- User feedback and reopened defects.
- Change failure rate and mean time to recovery.

## 7. Stop-the-line conditions

Pause rollout or disable the affected feature flag when:

- Unauthorized data or metadata may have been exposed.
- A certified KPI produces unreconciled material differences.
- SQL safety can be bypassed.
- Login/auth allows unauthenticated protected access.
- Logs or usage records contain secrets, tokens, sensitive claims, prompts, responses, SQL literals, result rows, or unredacted business data.
- Golden regression degrades beyond the approved threshold.
- A metadata instruction overrides or weakens runtime safety controls.
- Source routing executes against an unintended engine or unauthorized source.
- Schema drift invalidates a certified KPI, join, example, or recipe without blocking publication.
- Error, latency, or cost exceeds the release guardrail.
- A runtime agent bypasses the centralized model policy or selects its own model.
- A high-risk request is silently downgraded to an unapproved model.
- Model routing materially degrades golden-answer quality, SQL validity, authorization behavior, or SLA without automatic rollback.
- The client can spoof usage attribution or cost fields.
- Usage events are materially missing, duplicated, unrecoverable, or cannot reconcile to request totals.
- Per-user reporting or export permissions expose unauthorized employee usage information.
- Estimated or unreconciled costs are presented as final chargeback.
- A closed chargeback period can be altered without an auditable adjustment and approval.
