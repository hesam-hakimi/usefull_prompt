# askAlpha Delivery Pack

This package contains:

- `MASTER_PLAN_V1.md` — source-of-truth roadmap and phased delivery model.
- `PRODUCT_ORDER_AND_BACKLOG.md` — prioritized product order and executable epics.
- `QUALITY_GATES.md` — mandatory quality, security, test, and release controls.
- `RUNTIME_MODEL_ROUTING_STRATEGY.md` — governed use of GPT-5.1, GPT-5.2, and GPT-5.5 inside the KMAI server agentic flow.
- `COPILOT_AGENT_EXECUTION_PROMPT.md` — paste-ready implementation prompt for the existing GitHub Copilot development agents.

Recommended repository paths:

```text
docs/plans/MASTER_PLAN_V1.md
docs/plans/PRODUCT_ORDER_AND_BACKLOG.md
docs/plans/QUALITY_GATES.md
docs/plans/RUNTIME_MODEL_ROUTING_STRATEGY.md
docs/agents/COPILOT_AGENT_EXECUTION_PROMPT.md
```

Revision 1.3 adds a centralized runtime model-routing policy for the askAlpha server: GPT-5.1 for benchmark-approved low-risk and high-volume steps, GPT-5.2 as the default workhorse, and GPT-5.5 for governed complex or high-risk escalation and review. VS Code and GitHub Copilot custom-agent definitions are intentionally outside this delivery pack because they already exist separately.
