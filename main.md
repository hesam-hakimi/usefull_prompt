Create and execute a separate frontend dependency remediation task.

Repository:
TD-Enterprise/kmai-td-genie

Known findings:
- brace-expansion — High
- postcss — Moderate

Security will not accept risk disposition. Both findings must be remediated
before Phase 0 closure.

Do not modify PR #7 directly until a validated fix is ready.

1. Restore authenticated GitHub access and fetch origin.
2. Protect the user's dirty checkout by using an isolated worktree.
3. Create a new branch:
   security/frontend-dependency-remediation
4. Base it on the branch that must receive the security fix before PR #7 can
   close. Explain the selected base.
5. Run:
   npm ci
   npm audit --json
   npm ls brace-expansion postcss
   npm outdated --json
6. Identify the exact parent dependencies introducing each vulnerable package.
7. Evaluate remediation in this order:
   a. lock-file refresh;
   b. patch/minor direct dependency upgrade;
   c. compatible npm overrides;
   d. controlled major tooling upgrade.
8. Do not run npm audit fix --force.
9. Apply the smallest real remediation that removes both findings.
10. Validate:
    npm ci
    npm audit --json
    npm test
    npm run lint
    npm run build
11. Run relevant backend/API contract and auth tests if tooling changes affect
    frontend behavior.
12. Confirm:
    - React build output path unchanged;
    - FastAPI static serving remains compatible;
    - MSAL builds;
    - REST and SSE clients still work;
    - bundle size has no material regression.
13. Before commit show:
    git status --short
    git diff --name-status
    git diff --stat
    git diff --check
14. Commit only if:
    - both vulnerabilities are removed;
    - all tests pass;
    - no unrelated files changed.
15. Create one commit:
    fix: remediate frontend dependency vulnerabilities
16. Push the new branch without force push.
17. Create a draft PR.
18. Do not merge.
19. Return:
    - exact dependency changes;
    - before/after audit;
    - test results;
    - files changed;
    - bundle-size comparison;
    - commit SHA;
    - PR URL;
    - whether PR #7 can clear the npm blocker after this PR merges.

End with:
- Both vulnerabilities remediated: YES/NO
- Safe to merge dependency PR: YES/NO
- PR #7 npm blocker clear after merge: YES/NO
