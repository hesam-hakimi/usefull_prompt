Complete and harden Phase 2B in the existing stacked branch and Draft PR.

This instruction is the product-owner scope decision for Phase 2B. Record it in an authoritative repository artifact before changing implementation.

Current chain:
- PR #10: phase1/foundation-contracts
- PR #11: phase2/registry-contracts
- PR #12: phase2/service-version-boundary
- PR #12 must remain Draft and based on phase2/registry-contracts.

Use only the existing isolated Phase 2B worktree.

Do not use or modify the dirty asktd_v2 checkout.
Do not modify, rebase, merge, force-push, retarget, or close PR #10 or PR #11.
Do not begin Phase 2C.
Do not deploy anything.

────────────────────────────────────
1. Ratified Phase 2B scope
────────────────────────────────────

Phase 2B is the internal metadata-registry service and version boundary.

Phase 2B MUST include:

1. MetadataRegistryService as the internal owner of governed RegistrySnapshot loading and retrieval.

2. A safe current-version descriptor that exposes only approved identity information:
   - schema_version
   - registry_version
   - lifecycle_status
   - source, only if its semantics are clearly defined
   - no governed records, paths, payloads, authorization data, or secrets

3. A bounded, thread-safe, in-process cache for governed snapshots:
   - configurable TTL
   - configurable maximum retained versions
   - deterministic eviction
   - monotonic clock for expiration
   - injectable clock for tests
   - no external cache dependency

4. Immutable versioned snapshot retention:
   - snapshots keyed by registry_version
   - current snapshot retrieval
   - historical retained-snapshot retrieval by registry_version
   - cached snapshots must not be mutable by callers
   - attempting to register conflicting content under the same registry_version must fail safely

5. Explicit internal invalidation:
   - invalidate one registry_version
   - invalidate all retained versions
   - no HTTP endpoint
   - no publish workflow integration in this phase
   - the hook must be ready for a later publish workflow

6. Safe version lookup behavior:
   - lookup by registry_version
   - a typed safe error for unknown or expired versions
   - errors must contain only safe codes and version identifiers
   - no raw metadata, paths, payloads, or secrets in errors

7. Internal cache observability:
   - cache hits
   - cache misses
   - loads
   - evictions
   - invalidations
   - current retained-version count
   - expose metrics only through an internal service accessor

Phase 2B explicitly EXCLUDES:

- public HTTP endpoints
- public API shape changes
- persistent or SQL-backed snapshot storage
- Redis or distributed caching
- runtime routing
- semantic-plan validation
- recipe migration
- KPI or glossary behavior
- output templates
- publish/approval workflow
- deployment
- version comparison
- rollback
- admin APIs
- Phase 2C through Phase 2G behavior

Version comparison and rollback remain later Milestone 7 work.

────────────────────────────────────
2. Authoritative scope document
────────────────────────────────────

Inspect the repository documentation conventions.

If an ADR convention exists, create the next correctly numbered ADR.
Otherwise create:

docs/plans/phase2b-registry-service-version-boundary.md

The document must state:

- the exact included and excluded scope above;
- why Phase 2B is internal-only;
- snapshot version and cache semantics;
- strict-on and strict-off behavior;
- registry_version semantics;
- the relationship between legacy metadata()["version"] and governed registry_version;
- invalidation and retention behavior;
- deferred responsibilities and their future phases;
- acceptance criteria.

Do not modify unrelated planning documents.

────────────────────────────────────
3. Correct the version descriptor contract
────────────────────────────────────

Review the current RegistryVersionDescriptor implementation.

Remove content_hash from the Phase 2B contract unless an existing pre-PR-12 consumer requires it.

Reason:
- content_hash was introduced by PR #12;
- it is not required by an authoritative plan;
- its semantics are currently order-sensitive and tied to Pydantic serialization;
- registry_version is the authoritative lookup identity for Phase 2B.

Do not introduce a replacement public hash field.

If an internal fingerprint is necessary only to detect conflicting snapshots under the same registry_version, keep it private to the service and do not expose it through descriptors or APIs.

Document registry_version as the authoritative governed-snapshot identifier.

────────────────────────────────────
4. Resolve strict-off semantics
────────────────────────────────────

Preserve all Phase 2A legacy and public API behavior.

The governed registry boundary exists only when strict governed metadata is enabled.

Required behavior:

- strict mode enabled:
  - governed snapshot accessors operate normally;
  - version descriptor is available;
  - version lookup and cache behavior are available.

- strict mode disabled:
  - governed snapshot accessor returns None using the existing Phase 2A compatibility behavior;
  - version_descriptor() returns None, not a descriptor populated with null fields;
  - governed version lookup must not fabricate a version;
  - legacy metadata APIs remain unchanged.

Explicitly document that:

- metadata()["version"] is a legacy runtime/file metadata value;
- RegistrySnapshot.registry_version is the governed registry version;
- they are intentionally different contracts;
- consumers must not compare or substitute one for the other.

Update typing accordingly, such as:

RegistryVersionDescriptor | None

Do not expose the governed snapshot through /api/questions, /api/registry, /api/roles, or any new endpoint.

────────────────────────────────────
5. Cache and snapshot behavior
────────────────────────────────────

Before implementation, inspect existing configuration and dependency-injection patterns.

Reuse existing patterns where available.

Do not add new third-party dependencies solely for the cache.

The implementation should use standard-library facilities where appropriate and must be:

- thread-safe;
- bounded;
- deterministic;
- testable;
- independent of wall-clock changes;
- compatible with the existing application lifecycle.

Use constructor-injected cache policy and clock.

If repository configuration already defines suitable TTL and size values, use it.

If no approved product values exist:
- keep TTL and maximum versions injectable;
- choose conservative internal defaults;
- document them explicitly as Phase 2B defaults;
- do not present them as permanent production sizing decisions.

Ensure that callers cannot mutate a retained snapshot and thereby alter future reads.

Add a safe typed exception hierarchy where needed, including an unknown-version error and a conflicting-version error.

────────────────────────────────────
6. Tests required
────────────────────────────────────

Add focused tests for:

- current governed snapshot retrieval;
- lookup by registry_version;
- retrieval of a previously retained version;
- unknown version;
- expired version;
- single-version invalidation;
- invalidate-all;
- TTL expiration using an injected clock;
- maximum-capacity eviction;
- deterministic eviction order;
- cache hit and miss counters;
- load, eviction, and invalidation metrics;
- duplicate registration of identical version/content;
- conflicting content under the same registry_version;
- caller mutation cannot modify the retained snapshot;
- strict-on descriptor behavior;
- strict-off returns None;
- legacy metadata()["version"] remains unchanged;
- no governed metadata leak through public APIs;
- no metadata-based authorization fields;
- errors do not leak paths, payloads, secrets, or governed content;
- concurrent reads do not corrupt cache state.

Preserve all existing Phase 2A contract and API compatibility tests.

Do not rename or remove existing tests merely to satisfy coverage.

────────────────────────────────────
7. Verification gates
────────────────────────────────────

Run:

1. focused Phase 2B tests;
2. Phase 2A registry-contract tests;
3. metadata-registry service tests;
4. API route and serialization compatibility tests;
5. full backend test suite;
6. coverage gate;
7. golden-baseline tests;
8. git diff --check;
9. repository-approved secret scanner, if available;
10. pattern-based tracked-file scan only as a clearly labelled fallback.

Report skipped tests and confirm whether each skip is pre-existing.

Reconcile the exact changed-file inventory against:

origin/phase2/registry-contracts
to
phase2/service-version-boundary

────────────────────────────────────
8. Commit and PR handling
────────────────────────────────────

After all gates pass:

- commit only to phase2/service-version-boundary;
- push normally without force;
- keep PR #12 Draft;
- keep its base as phase2/registry-contracts;
- update the PR body with:
  - ratified Phase 2B scope;
  - implementation summary;
  - strict-off semantics;
  - cache and version-retention contract;
  - test results;
  - explicit exclusions;
  - BLOCKED BY PR #11;
  - TRANSITIVELY BLOCKED BY PR #10;
  - MUST NOT BE MERGED OR DEPLOYED.

Do not mark ready for review.
Do not start Phase 2C.

────────────────────────────────────
9. Final response
────────────────────────────────────

Return:

1. Overall PASS, PASS WITH CONDITIONS, PARTIAL, or FAIL
2. Authoritative scope document path
3. Exact requirements implemented
4. Exact files changed
5. Version and strict-off semantics
6. Cache policy and defaults
7. Version lookup and invalidation behavior
8. Tests, skips, and coverage
9. PR #12 state, base, head, commit SHA, and URL
10. Remaining blockers
11. Confirmation that parent branches, unrelated checkout, public APIs, deployment files, secrets, and Phase 2C+ scope were not modified
