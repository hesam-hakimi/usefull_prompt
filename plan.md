Perform the final independent, read-only acceptance audit of Phase 2B and Draft PR #12.

You are an independent reviewer. You did not implement Phase 2B.

Do not modify any file.
Do not commit, push, rebase, merge, retarget, deploy, change PR metadata, or begin Phase 2C.

Current stacked chain:

- PR #10: phase1/foundation-contracts
- PR #11: phase2/registry-contracts
- PR #12: phase2/service-version-boundary
- PR #12 must remain Draft and based on phase2/registry-contracts.

Use the clean isolated Phase 2B worktree.
Do not use or alter the dirty asktd_v2 checkout.

────────────────────────────────────
1. Verify the authoritative contract
────────────────────────────────────

Read:

- docs/adr/0001-phase2b-registry-service-version-boundary.md
- docs/adr/README.md
- the Phase 2 implementation plans and Milestone 1 requirements
- the Phase 2A registry contracts
- PR #12’s current body

Confirm that ADR 0001:

- follows the repository ADR convention;
- is marked Accepted;
- clearly defines included and excluded Phase 2B scope;
- defines registry_version as the authoritative governed-snapshot identifier;
- distinguishes legacy metadata()["version"] from governed registry_version;
- defines strict-on and strict-off behavior;
- documents cache TTL, capacity, retention, invalidation and metrics semantics;
- does not silently move Phase 2C–2G work into Phase 2B.

Report any contradiction between the ADR, implementation plans, code or PR body.

────────────────────────────────────
2. Verify the exact PR diff
────────────────────────────────────

Fetch origin and compare exactly:

origin/phase2/registry-contracts
to
origin/phase2/service-version-boundary

Confirm:

- the remote PR head matches the reported Phase 2B commit;
- exactly nine intended files are changed;
- additions and deletions match the committed Git diff;
- every changed file belongs to Phase 2B;
- no public API, deployment, workflow, dependency, secret, parent-branch or unrelated documentation file was changed.

Return the exact file inventory with:

- path
- added/modified/deleted
- additions/deletions
- purpose
- in-scope verdict

────────────────────────────────────
3. RegistrySnapshotCache correctness
────────────────────────────────────

Review RegistrySnapshotCache and its tests.

Verify:

- only standard-library dependencies are used;
- locking protects every shared mutable state operation;
- the injected clock is used consistently;
- expiration uses a monotonic clock rather than wall-clock time;
- configured TTL and maximum retained-version values are validated safely;
- the cache can never become accidentally unbounded;
- FIFO eviction is deterministic and documented;
- capacity eviction and TTL expiration have distinct, intentional semantics;
- expired entries are removed safely;
- the current-version pointer cannot reference an expired, invalidated or evicted snapshot;
- invalidating the current version leaves the service in a documented safe state;
- invalidate_all clears all associated state;
- duplicate registration of identical version/content is idempotent;
- duplicate registration does not unintentionally refresh TTL or reorder FIFO unless explicitly documented;
- conflicting content under the same registry_version raises the typed safe error;
- no lock ordering or re-entrant deadlock risk exists;
- concurrent reads, registrations, expiry and invalidation cannot corrupt state.

Pay particular attention to edge cases:

- max retained versions = 1;
- invalid or zero maximum capacity;
- TTL disabled or zero, if supported;
- exact TTL boundary;
- simultaneous expiry and lookup;
- current snapshot evicted by capacity;
- invalidation followed by registration of the same version;
- multiple threads requesting the same version.

────────────────────────────────────
4. Snapshot immutability and identity
────────────────────────────────────

Verify that retained RegistrySnapshot objects are genuinely protected from caller mutation.

Confirm:

- snapshots are copied before retention where required;
- reads return deep copies;
- nested lists, dictionaries and nested models cannot mutate the retained copy;
- mutation of the original object after registration cannot change the cached snapshot;
- mutation of a returned object cannot affect a later lookup;
- current and historical retrieval follow the same protection contract.

Inspect the private mechanism used to determine whether two snapshots under the same registry_version are identical.

Confirm:

- it does not expose content_hash publicly;
- it contains no paths, secrets or runtime-only fields;
- it behaves consistently across processes;
- record ordering semantics are intentional and documented;
- semantically equivalent snapshots are not incorrectly treated as conflicts merely because of unstable serialization or collection order;
- different governed content under the same registry_version is always rejected.

Report whether the conflict check is:

- canonical semantic identity;
- deterministic serialized identity;
- ordinary model equality;
- another mechanism.

State whether that mechanism matches ADR 0001.

────────────────────────────────────
5. Strict-mode and version semantics
────────────────────────────────────

Verify:

Strict enabled:

- governed_snapshot is available;
- version_descriptor() returns the frozen four-field descriptor;
- current and historical lookups work;
- cache, invalidation and metrics accessors work.

Strict disabled:

- governed_snapshot is None;
- version_descriptor() is None;
- governed version lookup cannot fabricate or expose a version;
- legacy metadata APIs remain byte/shape compatible;
- metadata()["version"] remains the legacy runtime/file value;
- no consumer can accidentally substitute it for RegistrySnapshot.registry_version.

Confirm source semantics are safe and documented and that the descriptor contains only:

- schema_version
- registry_version
- lifecycle_status
- source

Confirm it contains no records, owner details, provenance payloads, paths, permissions, authorization data or secrets.

────────────────────────────────────
6. Error and observability contracts
────────────────────────────────────

Inspect:

- UnknownRegistryVersionError
- ExpiredRegistryVersionError
- ConflictingRegistryVersionError
- cache metrics model and accessor

Verify:

- error messages and dictionaries contain only the approved error code and registry_version;
- no raw snapshot, metadata record, file path, payload, exception chain or secret is exposed;
- unknown and expired versions are distinguishable;
- repeated lookup after expiration has documented behavior;
- metrics are immutable snapshots rather than live mutable internal state;
- metrics updates are thread-safe;
- hits, misses, loads, evictions, invalidations and retained_versions have precise semantics;
- retained_versions always reflects actual cache contents;
- TTL removal and capacity eviction counters behave as documented;
- invalidation metrics distinguish operation calls from entries actually removed, or clearly document the chosen meaning.

────────────────────────────────────
7. Public API and authorization boundary
────────────────────────────────────

Verify that:

- no new HTTP endpoint was added;
- api.py is unchanged;
- /api/questions remains unchanged;
- /api/registry remains unchanged;
- /api/roles remains unchanged;
- metadata() remains unchanged;
- no RegistrySnapshot or RegistryVersionDescriptor leaks through serialization;
- metadata cannot grant permissions or authorization;
- no fields such as permissions, grants, authorized, allow or access were introduced into governed contracts.

────────────────────────────────────
8. Independent test execution
────────────────────────────────────

Run without modifying source files:

1. all focused cache tests;
2. all service-version-boundary tests;
3. Phase 2A registry-contract tests;
4. metadata-registry service tests;
5. API route and serialization compatibility suites;
6. concurrency tests repeatedly enough to expose obvious race conditions;
7. full backend suite;
8. coverage gate;
9. golden-baseline tests;
10. git diff --check;
11. repository-approved local secret scanner, if one exists;
12. otherwise a clearly labelled pattern-based tracked-file fallback scan.

Report:

- exact test commands;
- passed, failed and skipped counts;
- whether every skip is pre-existing;
- total coverage;
- coverage for registry_cache.py, registry_contract.py and metadata_registry.py;
- whether running tests left tracked files modified.

Do not install an unapproved security scanner.

────────────────────────────────────
9. Git and PR hygiene
────────────────────────────────────

Confirm:

- Phase 2B worktree is clean after testing;
- PR #12 is OPEN and Draft;
- base is phase2/registry-contracts;
- head is phase2/service-version-boundary;
- PR body contains the blocked-by and do-not-merge/deploy notices;
- PR #10 and PR #11 remain unchanged;
- no force push occurred;
- no secret, environment file or credential is tracked;
- the dirty asktd_v2 checkout was never modified;
- Phase 2C was not started.

────────────────────────────────────
10. Final verdict
────────────────────────────────────

Return exactly:

1. Overall verdict:
   - PASS
   - PASS WITH CONDITIONS
   - PARTIAL
   - FAIL

2. Authoritative-contract verdict
3. Exact changed-file inventory
4. Cache and concurrency findings
5. Snapshot immutability and conflict-identity findings
6. Strict-off and version-semantics findings
7. Error and metrics findings
8. Public-API/security-boundary findings
9. Test, skip and coverage results
10. PR #12 state, base, head and SHA
11. Required corrective actions before Phase 2C
12. Confirmation that this audit changed no files, branches, PRs or settings

Do not approve Phase 2C unless the final verdict is PASS.
