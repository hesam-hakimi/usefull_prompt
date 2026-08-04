# askAlpha Architecture Pack

This package contains three versioned Mermaid architecture views:

1. **Current Deployment Architecture** — current implementation evidence and known POC gaps.
2. **MVP1 SpruceX Architecture** — planned state after access, governed data-product onboarding, and pilot quality validation.
3. **Target Enterprise Production Architecture** — future enterprise target with distinct safety, audit, trace, metering, caching, and operational flows.

## Important status rule

Do not present MVP1 or Production components as implemented unless the private repository, deployment configuration, and platform evidence confirm them.

The architecture views must preserve the distinction between:

- implemented;
- technically validated;
- planned;
- target;
- open for platform or governance confirmation.

## Cross-cutting control reference

Use `docs/plans/SAFETY_OBSERVABILITY_AUDIT_AND_QUALITY_ADDENDUM.md` for the normative requirements covering:

- application-level pre-LLM validation;
- user/data/export auditing;
- agent and LLM decision traceability;
- model usage metering;
- automated answer-quality evaluation;
- bounded reviewer feedback loops;
- visualization-sandbox security;
- authorization-scope-aware caching;
- Event Hubs and enterprise monitoring responsibilities.

## Visual language

- **Green:** application and request-processing components.
- **Blue:** Azure platform, identity, and managed-service components.
- **Orange:** governed data and control-plane stores.
- **Purple:** telemetry, audit, usage-metering, trace, and operational components.
- **Solid arrows:** request, processing, or data flow.
- **Dashed arrows:** authentication, feedback, telemetry, or asynchronous event flow.

## Structure

```text
docs/architecture/
├── README.md
├── current/
│   ├── current_architecture.md
│   └── current_architecture.mmd
├── mvp1/
│   ├── mvp1_architecture.md
│   └── mvp1_architecture.mmd
└── production/
    ├── production_architecture.md
    └── production_architecture.mmd
```
