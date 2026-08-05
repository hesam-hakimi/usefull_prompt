Begin Phase 2 implementation planning.

Current context:

- Phase 0 implementation is technically complete, but formal closure is still pending governance/security approvals.
- PR #9 has been merged.
- PR #7 remains subject to its remaining approval and merge process.
- Phase 1 foundation work exists in PR #10 and has completed local validation.
- Phase 1 introduced the readiness contract and separated:
  - implementation status
  - environment validation status
  - approval status
- Phase 1 behavior must remain backward compatible and feature-flagged.
- Do not deploy.
- Do not modify Azure resources.
- Do not merge or alter Phase 0/Phase 1 PRs.
- Continue from the current Phase 2 branch or create an isolated Phase 2 branch from the correct approved development base.

Your task is to prepare the Phase 2 implementation plan before writing feature code.

## 1. Determine the exact Phase 2 scope

Inspect the repository plans, roadmap, architecture documents, ADRs, existing code, open PRs, and tests.

Identify:

- the intended Phase 2 objective
- the capabilities that belong in Phase 2
- explicit exclusions
- dependencies on Phase 0 and Phase 1
- unresolved assumptions
- platform or access prerequisites
- items that must remain planned rather than implemented

Do not infer deployment or approval from the presence of code or configuration.

## 2. Verify the correct branch and dependency chain

Confirm:

- repository
- current branch
- branch base
- current commit SHA
- whether Phase 2 should be stacked on PR #10 or based on another branch
- whether the working tree is clean
- whether any uncommitted or unrelated files exist

Do not modify, commit, push, rebase, merge, or deploy during this step.

## 3. Perform a Phase 2 architecture review

Review the current implementation and identify:

- reusable Phase 1 contracts
- missing interfaces or abstractions
- API boundaries
- orchestration boundaries
- identity and authorization boundaries
- validation and evidence boundaries
- serialization and backward-compatibility concerns
- technical debt that would block Phase 2
- components that must not be coupled to Azure deployment state

## 4. Break Phase 2 into small implementation slices

Produce independent PR-sized slices.

For each slice include:

- purpose
- user-visible outcome
- exact files or modules likely affected
- dependencies
- implementation approach
- risks
- security impact
- backward-compatibility impact
- required unit tests
- required integration or smoke tests
- feature flags
- rollback approach
- acceptance criteria

Prefer small, independently reviewable slices over one large PR.

## 5. Recommend execution order

Provide a dependency-ordered sequence such as:

Phase 2A
↓
Phase 2B
↓
Phase 2C

Clearly identify the first slice that can be implemented and validated entirely locally without deployment or pending external approval.

## 6. Final output

Return:

1. confirmed Phase 2 scope
2. branch/base recommendation
3. architecture findings
4. ordered implementation slices
5. blockers and external dependencies
6. recommended first implementation slice
7. exact next prompt for implementing that first slice

Do not write feature code yet.

Do not create documentation merely to claim progress.

Do not deploy.

Do not commit or push.

Wait for explicit approval before implementing the first Phase 2 slice.
