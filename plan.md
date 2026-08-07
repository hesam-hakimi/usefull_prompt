Remediate the Phase 2C final acceptance audit failures before Phase 2D.

Current status:
- Phase 2C Draft PR #14
- base: phase2/service-version-boundary
- head: phase2/semantic-plan-contract-validator
- independent acceptance verdict: FAIL
- Phase 2D MUST NOT start.

Important:
Some findings affect the Phase 2B registry-version/cache contract.
Do not hide a parent-contract defect inside Phase 2C.

First determine correct ownership of each fix:
- Phase 2B-owned fixes must be made on phase2/service-version-boundary / PR #12.
- Phase 2C-owned fixes must be made on phase2/semantic-plan-contract-validator / PR #14.
- After any parent fix, safely rebase/update Phase 2C and rerun all gates.

Do not modify the dirty asktd_v2 checkout.
Do not deploy.
Do not merge.
Do not mark PRs ready.
Never force-push unless explicitly stopped and approved.

────────────────────────────────────
1. Reproduce the audit findings first
────────────────────────────────────

Read the final Phase 2C acceptance audit and independently reproduce:

A. DatasetRecord(schema_id=None) can bypass canonical hierarchy.
B. registry_version does not identify the complete governed snapshot.
C. product_group_refs may contradict dataset-derived Product Groups.
D. grain_field_refs/time_field_refs are existence-checked but not
   sufficiently dataset-scoped.
E. no dedicated cross-ProductGroup relationship test.
F. registry-cache concurrency test is flaky and caused the full suite to
   finish non-green.

Do not edit anything until each finding is reproduced.

────────────────────────────────────
2. Enforce the canonical governed hierarchy
────────────────────────────────────

Ratified invariant:

Every canonical governed DatasetRecord must resolve to exactly one
SchemaRecord.

Every SchemaRecord must resolve to exactly one ProductGroupRecord.

Therefore every canonical governed dataset must resolve to exactly one:

ProductGroup → Schema → Dataset

DatasetRecord(schema_id=None) must NOT be valid inside a canonical
governed RegistrySnapshot.

Legacy/raw inputs without hierarchy are allowed only before canonical
snapshot construction.

The legacy adapter must deterministically convert them to:

product_group:unassigned
schema:unassigned

before canonical validation.

Do not infer Product Group or Schema from table/dataset names.

Update ADR 0002 to distinguish:

raw/legacy input
→ deterministic adaptation
→ canonical governed snapshot

Add tests proving:
- raw legacy input can be adapted;
- canonical DatasetRecord without schema is rejected;
- every canonical dataset resolves to one schema and one Product Group;
- unknown schema fails;
- schema with unknown Product Group fails;
- unassigned is an adapter fallback, not discovered business metadata.

────────────────────────────────────
3. Correct authoritative registry-version identity
────────────────────────────────────

This finding belongs conceptually to Phase 2B.

registry_version is the authoritative governed snapshot identity.

It must change whenever governed semantic snapshot content changes,
including as applicable:

- ProductGroup records
- Schema records
- Dataset records
- Field records
- Relationship records
- owners/roles/sources
- intents/questions
- lifecycle-relevant governed content

It must not depend only on the original two seed file bytes.

Design the correction at the Phase 2B boundary so future additive governed
collections automatically participate in canonical identity where
appropriate.

Requirements:

- deterministic across processes/checkouts;
- canonical ordering using stable record IDs;
- independent of input collection ordering;
- excludes documented runtime-only values such as imported timestamps;
- no filesystem paths or environment-specific values;
- no public content_hash field;
- registry_version remains the external authoritative identity;
- same semantic snapshot => same registry_version;
- changed semantic snapshot => different registry_version.

Do NOT silently change this only inside Phase 2C.

If the clean fix requires modifying PR #12:
- implement and test it on phase2/service-version-boundary;
- push normally;
- keep PR #12 Draft;
- then update/rebase Phase 2C onto the corrected Phase 2B head;
- rerun all Phase 2B and Phase 2C gates.

Update ADR 0001 and/or ADR 0002 as appropriate so the version contract is
explicit.

Add tests for:
- reordered equivalent content gives same version;
- ProductGroup assignment change changes version;
- Schema assignment change changes version;
- Field change changes version;
- Relationship change changes version;
- semantic content change changes version;
- runtime-only field change does not change version.

────────────────────────────────────
4. Add Field governance/classification metadata
────────────────────────────────────

Product-owner decision:

Phase 2C SHOULD retain authoritative field-level governance metadata that
already exists in repository metadata sources.

This is governance metadata, NOT authorization.

Inspect the authoritative field metadata source and reuse only evidenced
fields, including where present:

- DATA_TYPE
- IS_KEY
- PII
- PCI
- SECURITY_CLASSIFICATION_CANDIDATE
- BUSINESS_NAME
- BUSINESS_DESCRIPTION

Use repository naming conventions.

These values are descriptive/governance metadata only.

They MUST NOT:
- grant access;
- deny access;
- create permissions;
- create group mappings;
- substitute for the AuthZ layer.

Do not invent new classification values or semantics.

If source values are inconsistent, preserve the authoritative source form
or normalize only where an existing repository rule exists.

Document explicitly:

classification metadata != authorization.

────────────────────────────────────
5. Fix GovernedSemanticPlan hierarchy consistency
────────────────────────────────────

If product_group_refs or schema_refs are provided, they must be consistent
with the hierarchy derived from referenced datasets.

Ratified behavior:

- Dataset hierarchy is authoritative for structural resolution.
- Optional ProductGroup/Schema references act as declared scope.
- They may narrow scope but may never contradict the dataset-derived
  hierarchy.

Validate:

dataset → schema → ProductGroup

For candidate/selected datasets:

- every explicitly referenced schema must exist;
- every explicitly referenced Product Group must exist;
- datasets must lie inside the declared schema/ProductGroup scope;
- a contradictory ProductGroup or Schema reference fails deterministically.

If schema_refs/product_group_refs are omitted, derive hierarchy from
dataset references; do not fabricate additional scope.

Add explicit contradiction tests.

────────────────────────────────────
6. Fix field/grain/time/relationship scope
────────────────────────────────────

Ratified rule:

When selected_dataset_refs are present:

- field_refs must belong to selected datasets;
- grain_field_refs must belong to selected datasets;
- time_field_refs must belong to selected datasets;
- relationship_refs must connect datasets within the selected plan graph.

Candidate datasets are discovery scope.
Selected datasets are execution-plan structural scope.

If no selected dataset exists because the plan represents a clarification
stage, governed field/join/grain/time references must be empty unless ADR
0002 explicitly defines another safe state.

Add tests for:
- field exists but belongs to unselected dataset;
- grain field belongs to wrong dataset;
- time field belongs to wrong dataset;
- relationship exists but connects an out-of-scope dataset.

────────────────────────────────────
7. Cross-ProductGroup relationships
────────────────────────────────────

Keep the existing rule:

Cross-Schema and cross-ProductGroup relationships are never inferred.

They are structurally valid only when an explicit governed
RelationshipRecord exists.

Add dedicated tests for:

- explicit cross-ProductGroup relationship accepted structurally;
- absent relationship is rejected;
- wrong endpoint rejected;
- relationship does not grant authorization to either Product Group.

────────────────────────────────────
8. Registry-cache concurrency failure
────────────────────────────────────

Treat this as a Phase 2B acceptance issue.

Reproduce the flaky test repeatedly on:

A. the Phase 2B base branch
B. the Phase 2C branch

Determine root cause.

The observed failure was approximately:

test_registry_cache.py:
test_concurrent_reads_registers_and_metrics_do_not_corrupt_cache_state

where a thread's newly registered version may be evicted before that same
thread performs get().

Do not merely label it flaky.

Determine whether:

1. the cache implementation violates its contract; or
2. the test incorrectly assumes a registered entry cannot be evicted under
   concurrent capacity pressure.

Fix the correct layer.

Preserve:
- true FIFO;
- bounded capacity;
- thread safety;
- deterministic metrics;
- no corruption.

Add/revise tests so concurrency assertions match the ratified cache
contract and are deterministic.

Run the concurrency suite repeatedly (minimum 50 iterations) after the fix.

The final full backend acceptance suite must be green.

────────────────────────────────────
9. Exact PR hygiene
────────────────────────────────────

The independent audit reconciled PR #14 as:

6 files
1455 additions
0 deletions

The earlier editor 7-file / +1534 / -7 display was transient and is not
the authoritative PR diff.

After remediation, report exact base-to-head inventories separately for:

PR #12
and
PR #14.

Do not mix editor-session counts with Git PR diff counts.

────────────────────────────────────
10. Verification
────────────────────────────────────

After parent and child corrections are complete, run:

Phase 2B:
- registry contract tests
- registry cache tests
- service-version-boundary tests
- repeated concurrency tests >= 50 runs

Phase 2C:
- hierarchy contract tests
- semantic-plan tests
- hierarchy contradiction tests
- field/grain/time scope tests
- cross-Schema tests
- cross-ProductGroup tests
- strict-off tests
- deterministic-order tests repeatedly

Compatibility:
- metadata registry service tests
- existing SemanticQueryPlan/recipe tests
- API routes + serialization
- golden baseline
- full backend suite
- coverage gate
- git diff --check
- approved secret scanner if available, otherwise labelled fallback

All skipped tests must be listed and classified as pre-existing or new.

The final full suite must have zero failures.

────────────────────────────────────
11. PR handling
────────────────────────────────────

Keep both PRs Draft.

PR #12:
- modify only if required for Phase 2B-owned corrections;
- no merge/deploy.

PR #14:
- update after the Phase 2B correction;
- remain based on phase2/service-version-boundary;
- no merge/deploy.

Do not start Phase 2D.

────────────────────────────────────
12. Final report
────────────────────────────────────

Return:

1. Overall result
2. Which fixes belonged to PR #12 vs PR #14
3. Starting and ending SHAs for both branches
4. Canonical hierarchy result
5. registry_version contract result
6. Field governance/classification implementation
7. GovernedSemanticPlan hierarchy/scope result
8. Cross-ProductGroup relationship result
9. Concurrency root cause and resolution
10. Exact changed-file inventories for PR #12 and #14
11. Exact test commands/counts/skips/coverage
12. PR states/base/head/URLs
13. Remaining blockers
14. Confirmation of non-force pushes
15. Confirmation that Phase 2D was not started
