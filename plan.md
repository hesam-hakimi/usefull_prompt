Perform the final independent acceptance audit of Phase 2C / Draft PR #14.

You did not implement Phase 2C.

This is strictly read-only.

Do not modify files, commit, push, rebase, merge, retarget, mark ready,
change PR metadata, deploy, or start Phase 2D.

Use the isolated Phase 2C worktree.
Do not use or modify the dirty asktd_v2 checkout.

Expected state:

PR #14
base: phase2/service-version-boundary
head: phase2/semantic-plan-contract-validator
state: OPEN + Draft

Implementation report:
830 passed / 3 pre-existing skipped
coverage: 86.46%

────────────────────────────────────
1. Verify Git / PR state
────────────────────────────────────

Fetch origin and independently verify:

- PR #14 state/base/head/SHA
- origin/phase2/service-version-boundary is an ancestor of the Phase 2C head
- Phase 2C worktree is clean
- PR #11 and PR #12 are untouched
- no force push occurred
- no Phase 2D+ work exists

────────────────────────────────────
2. Reconcile the exact diff
────────────────────────────────────

Compare exactly:

origin/phase2/service-version-boundary
to
origin/phase2/semantic-plan-contract-validator

Report:

- every changed path
- A/M/D/R status
- additions/deletions
- purpose

Reconcile why the implementation report says:

6 files / +1455 / all additive

while the editor showed:

7 files / +1534 / -7

Do not accept an unexplained discrepancy.

────────────────────────────────────
3. Verify the hierarchy invariant
────────────────────────────────────

The intended governed hierarchy is:

ProductGroup
→ Schema
→ Dataset
→ Field

Relationships connect governed datasets/fields.

Inspect DatasetRecord and registry validation carefully.

Determine whether a governed RegistrySnapshot can contain:

- DatasetRecord(schema_id=None)
- a Dataset referencing no Schema
- a Schema referencing no ProductGroup

The product requirement is:

Every dataset in a canonical governed snapshot must resolve to exactly one
Schema, and every Schema must resolve to exactly one ProductGroup.

Legacy input may lack hierarchy information, but it must be adapted before
becoming the canonical governed snapshot.

The deterministic legacy fallback may use:

product_group:unassigned
schema:unassigned

but `None` must not allow the canonical hierarchy invariant to be bypassed.

Classify current behavior:

PASS
or
FAIL / NEEDS CORRECTION

Do not change it during this audit.

────────────────────────────────────
4. Verify unassigned migration semantics
────────────────────────────────────

Confirm that product_group:unassigned and schema:unassigned are only a
backward-compatibility migration adapter.

They must not be treated as real discovered business metadata.

Confirm:

- no inference from dataset/table names occurs
- actual future onboarding can replace them with authoritative Product
  Group and Schema records
- validator treats explicit real hierarchy normally
- no special authorization behavior is attached to unassigned records

────────────────────────────────────
5. Registry-version identity audit
────────────────────────────────────

This is critical.

The implementation report states that registry_version is still derived
from the original two seed files.

But the governed RegistrySnapshot now contains additional derived or
onboarded structural content:

- product_groups
- schemas
- fields
- relationships

Determine whether two semantically different governed snapshots could ever
receive the same registry_version.

Explicitly test/reason about:

A. Same seed files but different hierarchy records
B. Same datasets but different ProductGroup assignment
C. Same datasets but different Schema assignment
D. Different FieldRecords
E. Different RelationshipRecords
F. A future change to seed-adaptation logic with the same seed files

The Phase 2B contract says registry_version is the authoritative governed
snapshot identity.

Therefore determine whether current version computation still satisfies
that contract.

Return:

PASS
or
FAIL / VERSION CONTRACT NEEDS CORRECTION

Do not silently redefine registry_version.

────────────────────────────────────
6. ProductGroup and Schema governance contract
────────────────────────────────────

Verify ProductGroupRecord and SchemaRecord against ADR 0002 and existing
registry conventions.

Check whether they appropriately support:

- stable IDs
- ownership/governance stewardship
- lifecycle where required by the registry model
- provenance where required by the registry model
- extra="forbid"
- immutability
- deterministic duplicate validation

Explain explicitly whether lifecycle/provenance are record-level,
snapshot-level, or intentionally omitted.

Flag any inconsistency rather than guessing.

────────────────────────────────────
7. Field governance metadata decision
────────────────────────────────────

Inspect existing repository metadata sources and contracts for evidence of:

- data classification
- security classification
- PII indicators
- PCI indicators
- sensitivity classification
- datatype
- business/technical descriptions

Distinguish carefully:

Authorization metadata:
permissions, grants, user/group access, entitlements
→ MUST remain outside FieldRecord.

Governance/classification metadata:
PII, PCI, security/sensitivity classification
→ these are NOT authorization by themselves.

Determine whether authoritative repository evidence supports retaining
governance/classification attributes on FieldRecord or related governed
metadata.

Return one of:

A. INCLUDE NOW IN PHASE 2C
B. EXPLICITLY DEFER TO A GOVERNANCE METADATA PHASE
C. NO AUTHORITATIVE SOURCE EXISTS YET

Do not invent classification fields.

But do not incorrectly classify PII/PCI/security classification as AuthZ.

────────────────────────────────────
8. ProductGroup / Schema / Dataset validation
────────────────────────────────────

Verify deterministic referential integrity for:

- duplicate ProductGroup ID
- duplicate Schema ID
- unknown ProductGroup
- Dataset → Schema
- Schema → ProductGroup
- Field → Dataset
- Relationship → datasets
- Relationship fields → their declared datasets
- cross-Schema relationship only when explicitly governed
- cross-ProductGroup relationship only when explicitly governed
- no relationship inference

Verify error ordering is deterministic and error payloads are safe.

────────────────────────────────────
9. GovernedSemanticPlan audit
────────────────────────────────────

Verify:

- existing runtime SemanticQueryPlan is untouched
- GovernedSemanticPlan is internal-only
- registry_version is mandatory
- candidate/selected dataset semantics are correct
- hierarchy references cannot contradict dataset-derived hierarchy
- selected datasets must be within candidate datasets
- field/relationship references are in scope
- current and retained Phase 2B snapshots are supported
- strict-off fails closed
- legacy metadata()["version"] is never substituted

Confirm the plan contains no:

- raw prompt/question
- SQL
- arbitrary expressions
- authorization mappings
- group claims
- secrets
- executable tool instructions

────────────────────────────────────
10. Public API / AuthZ boundary
────────────────────────────────────

Verify:

Metadata existence != user access.

No ProductGroup, Schema, Dataset, Field or Relationship record grants
authorization.

Confirm no public endpoint or public response shape changed for:

/api/questions
/api/roles
/api/registry
metadata()

Confirm no hierarchy data leaks publicly unless it was already part of the
existing contract.

────────────────────────────────────
11. Independent tests
────────────────────────────────────

Run:

- Phase 2C hierarchy tests
- semantic-plan contract tests
- Phase 2A registry tests
- Phase 2B cache/version tests
- metadata-registry service tests
- existing semantic-model/recipe tests
- public API compatibility tests
- deterministic-order tests repeatedly
- cross-Schema and cross-ProductGroup relationship tests
- strict-off tests
- golden baseline
- full backend suite
- coverage gate
- git diff --check

Repeat the known concurrency test enough to determine whether Phase 2C
introduced any regression.

Report exact counts and all skips.

Do not install an unapproved security scanner.

────────────────────────────────────
12. Final verdict
────────────────────────────────────

Return:

1. Overall verdict:
   PASS
   PASS WITH CONDITIONS
   PARTIAL
   FAIL

2. Verified PR #14 state/base/head/SHA
3. Exact changed-file inventory
4. Explanation of 6-vs-7 file discrepancy
5. Hierarchy invariant verdict
6. Legacy unassigned-adapter verdict
7. registry_version identity verdict
8. ProductGroup/Schema governance findings
9. PII/PCI/security-classification recommendation
10. Dataset/Field/Relationship findings
11. GovernedSemanticPlan findings
12. Security/AuthZ/public API findings
13. Exact tests/skips/coverage
14. Required corrections before Phase 2D
15. Confirmation that this audit changed nothing

Phase 2D may start only if the overall verdict is exactly PASS.
