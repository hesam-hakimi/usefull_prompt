# askAlpha — Quality Gates and Acceptance Standard

This document defines the controls that make quality enforceable for human developers and GitHub Copilot agents.

## 1. Mandatory engineering rules

1. Never implement directly on the protected default branch.
2. Never remove a legacy path before parity, telemetry, rollback, and approval exist.
3. Never introduce a new business mapping in a prompt or orchestration branch when it belongs in governed metadata.
4. Never execute unvalidated generated SQL.
5. Never expose unauthorized schema, metadata, prompts, SQL, result values, group claims, or traces.
6. Never enable mock authentication in a hosted production environment.
7. Never claim Redis, AI Search, or an agent is active unless verified in the live path.
8. Never change an API response shape silently.
9. Never merge a PR that lacks tests, evidence, documentation, and rollback.
10. Agents may create branches and PRs but may not self-approve or self-merge.

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

## 3. Runtime model-routing quality controls

- Follow `docs/plans/RUNTIME_MODEL_ROUTING_STRATEGY.md` for model selection inside the KMAI server agentic flow.
- Runtime agents may not select their own model; the orchestrator resolves a versioned policy.
- GPT-5.1 is limited to benchmark-approved low-risk tasks such as intent classification, clarification, normalization, and error classification.
- GPT-5.2 is the default generative workhorse for registry routing, bounded SQL generation, visualization, and ordinary report writing.
- GPT-5.5 is reserved for documented ambiguity, complexity, sensitive KPI, repeated validation failure, executive review, and other high-risk triggers.
- Deterministic recipes remain model-free where possible.
- Model escalation never bypasses authorization, semantic-plan validation, SQL policy, row, scan, or time limits, or redaction.
- Retry and escalation counts are bounded by policy.
- High-risk requests must not silently downgrade to an unapproved weaker fallback during service failure.
- Model-policy changes require versioning, canary evidence, and rollback.
- Each model call must record policy version, requested and actual model, route, reason, latency, tokens, retry or escalation, and outcome without logging sensitive content.

## 4. Pull-request evidence checklist

Every implementation PR must include:

- Requirement/issue link.
- Scope and out-of-scope.
- Current behavior and intended behavior.
- Architecture or ADR reference.
- Security and authorization impact.
- Data/KPI impact.
- API/metadata compatibility impact.
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

### Phase 5 gate

- Performance and cost targets pass.
- Cache isolation/freshness tests pass if cache is enabled.
- Aggregates reconcile.

### Production release gate

- Product, architecture, security, data, QA, platform, and operations approvals.
- Supported production environment confirmed.
- Compliance and data-classification requirements satisfied.
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
- Quality, structured-output validity, p50/p95 latency, tokens, retries, and cost by runtime agent, model, and policy version.
- Model escalation, fallback, timeout, and safe-stop rates.
- User feedback and reopened defects.
- Change failure rate and mean time to recovery.

## 7. Stop-the-line conditions

Pause rollout or disable the affected feature flag when:

- Unauthorized data or metadata may have been exposed.
- A certified KPI produces unreconciled material differences.
- SQL safety can be bypassed.
- Login/auth allows unauthenticated protected access.
- Logs contain secrets, tokens, sensitive claims, or unredacted business data.
- Golden regression degrades beyond the approved threshold.
- A metadata instruction overrides or weakens runtime safety controls.
- Source routing executes against an unintended engine or unauthorized source.
- Schema drift invalidates a certified KPI, join, example, or recipe without blocking publication.
- Error, latency, or cost exceeds the release guardrail.
- A runtime agent bypasses the centralized model policy or selects its own model.
- A high-risk request is silently downgraded to an unapproved model.
- Model routing materially degrades golden-answer quality, SQL validity, authorization behavior, or SLA without automatic rollback.
