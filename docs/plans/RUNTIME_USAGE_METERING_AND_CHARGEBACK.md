# askAlpha — Runtime Usage Metering and Chargeback Design

**Status:** Proposed implementation standard — revision 1.0  
**Scope:** Per-model-call token metering, per-request aggregation, user/team/department attribution, showback, and governed chargeback for the askAlpha/KMAI server runtime.  
**Decision:** Start by recording every model API call, then aggregate through the organizational hierarchy for reporting and billback.

---

## 1. Objective

Capture the actual input and output token usage for every Azure OpenAI/model API call made by the askAlpha agentic runtime, attribute that usage to the authenticated user and the user's effective team hierarchy, and aggregate it for operational reporting, showback, budget management, and eventual chargeback.

The first release should produce trustworthy usage and estimated-cost reporting. Formal financial chargeback should be enabled only after Finance/Platform owners approve pricing, allocation, reconciliation, retention, and dispute rules.

---

## 2. Core principles

1. **Meter every real model call.** Record all agent calls, retries, repair attempts, fallbacks, escalations, and reviewer calls—not only the final answer.
2. **Aggregate by user request.** A single user request may invoke several agents and models; the request total is the sum of its model-call events.
3. **Use authenticated identity.** Derive the user from validated Entra/backend identity context. Never trust a client-supplied user or team identifier.
4. **Snapshot organizational attribution.** Record the effective user, team, department, and cost-center assignment at call time so historical reports do not change when people move teams.
5. **Separate usage from content.** Store counts, approved identifiers, hashes, status, and routing metadata. Do not store raw prompts, responses, SQL literals, result rows, tokens, secrets, or unrestricted claims in the usage fact table.
6. **Do not estimate silently.** When the provider does not return usage, store `usage_status=not_observed`; estimation must be explicit, separately labeled, and excluded from reconciled chargeback unless approved.
7. **Pricing is versioned configuration.** Model/deployment rates, currency, effective dates, discounts, and allocation rules must not be hardcoded in orchestration logic.
8. **Showback before chargeback.** Validate attribution and reconcile totals before using the data for actual billing.
9. **Metering must not break chat.** Persist through a durable outbox or equivalent retry mechanism. A reporting-store outage must not fail a user answer, but lost usage events must be observable and recoverable.
10. **Idempotent and auditable.** Each model call has a unique idempotency key and every price or attribution change is traceable.

---

## 3. Target flow

```text
Authenticated user request
        ↓
Request/trace context created
        ↓
Authorized org hierarchy resolved
        ↓
RuntimeModelPolicy selects deployment
        ↓
Agent invokes model API
        ↓
Usage extractor reads provider response/final stream chunk
        ↓
Append-only ModelUsageEvent written to durable outbox
        ↓
Usage event store
        ├── per-request summary
        ├── daily aggregates
        ├── monthly user/team/department/cost-center aggregates
        └── pricing and invoice reconciliation
        ↓
Admin/Finance reporting, showback, budget alerts, and approved chargeback export
```

The usage collector wraps the model client or gateway once. Individual agents should not implement separate token-accounting logic.

---

## 4. Runtime event contract

Create one append-only event for every actual model API call.

### 4.1 Required identity and hierarchy fields

- `model_call_id` — globally unique idempotency key.
- `request_id` — user-visible request correlation identifier.
- `trace_id` and `parent_span_id`.
- `subject_id` — stable authenticated Entra object identifier or approved pseudonymous equivalent.
- `team_id` and `team_name_snapshot`.
- `department_id` and `department_name_snapshot`.
- `cost_center_id`.
- `org_path_snapshot` — approved hierarchy identifiers at event time.
- `org_assignment_version` and `org_effective_at`.

Display names and email addresses should live in a protected identity dimension rather than the usage fact table unless governance explicitly approves otherwise.

### 4.2 Model-routing fields

- `agent_name` or runtime function.
- `route` and `intent`.
- `policy_id`, `policy_version`, and `risk_tier`.
- `requested_model_alias` and `actual_model_or_deployment`.
- `fallback_reason`, `escalation_reason`, and `attempt_number`.
- `prompt_template_version`, `metadata_version`, and applicable KPI/plan version.

### 4.3 Usage and outcome fields

- `input_tokens`.
- `output_tokens`.
- `total_tokens`.
- Optional provider-supported fields such as cached-input, reasoning, or audio tokens, stored separately rather than mixed into generic totals.
- `usage_status`: `observed`, `partial`, `not_observed`, or `estimated`.
- `started_at`, `completed_at`, and `latency_ms`.
- `status`: success, validation failure, timeout, provider error, safe stop, or cancelled.
- `structured_output_valid`.
- `authorization_result` and `sql_policy_result` when applicable.
- `answer_produced` and `request_completed`.
- `environment`, `region`, and application version.

### 4.4 Cost fields

- `price_catalog_version`.
- `currency` — configurable; use `CAD` for the initial Canadian reporting profile unless Finance specifies another billing currency.
- `input_rate_per_million`.
- `output_rate_per_million`.
- Optional cached/reasoning-token rates when applicable.
- `estimated_cost`.
- `cost_status`: `estimated`, `reconciled`, `final`, or `excluded`.
- `reconciliation_batch_id` when matched to provider billing.

Example calculation:

```text
estimated_cost_cad =
    (input_tokens  / 1,000,000 × input_rate_cad_per_million)
  + (output_tokens / 1,000,000 × output_rate_cad_per_million)
  + approved additional token-category charges
```

Do not include tax, enterprise discount, reserved capacity, or shared platform overhead until the approved allocation policy defines them.

---

## 5. Recommended storage model

### `ai_model_usage_event`

Append-only event-level fact table. One row per actual provider model call.

### `ai_request_usage_summary`

One row per askAlpha user request, aggregating every agent/model call, retry, and escalation linked to the request.

### `ai_usage_daily_aggregate`

Daily totals by user, team, department, cost center, model, agent, route, environment, and policy version.

### `ai_usage_monthly_chargeback`

Monthly controlled snapshot used for showback and, after approval, chargeback. Include allocation status, reconciliation status, owner approval, and dispute status.

### `ai_model_price_catalog`

Effective-dated price records by provider, model/deployment alias, region, token category, currency, and contract version.

### `user_org_assignment`

Effective-dated hierarchy mapping from authenticated subject to team, department, and cost center. Event rows also retain the approved snapshot to protect historical attribution.

For the initial release, Azure SQL can hold these records if scale is acceptable. The interfaces should remain storage-neutral so usage events and aggregates can later move to Databricks without changing model-call instrumentation.

---

## 6. Collection behavior

### Standard non-streaming call

Read provider usage metadata from the completed response and persist the event in a `finally`-safe instrumentation wrapper.

### Streaming call

Collect usage from the provider's final stream chunk or final response metadata. Do not emit the final usage event until the stream is complete, cancelled, timed out, or failed. Record partial/not-observed status when usage is unavailable.

### Retries, repair, fallback, and escalation

Each actual provider call gets its own `model_call_id`. A request summary aggregates all calls, including unsuccessful validation/repair attempts, because they still consume tokens and cost.

### Failure handling

- Persist an event for failed or cancelled calls when a provider request was made.
- Use a durable outbox with retry and dead-letter monitoring.
- Protect the user-facing response from metering-store latency or outage.
- Alert when events cannot be delivered or observed usage is unexpectedly missing.
- Prevent duplicates through `model_call_id` uniqueness.

---

## 7. Organizational attribution

Resolve hierarchy from a trusted backend source such as governed access mappings, an approved directory feed, or an HR/team hierarchy service.

Recommended hierarchy:

```text
User → Team → Department/Line of Business → Cost Center
```

Rules:

- Resolve and snapshot the hierarchy before or during request initialization.
- Preserve effective dates and source version.
- Never accept team or cost center from the browser as authoritative.
- Support unassigned/unknown attribution as a visible exception queue rather than silently assigning it to a default team.
- Historical events keep their original hierarchy snapshot; later hierarchy corrections use an auditable adjustment process.
- Restrict per-user details to approved administrators, Finance, and authorized managers. General dashboards should default to team/department aggregates.

---

## 8. Reporting and APIs

Minimum reports:

- Input/output/total tokens by day and month.
- Usage and estimated cost by user, team, department, and cost center.
- Usage by model, deployment, agent, route, intent, and policy version.
- Cost per successful answer and per report.
- Retry, escalation, fallback, timeout, and failed-call cost.
- Budget versus actual and anomaly alerts.
- Unattributed usage and missing provider-usage metadata.
- Estimated versus reconciled totals.

Suggested protected endpoints:

- `GET /api/admin/usage/summary`
- `GET /api/admin/usage/by-user`
- `GET /api/admin/usage/by-team`
- `GET /api/admin/usage/by-department`
- `GET /api/admin/usage/by-model`
- `GET /api/admin/usage/reconciliation`
- `POST /api/admin/usage/export`

All endpoints require explicit reporting permissions, server-side filtering, pagination, date limits, audit logging, and export controls.

---

## 9. Showback and chargeback lifecycle

### Stage 1 — Metering

Capture provider-observed usage for every call and prove completeness, idempotency, and redaction.

### Stage 2 — Showback

Publish informational user/team/department reports. Validate hierarchy attribution, pricing, and dispute workflows without financial posting.

### Stage 3 — Reconciliation

Compare event totals with Azure/provider billing records, discounts, credits, and shared platform costs. Investigate material differences.

### Stage 4 — Chargeback

Produce a frozen monthly allocation only after Finance, Platform, Product, and Security approve the calculation and reporting controls.

Recommended status flow:

```text
draft → calculated → reviewed → reconciled → approved → exported → closed
```

Corrections create adjustment records; they do not overwrite closed historical allocations.

---

## 10. Security, privacy, and retention

- Treat per-user usage as controlled employee/operational data.
- Complete privacy and records-management review before long-term per-user retention.
- Store the minimum identity information required for attribution.
- Encrypt in transit and at rest.
- Apply least-privilege RBAC and row-level reporting restrictions where needed.
- Audit report views, exports, price changes, hierarchy changes, and chargeback approvals.
- Never store prompts/responses merely to support token counting.
- Define event, aggregate, export, and audit retention separately.
- Provide a documented process for identity deletion/pseudonymization where policy requires it without corrupting financial audit records.

---

## 11. Implementation slices

### Slice A — Instrumentation foundation

- Introduce `ModelUsageCollector` around the shared Azure OpenAI/model client.
- Create typed `ModelUsageEvent` and `RequestUsageSummary` contracts.
- Capture actual provider usage for streaming and non-streaming calls.
- Add request/trace/model-call correlation and idempotency.
- Persist through a durable outbox.

### Slice B — Identity and hierarchy attribution

- Resolve authenticated subject from backend auth context.
- Add effective-dated team/department/cost-center mapping.
- Snapshot the hierarchy on each event.
- Add unattributed-usage monitoring.

### Slice C — Pricing and aggregation

- Add versioned price catalog and estimated-cost calculator.
- Build request, daily, and monthly aggregates.
- Reconcile event totals against request totals.

### Slice D — Reporting and showback

- Add protected admin APIs and dashboards/exports.
- Add budget and anomaly alerts.
- Validate with Finance and team owners.

### Slice E — Reconciliation and approved chargeback

- Import provider billing summaries.
- Reconcile usage and cost.
- Add frozen monthly allocation, approval, adjustment, dispute, and export workflows.

---

## 12. Tests and quality gates

### Unit

- Usage extraction for each supported response shape.
- Streaming final-chunk handling.
- Cost calculation by price version and token category.
- Hierarchy effective-date selection and snapshot behavior.
- Idempotency and duplicate prevention.
- Redaction and serialization.

### Integration

- Multi-agent request with several model calls.
- Retry/escalation totals.
- Timeout, cancellation, and provider error.
- Outbox retry and dead-letter recovery.
- Authentication-derived user attribution.
- Daily/monthly aggregation and export authorization.

### Reconciliation

- Sum of model-call events equals request summary.
- Sum of request summaries equals daily/monthly aggregates.
- Aggregate totals reconcile to provider billing within an approved tolerance.
- Closed chargeback periods cannot be edited directly.

### Security/privacy

- Client cannot spoof user/team/cost center.
- Unauthorized users cannot access per-user reports or exports.
- Usage records contain no prompt, response, SQL literal, secret, token, or raw result data.
- Report and export access is audited.

---

## 13. Acceptance criteria

- Every actual model API call creates exactly one idempotent usage event or a visible recoverable delivery failure.
- Input, output, and total tokens are captured from provider usage metadata when available.
- Every event is linked to request, trace, agent, route, policy version, requested/actual model, attempt, and outcome.
- Authenticated user and effective team/department/cost-center hierarchy are attributed and snapshotted.
- All retries, fallbacks, escalations, and failed provider calls contribute to request and cost totals.
- Raw prompts, responses, SQL literals, secrets, and result rows are absent from usage facts.
- Price configuration is effective-dated, versioned, auditable, and rollback-capable.
- User, team, department, model, agent, and route aggregates reconcile to event-level records.
- Missing usage and unattributed hierarchy are visible operational exceptions.
- Showback reports are available before chargeback is enabled.
- Formal chargeback requires provider-bill reconciliation and named Finance/Platform/Product/Security approvals.
- Metering failure does not fail the user request, and undelivered events are durably retried and alerted.
