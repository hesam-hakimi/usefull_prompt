# askAlpha — Runtime Model Routing Strategy

**Status:** Governed target policy — revision 1.6  
**Important current-state fact:** The verified private-runtime path calls Azure OpenAI directly through the Azure OpenAI SDK/AutoGen configuration at `AZURE_OPENAI_ENDPOINT`. No enterprise LLM Gateway is present in the current live code path. A gateway must not be shown or assumed unless separately approved, implemented, and verified.

## 1. Purpose

Centralize model selection, escalation, retry, reviewer behavior, token/cost limits, and trace/usage evidence for all askAlpha runtime agents.

Runtime agents must not select their own model independently. The orchestrator resolves a versioned `RuntimeModelPolicy` after request safety and authorization checks.

## 2. Current versus target behavior

### Current verified behavior

- Model calls are made directly to Azure OpenAI through current SDK/AutoGen clients.
- The application uses in-process request, authentication, authorization, configuration, and prompt-data validation.
- Generated SQL is validated after generation and before Azure SQL execution.
- Primary and fallback orchestrators are wired; runtime agents are route-dependent.
- JSON traces/diagnostics may be available in authorized debug mode.
- Complete per-call metering and centralized policy enforcement must not be claimed unless the private runtime proves they are active.

### Target behavior

```text
Validated request + trusted auth context
  → route/risk/complexity classification
  → RuntimeModelPolicy resolution
  → bounded provider call
  → validation/reviewer decision
  → bounded repair/escalation or safe stop
  → response + trace + usage reference
```

## 3. Initial model tiers

The initial policy assumes these approved deployments are available to the KMAI runtime; deployment names and availability must be read from approved configuration rather than hardcoded.

### GPT-5.1 — low-risk/high-volume tier

Candidate tasks, only after benchmark approval:

- intent classification;
- normalization;
- simple clarification;
- low-risk error classification;
- metadata candidate scoring with bounded context;
- deterministic-output support tasks.

### GPT-5.2 — default workhorse tier

Candidate tasks:

- ordinary registry routing;
- semantic planning;
- bounded fallback SQL generation/repair;
- ordinary report planning/writing;
- visualization planning/code generation within the hardened sandbox;
- answer synthesis and ordinary review.

### GPT-5.5 — selective escalation tier

Candidate triggers:

- ambiguous source/dataset/KPI selection after clarification rules;
- complex/high-risk SQL planning;
- sensitive or executive questions;
- repeated validated failure;
- cross-table grain/join complexity;
- executive review;
- policy-approved exception handling.

Deterministic recipes remain model-free where possible.

## 4. Policy inputs

The versioned policy may consider:

- route and intent;
- authenticated user/role and authorization scope;
- data classification and source capability;
- semantic-plan complexity;
- join/table/field count;
- KPI risk/certification;
- output type;
- latency SLO;
- request/model-call/token/cost budget;
- prior attempt outcomes;
- current provider health;
- approved fallback matrix.

The policy must not use client-supplied identity, role, risk, team, cost center, model, or budget as authoritative input.

## 5. Pre-model gate

Before any model call:

- request/Pydantic validation passes;
- enterprise authentication is resolved;
- authorization context exists;
- request size/complexity is within limits;
- harmful/unsupported/prompt-injection policy passes or returns a governed blocked/clarification result;
- only authorized bounded metadata is selected for context;
- route is eligible for model use.

Current implementation performs these controls in-process. This strategy does not require a standalone validation service.

Where policy permits rejection without a model call, tests must prove no provider call occurred.

## 6. Retry, repair, and escalation contract

Every request has explicit limits:

- maximum total model calls;
- maximum attempts per task/agent;
- maximum reviewer feedback cycles;
- maximum elapsed time;
- input/output/total token budget;
- request cost budget;
- permitted model transitions;
- permitted repair categories;
- safe stop/fallback outcome.

A failed high-risk request must not silently downgrade to an unapproved weaker model.

### Example policy sequence

```text
Deterministic route available?
  yes → no model
  no  → approved default model
          → validation pass → continue
          → repairable failure → bounded repair
          → approved escalation trigger → higher tier
          → budget/attempt exhausted → clarify, partial, or block
```

## 7. Reviewer feedback loop

The reviewer is a decision control, not an unlimited generator.

Reviewer output includes:

- pass/fail/clarify/block;
- missing requirement or unsupported claim;
- affected plan/answer section;
- permitted repair instruction;
- evidence reference;
- attempt number;
- stop reason.

The reviewer cannot:

- override authorization or SQL policy;
- add an unauthorized source/object;
- expand the request beyond approved scope;
- exceed time/token/cost limits;
- loop indefinitely.

## 8. Evidence instead of uncalibrated confidence

Do not present a generic model probability as answer correctness.

Prefer evidence indicators:

- authentication/authorization result;
- semantic-plan validation;
- source/metadata coverage;
- SQL policy validation;
- data freshness;
- reviewer outcome;
- baseline reconciliation;
- deterministic versus generated path;
- known limitation/partial-answer status.

A confidence percentage may be introduced only after calibration, validation, explanation, and Product/Security/Model-Risk approval.

## 9. Model-call trace fields

Each attempted model call should record, when the corresponding systems are implemented:

- request/trace/model-call IDs;
- policy version;
- route, agent, task, risk tier;
- requested and actual deployment;
- selection reason;
- attempt/retry/repair/escalation type;
- context version references, not raw sensitive context;
- start/end/latency;
- provider response/usage status;
- validation/reviewer outcome;
- stop/fallback reason;
- app/environment version.

Raw prompts, responses, SQL literals, result rows, credentials, access tokens, or secrets are not stored in usage facts. Agent traces use a separate protected/redacted contract.

## 10. Usage-metering relationship

Model routing and usage metering are related but distinct:

- routing decides which model may be called;
- usage records each actual provider call;
- user/data audit records business/data access;
- agent trace records decision flow.

All may share request/trace/model-call identifiers but retain separate schemas, access controls, and retention.

## 11. Failure behavior

- Provider unavailable: follow approved fallback matrix or safe stop.
- Usage unavailable: user response may continue; mark usage not observed/partial and recover delivery when possible.
- Trace unavailable: do not weaken required audit or authorization.
- Budget exhausted: clarify, return governed partial answer, or block.
- Validation failure: do not execute SQL or expose unsafe output.
- Reviewer loop exhausted: return explicit stop reason; do not continue silently.

## 12. Benchmark and approval requirements

Before enabling or changing a route/model mapping:

- golden and unseen quality comparison;
- SQL validity/safety comparison;
- authorization behavior comparison;
- structured-output validity;
- p50/p95 latency;
- provider token/cost evidence;
- retry/escalation rate;
- failure/fallback behavior;
- canary and rollback plan;
- named Product/Engineering approval and Security/Model-Risk approval for high-risk changes.

## 13. Stop-the-line conditions

- agent bypasses central policy;
- unauthorized data/metadata reaches a model;
- high-risk request silently downgrades;
- reviewer/model loop exceeds policy;
- model change materially degrades golden/unseen/reconciliation thresholds;
- raw sensitive content appears in usage records;
- model selection or cost can be spoofed by the client;
- documentation claims gateway/policy/metering is active without runtime evidence.
