Remediate the final Phase 2B acceptance-audit conditions in the existing isolated Phase 2B worktree.

Current state:
- Branch: phase2/service-version-boundary
- Draft PR: #12
- Base: phase2/registry-contracts
- Reported remote head SHA:
  d272bacd43ae1600863807efe931d4c38f2f86f
- Independent audit verdict: PASS WITH CONDITIONS
- Phase 2C is not approved.

Do not use, clean, reset, stash, or modify the dirty asktd_v2 checkout.

Do not modify, rebase, merge, retarget, close, or force-push:
- PR #7
- PR #10
- PR #11
- their branches or worktrees

Do not deploy anything.
Do not begin Phase 2C.
Keep PR #12 OPEN and Draft.

────────────────────────────────────
1. Read-only starting verification
────────────────────────────────────

Before editing:

1. Fetch origin.
2. Confirm:
   - origin/phase2/service-version-boundary exists;
   - its SHA matches the reported PR #12 head;
   - PR #12 is OPEN and Draft;
   - its base is phase2/registry-contracts;
   - its head is phase2/service-version-boundary.
3. Confirm the isolated Phase 2B worktree is clean.
4. Read:
   - docs/adr/0001-phase2b-registry-service-version-boundary.md
   - registry_cache.py
   - registry_contract.py
   - metadata_registry.py
   - all Phase 2B tests
   - the independent audit findings.

Do not modify anything until the audit findings are reproduced and understood.

────────────────────────────────────
2. Correct FIFO eviction semantics
────────────────────────────────────

ADR 0001 defines deterministic FIFO, oldest-registered eviction.

Implement true FIFO semantics:

- Cache reads must not reorder retained versions.
- get(), current lookup, historical lookup and metrics access must not call
  move_to_end() or otherwise change retention order.
- Capacity eviction must remove the oldest active registration.
- FIFO position is determined only by first successful registration.
- A read must never protect an old entry from capacity eviction.

Do not silently change the ADR to LRU.

Add a focused test proving:

1. Register A.
2. Register B.
3. Read A repeatedly.
4. Register C at capacity.
5. A is evicted, not B.

────────────────────────────────────
3. Make duplicate registration idempotent
────────────────────────────────────

Registration of identical governed content under an already-retained
registry_version must be truly idempotent.

It must not:

- refresh inserted_at;
- refresh TTL;
- change FIFO position;
- increment loads;
- increment evictions;
- increment invalidations;
- replace the retained object unnecessarily;
- change the current pointer unexpectedly.

It should return the existing retained snapshot through the normal
deep-copy protection contract.

Registration after the previous version was actually expired, invalidated
or evicted is a new registration and may establish a new TTL/FIFO position.

Add tests proving duplicate registration does not refresh TTL or alter FIFO.

────────────────────────────────────
4. Validate cache policy everywhere
────────────────────────────────────

RegistrySnapshotCachePolicy must validate both:

- environment/configuration loading;
- direct constructor usage.

Required contract:

- ttl_seconds must be >= 0;
- max_versions must be >= 1;
- ttl_seconds = 0 means expiration is disabled;
- zero or negative max_versions must fail immediately;
- negative TTL must fail immediately;
- invalid values must never create an unbounded or unusable cache.

Use the repository’s existing validation style.
Do not add a new third-party dependency.

Add direct-construction tests for valid and invalid policies.

────────────────────────────────────
5. Ratify TTL behavior
────────────────────────────────────

Use the injected monotonic clock consistently.

Ratified TTL semantics:

- ttl_seconds = 0 disables expiration.
- For positive TTL, an entry is expired when:

  elapsed_time >= ttl_seconds

- Therefore, the exact TTL boundary is expired.
- Expired entries must not be returned as retained snapshots.
- Expiration must not depend on wall-clock changes.

Add tests for:

- immediately before the boundary;
- exactly at the boundary;
- after the boundary;
- TTL disabled;
- max_versions = 1.

────────────────────────────────────
6. Canonical conflict identity
────────────────────────────────────

The current ordinary Pydantic model equality is order-sensitive and is not
an adequate undocumented conflict contract.

Implement and document a private canonical governed-snapshot identity used
only to determine whether the same registry_version is being registered
with identical or conflicting governed content.

Requirements:

- registry_version remains the authoritative external identity.
- Do not reintroduce public content_hash.
- Do not expose the private fingerprint through descriptors, APIs, errors
  or metrics.
- Include all governed semantic fields required to determine snapshot
  equivalence.
- Exclude only fields explicitly documented as runtime-only or
  non-semantic.
- Collections of registry records must be canonicalized by their existing
  stable IDs so equivalent record ordering does not create a false
  conflict.
- If any collection lacks an authoritative stable identifier, stop and
  report the blocker instead of inventing one.
- Different governed content under the same registry_version must raise
  ConflictingRegistryVersionError.
- Error output must still contain only the safe code and registry_version.

Update ADR 0001 with the exact canonical-identity semantics.

Add tests proving:

- equivalent snapshots with different collection ordering are identical;
- mutation of meaningful governed content creates a conflict;
- runtime-only/non-semantic values behave according to the documented
  contract;
- the fingerprint remains private.

────────────────────────────────────
7. Expiration, metrics and invalidation semantics
────────────────────────────────────

Ratify and implement these semantics:

- First lookup of an expired retained version:
  - removes the expired entry;
  - increments eviction according to the documented expiration rule;
  - raises ExpiredRegistryVersionError.

- A later lookup of the same removed version:
  - raises UnknownRegistryVersionError.

- invalidations counts entries actually removed, not method calls.

- retained_versions represents currently valid retained snapshots.
  Expired entries must be pruned before returning the metrics snapshot.

- evictions must document whether it includes both:
  - TTL expiration removals;
  - capacity removals.

Use one clear interpretation consistently in code, ADR and tests.

- Metrics access must return an immutable snapshot.
- Reading metrics must not change FIFO order.
- Any pruning triggered during metrics calculation must remain thread-safe.

Add focused tests for all these rules.

────────────────────────────────────
8. Strict-off safety check
────────────────────────────────────

Preserve the existing public and legacy behavior:

- governed_snapshot() returns None when strict mode is disabled;
- version_descriptor() returns None;
- metadata()["version"] remains the legacy runtime/file value;
- no public endpoint changes.

Inspect whether internal register_snapshot() can currently create governed
registry state when strict mode is disabled.

The governed boundary must fail closed in strict-off mode.

If registration is currently possible:

- add an internal strict-mode guard using the repository’s existing safe
  error conventions;
- do not expose snapshot content, paths or payloads;
- do not add an HTTP endpoint or change any public API shape.

Add a focused strict-off registration test.

────────────────────────────────────
9. Update documentation and PR evidence
────────────────────────────────────

Update only the Phase 2B ADR where necessary to document:

- true FIFO behavior;
- duplicate-registration idempotency;
- exact TTL boundary;
- direct policy validation;
- canonical snapshot-equivalence semantics;
- first expired lookup versus subsequent unknown lookup;
- eviction-counter meaning;
- invalidation counting actual removed entries;
- retained_versions semantics;
- strict-off registration behavior.

Do not modify unrelated planning documents.

Reconcile the PR body’s API compatibility test count.

The independent audit observed:

- test_api_routes.py + test_api_serialization.py = 156 passed.

If another API test file is included in the claimed 163 count, list the exact
command and files. Otherwise correct the count to 156.

Do not retain an unexplained or stale count.

────────────────────────────────────
10. Required tests
────────────────────────────────────

Run:

1. focused registry-cache tests;
2. service-version-boundary tests;
3. Phase 2A registry-contract tests;
4. metadata-registry service tests;
5. API routes and serialization compatibility tests;
6. concurrency tests repeatedly;
7. golden-baseline tests;
8. full backend suite;
9. coverage gate;
10. git diff --check;
11. repository-approved local secret scanner, if available;
12. otherwise a clearly labelled pattern-based tracked-file fallback.

Focused tests must include:

- true FIFO after reads;
- max_versions = 1;
- invalid zero/negative capacity;
- negative TTL;
- TTL disabled;
- exact TTL boundary;
- duplicate registration does not refresh TTL;
- duplicate registration does not reorder FIFO;
- duplicate registration does not distort metrics;
- canonical equality with reordered records;
- actual content conflict;
- repeated expired lookup behavior;
- retained_versions excludes expired entries;
- invalidations counts actual entries removed;
- strict-off registration is fail-closed;
- concurrent read/register/expire/invalidate safety.

Report every skipped test and whether it was pre-existing.

────────────────────────────────────
11. Commit and PR handling
────────────────────────────────────

Only after all gates pass:

- commit only on phase2/service-version-boundary;
- push using a normal non-force push;
- keep PR #12 Draft;
- keep its base as phase2/registry-contracts;
- update the PR body with the corrected semantics and exact test evidence.

Do not mark ready for review.
Do not merge.
Do not deploy.
Do not start Phase 2C.

────────────────────────────────────
12. Final response
────────────────────────────────────

Return:

1. Overall result: PASS, PASS WITH CONDITIONS, PARTIAL or FAIL
2. Starting and ending commit SHAs
3. Audit conditions resolved
4. Exact files changed
5. FIFO and duplicate-registration semantics
6. Policy and TTL validation behavior
7. Canonical conflict-identity contract
8. Expiration, invalidation and metrics semantics
9. Strict-off behavior
10. Exact test commands, passed/failed/skipped counts and coverage
11. PR #12 state, base, head and URL
12. Remaining blockers
13. Confirmation that the push was non-force
14. Confirmation that PRs #7/#10/#11, parent branches, dirty checkout,
    public APIs, deployment files and Phase 2C+ scope were untouched
