Do not modify any files.

The fresh Verifier confirmed that the Artifact Reuse implementation itself is correct and that the only blocking finding is scope containment because the working tree contains unrelated pre-existing dirty files.

Do NOT change ArtifactReuseIntentRouter.ts.
Do NOT change artifactReuseConversation.test.ts.
Do NOT clean, reset, revert, stash, or commit unrelated working-tree changes.

Your task is only to establish a grounded verification boundary for this completed task.

The intended task diff is exactly:

1. ArtifactReuseIntentRouter.ts
2. artifactReuseConversation.test.ts

Do the following:

1. Reconstruct the task boundary from this session's execution evidence:
   - identify the files that were already modified before this Artifact Reuse task began;
   - identify the exact two files modified by this task;
   - distinguish PRE_EXISTING_DIRTY from TASK_DIFF.

2. Use git/status/diff evidence where useful, but do not claim that a dirty file is pre-existing unless the task/session evidence supports it.

3. Produce a scope table:

   File
   Current dirty?
   Changed by this task?
   Evidence
   Classification

4. Confirm whether this task modified anything outside:
   - ArtifactReuseIntentRouter.ts
   - artifactReuseConversation.test.ts

5. Then invoke a FRESH independent Verifier and explicitly give it the scoped task boundary.

The verification question is:

"Did this Artifact Reuse task itself modify any file outside the two-file task diff?"

The existence of unrelated pre-existing dirty files MUST NOT by itself count as a scope violation.

The Verifier should evaluate:
- the exact two-file task diff;
- the recorded task-start/task-execution evidence;
- behavior/regression evidence already produced;
- whether any out-of-scope modification was attributable to THIS task.

Do not ask the Verifier to require a globally clean working tree.

Return:

TASK_DIFF:
...

PRE_EXISTING_DIRTY:
...

SCOPE_EVIDENCE:
...

FRESH_VERIFIER_RESULT:
VERIFIED | CHANGES_REQUIRED | BLOCKED

If VERIFIED, explicitly state:
"No out-of-scope file was changed by this task."

If reliable task-start evidence is genuinely unavailable, return BLOCKED_SCOPE_PROVENANCE instead of changing files or fabricating evidence.
