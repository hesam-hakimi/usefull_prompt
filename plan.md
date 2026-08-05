Implement Phase 2A only:

Governed Metadata Registry Contract and Strict Seed Validation

Repository:
TD-Enterprise/kmai-td-genie

Phase 1 branch:
phase1/foundation-contracts

Phase 1 stacked PR:
#10

Phase 2 must follow the current authoritative roadmap:

- MASTER_PLAN_V1.md
- PRODUCT_ORDER_AND_BACKLOG.md

Controlling Phase 2 interpretation:

Metadata Registry and Semantic Foundation

This task authorizes implementation of Phase 2A only. Do not begin Phase
2B–2G.

──────────────────────────────────────────────────────────────────────
1. SAFE SOURCE AND BRANCH SETUP
──────────────────────────────────────────────────────────────────────

1. Confirm authenticated GitHub access and fetch origin.

2. Determine the actual current head SHA of:

   phase1/foundation-contracts / PR #10

3. Do not use the user's current dirty `asktd_v2` checkout.

4. Create an isolated clean worktree based on the actual PR #10 head.

5. Create a stacked Phase 2 branch:

   phase2/registry-contracts

6. Record:

- repository;
- source branch;
- source SHA;
- Phase 2 branch;
- working-tree cleanliness;
- relationship to PR #10.

7. Do not modify:

- PR #7;
- PR #9;
- PR #10;
- Phase 0 evidence;
- Phase 1 readiness contracts;
- CODEOWNERS;
- GitHub workflows;
- deployment configuration;
- dependency-remediation files;
- COPILOT_AGENT_EXECUTION_PROMPT.md.

Stop if the clean Phase 1 source cannot be established.

──────────────────────────────────────────────────────────────────────
2. PHASE 2A OBJECTIVE
──────────────────────────────────────────────────────────────────────

Add a typed, versioned, governed metadata registry contract and a strict
validation path for the current local seed files.

Current runtime behavior must remain backward compatible by default.

Phase 2A must prevent invalid governed metadata from silently becoming empty
runtime catalogs.

Do not yet:

- replace existing runtime routing;
- migrate recipes from Python;
- add KPI or glossary behavior;
- add output-template behavior;
- add publish/approval workflows;
- add Azure or SQL-backed registry storage;
- add Databricks, ADLS, Event Hubs, Redis runtime cache, or durable outbox;
- modify frontend response shapes;
- deploy.

──────────────────────────────────────────────────────────────────────
3. DISCOVER CURRENT METADATA SOURCES
──────────────────────────────────────────────────────────────────────

Inspect and inventory the current metadata inputs and loaders, including:

- built_in_questions;
- intent_registry;
- roles;
- sources;
- datasets;
- available-data definitions;
- existing registry JSON/YAML files;
- MetadataRegistryService;
- registry.py loaders;
- current public metadata API responses:
  - GET /api/questions
  - GET /api/roles
  - GET /api/registry

Report the current source of truth and loader behavior before editing.

Identify every case where missing or malformed metadata currently:

- returns an empty collection;
- is silently ignored;
- falls back without evidence;
- permits duplicate or conflicting records.

──────────────────────────────────────────────────────────────────────
4. TYPED REGISTRY CONTRACT
──────────────────────────────────────────────────────────────────────

Create typed domain contracts for a governed registry snapshot.

Prefer Pydantic models or the repository's established typed-model pattern.

The contract must support at least:

RegistrySnapshot

- schema_version
- registry_version
- lifecycle_status
- source/provenance
- owners
- roles
- sources
- datasets
- intents
- questions

Registry-level metadata should distinguish:

- draft
- validated
- approved
- published
- retired

Do not claim approval or publication for current seeds unless evidence exists.

Each governed record must have appropriate typed identifiers and references.

Support at least:

OwnerRecord
RoleRecord
SourceRecord
DatasetRecord
IntentRecord
QuestionRecord
ProvenanceRecord

Use stable IDs as primary references rather than display names.

Do not add secrets, credentials, physical connection strings, private URLs,
tenant IDs, or environment-specific resource identifiers.

──────────────────────────────────────────────────────────────────────
5. VALIDATION RULES
──────────────────────────────────────────────────────────────────────

The strict validator must reject or explicitly report:

- malformed JSON/YAML;
- unsupported schema version;
- invalid registry version;
- duplicate IDs;
- duplicate conflicting names where prohibited;
- missing required owners;
- missing lifecycle status;
- missing provenance;
- unknown role references;
- unknown source references;
- unknown dataset references;
- unknown intent references;
- a question referencing a missing intent;
- a dataset referencing a missing source;
- invalid lifecycle transitions encoded in the snapshot;
- empty required collections;
- unsafe metadata instructions attempting to override:
  - authentication;
  - authorization;
  - privacy;
  - SQL safety;
  - limits;
  - redaction;
  - audit.

Validation output must be deterministic and actionable.

Every error should include:

- safe error code;
- record type;
- safe record ID where available;
- field;
- reason.

Do not include raw sensitive payload values in errors or logs.

──────────────────────────────────────────────────────────────────────
6. STRICT AND LEGACY MODES
──────────────────────────────────────────────────────────────────────

Preserve existing loader/runtime behavior by default.

Add a strict path that can initially operate in one or both of these modes:

- validate-only;
- feature-flagged strict loading.

Use a feature flag such as:

METADATA_REGISTRY_STRICT_ENABLED

Default:

false

When false:

- existing runtime behavior remains unchanged;
- existing public API response shapes remain unchanged.

When true:

- governed seeds must pass strict validation before use;
- invalid governed metadata must fail closed with a safe diagnostic;
- do not silently return an empty governed registry.

Do not remove the existing JSON/YAML loaders in Phase 2A.

──────────────────────────────────────────────────────────────────────
7. CURRENT SEED MIGRATION
──────────────────────────────────────────────────────────────────────

Create the smallest valid governed snapshot or adapter necessary to validate
the current:

- built_in_questions;
- intent_registry;
- related roles/sources/datasets required by those records.

Do not fabricate business owners or approvals.

When ownership, approval, or provenance is unknown, represent it truthfully
using an allowed pending/unknown state if the contract permits it.

Do not mark current content certified or published without evidence.

Preserve:

- current question text;
- current role behavior;
- current intent IDs;
- API ordering where contractually relevant;
- current visible outputs.

──────────────────────────────────────────────────────────────────────
8. API BACKWARD COMPATIBILITY
──────────────────────────────────────────────────────────────────────

The following current response contracts must remain unchanged:

- GET /api/questions
- GET /api/roles
- GET /api/registry

Do not expose richer internal governance fields through existing public APIs
unless the current API already allows them.

Internal models may be richer than public DTOs.

Add contract tests proving the existing public payloads remain compatible.

No Phase 0 API may change.

──────────────────────────────────────────────────────────────────────
9. SECURITY BOUNDARY
──────────────────────────────────────────────────────────────────────

Metadata must never grant authorization.

The registry may describe:

- role applicability;
- dataset requirements;
- intended source;
- business ownership.

But effective access must continue to come from the existing trusted
authorization layer.

Validate that:

- client-supplied metadata cannot change permissions;
- client-selected intent does not bypass authorization;
- unauthorized datasets do not appear in user-visible dynamic metadata;
- metadata instructions cannot disable policy checks;
- registry errors do not leak sensitive configuration.

──────────────────────────────────────────────────────────────────────
10. TESTS
──────────────────────────────────────────────────────────────────────

Add focused tests covering at least:

1. valid current seed snapshot;
2. invalid JSON;
3. unsupported schema version;
4. invalid registry version;
5. duplicate record IDs;
6. duplicate conflicting questions;
7. unknown intent reference;
8. unknown dataset reference;
9. unknown source reference;
10. unknown role reference;
11. missing owner;
12. missing provenance;
13. missing lifecycle status;
14. empty required registry;
15. unsafe instruction rejection;
16. deterministic validation errors;
17. strict mode disabled preserves legacy behavior;
18. strict mode enabled accepts valid seeds;
19. strict mode enabled rejects invalid seeds;
20. `/api/questions` compatibility;
21. `/api/roles` compatibility;
22. `/api/registry` compatibility;
23. authorization filtering remains effective;
24. no sensitive data in validation errors.

Where useful, use temporary files and in-memory fixtures rather than altering
approved seed files during tests.

──────────────────────────────────────────────────────────────────────
11. VALIDATION
──────────────────────────────────────────────────────────────────────

Run:

- focused Phase 2A tests;
- current metadata-registry tests;
- API contract tests;
- authentication tests;
- authorization tests;
- SQL-safety tests where metadata affects candidate selection;
- backend full suite;
- backend coverage;
- offline golden baseline;
- secret-pattern scan;
- git diff --check.

Do not update an approved golden baseline merely to make tests pass.

Report:

| Validation | Command | Passed | Failed | Skipped | Warnings | Coverage |

──────────────────────────────────────────────────────────────────────
12. REVIEW BEFORE COMMIT
──────────────────────────────────────────────────────────────────────

Show:

git status --short
git diff --name-status
git diff --stat
git diff --check

Confirm:

- only Phase 2A files changed;
- no Phase 0 or Phase 1 files were altered unintentionally;
- no public API response shape changed;
- no runtime routing behavior changed by default;
- no Azure/deployment code was added;
- no temporary test output or secrets are included;
- invalid governed metadata no longer silently becomes an empty catalog in
  strict mode;
- legacy compatibility remains available.

──────────────────────────────────────────────────────────────────────
13. COMMIT, PUSH, AND STACKED DRAFT PR
──────────────────────────────────────────────────────────────────────

If all validations pass:

1. Create one focused commit:

   feat: add governed metadata registry contracts

2. Push without force to:

   phase2/registry-contracts

3. Create a Draft stacked PR targeting:

   phase1/foundation-contracts

4. Include this notice in the PR body:

   This is a stacked Phase 2A PR based on Phase 1 PR #10.

   It introduces typed governed metadata contracts and strict local seed
   validation only.

   Existing runtime and public API behavior remain compatible by default.

   It must not be merged into main until its parent PR chain is finalized and
   the branch is rebased onto the approved development base.

5. Keep the PR Draft.
6. Do not merge.
7. Do not deploy.

──────────────────────────────────────────────────────────────────────
14. FINAL REPORT
──────────────────────────────────────────────────────────────────────

Return:

# Phase 2A Registry Contract Result

## Source branch and SHA
## Phase 2 branch and PR
## Current metadata inventory
## Typed contracts added
## Validation rules
## Strict versus legacy behavior
## Seed adaptation
## API compatibility
## Security boundary
## Files changed
## Focused tests
## Full regression results
## Golden-baseline result
## Defects found
## Commit SHA
## Draft PR
## Rollback
## Deferred Phase 2B–2G work

End with:

- Phase 2A implemented: YES/NO
- Current public API shapes preserved: YES/NO
- Legacy runtime remains default: YES/NO
- Strict validation fails closed: YES/NO
- Sensitive metadata exposed: YES/NO
- Safe to continue to Phase 2B: YES/NO
- Safe to deploy: NO
- Safe to merge before parent PR chain: NO
