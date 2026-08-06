Perform the final independent acceptance audit of the remediated Phase 2B implementation and Draft PR #12.

You are an independent reviewer and did not implement or remediate Phase 2B.

Use the existing isolated Phase 2B worktree.

Do not modify files.
Do not commit, push, rebase, merge, retarget, mark ready, deploy, change PR metadata, or start Phase 2C.
Do not use or modify the dirty asktd_v2 checkout.

Current expected state:
- PR #12: OPEN and Draft
- Base: phase2/registry-contracts
- Head: phase2/service-version-boundary
- Reported final head prefix: 5f79d49
- Remediation report: PASS
- Reported full suite: 786 passed, 3 skipped
- Reported coverage: 86.28%

────────────────────────────────────
1. Verify current Git and PR state
────────────────────────────────────

Fetch origin and independently confirm:

- exact origin/main SHA;
- exact origin/phase2/registry-contracts SHA;
- exact origin/phase2/service-version-boundary SHA;
- exact PR #12 head SHA;
- PR #12 is OPEN and Draft;
- base is phase2/registry-contracts;
- head is phase2/service-version-boundary;
- PR body still contains blocked-by and do-not-merge/deploy notices.

Do not trust SHAs from the remediation report without verifying them.

────────────────────────────────────
2. Verify stacked ancestry
────────────────────────────────────

The remediation report states that the live Phase 2B branch had previously
been aligned or rebased onto an updated main containing merged parent work.

Determine the exact ancestry using Git merge-base and ancestor checks.

Confirm:

- origin/phase2/registry-contracts is an ancestor of
  origin/phase2/service-version-boundary;
- PR #12 contains only Phase 2B changes relative to its current base;
- no Phase 0, Phase 1, unrelated main, or duplicate parent commits appear
  as Phase 2B-owned PR changes;
- the stacked relationship #10 → #11 → #12 remains logically correct;
- no parent branch was accidentally rewritten or bypassed.

Return a concise commit graph showing:

main
→ phase1/foundation-contracts
→ phase2/registry-contracts
→ phase2/service-version-boundary

Mark any merged or obsolete branch explicitly.

If ancestry is incorrect, return FAIL and do not repair it.

────────────────────────────────────
3. Reconcile all file counts
────────────────────────────────────

The remediation report says exactly 6 files were changed, while the editor
summary displayed 7 files changed.

Reconcile separately:

A. Remediation-only diff:
   <verified pre-remediation remote head>
   to
   origin/phase2/service-version-boundary

B. Full PR #12 diff:
   origin/phase2/registry-contracts
   to
   origin/phase2/service-version-boundary

For each comparison report:

- exact paths;
- added, modified, deleted, or renamed;
- additions and deletions;
- purpose;
- whether the file belongs to Phase 2B.

Explain precisely why the UI displayed 7 files if the remediation commit
changed 6.

Confirm no untracked or uncommitted file accounts for the difference.

────────────────────────────────────
4. Verify every prior audit correction
────────────────────────────────────

Independently inspect code and tests and verify:

A. True FIFO:
- reads never reorder entries;
- current, historical and metrics reads never call move_to_end;
- capacity removes the oldest first registration;
- read A repeatedly, then add C at capacity: A is evicted, not B.

B. Duplicate registration:
- identical version/content does not refresh TTL;
- does not change FIFO position;
- does not alter metrics;
- does not replace the retained object;
- returns a protected deep copy.

C. Policy validation:
- ttl_seconds >= 0;
- max_versions >= 1;
- validation applies to direct construction and environment loading;
- invalid values fail immediately;
- ttl_seconds = 0 disables expiration.

D. TTL:
- immediately before boundary is valid;
- exact boundary is expired;
- after boundary is expired;
- monotonic injected clock is used consistently.

E. Canonical identity:
- private only;
- not exported through __all__;
- not present in descriptors, APIs, errors or metrics;
- all governed semantic fields are covered;
- runtime-only provenance.imported_at is excluded only as documented;
- every sortable collection uses an authoritative stable ID;
- reordered equivalent records are identical;
- changed semantic content conflicts;
- no collision or omitted-field risk is evident.

F. Strict-off:
- governed_snapshot() returns None;
- version_descriptor() returns None;
- register_snapshot() fails closed;
- no governed cache state is created;
- legacy metadata()["version"] remains unchanged.

G. Metrics and errors:
- first expired lookup raises ExpiredRegistryVersionError;
- later lookup raises UnknownRegistryVersionError;
- expired removal increments documented counters;
- invalidations counts entries actually removed;
- retained_versions excludes expired entries;
- metrics snapshot is immutable;
- errors expose only code and registry_version.

────────────────────────────────────
5. Public API and security boundary
────────────────────────────────────

Confirm:

- api.py is unchanged;
- no new HTTP endpoint exists;
- /api/questions is unchanged;
- /api/registry is unchanged;
- /api/roles is unchanged;
- metadata() shape is unchanged;
- no governed snapshot or descriptor leaks publicly;
- metadata cannot grant authorization;
- no secret, credential, path or payload leaks through errors.

────────────────────────────────────
6. Independent test execution
────────────────────────────────────

Run independently:

1. registry cache tests;
2. service-version-boundary tests;
3. Phase 2A registry contract tests;
4. metadata registry service tests;
5. API routes and serialization tests;
6. FIFO and duplicate registration focused tests;
7. TTL boundary and policy validation tests;
8. canonical identity ordering tests;
9. strict-off registration tests;
10. concurrency test repeatedly at least 10 times;
11. golden-baseline tests;
12. full backend suite;
13. coverage gate;
14. git diff --check;
15. repository-approved local secret scanner if available;
16. otherwise a clearly labelled pattern-based tracked-file fallback.

Report exact commands and exact counts.

Confirm:

- API compatibility count is 156 unless additional named files justify
  another total;
- all 3 skips are pre-existing;
- tests leave no tracked file modified;
- worktree is clean afterward.

────────────────────────────────────
7. Final verdict
────────────────────────────────────

Return:

1. Overall verdict:
   - PASS
   - PASS WITH CONDITIONS
   - PARTIAL
   - FAIL

2. Verified PR #12 state, base, head and full SHA
3. Verified stacked ancestry and concise commit graph
4. Remediation-only file inventory
5. Full PR #12 file inventory
6. Explanation of 6-versus-7 file count
7. FIFO and duplicate-registration findings
8. Policy and TTL findings
9. Canonical identity findings
10. Strict-off findings
11. Metrics and error findings
12. Public API and security findings
13. Exact tests, skips and coverage
14. Required actions before Phase 2C
15. Confirmation that this audit changed nothing

Approve starting Phase 2C only if the verdict is exactly PASS.
