Phase 0 technical implementation and validation are complete. Do not start Phase 1.

Prepare the final manual approval handoff only:

1. Create a concise repository-admin checklist for:
   - branch protection/ruleset configuration;
   - exact required GitHub Check names;
   - required CODEOWNERS reviews;
   - dismissal of stale approvals;
   - prevention of direct pushes and force pushes;
   - required conversation resolution.

2. Prepare the final stakeholder approval matrix with:
   - Product;
   - Security;
   - Architecture/Engineering;
   - Data;
   - QA;
   - Platform/DevOps;
   - Operations.
   For each owner, specify exactly what evidence they must review.

3. Prepare a PR evidence index linking:
   - backend test results;
   - frontend tests, lint, and build;
   - offline golden baseline;
   - live 25-question golden baseline;
   - threat model;
   - data-flow diagram;
   - environment matrix;
   - Definition of Done;
   - dependency/MSI compatibility evidence;
   - rollback instructions.

4. Record `model_used: not_observed` as a non-blocking follow-up under runtime model-routing and usage-metering observability. Do not present it as observed evidence.

5. Update PHASE_0_STATUS_AND_EVIDENCE.md with the final status:
   “Technically ready for approval; formal Phase 0 closure is pending manual repository controls and stakeholder approvals.”

6. Do not make additional runtime changes, do not start Phase 1, and do not mark the PR ready or merge it.

At the end, provide:
- the exact GitHub repository-settings steps;
- the required check names;
- the stakeholder approval table;
- the PR evidence checklist;
- the remaining actions required before Phase 0 can be formally closed.
