Resolve only the merge conflict blocking PR #7.

Context:
- Stack #13 was created successfully.
- PR #7:
  - base: main
  - head: asktd_v2
  - state: OPEN and Draft
  - current reported conflict: CODEOWNERS
- PR #10 is stacked on PR #7.
- PR #11 is stacked on PR #10.
- PR #12 is stacked on PR #11.
- The existing asktd_v2 main checkout contains unrelated pre-existing dirty documentation changes.

Do not use, clean, reset, stash, commit, or modify the dirty asktd_v2 checkout.
Do not modify PRs #10, #11, or #12.
Do not mark any PR ready, merge anything, retarget anything, or deploy anything.

1. Fetch origin and perform a read-only verification:
   - verify PR #7 base is main;
   - verify its head is asktd_v2;
   - record origin/main and origin/asktd_v2 SHAs;
   - confirm the only reported merge conflict and identify every actually conflicting file;
   - inspect repository branch/ruleset requirements, especially whether linear history is required.

2. Create a new isolated worktree on a temporary local conflict-resolution branch starting exactly from origin/asktd_v2.

3. Safely incorporate origin/main:

   Preferred approach:
   - if merge commits are allowed, merge origin/main into the temporary branch;
   - do not rebase or rewrite PR #7 history.

   If repository policy requires linear history or prevents a merge commit:
   - stop before rebasing or force-pushing;
   - report the exact policy and proposed safe sequence;
   - do not perform a force-push without explicit approval.

4. Resolve CODEOWNERS semantically:
   - compare the version from origin/main with the version from origin/asktd_v2;
   - preserve all valid current ownership rules from main;
   - preserve the ownership coverage required by the approved Phase 0 work;
   - do not blindly select ours or theirs;
   - do not broaden or weaken protected ownership;
   - if the intended owners cannot be established from repository evidence, stop and report the ambiguity.

5. After resolution, verify:
   - no conflict markers remain;
   - git diff --check passes;
   - CODEOWNERS syntax and ownership paths are valid;
   - PR #7 still contains only its intended Phase 0 changes plus the conflict-resolution update;
   - no secrets, environment files, deployment changes, or Phase 1/2 changes were introduced.

6. Run the required PR #7 validation gates and the repository’s relevant backend, frontend, golden-baseline, lint, build, and coverage checks.

7. If all checks pass:
   - create the conflict-resolution commit;
   - push HEAD to origin/asktd_v2 using a normal non-force push;
   - do not change PR metadata;
   - do not mark PR #7 ready;
   - do not merge PR #7;
   - do not propagate changes into PRs #10–#12 yet.

Return:
1. starting SHAs;
2. conflict root cause;
3. exact CODEOWNERS resolution;
4. files changed;
5. test/check results;
6. resulting origin/asktd_v2 SHA;
7. confirmation that the push was non-force;
8. PR #7 merge/conflict/check status;
9. whether existing approvals remain valid;
10. confirmation that PRs #10–#12 and the dirty checkout were untouched.
