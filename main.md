Prepare the authoritative implementation contract for Phase 2C.

This is a read-only planning task. Do not modify files, create branches,
create worktrees, commit, push, change PR metadata, merge, deploy, or begin
implementation.

Current state:

- PR #10 has already been merged.
- PR #11:
  - branch: phase2/registry-contracts
  - remains the parent of Phase 2B.
- PR #12:
  - state: OPEN and Draft
  - base: phase2/registry-contracts
  - head: phase2/service-version-boundary
  - final independent acceptance verdict: PASS
  - Phase 2B is technically complete.
- Phase 2C is approved to begin as controlled stacked development.
- PR #11 and PR #12 must not be merged or deployed yet.

Do not use or modify the dirty asktd_v2 checkout.

────────────────────────────────────
1. Verify the starting state
────────────────────────────────────

Fetch origin and confirm:

- origin/phase2/registry-contracts exists;
- origin/phase2/service-version-boundary exists;
- phase2/registry-contracts is an ancestor of
  phase2/service-version-boundary;
- PR #12 is OPEN and Draft;
- PR #12 base and head are correct;
- the Phase 2B remote head matches the final accepted commit;
- the isolated Phase 2B worktree is clean.

Do not change anything.

────────────────────────────────────
2. Locate authoritative Phase 2C requirements
────────────────────────────────────

Search all repository planning and architecture artifacts, including:

- docs/plans/plan_impl.md
- docs/plans/plan_imp.md, if present
- docs/plans/MASTER_PLAN_V1.md
- docs/plans/PRODUCT_ORDER_AND_BACKLOG.md
- ADRs and ADR index
- Phase 2 validation plan
- Phase 2B ADR
- PR #11 and PR #12 deferred-scope descriptions
- relevant models, registry contracts and service boundaries

Locate every requirement related to:

- Phase 2C;
- semantic-plan contract;
- semantic-plan validation;
- deterministic validation;
- metadata references used by a semantic plan;
- safe error contracts;
- authorization boundaries;
- SQL-safety boundaries;
- plan lifecycle or version compatibility;
- public versus internal API exposure.

Provide exact file paths, headings and line references where possible.

Do not infer requirements solely from the branch name or previous agent
summaries.

────────────────────────────────────
3. Define the exact Phase 2C boundary
────────────────────────────────────

Determine whether the authoritative repository evidence defines Phase 2C as:

- semantic-plan typed contracts;
- semantic-plan validator;
- validation against the governed metadata registry;
- safe deterministic validation errors;
- compatibility with RegistrySnapshot and registry_version;

and identify precisely which additional responsibilities are included.

Explicitly classify each of the following as:

- INCLUDED IN PHASE 2C
- EXCLUDED FROM PHASE 2C
- DEFERRED TO A LATER PHASE
- AMBIGUOUS / REQUIRES PRODUCT DECISION

Items to classify:

- semantic-plan Pydantic models;
- supported semantic operation types;
- dataset, field, relationship, intent and question references;
- registry_version binding;
- validation against current snapshots;
- validation against historical retained snapshots;
- unknown metadata-reference handling;
- unsupported operation handling;
- deterministic error ordering;
- SQL generation;
- SQL execution;
- SQL safety validation;
- authorization;
- runtime routing;
- recipe migration or recipe execution;
- KPI and glossary behavior;
- output templates;
- dynamic suggestions;
- publish and approval workflow;
- rollback;
- deployment;
- public HTTP endpoints;
- persistence or SQL-backed plan storage.

────────────────────────────────────
4. Security and ownership boundaries
────────────────────────────────────

Define the required security contract.

At minimum determine:

- semantic plans must never grant authorization;
- metadata must not grant authorization;
- validation must not expose governed records, payloads, secrets or paths;
- error objects may expose only safe codes and safe identifiers;
- validation must not execute SQL;
- validation must not execute recipes or tools;
- validation must not perform deployment;
- public API compatibility must remain unchanged unless an authoritative
  requirement explicitly says otherwise.

Identify the appropriate ownership boundaries between:

- semantic-plan contract models;
- semantic-plan validator;
- MetadataRegistryService;
- RegistrySnapshotCache;
- future runtime or recipe components.

────────────────────────────────────
5. Produce a Phase 2C contract proposal
────────────────────────────────────

Produce a proposed authoritative Phase 2C contract containing:

1. Objective
2. Included scope
3. Explicit exclusions
4. Typed models required
5. Validator responsibilities
6. Registry and version interaction
7. Deterministic validation rules
8. Safe error contract
9. Strict-on and strict-off behavior
10. Public API compatibility
11. Security boundary
12. Test requirements
13. Acceptance criteria
14. Expected implementation files
15. Expected documentation artifact
16. Proposed branch name
17. Proposed stacked PR base and head
18. Deferred Phase 2D–2G responsibilities

Preferred branch name:

phase2/semantic-plan-contract-validator

Preferred stacked PR:

- base: phase2/service-version-boundary
- head: phase2/semantic-plan-contract-validator
- Draft: yes

────────────────────────────────────
6. Ambiguity handling
────────────────────────────────────

Do not implement code during this task.

If authoritative sources fully define Phase 2C:

- return a requirement-to-source traceability table;
- return a complete implementation plan.

If requirements are incomplete or contradictory:

- identify each ambiguity precisely;
- propose the smallest safe product-owner decision needed;
- do not silently choose a behavior;
- do not begin implementation.

────────────────────────────────────
7. Final response
────────────────────────────────────

Return:

1. Starting branch and SHA verification
2. Exact authoritative Phase 2C sources
3. Exact included scope
4. Exact excluded/deferred scope
5. Requirement-to-source traceability table
6. Proposed typed contract
7. Proposed validator responsibilities
8. Registry-version interaction
9. Security and public-API boundaries
10. Required tests and acceptance criteria
11. Expected files
12. Branch/worktree/stacked-PR plan
13. Ambiguities requiring approval
14. Confirmation that no files, branches, PRs or settings were changed
