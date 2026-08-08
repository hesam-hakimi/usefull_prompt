Task: Stabilize and classify the current extension-source working tree before packaging.

Environment terminology:
- This repository, where the VS Code extension source is developed, is the production environment.
- The etl-acz0004-cd-renewal consumer workspace is the test environment.

This task is investigation and planning only.

Do not modify, stage, commit, revert, stash, package, install, reload, or publish anything.

1. Capture the current production-repository state using:
   - git status --porcelain
   - git diff --name-only
   - git diff --stat
   - current branch and HEAD
   - staged and unstaged changes separately

2. Inspect every currently dirty file and classify it as exactly one of:
   - TASK_DIFF_CONFIRMED
   - PRE_EXISTING_DIRTY
   - GENERATED_OR_TEMPORARY
   - UNKNOWN_OWNERSHIP

3. Where evidence permits, associate each TASK_DIFF_CONFIRMED file with one of these completed tasks:
   - workflow contract / shipped-extension Definition of Done correction
   - stale TEST commands in SKILL.md
   - ExcelJS ESLint pretest correction
   - Electron test workspace-visibility correction
   - Run Diagnosis regression correction
   - Artifact Reuse intent-routing correction
   - Copilot workflow command-routing stale-test correction
   - Chat Participant activation-event stale-test correction
   - Config Explain fixture correction
   - Mocha exit-code propagation correction

4. For the exit-code propagation task, confirm that its intended file boundary is only:
   - src/test/runTest.ts
   - src/test/harness/mochaResultGuard.ts
   - src/test/unit/mochaResultGuard.test.ts
   - src/test/testPatterns.ts

5. Do not infer task ownership from filenames alone. Use:
   - current diffs
   - task-start or before-edit evidence available in the chat/session
   - git history and blame where useful
   - test names and implementation purpose

6. Produce a Working Tree Reconciliation Matrix with:
   - file
   - current status
   - owning task
   - classification
   - evidence
   - whether safe to include in a logical commit
   - remaining uncertainty

7. Propose the smallest coherent logical commit groups, including:
   - exact file list for each proposed commit
   - proposed commit message
   - tests already available for that group
   - tests that must run before commit
   - dependencies/order between commit groups

8. Identify files that must not be included in any commit until ownership is clarified.

9. Do not stage or commit. Stop after presenting the reconciliation matrix and proposed commit sequence.

Return:
- repository/branch/HEAD
- dirty-file inventory
- reconciliation matrix
- proposed commit groups in order
- blockers and unknowns
- Files Changed: NONE
