Phase 0 repository-side implementation is now technically ready. Do not start Phase 1.

Perform the final Phase 0 packaging and review preparation:

1. Audit the complete diff:
   - confirm every changed file is required for Phase 0;
   - remove generated, duplicate, temporary, or unrelated files;
   - verify no secrets, tokens, sensitive logs, local paths, or production data are included;
   - confirm requirements.txt and pyproject.toml have consistent OpenAI dependency constraints.

2. Reconfirm the final validation summary:
   - backend: 553 passed, 3 skipped, coverage 78.14%;
   - offline golden baseline: 9 passed;
   - frontend: 29 files and 154 tests passed;
   - lint and build passed;
   - live golden baseline: 25 passed, 0 failed, 0 blocked, 0 skipped;
   - git diff --check passed.
   If any result has changed, report the new exact result.

3. Update PHASE_0_STATUS_AND_EVIDENCE.md so it clearly separates:
   - completed technical criteria;
   - evidence and exact commands;
   - remaining manual/platform actions;
   - required stakeholder approvals;
   - final Phase 0 status: “technically ready for approval, not yet formally approved.”

4. Record the missing per-call runtime model/deployment telemetry as a non-blocking follow-up issue for the runtime observability/model-routing work. Do not claim model usage was observed when it was not.

5. Create a clean Phase 0 feature branch if one is not already active, commit the approved changes with a clear commit message, push it, and create or update a Draft PR.

6. In the PR include:
   - scope and out-of-scope;
   - root causes fixed;
   - files changed;
   - complete test and golden-baseline evidence;
   - OpenAI/MSI compatibility rationale;
   - security and authorization impact;
   - migration and rollback;
   - remaining manual actions and approval owners.

7. Do not configure branch protection unless access is available and explicitly authorized. Otherwise provide exact repository-settings steps and required check names for a repository administrator.

8. Do not merge the PR and do not mark Phase 0 formally complete until the manual ruleset, evidence attachment, and stakeholder approvals are finished.

At the end, provide the branch name, commit SHA, PR link, final changed-file count, and the remaining manual approval checklist.
