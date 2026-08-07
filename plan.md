Perform the final independent, read-only acceptance verification of the
remediated Phase 2B and Phase 2C branches.

You did not implement these corrections.

Do not modify files, commit, push, merge, rebase, retarget, mark ready,
change PR metadata, deploy, or start Phase 2D.

Do not use or modify the dirty asktd_v2 checkout.

Expected branches:

PR #12:
- base: phase2/registry-contracts
- head: phase2/service-version-boundary
- expected head prefix: e67680e
- must remain OPEN and Draft

PR #14:
- base: phase2/service-version-boundary
- head: phase2/semantic-plan-contract-validator
- expected head prefix: effd7ba
- must remain OPEN and Draft

────────────────────────────────────
1. Git and stacked-PR verification
────────────────────────────────────

Fetch origin and verify:

- exact full SHAs for both branches;
- phase2/registry-contracts is an ancestor of
  phase2/service-version-boundary;
- phase2/service-version-boundary is an ancestor of
  phase2/semantic-plan-contract-validator;
- PR #14 contains only Phase 2C-owned changes relative to its current base;
- no parent changes appear as duplicate PR #14 changes;
- no new force push occurred;
- both worktrees are clean.

PR #14 reportedly contains a merge commit bringing in the corrected PR #12
head. Confirm that:

- this does not duplicate parent changes in PR #14;
- it is compatible with repository history policy;
- if linear history is required, report the issue without changing history.

────────────────────────────────────
2. Exact PR inventories
────────────────────────────────────

Verify the exact current base-to-head inventories.

Expected PR #12 summary:
- 9 files
- 1821 additions
- 8 deletions

Expected PR #14 summary:
- 8 files
- 2466 additions
- 0 deletions

Report every changed path and confirm that:

- all files belong to Phase 2B or Phase 2C;
- production_architecture.md or any unrelated document is not included;
- no deployment, workflow, dependency or public API file changed.

────────────────────────────────────
3. Phase 2B acceptance
────────────────────────────────────

Verify that registry_version:

- is derived from the canonical governed RegistrySnapshot;
- includes all governed semantic collections;
- changes when ProductGroup, Schema, Dataset, Field or Relationship content
  changes;
- is stable under reordered equivalent input;
- excludes documented runtime-only values;
- remains the authoritative external snapshot identity;
- does not expose a public content_hash.

Verify the cache concurrency correction:

- bounded FIFO behavior is preserved;
- the test no longer assumes that a newly registered entry cannot be
  evicted;
- no cache corruption occurs;
- the repeated concurrency suite is stable.

────────────────────────────────────
4. Phase 2C acceptance
────────────────────────────────────

Verify:

- canonical DatasetRecord requires schema_id;
- every canonical Dataset resolves to exactly one Schema;
- every Schema resolves to exactly one ProductGroup;
- raw legacy input is adapted before canonical validation;
- no ProductGroup or Schema is inferred from names;
- unassigned records are migration fallback only.

Verify GovernedSemanticPlan:

- dataset-derived hierarchy is authoritative;
- optional product_group_refs and schema_refs cannot contradict it;
- fields, grain fields and time fields belong to selected datasets;
- relationships connect selected datasets;
- no selected dataset means field/grain/time/relationship references must
  be empty;
- current and retained registry versions are supported;
- strict-off behavior fails closed.

Verify cross-ProductGroup behavior:

- explicit governed relationship is structurally accepted;
- absent or incorrect relationship is rejected;
- relationship existence never grants authorization.

Verify field governance metadata:

- only evidenced attributes are retained:
  DATA_TYPE, IS_KEY, PII, PCI,
  SECURITY_CLASSIFICATION_CANDIDATE,
  BUSINESS_NAME, BUSINESS_DESCRIPTION;
- classification metadata does not grant or deny access;
- no group, permission, entitlement or AuthZ mapping was introduced.

────────────────────────────────────
5. Independent validation
────────────────────────────────────

Run:

Phase 2B:
- registry contract tests;
- registry cache tests;
- service-version-boundary tests;
- concurrency tests for at least 50 repetitions.

Phase 2C:
- hierarchy tests;
- semantic-plan tests;
- hierarchy contradiction tests;
- field/grain/time scope tests;
- cross-Schema tests;
- cross-ProductGroup tests;
- strict-off tests;
- deterministic-order/version tests repeatedly.

Compatibility:
- metadata registry service tests;
- existing SemanticQueryPlan and recipe tests;
- API route and serialization tests;
- golden baseline;
- full backend suite on PR #12;
- full backend suite on PR #14;
- coverage gate;
- git diff --check;
- available approved secret scan, or labelled fallback.

Expected full-suite minimum evidence:

PR #12:
- 800 passed
- 3 pre-existing skipped
- 0 failed
- approximately 86.29% coverage

PR #14:
- 877 passed
- 3 pre-existing skipped
- 0 failed
- approximately 86.50% coverage

Report any difference rather than hiding it.

────────────────────────────────────
6. Final response
────────────────────────────────────

Return:

1. Overall verdict: PASS, PASS WITH CONDITIONS, PARTIAL or FAIL
2. Verified PR #12 state, base, head and full SHA
3. Verified PR #14 state, base, head and full SHA
4. Verified stacked ancestry
5. Exact PR inventories
6. registry_version verdict
7. cache concurrency verdict
8. canonical hierarchy verdict
9. semantic-plan scope verdict
10. classification/AuthZ verdict
11. exact test counts, skips and coverage
12. required actions before Phase 2D
13. confirmation that this audit changed nothing

Approve Phase 2D only if the final verdict is exactly PASS.
