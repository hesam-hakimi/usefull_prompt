Create a separate minimal CODEOWNERS bootstrap pull request.

Repository:
TD-Enterprise/kmai-td-genie

Target branch:
main

Purpose:
Make CODEOWNERS effective from the base branch before PR #7 is formally reviewed.

Requirements:

1. Use authenticated GitHub source of truth.
2. Protect the user's existing dirty checkout by using an isolated worktree.
3. Fetch the latest origin/main.
4. Create a new branch:

   governance/codeowners-bootstrap

5. Copy only the reviewed CODEOWNERS rules from PR #7.
6. Do not include any Phase 0 code, documentation, architecture, dependency,
   workflow, or product changes.
7. Validate:
   - CODEOWNERS syntax;
   - referenced path coverage;
   - referenced users/teams where GitHub access permits;
   - git diff --check.
8. Confirm coverage for:
   - backend;
   - frontend;
   - tests;
   - authentication;
   - authorization;
   - SQL safety;
   - deployment/workflows;
   - Phase 0 evidence;
   - CODEOWNERS itself;
   - .github files where appropriate.
9. Commit with:

   chore: bootstrap CODEOWNERS

10. Push without force.
11. Create a small draft PR targeting main.
12. Do not merge.
13. Do not modify PR #7.
14. Do not change repository settings.

Return:

# CODEOWNERS Bootstrap PR

- Base SHA
- Branch
- Commit SHA
- Pull request URL
- Exact file changed
- Validation result
- Referenced teams/users verified
- Safe to mark Ready for Review: YES/NO
- Safe to merge: YES/NO
- Effect on PR #7 after merge
