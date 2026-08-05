# askAlpha — Runtime Usage Metering, Showback, Reconciliation, and Chargeback

**Status:** Planned target contract — revision 1.6  
**Current-state warning:** The verified private runtime does not contain a live usage collector, durable outbox, Event Hubs pipeline, or chargeback implementation. These components must not be presented as current.

## 1. Purpose

Capture every actual model-provider call, aggregate calls to the originating authenticated request, attribute usage through a governed organization hierarchy, and progress safely through:

```text
Metering → Showback → Provider-Bill Reconciliation → Approved Chargeback
```

Formal chargeback is disabled until completeness, reconciliation, governance, privacy, Finance, Product, Platform, and Security approvals are proven.

## 2. Separation from audit and trace

Three record streams are required:

1. **Model usage event** — provider calls, tokens, latency, model, cost status.
2. **User/data/export audit event** — who requested/accessed/exported what under which authorization.
3. **Agent/LLM decision trace** — route, plan, agent transitions, validation, repair, reviewer feedback.

They share correlation identifiers but are not substitutes for one another.

### Common identifiers

- `request_id`
- `trace_id`
- `subject_id`
- `authorization_version`
- `app_version`
- `environment`

### Usage-specific identifier

- `model_call_id`

## 3. Current baseline

Repository audit confirmed:

- model calls currently go directly to Azure OpenAI through SDK/AutoGen configuration;
- JSON traces/diagnostics may exist in authorized debug responses;
- no live `ModelUsageCollector` was found;
- no durable outbox was found;
- no Event Hubs runtime path was found;
- Databricks/ADLS usage processing is planned only;
- user-query/export audit is absent and data-access audit is partial.

This document defines future implementation requirements, not current behavior.

## 4. Event granularity

Create one idempotent usage event for every actual provider call, including:

- initial call;
- retry;
- repair;
- fallback;
- escalation;
- reviewer call;
- shadow/canary call;
- streaming call;
- failed, timed-out, cancelled, or partial call when provider interaction occurred.

Do not record only the final successful answer.

## 5. Model usage event contract

Minimum fields:

### Identity and correlation

- `model_call_id`
- `request_id`
- `trace_id`
- trusted `subject_id`
- tenant/application/environment/region
- session/conversation reference where approved

### Organization snapshot

- team
- department/LOB
- cost center
- assignment source/version/effective time
- attribution status

The hierarchy is resolved from trusted backend identity and governed effective-dated data. Client-supplied hierarchy values are ignored.

### Runtime context

- agent/task/route/intent
- semantic-plan/metadata/KPI/model-policy versions
- requested and actual model/deployment
- selection/escalation reason
- attempt type and sequence
- risk/complexity tier

### Provider usage

- input tokens
- output tokens
- total tokens
- supported cached/reasoning/audio categories
- usage status: `observed`, `partial`, `not_observed`
- provider request/correlation ID where available

Missing usage is not silently estimated as authoritative usage.

### Timing and outcome

- start/end/latency
- success/failure/timeout/cancel status
- validation/reviewer outcome
- error class without sensitive content
- streaming/non-streaming marker

### Cost

- price-catalog version
- estimated cost
- cost status: `estimated`, `reconciled`, `final`, `excluded`
- reconciliation batch/period
- adjustment reference where applicable

## 6. Privacy and prohibited content

Usage facts must not contain:

- raw prompts;
- raw responses;
- SQL literals or full generated SQL;
- result rows;
- access tokens or credentials;
- secrets;
- raw group claims;
- unnecessary personal or sensitive business content.

Use version IDs, hashes, classifications, reason codes, counts, and protected trace references instead.

## 7. Request usage summary

Aggregate every linked call into one request summary:

- total calls;
- models/deployments used;
- retry/repair/fallback/escalation counts;
- total input/output/overall usage;
- total latency and model latency;
- estimated/reconciled cost;
- usage completeness;
- attribution completeness;
- final request outcome.

A request that triggers six calls must not appear as one provider call.

## 8. Reliability architecture

Target flow:

```text
Model call wrapper
  → ModelUsageCollector
  → Durable Outbox transaction
  → Azure Event Hubs
  → Databricks event processing
  → ADLS append-only history
  → request/daily/monthly aggregates
  → showback/reconciliation
```

### Reliability requirements

- idempotent `model_call_id`;
- durable outbox;
- retry with backoff;
- dead-letter handling;
- replay and recovery;
- duplicate detection;
- backlog age/throughput alerts;
- schema versioning;
- no chat failure solely because reporting transport is unavailable.

Event Hubs is asynchronous event transport. It is not the user-query engine or analytical answer source.

## 9. Logical data model

Recommended entities:

- `ai_model_usage_event`
- `ai_request_usage_summary`
- `ai_usage_daily_aggregate`
- `ai_usage_monthly_showback`
- `ai_usage_monthly_chargeback`
- `ai_model_price_catalog`
- `user_org_assignment`
- `usage_delivery_exception`
- `usage_reconciliation_batch`
- `chargeback_adjustment`
- `chargeback_period_close`

User/data/export audit and agent traces use separate entities/contracts.

## 10. Price catalog

The catalog is:

- versioned;
- effective-dated;
- model/deployment/region/usage-category aware;
- owned by a named Finance/Platform function;
- auditable and rollback-capable.

Historical events retain the price version used. A price change does not silently rewrite closed history.

## 11. Showback

Showback reports usage and estimated/reconciled cost without creating a financial posting.

Required dimensions:

- user;
- team;
- department/LOB;
- cost center;
- model/deployment;
- agent/task/route;
- environment;
- day/month;
- usage/cost status.

Protected reporting and exports require least privilege and audit.

## 12. Provider-bill reconciliation

Before chargeback:

- event totals reconcile to request summaries;
- request totals reconcile to daily/monthly aggregates;
- aggregate totals reconcile to provider billing within approved tolerance;
- missing/duplicate/unattributed events are resolved or explicitly excluded;
- price and allocation versions are approved;
- material variance has an owner and disposition.

## 13. Chargeback controls

Formal chargeback requires:

- approved allocation method;
- complete/reconciled usage period;
- named Finance, Platform, Product, Security/privacy, and relevant owner approvals;
- monthly freeze/close;
- auditable adjustment rather than direct edit;
- dispute workflow;
- protected export;
- retention and records-management policy;
- rollback/correction procedure.

Estimated or unreconciled data must never be labeled final chargeback.

## 14. Missing-usage and attribution handling

### Missing provider usage

- set `usage_status = not_observed` or `partial`;
- retain call identity/outcome;
- alert/queue for investigation;
- do not fabricate authoritative token counts.

### Missing organization assignment

- mark attribution exception;
- do not silently assign a default team/cost center;
- route to governed resolution queue;
- preserve the user/request timestamp and assignment evidence.

## 15. Security and access

- authoritative identity is backend validated;
- usage APIs and exports are role/entitlement protected;
- per-user employee usage is treated as sensitive operational information;
- client cannot submit authoritative token/cost/model/identity values;
- raw prompt/result content is prohibited;
- access to price/reconciliation/closed periods is separated by duty;
- all exports and adjustments are audited.

## 16. Tests

### Unit

- provider usage extraction;
- event validation/serialization;
- request aggregation;
- hierarchy snapshot;
- price selection and cost calculation;
- idempotency/duplicate prevention;
- redaction/prohibited-field checks.

### Integration

- streaming final usage;
- retry/repair/fallback/escalation aggregation;
- timeout/cancellation/partial usage;
- outbox retry/dead-letter/replay;
- identity/hierarchy attribution;
- event-to-request-to-aggregate reconciliation;
- protected reporting/export/adjustment.

### Security

- spoofed subject/hierarchy/model/token/cost;
- unauthorized reporting/export;
- prohibited raw content in records;
- closed-period direct edit;
- audit of usage-report access.

### Performance

- instrumentation overhead;
- event throughput/backlog age;
- recovery time;
- aggregate refresh/report latency.

## 17. Acceptance gates

### Metering gate

- every provider call produces one event or visible recoverable delivery failure;
- all request-linked calls aggregate correctly;
- no prohibited sensitive content;
- chat survives reporting transport outage;
- duplicates are prevented.

### Showback gate

- attribution and aggregate completeness meet threshold;
- protected reports/exports are audited;
- representative team owners review results.

### Reconciliation gate

- provider-bill variance is within approved tolerance;
- unresolved exceptions have owner/disposition;
- price catalog is approved.

### Chargeback gate

- all prior gates pass;
- approvals and financial close controls exist;
- adjustments/disputes are auditable;
- final labels are accurate.

## 18. Stop-the-line conditions

- client can spoof authoritative fields;
- usage records contain prohibited content;
- material calls are missing, duplicated, or unrecoverable;
- request/aggregate/provider totals cannot reconcile;
- unauthorized users can access employee/team usage;
- estimated cost is shown as final chargeback;
- closed periods can be changed without adjustment/approval;
- documentation presents planned metering/event components as current.
