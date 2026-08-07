Implement the ratified Phase 2C governed metadata hierarchy,
semantic-plan contract, and deterministic validator as a controlled
stacked Draft PR.

This instruction supersedes the previous Phase 2C implementation prompt.

IMPORTANT PRODUCT-OWNER ADDITION:

The governed metadata model must explicitly represent the enterprise
hierarchy:

Product Group
  → Schema
    → Dataset/Table
      → Field

Relationships connect governed datasets/fields.

Phase 2C must establish this structural metadata foundation before later
business-semantic and recipe phases.

────────────────────────────────────
1. Starting point and branch safety
────────────────────────────────────

Current chain:

- PR #10 is merged.
- PR #11:
  branch: phase2/registry-contracts
- PR #12:
  state: OPEN and Draft
  base: phase2/registry-contracts
  head: phase2/service-version-boundary
  final independent acceptance: PASS

Create Phase 2C from exactly:

origin/phase2/service-version-boundary

Branch:

phase2/semantic-plan-contract-validator

Use a new isolated worktree.

Do not use or modify the dirty asktd_v2 checkout.

Do not modify, rebase, merge, force-push, retarget, close, or mark ready
PR #11 or PR #12.

Do not deploy.
Do not begin Phase 2D.

────────────────────────────────────
2. Ratify the Phase 2C ADR first
────────────────────────────────────

Before implementation create the next ADR:

docs/adr/0002-phase2c-governed-semantic-plan-validator.md

Register it in the ADR index and mark it Accepted.

The ADR must explicitly define the governed hierarchy:

ProductGroupRecord
  → SchemaRecord
    → DatasetRecord
      → FieldRecord

RelationshipRecord connects governed datasets and governed fields.

DatasetRecord should continue to represent the repository's table/dataset
concept unless repository evidence proves a separate TableRecord is
required.

Do NOT create both DatasetRecord and TableRecord merely as aliases.

────────────────────────────────────
3. ProductGroupRecord
────────────────────────────────────

Add a first-class governed ProductGroupRecord.

Determine its exact shape from repository evidence and existing naming /
stable-ID conventions.

At minimum it must provide enough safe structural identity to support:

- stable product_group_id;
- safe name/display identity if already supported by metadata conventions;
- lifecycle/provenance/ownership according to existing registry patterns;
- deterministic validation.

Do not put authorization into ProductGroupRecord.

Do not add:

permissions
grants
groups
authorized_users
access_roles
entitlements

Product Group is a metadata/governance hierarchy concept, NOT an
authorization decision.

────────────────────────────────────
4. SchemaRecord
────────────────────────────────────

Add first-class governed SchemaRecord.

A SchemaRecord must:

- have a stable schema_id;
- reference exactly one existing ProductGroupRecord;
- follow existing lifecycle/provenance/ownership conventions;
- fail validation if its product_group_id is unknown.

Do not infer schemas from names at validation time.

────────────────────────────────────
5. DatasetRecord hierarchy
────────────────────────────────────

Extend DatasetRecord only as necessary so every governed dataset/table can
be structurally located within the hierarchy.

A DatasetRecord must be resolvable to:

product_group_id
schema_id
dataset_id

The validator must be able to prove:

- Product Group exists;
- Schema exists;
- Schema belongs to Product Group;
- Dataset exists;
- Dataset belongs to Schema;
- therefore Dataset belongs to Product Group through its Schema.

Do not duplicate hierarchy information unnecessarily if schema_id already
allows Product Group resolution.

Prefer normalized references over repeated denormalized values unless the
existing repository convention requires otherwise.

Preserve backward compatibility with existing Phase 2A seeds where
possible.

If existing seeds do not contain Product Group / Schema information,
provide an explicit deterministic seed-adaptation strategy.

Do not fabricate business meaning from table names.

────────────────────────────────────
6. FieldRecord
────────────────────────────────────

Add first-class governed FieldRecord.

Each FieldRecord must:

- have a stable field_id;
- reference an existing dataset_id;
- have only the structural metadata necessary for Phase 2C;
- preserve safe existing datatype/metadata information where authoritative;
- use Pydantic v2 strict/frozen patterns consistent with Phase 2A.

The Registry validator must reject:

- unknown dataset;
- duplicate field_id;
- field referencing a nonexistent dataset.

Do not add KPI semantics or business calculations to FieldRecord.

────────────────────────────────────
7. RelationshipRecord
────────────────────────────────────

Add first-class governed RelationshipRecord.

Derive the exact contract from repository metadata evidence.

It must be sufficient to validate:

- source dataset exists;
- target dataset exists;
- source field belongs to source dataset;
- target field belongs to target dataset;
- relationship has a stable relationship_id;
- joins reference an explicitly governed relationship.

Relationships may cross Schemas only when explicitly represented by a
RelationshipRecord.

Do not infer cross-schema relationships.

Relationships across Product Groups must also never be inferred.

If an explicit governed relationship exists across Product Groups,
Phase 2C may validate its structural existence only.

It must NOT interpret that relationship as authorization to access both
Product Groups.

Authorization remains a separate runtime/AuthZ responsibility.

────────────────────────────────────
8. Structural hierarchy validation
────────────────────────────────────

Extend deterministic RegistrySnapshot validation to check:

ProductGroupRecord
SchemaRecord
DatasetRecord
FieldRecord
RelationshipRecord

Required referential integrity:

ProductGroup exists
→ Schema belongs to ProductGroup
→ Dataset belongs to Schema
→ Field belongs to Dataset
→ Relationship endpoints belong to their declared datasets

Errors must remain deterministic and safe.

No raw metadata payload should appear in validation errors.

────────────────────────────────────
9. GovernedSemanticPlan
────────────────────────────────────

Preserve the existing runtime SemanticQueryPlan unchanged.

Create a separate internal Pydantic v2 model:

GovernedSemanticPlan

It must be able to reference structural scope using safe IDs such as:

product_group_refs
schema_refs
candidate_dataset_refs
selected_dataset_refs
field_refs
relationship_refs

Use only the fields actually required by the repository architecture.

Do not force all plans to repeat redundant hierarchy references.

For example, if selected_dataset_refs deterministically resolves Schema and
Product Group, explicit schema/product-group references may be optional.

Document the chosen normalization rule.

The plan must bind to:

registry_version

Never use legacy metadata()["version"] as the governed version.

────────────────────────────────────
10. Semantic-plan validator
────────────────────────────────────

The Phase 2C validator must be able to prove that a proposed plan references
a valid governed structural graph.

Validate:

- referenced Product Groups exist;
- referenced Schemas exist;
- Schema/Product Group relationships are valid;
- datasets exist;
- datasets belong to referenced Schemas;
- fields exist;
- fields belong to referenced datasets;
- relationships exist;
- relationships connect the referenced datasets/fields;
- joins use explicitly governed relationships;
- grain references point to governed fields;
- time-field references point to governed fields;
- selected datasets are within candidate datasets;
- registry_version is current or retained and valid.

Validation must support current and retained Phase 2B RegistrySnapshots.

────────────────────────────────────
11. What Phase 2C MUST NOT solve
────────────────────────────────────

Explicitly exclude all business-semantic interpretation such as:

- what "Loan" means;
- which products count as loans;
- Mortgage vs Auto Loan vs Personal Loan taxonomy;
- canonical account status mapping;
- Active/Closed/Delinquent business semantics;
- outstanding balance definition;
- customer/entity resolution;
- cross-system deduplication rules;
- KPI formulas;
- business glossary;
- choosing which datasets should answer a natural-language question;
- union/aggregation strategy;
- approved multi-source query recipes;
- SQL generation;
- SQL execution.

These belong to later phases.

────────────────────────────────────
12. Ratified later-phase ownership
────────────────────────────────────

Phase 2D:
Metadata-backed approved recipe pilot.

Examples of future responsibility:

- validated plan → approved recipe;
- controlled multi-table / multi-source query strategy;
- approved join/union/aggregation recipe.

Phase 2E:
Business semantic foundation.

Includes:

- Product taxonomy;
- KPI definitions;
- Business Glossary;
- canonical statuses;
- definitions such as "Outstanding Loan Amount";
- semantic mappings between business concepts and governed metadata.

Phase 2F:
Output templates and dynamic suggestions.

Phase 2G:
Local publish / validation / dry-run / rollback workflow.

Runtime agent routing, production SQL-backed persistence and deployment
remain outside Phase 2.

────────────────────────────────────
13. Important future-use example
────────────────────────────────────

Use this example only to validate architectural completeness.
Do NOT implement its business logic in Phase 2C.

Future question:

"What is Person A's total loan amount?"

The architecture will eventually need to support:

Business concept:
Loan

Potential products:
Mortgage
Auto Loan
Personal Loan
Line of Credit
...

Potentially multiple:
Product Groups
Schemas
Datasets
Systems
Statuses

Phase 2C responsibility is ONLY to provide a governed structural metadata
graph so that a later approved plan/recipe can safely reference:

Product Group
→ Schema
→ Dataset
→ Field
→ Relationship

Phase 2C must not decide:

- which loan products are included;
- which statuses count;
- how balances are calculated;
- how records across systems are deduplicated;
- how Person A is resolved across systems;
- which datasets should be unioned;
- the resulting SQL.

Those decisions belong to Phase 2D/2E and later runtime components.

────────────────────────────────────
14. Security boundary
────────────────────────────────────

The hierarchy is not authorization.

Explicitly preserve:

Metadata existence != User access.

The validator may confirm:

"This Dataset belongs to this Schema/Product Group."

It may NOT conclude:

"The user is therefore allowed to query it."

Do not introduce authorization fields into:

ProductGroupRecord
SchemaRecord
DatasetRecord
FieldRecord
RelationshipRecord
GovernedSemanticPlan

Candidate datasets may later be supplied by an AuthZ-filtered upstream
component, but Phase 2C does not grant or certify access.

────────────────────────────────────
15. Required tests
────────────────────────────────────

Add focused tests for the hierarchy.

Product Groups:
- valid ProductGroupRecord;
- duplicate stable ID;
- invalid contract;
- no authorization fields.

Schemas:
- valid Schema → Product Group;
- unknown Product Group;
- duplicate Schema ID.

Datasets:
- valid Dataset → Schema;
- unknown Schema;
- deterministic hierarchy resolution.

Fields:
- valid Field → Dataset;
- unknown Dataset;
- duplicate Field ID.

Relationships:
- valid relationship;
- unknown dataset;
- unknown field;
- field/dataset mismatch;
- cross-schema relationship works only when explicitly governed;
- no inferred relationship;
- reordered records preserve deterministic results.

Semantic plan:
- valid Product Group/Schema/Dataset/Field graph;
- unknown Product Group;
- unknown Schema;
- Dataset/Schema mismatch;
- Schema/ProductGroup mismatch;
- unknown Field;
- unknown Relationship;
- invalid relationship endpoint;
- valid current registry version;
- valid historical retained registry version;
- strict-off fail-closed;
- deterministic ordered errors.

Security:
- hierarchy metadata never grants authorization;
- no public API leak;
- errors contain no governed payload or sensitive data.

Compatibility:
- existing Phase 2A tests pass;
- Phase 2B tests pass;
- existing SemanticQueryPlan behavior unchanged;
- existing public APIs unchanged;
- golden baseline unchanged.

────────────────────────────────────
16. Verification gates
────────────────────────────────────

Run:

- Phase 2C contract tests;
- Phase 2C validator tests;
- registry hierarchy tests;
- Phase 2A registry tests;
- Phase 2B cache/version tests;
- metadata registry service tests;
- existing semantic-model/recipe tests;
- API route and serialization tests;
- deterministic ordering tests;
- golden baseline;
- full backend suite;
- coverage gate;
- git diff --check;
- approved secret scanner if locally available;
- otherwise labelled pattern-based fallback.

Report all skips and whether they are pre-existing.

────────────────────────────────────
17. Draft stacked PR
────────────────────────────────────

After all tests pass:

Commit only to:

phase2/semantic-plan-contract-validator

Push normally, never force.

Create Draft PR:

base:
phase2/service-version-boundary

head:
phase2/semantic-plan-contract-validator

Keep it Draft.

PR body must clearly state:

BLOCKED BY PR #12
TRANSITIVELY BLOCKED BY PR #11
MUST NOT BE MERGED OR DEPLOYED

Also state:

- ProductGroupRecord and SchemaRecord added;
- Dataset/Field/Relationship structural hierarchy added;
- hierarchy does not grant authorization;
- business taxonomy/KPI/glossary not implemented;
- loan/business calculation logic not implemented;
- runtime path remains unchanged;
- no SQL/routing/recipe execution/public API added.

Do not start Phase 2D.

────────────────────────────────────
18. Final response
────────────────────────────────────

Return:

1. Overall result
2. Starting SHAs
3. ADR path
4. ProductGroupRecord contract
5. SchemaRecord contract
6. Dataset/Field/Relationship hierarchy
7. GovernedSemanticPlan changes
8. Validator behavior
9. Security/AuthZ boundary
10. Exact files changed
11. Tests, skips and coverage
12. Draft PR number/URL/base/head/SHA
13. Blockers or assumptions
14. Confirmation that later business semantics remain deferred
15. Confirmation that parent branches/PRs, dirty checkout, public APIs,
    deployment and Phase 2D+ were untouched
