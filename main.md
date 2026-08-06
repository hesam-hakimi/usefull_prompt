Implement the ratified Phase 2C governed semantic-plan contract and
deterministic validator as a controlled stacked Draft PR.

This instruction is the authoritative product-owner decision for Phase 2C.

Current chain:

- PR #10 has been merged.
- PR #11:
  branch: phase2/registry-contracts
  current base: main
- PR #12:
  state: OPEN and Draft
  base: phase2/registry-contracts
  head: phase2/service-version-boundary
  final independent acceptance verdict: PASS

Phase 2C must be stacked on the accepted Phase 2B branch.

Do not use, clean, reset, stash, or modify the dirty asktd_v2 checkout.

Do not modify, merge, rebase, force-push, retarget, close, or mark ready:

- PR #11
- PR #12
- phase2/registry-contracts
- phase2/service-version-boundary

Do not deploy anything.
Do not begin Phase 2D or any later phase.

────────────────────────────────────
1. Verify the starting point
────────────────────────────────────

Fetch origin and verify:

- origin/phase2/registry-contracts exists;
- origin/phase2/service-version-boundary exists;
- origin/phase2/registry-contracts is an ancestor of
  origin/phase2/service-version-boundary;
- PR #12 is OPEN and Draft;
- PR #12 base is phase2/registry-contracts;
- PR #12 head is phase2/service-version-boundary;
- the remote Phase 2B head matches its accepted commit;
- the isolated Phase 2B worktree is clean.

Record all verified SHAs.

If ancestry is incorrect, stop and report it. Do not repair parent branches.

────────────────────────────────────
2. Create the Phase 2C worktree
────────────────────────────────────

Create a new isolated worktree and branch starting exactly from:

origin/phase2/service-version-boundary

Branch:

phase2/semantic-plan-contract-validator

Suggested worktree:

/tmp/kmai-phase2c-semantic-plan-contract-validator

Do not create the branch from main or from phase2/registry-contracts.

────────────────────────────────────
3. Record the authoritative Phase 2C decision
────────────────────────────────────

Before implementing code, create the next correctly numbered ADR:

docs/adr/0002-phase2c-governed-semantic-plan-validator.md

Register it in the ADR index.

Mark it Accepted.

The ADR must explicitly state that Phase 2C includes:

- an internal governed semantic-plan Pydantic contract;
- deterministic structural and registry-bound validation;
- mandatory registry_version binding;
- validation against current and retained historical snapshots;
- dataset, source, intent, question, field and relationship references;
- safe deterministic validation errors;
- strict-on and strict-off behavior;
- additive FieldRecord and RelationshipRecord registry support;
- preservation of all public API shapes;
- preservation of the existing runtime path.

The ADR must explicitly exclude:

- runtime routing;
- model routing;
- SQL generation;
- SQL execution;
- SQL safety execution;
- recipe migration or execution;
- KPI and glossary records or behavior;
- output-template behavior;
- dynamic suggestions;
- publish or approval workflows;
- rollback;
- deployment;
- public HTTP endpoints;
- persistent or SQL-backed plan storage;
- authorization decisions.

Record the later phase allocation:

- Phase 2D: metadata-backed recipe pilot
- Phase 2E: KPI/glossary foundation
- Phase 2F: output templates and dynamic suggestions
- Phase 2G: local publish, dry-run and rollback workflow

Runtime routing, SQL-backed persistence and deployment remain outside
Phase 2.

Do not modify unrelated planning documents.

────────────────────────────────────
4. Preserve the existing SemanticQueryPlan
────────────────────────────────────

Inspect the existing SemanticQueryPlan implementation.

It is part of the current recipe/runtime path and must not be replaced,
renamed, migrated or behaviorally changed in Phase 2C.

Create a separate internal Pydantic v2 contract named:

GovernedSemanticPlan

The ADR should explain that GovernedSemanticPlan implements the roadmap's
governed SemanticQueryPlan concept without changing the legacy runtime
SemanticQueryPlan.

No runtime component should begin consuming GovernedSemanticPlan in this
phase.

────────────────────────────────────
5. Extend the governed RegistrySnapshot
────────────────────────────────────

Phase 2C is authorized to add first-class governed records for:

- FieldRecord
- RelationshipRecord

Do not add:

- KPIRecord
- GlossaryRecord
- template records
- recipe records
- authorization records

Derive the exact FieldRecord and RelationshipRecord shapes from existing
repository metadata sources, relationship metadata, plans and stable-ID
conventions.

Do not invent unstable identifiers.

At minimum, the resulting records must make it possible to validate:

- a field belongs to a dataset;
- a referenced dataset exists;
- a relationship connects known datasets;
- relationship field references point to known fields;
- a join references a governed relationship;
- grain and time-field references point to governed fields.

Requirements:

- stable deterministic IDs;
- Pydantic extra="forbid";
- frozen/immutable contracts consistent with Phase 2A;
- deterministic duplicate detection;
- deterministic error ordering;
- referential integrity;
- safe lifecycle and provenance behavior consistent with the existing
  registry;
- additive backward compatibility for existing seed inputs;
- no public API exposure;
- no metadata-based authorization fields.

If repository evidence cannot establish stable IDs or relationship
endpoints, stop before inventing them and report the exact blocker.

Update schema_version only if required by the repository's established
schema-version policy. Do not invent a migration policy.

────────────────────────────────────
6. GovernedSemanticPlan contract
────────────────────────────────────

Create the contract following repository conventions, preferably at:

src/backend/app/semantic_plan_contract.py

Use strict Pydantic v2 models with:

- extra="forbid";
- bounded strings and collections;
- immutable/frozen models where appropriate;
- deterministic serialization;
- safe identifier validation.

The contract must include, as needed:

- plan_id;
- schema_version;
- registry_version;
- request_id or opaque request_context_ref;
- semantic operation;
- optional governed intent reference;
- candidate dataset references;
- selected dataset and source references;
- field references;
- relationship/join references;
- typed filter predicates;
- grain references;
- typed time-window references;
- output intent;
- bounded limits;
- bounded confidence;
- ambiguity reasons or clarification requirements.

Do not include:

- raw user question or prompt;
- conversation transcript;
- user identity;
- group claims;
- authorization mappings;
- permission decisions;
- SQL text;
- SQL fragments;
- arbitrary executable expressions;
- tool calls;
- secrets;
- filesystem paths;
- deployment information;
- KPI or glossary references in this schema version.

Use an opaque request reference rather than raw user text.

Filter models may contain only typed operators and safe bounded primitive
values or opaque value references. Errors must never echo filter values.

────────────────────────────────────
7. Operation and output taxonomy
────────────────────────────────────

Do not blindly copy the proposed enum values from the planning report.

Inspect existing canonical intent, route and output values.

Reuse existing authoritative values where possible.

Keep these concepts separate:

- semantic operation;
- governed intent reference;
- output intent;
- future runtime route.

Phase 2C must not define runtime agent routing.

Do not add KPI-definition or glossary-definition behavior in this phase.

If no authoritative operation taxonomy exists, introduce only the smallest
documented Phase 2C enum required for:

- analytical answer;
- clarification;
- report;
- visualization;
- metadata definition;
- out-of-scope.

Do not include a value whose behavior belongs to Phase 2D–2G.

────────────────────────────────────
8. Validator responsibilities
────────────────────────────────────

Create an internal validator following repository conventions, preferably:

src/backend/app/semantic_plan_validator.py

The validator must:

1. Perform strict structural validation.

2. Bind every governed plan to RegistrySnapshot.registry_version.

3. Never use legacy metadata()["version"] as the governed version.

4. Resolve:
   - the current governed snapshot;
   - a retained historical snapshot through snapshot_for_version().

5. Fail safely for:
   - strict mode disabled;
   - unknown registry version;
   - expired registry version;
   - malformed plan;
   - unsupported semantic operation;
   - missing required reference;
   - unknown dataset;
   - unknown source;
   - unknown intent;
   - unknown question;
   - unknown field;
   - unknown relationship;
   - field/dataset mismatch;
   - invalid relationship endpoints;
   - join not supported by the governed relationship;
   - invalid grain reference;
   - invalid time-field reference;
   - invalid limit;
   - invalid confidence;
   - unsupported Phase 2D–2G capability.

6. Validate referential integrity:

   - fields belong to their governed datasets;
   - relationships connect existing datasets;
   - relationship fields belong to their respective datasets;
   - selected datasets are within candidate dataset references;
   - joins reference governed relationships;
   - grain and time references use known fields.

7. Produce deterministic ordered errors.

Recommended ordering key:

(field_path, code, record_type, record_id)

Use repository conventions if an equivalent deterministic rule already
exists.

8. Return a typed immutable validation result containing:

- valid;
- ordered errors;
- ordered warnings;
- resolved registry_version;
- validation mode.

9. Never:

- execute SQL;
- generate SQL;
- execute a recipe;
- call a model;
- route to an agent;
- call tools;
- deploy;
- publish;
- alter metadata;
- grant or infer authorization.

────────────────────────────────────
9. Authorization boundary
────────────────────────────────────

The validator is not an authorization engine.

Candidate datasets may have been filtered by an upstream authorization
layer, but Phase 2C must not certify that they are authorized.

Do not name a field "authorized_datasets" unless it represents an opaque
input produced by the real authorization layer and the validator does not
trust or grant it.

Prefer:

candidate_dataset_refs

The validator may verify that candidates exist in the governed snapshot,
but it must not grant access or treat metadata presence as permission.

Downstream runtime components must perform their own authorization checks
when they are implemented.

Do not add fields such as:

- permissions
- grants
- authorized
- allowed_access
- group_mappings
- access_roles

to the governed plan or metadata records.

────────────────────────────────────
10. Strict-mode behavior
────────────────────────────────────

Strict mode enabled:

- structural validation is available;
- current and retained snapshot validation is available;
- registry_version binding is mandatory;
- all metadata references are validated.

Strict mode disabled:

- Pydantic construction and pure structural validation may run;
- registry-bound validation must fail closed;
- use a safe typed code such as:
  semantic_plan_registry_strict_mode_disabled;
- do not fabricate a registry_version;
- do not fall back to legacy metadata()["version"];
- public legacy metadata APIs remain unchanged.

────────────────────────────────────
11. Safe error contract
────────────────────────────────────

Create typed immutable validation errors.

Errors may expose only safe values such as:

- code;
- plan_id;
- registry_version;
- field_path;
- record_type;
- safe record_id.

Errors must not expose:

- governed record contents;
- raw user text;
- filter values;
- result rows;
- SQL text;
- prompts;
- model output;
- filesystem paths;
- metadata file paths;
- secrets;
- authorization mappings;
- group claims;
- payload dumps;
- traceback internals.

Error ordering must remain stable regardless of input collection order.

────────────────────────────────────
12. Public API compatibility
────────────────────────────────────

Phase 2C is internal-only.

Do not add or modify HTTP endpoints.

Confirm the shapes and behavior remain unchanged for:

- /api/questions
- /api/registry
- /api/roles
- metadata()
- existing authentication and authorization APIs

Do not expose:

- GovernedSemanticPlan;
- RegistrySnapshot;
- validation results;
- field records;
- relationship records

through public serialization.

Do not modify api.py unless an unrelated import-only necessity is proven;
prefer no api.py change.

────────────────────────────────────
13. Required tests
────────────────────────────────────

Add focused tests for:

Contract behavior:

- extra fields forbidden;
- enums bounded;
- identifiers validated;
- confidence boundaries;
- limit boundaries;
- no raw SQL or arbitrary expression fields;
- no raw user-prompt field;
- immutable/frozen behavior;
- stable serialization.

Registry extension:

- valid field records;
- valid relationship records;
- duplicate field IDs;
- duplicate relationship IDs;
- unknown dataset reference;
- unknown field reference;
- invalid relationship endpoints;
- deterministic error order;
- existing Phase 2A seeds remain compatible;
- no authorization fields;
- no public API leak.

Validator:

- valid current-version plan;
- valid retained historical-version plan;
- unknown version;
- expired version;
- strict-off fail-closed;
- unknown dataset/source/intent/question;
- unknown field;
- unknown relationship;
- field belongs to wrong dataset;
- invalid relationship join;
- invalid grain field;
- invalid time field;
- selected dataset outside candidates;
- invalid limits;
- invalid confidence;
- unsupported operation;
- deterministic errors across reordered inputs;
- errors contain no governed content or sensitive values;
- validator does not execute SQL, recipes, models, tools or deployment;
- validator does not grant authorization.

Compatibility:

- existing SemanticQueryPlan path unchanged;
- current recipe behavior unchanged;
- Phase 2A tests pass;
- Phase 2B tests pass;
- public API route and serialization tests pass;
- golden baseline remains unchanged.

────────────────────────────────────
14. Verification gates
────────────────────────────────────

Run:

1. Phase 2C contract tests;
2. Phase 2C validator tests;
3. registry contract tests;
4. metadata registry service tests;
5. registry cache tests;
6. Phase 2B service-version-boundary tests;
7. existing semantic-model and recipe tests;
8. API route and serialization compatibility tests;
9. deterministic-order tests repeatedly;
10. golden-baseline tests;
11. full backend suite;
12. coverage gate;
13. git diff --check;
14. repository-approved secret scanner, if locally available;
15. otherwise a clearly labelled pattern-based tracked-file fallback.

Report all skips and whether they are pre-existing.

Running tests must leave the worktree clean.

────────────────────────────────────
15. Commit and Draft PR
────────────────────────────────────

After all gates pass:

- commit only to phase2/semantic-plan-contract-validator;
- push using a normal non-force push;
- open a Draft stacked PR:

  base: phase2/service-version-boundary
  head: phase2/semantic-plan-contract-validator

Suggested title:

Phase 2C: governed semantic-plan contract and validator
(stacked on PR #12)

The PR body must state:

- BLOCKED BY PR #12;
- TRANSITIVELY BLOCKED BY PR #11;
- MUST NOT BE MERGED OR DEPLOYED;
- Phase 2C is internal-only;
- existing runtime SemanticQueryPlan is unchanged;
- no SQL, routing, recipe execution, public API or authorization behavior
  was introduced;
- FieldRecord and RelationshipRecord are the only registry record types
  added;
- KPI/glossary behavior is deferred to Phase 2E;
- exact tests and coverage results.

Do not mark ready for review.
Do not merge.
Do not deploy.
Do not begin Phase 2D.

────────────────────────────────────
16. Final response
────────────────────────────────────

Return:

1. Overall result: PASS, PASS WITH CONDITIONS, PARTIAL or FAIL
2. Verified starting SHAs
3. ADR path and scope decision
4. Exact registry extensions
5. GovernedSemanticPlan contract
6. Validator behavior
7. Strict-on and strict-off behavior
8. Authorization and security boundary
9. Exact files changed
10. Exact test commands, pass/fail/skip counts and coverage
11. Draft PR number, state, base, head, SHA and URL
12. Assumptions or blockers
13. Deferred Phase 2D–2G scope
14. Confirmation that the push was non-force
15. Confirmation that parent branches, parent PRs, dirty checkout, public
    APIs, deployment files and existing runtime behavior were untouched
