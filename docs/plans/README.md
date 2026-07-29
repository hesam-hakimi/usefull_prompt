# askAlpha Delivery Pack

This package contains:

- `MASTER_PLAN_V1.md` — source-of-truth roadmap and phased delivery model.
- `PRODUCT_ORDER_AND_BACKLOG.md` — prioritized product order and executable epics, including Epic 9A for runtime token metering and organizational cost attribution.
- `QUALITY_GATES.md` — mandatory quality, security, test, reconciliation, and release controls.
- `RUNTIME_MODEL_ROUTING_STRATEGY.md` — governed use of GPT-5.1, GPT-5.2, and GPT-5.5 inside the KMAI server agentic flow.
- `RUNTIME_USAGE_METERING_AND_CHARGEBACK.md` — per-model-call input/output token metering, per-request totals, user/team/department attribution, showback, reconciliation, and approved billback.
- `COPILOT_AGENT_EXECUTION_PROMPT.md` — paste-ready implementation prompt for the existing GitHub Copilot development agents.

Recommended repository paths:

```text
docs/plans/MASTER_PLAN_V1.md
docs/plans/PRODUCT_ORDER_AND_BACKLOG.md
docs/plans/QUALITY_GATES.md
docs/plans/RUNTIME_MODEL_ROUTING_STRATEGY.md
docs/plans/RUNTIME_USAGE_METERING_AND_CHARGEBACK.md
docs/agents/COPILOT_AGENT_EXECUTION_PROMPT.md
```

Revision 1.4 adds governed runtime usage metering and cost attribution. Every actual model call is captured, all retries/escalations roll up to the originating request, authenticated users are attributed through an effective-dated team hierarchy, and reporting progresses from metering to showback, reconciliation, and only then approved chargeback. VS Code and GitHub Copilot custom-agent definitions remain outside this delivery pack because they already exist separately.
