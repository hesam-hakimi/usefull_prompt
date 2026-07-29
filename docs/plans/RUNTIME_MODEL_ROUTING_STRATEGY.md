# askAlpha — Runtime Model Routing Strategy

**Status:** Proposed runtime operating standard — revision 1.1  
**Available KMAI server models:** GPT-5.1, GPT-5.2, GPT-5.5  
**Scope:** Model selection inside the askAlpha agentic runtime. This document does not define VS Code or GitHub Copilot custom agents. Token metering, organizational attribution, showback, and billback are governed by `RUNTIME_USAGE_METERING_AND_CHARGEBACK.md`.

---

## 1. Objective

Use the three available models as a governed runtime portfolio rather than assigning one model to every agent. Model choice must balance answer quality, latency, cost, risk, and failure recovery while preserving the deterministic primary path and all authorization and SQL safeguards.

This routing policy is an initial hypothesis. It must be validated with askAlpha golden questions, production-like traces, latency, token usage, cost, and human review before being treated as a permanent model-quality ranking.

---

## 2. Core principles

1. **Deterministic first.** Curated semantic plans, recipes, policy checks, and renderers should avoid an LLM call when one is not needed.
2. **The orchestrator chooses the model.** Individual runtime agents must not select or upgrade their own model.
3. **Task risk drives model tier.** Route by ambiguity, complexity, KPI sensitivity, source count, join count, report depth, confidence, and prior failures.
4. **Authorization before inference.** Filter metadata and candidate datasets before any model sees them.
5. **Model choice never bypasses controls.** Every generated SQL query is still subject to semantic-plan validation, AST policy, authorization, limits, and audit.
6. **Escalate selectively.** GPT-5.5 is used where deeper reasoning is valuable, not as the default for all traffic.
7. **No model voting by default.** Multiple-model ensembles add latency and cost and should be introduced only when measured evidence justifies them.
8. **Bound retries.** Repeated failure escalates once according to policy and then stops safely or asks for clarification.
9. **Version the policy.** Model mappings, thresholds, fallbacks, and prompts are governed configuration with publish and rollback.
10. **Measure every actual call.** Every model call records the requested model, actual model, agent, policy reason, latency, provider-observed tokens, retry or escalation, and outcome.
11. **Aggregate the whole request.** All model calls, repairs, fallbacks, and reviews triggered by one user request roll up to one request-level usage summary.
12. **Attribute through trusted identity.** User/team/department/cost-center attribution comes from authenticated backend context and an effective-dated hierarchy, never from client input.

---

## 3. Initial model roles

| Model | Runtime role | Good starting uses | Avoid as the only model for |
|---|---|---|---|
| **GPT-5.1** | Fast, high-volume, low-risk reasoning | intent classification after deterministic rules, conversational routing, clarification wording, query normalization, metadata search terms, simple error classification, simple answer phrasing | complex dataset selection, multi-join SQL, financial KPI reasoning, difficult repair, multi-query reports |
| **GPT-5.2** | Default workhorse | registry routing, bounded fallback SQL generation, ordinary visualization code, standard report planning and writing, executive summaries, first SQL repair attempt | unresolved high-risk ambiguity, repeated SQL failure, complex multi-dataset or sensitive executive analysis without escalation |
| **GPT-5.5** | Selective high-reasoning escalation and review | complex report planning, ambiguous dataset or KPI resolution, high-risk SQL generation or repair, difficult multi-join reasoning, executive review, conflict resolution across glossary, KPI, and instructions | routine chat, simple formatting, deterministic recipe answers, high-volume low-risk requests |

The names above should be stored as deployment aliases in configuration. The policy must not assume that model-version numbers alone guarantee a fixed quality, latency, or price relationship.

---

## 4. Recommended mapping to current runtime agents

| Runtime agent or function | Primary | Fallback or escalation | Notes |
|---|---|---|---|
| Deterministic primary recipe path | No LLM where possible | GPT-5.1 only for optional wording | Do not add an LLM merely to re-decide a governed result. |
| `intent_router` | GPT-5.1 | GPT-5.2 when confidence is low or routes conflict | Run deterministic route rules first. |
| `requirement_clarity` | GPT-5.1 | GPT-5.2 for multi-part or domain-sensitive clarification | It should ask, not guess. |
| `registry_router` | GPT-5.2 | GPT-5.5 for conflicting candidates, close confidence, sensitive KPI, or multi-domain requests | Candidate metadata must already be authorization-filtered and bounded. |
| `report_planner` | GPT-5.2 for simple single-source reports | GPT-5.5 for multi-query, executive, multi-dataset, or high-complexity reports | Planner emits a typed plan, not executable SQL. |
| `sql_generator` | GPT-5.2 | GPT-5.5 for high-risk or complex plan, or after one validated failure | Only in the bounded fallback path and only from a validated semantic plan. |
| `error_triage` | GPT-5.1 for classification | GPT-5.2 for first repair; GPT-5.5 after repeated or systemic failure | Maximum attempts are policy-controlled. |
| `viz_coder` | GPT-5.2 | GPT-5.5 only for unusually complex multi-view visualization | Simple chart selection should be deterministic metadata where possible. |
| `executive_writer` | GPT-5.2 | GPT-5.5 for sensitive, high-impact, or multi-source executive narratives | Numerical facts must come from validated results, never model memory. |
| `report_writer` | GPT-5.2 | GPT-5.5 for complex multi-section reports | Preserve evidence, caveats, and traceability. |
| `executive_reviewer` or coverage review | GPT-5.5 when invoked | GPT-5.2 only for standard low-risk review if benchmarked | Do not invoke on every simple deterministic answer; use a risk threshold. |

Every actual invocation in this table creates its own idempotent usage event, including failed attempts, fallback calls, and review calls.

---

## 5. Runtime model policy contract

Model routing should be represented by a versioned `RuntimeModelPolicy`, not scattered `if model == ...` statements.

Suggested fields:

```yaml
policy_id: askalpha-runtime-model-policy
version: 1
agent: sql_generator
route: fallback_sql
risk_tier: standard
primary_model: gpt-5.2
fallback_models:
  - gpt-5.5
max_attempts: 2
timeout_seconds: 45
max_input_tokens: 18000
max_output_tokens: 3000
confidence_threshold: 0.80
usage_metering_policy_version: 1
escalation_triggers:
  - low_confidence
  - more_than_two_joins
  - sensitive_kpi
  - repeated_validation_failure
allowed_environments:
  - sandbox
  - test
status: published
```

The policy registry should also support:

- agent and route scope;
- domain and data-product overrides;
- simple, standard, complex, and high-risk tiers;
- latency and token budgets;
- feature flags and rollout percentage;
- effective dates;
- owner, approver, change reason, and rollback version;
- linkage to the effective price catalog and usage-metering policy.

---

## 6. Risk and complexity signals

The router should calculate a deterministic risk or complexity score before model invocation. Suggested signals include:

- deterministic route available or not;
- user-request ambiguity;
- number and closeness of candidate datasets;
- certified versus uncertified KPI;
- number of requested dimensions, measures, joins, queries, and report sections;
- one source versus multiple candidate sources;
- SQL recipe available versus generated SQL required;
- sensitive field or restricted domain involvement;
- historical failure rate for this intent or pattern;
- previous model confidence and validation result;
- user-facing SLA and remaining latency budget;
- request-level token and cost budget already consumed by prior calls.

Model routing should consume this score but should not replace explicit policy rules for high-risk cases.

---

## 7. Escalation policy

### GPT-5.1 to GPT-5.2

Escalate when:

- classification confidence falls below the configured threshold;
- multiple intents or datasets remain plausible;
- the request contains multiple analytical clauses;
- glossary terms conflict or have multiple scoped definitions;
- the first structured output fails schema validation.

### GPT-5.2 to GPT-5.5

Escalate when:

- the request uses a high-risk or executive KPI;
- the plan requires complex joins or multiple queries;
- dataset, grain, or KPI selection remains ambiguous;
- a SQL query fails safety, semantic, or execution validation after the first bounded repair;
- the report spans multiple datasets or sources;
- executive review detects missing coverage or material inconsistency;
- policy explicitly marks the route as high risk.

### Stop conditions

Stop rather than continue escalating when:

- authorization denies the request;
- required metadata is absent or unpublished;
- no safe join path exists;
- the query cannot fit row, scan, time, token, or request-cost limits;
- repeated validation fails after the maximum attempt count;
- the required model is unavailable and the fallback is not approved for that risk tier.

The safe outcome is clarification, a blocked response, a partial answer with caveats, or a retryable service error, not unrestricted model retries.

---

## 8. Reliability and fallback behavior

Model fallback must distinguish between:

- **capability escalation:** the task needs deeper reasoning;
- **service fallback:** the selected deployment is unavailable or times out;
- **validation repair:** the output is invalid but the task is still safe to retry.

For service outages, do not automatically downgrade a high-risk task to a weaker model unless the policy explicitly allows it. A high-risk task may instead fail safely or be deferred.

Do not retry the same prompt unchanged. Each repair attempt must receive the validation failure in a structured, redacted form and remain within the original semantic plan.

Every provider call, including an unsuccessful repair or fallback, is metered separately and included in the originating request total.

---

## 9. Observability, usage metering, and audit

Record for every model call:

- `model_call_id`, request ID, trace ID, and parent agent span;
- authenticated subject identifier and effective team/department/cost-center snapshot;
- agent or function and route;
- policy ID, version, and risk tier;
- requested and actual deployment or model;
- escalation or fallback reason and attempt number;
- prompt-template and metadata versions;
- provider-observed input, output, total, and supported token-category counts;
- usage status: observed, partial, not observed, or explicitly estimated;
- latency, timeout, retry count, and status;
- structured-output validation result;
- SQL-policy and authorization result when applicable;
- effective price-catalog version, estimated cost, currency, and reconciliation status;
- final answer coverage and user feedback.

Do not log raw tokens, secrets, unrestricted metadata, raw result rows, SQL literals, or sensitive prompts/responses. Use approved identifiers, hashes, counts, and redacted summaries.

The model client/gateway should emit one shared `ModelUsageEvent` contract. Individual agents must not build inconsistent token-accounting implementations.

---

## 10. Request aggregation and billback

All model-call events sharing the same request ID are aggregated into one `RequestUsageSummary`. Daily and monthly rollups then group usage by:

- user;
- team;
- department/line of business;
- cost center;
- model/deployment;
- agent, route, intent, and policy version;
- environment and application version.

Follow the lifecycle defined in `RUNTIME_USAGE_METERING_AND_CHARGEBACK.md`:

```text
metering → showback → provider-bill reconciliation → approved chargeback
```

Do not treat calculated model prices as final financial charges until the price catalog, discounts, shared costs, hierarchy rules, dispute process, and Finance approval are in place. Closed monthly allocations require adjustment records rather than direct edits.

---

## 11. Evaluation and rollout plan

Create a model-routing benchmark from the existing golden suite. Evaluate each relevant agent and model pair on:

- structured-output validity;
- correct intent, dataset, KPI, and plan selection;
- SQL execution success after policy validation;
- answer correctness and coverage;
- clarification quality;
- false-confidence rate;
- retries and escalation rate;
- p50 and p95 latency;
- input/output tokens and request-level total tokens;
- estimated and reconciled cost;
- human review corrections.

Recommended rollout:

1. **Baseline:** capture current model behavior and usage without changing routing.
2. **Shadow:** run alternative model choices on a small redacted evaluation set without affecting user answers; tag shadow cost separately.
3. **Low-risk migration:** move intent and clarification tasks to GPT-5.1 when benchmark thresholds pass.
4. **Default workhorse:** use GPT-5.2 for standard runtime generation and writing.
5. **Selective escalation:** enable GPT-5.5 only for documented triggers.
6. **Canary:** route a small percentage by policy version and compare quality, latency, tokens, and cost.
7. **Showback:** validate user/team/department attribution and estimated cost with owners.
8. **Publish:** promote the policy only after release gates pass and retain instant rollback.

---

## 12. Initial acceptance criteria

- Runtime model selection is centralized behind a versioned policy service.
- No runtime agent chooses its own model.
- Current agent names have explicit primary and fallback mappings.
- GPT-5.1 handles only benchmark-approved low-risk runtime tasks.
- GPT-5.2 is the default generative workhorse.
- GPT-5.5 is invoked only by governed complexity, risk, failure, or review rules.
- Model fallback and retry counts are bounded.
- Deterministic recipes and all safety and authorization controls remain unchanged.
- Golden tests compare quality, latency, retries, tokens, and cost by model and agent.
- Every actual model call produces an idempotent usage event or a visible recoverable delivery failure.
- Request summaries include all retries, repairs, fallbacks, escalations, and reviews.
- Traces identify authenticated attribution, policy version, model used, reason, usage, cost status, and outcome without leaking sensitive content.
- User/team/department/cost-center rollups reconcile to event-level records.
- Model-policy changes support canary rollout and rollback without application redeployment where feasible.
- Chargeback remains disabled until showback, provider-bill reconciliation, and required approvals are complete.
