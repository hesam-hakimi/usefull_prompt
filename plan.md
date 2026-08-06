Start Phase 2B using a controlled stacked-development workflow.

Important context:
- PR #10 is still awaiting external approval and has not been merged.
- Phase 2A is complete in branch phase2/registry-contracts and Draft PR #11.
- We do not want development blocked while PR #10 is under review.
- Phase 2B must remain dependent on Phase 2A and must not be merged or deployed yet.

First, perform a read-only verification:

1. Fetch origin.
2. Confirm origin/phase2/registry-contracts exists.
3. Confirm its HEAD matches the current remote head used by PR #11.
4. Confirm PR #11 is OPEN and Draft.
5. Confirm the Phase 2A worktree is clean.
6. Read the approved Phase 2 implementation plan and identify the exact Phase 2B scope, acceptance criteria, exclusions, dependencies, and expected files.

Then create Phase 2B safely:

- Create a new isolated worktree.
- Create branch:
  phase2/service-version-boundary
- Base it exactly on origin/phase2/registry-contracts.
- Do not use or modify the dirty asktd_v2 main checkout.
- Do not modify, rebase, force-push, or merge:
  - phase1/foundation-contracts
  - phase2/registry-contracts
  - PR #10
  - PR #11

Implement only the approved Phase 2B scope.

Required safeguards:

- Preserve all Phase 2A public API and compatibility guarantees.
- Do not expose the governed internal registry snapshot through public APIs.
- Do not grant authorization through metadata.
- Do not begin Phase 2C or any later phase.
- Do not add deployment, publish, SQL-backed storage, recipe migration, KPI/glossary, output-template, or runtime-routing work unless explicitly included in Phase 2B.
- Do not invent requirements where the plan is ambiguous.
- Record ambiguous requirements as blockers rather than guessing.
- Add focused contract tests and regression coverage.
- Run the focused Phase 2B tests, related suites, full backend suite, coverage gate, golden-baseline tests, secret scan, and git diff hygiene checks.

After implementation:

1. Commit and push only to phase2/service-version-boundary.
2. Open a Draft stacked PR with:
   - base: phase2/registry-contracts
   - head: phase2/service-version-boundary
3. State clearly in the PR body:
   - BLOCKED BY PR #11
   - TRANSITIVELY BLOCKED BY PR #10
   - MUST NOT BE MERGED OR DEPLOYED until the parent PR chain is finalized
4. Do not mark the PR ready for review unless explicitly requested.

Return:

1. Verified starting branch and SHA
2. Exact Phase 2B scope implemented
3. Files changed
4. Tests and coverage results
5. Draft PR number and URL
6. Any assumptions or blockers
7. Required rebase sequence after PR #10 is merged
8. Confirmation that no parent branch, unrelated checkout, secret, deployment file, or later-phase scope was modified
