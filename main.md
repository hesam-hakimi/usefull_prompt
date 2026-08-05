Monitor PR #7 checks for the current head commit.

Repository:
TD-Enterprise/kmai-td-genie

PR:
#7

Do not modify files, commit, push, merge, change settings, or mark the PR
Ready for Review.

Wait until all checks registered for the current PR head reach a terminal
state.

Then report:

1. Current PR head SHA.
2. Every exact displayed check name.
3. Workflow and job corresponding to each check.
4. GitHub App/source.
5. Final status:
   - SUCCESS
   - FAILURE
   - CANCELLED
   - SKIPPED
   - TIMED OUT
6. Whether each check ran on the current head SHA.
7. Failed job step and error summary for any failure.
8. Checks that were expected but never registered.
9. Whether downstream open-pr-cycle and Terraform jobs appeared.
10. Whether the PR remains behind main.
11. Whether the PR remains Draft and BLOCKED.

Return:

# PR #7 Current Head Check Report

## PR head SHA
## Exact checks
## Successful checks
## Failed checks
## Skipped/cancelled checks
## Missing expected checks
## Behind-base status
## Remaining blockers

End with:

Safe to mark Ready for Review: NO
Safe to merge: NO
