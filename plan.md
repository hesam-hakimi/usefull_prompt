Simplify CODEOWNERS for the current project stage.

Repository:
TD-Enterprise/kmai-td-genie

Pull request:
#9

Branch:
governance/codeowners-bootstrap

Current situation:

- The proposed organization teams do not exist.
- GitHub reports Unknown owner errors.
- For the current development stage, Hesam Hakimi is the temporary sole
  repository owner and reviewer.
- We want to remove the team-provisioning blocker and proceed quickly.

Instructions:

1. Update only the CODEOWNERS file.

2. Remove every unresolved or unknown team/user owner.

3. Use this verified GitHub user as the temporary owner for all repository
   paths:

   @hesam-hakimi

4. Keep the file simple. Prefer:

   * @hesam-hakimi

5. Add only narrowly justified exceptions if technically required, but every
   rule must still use @hesam-hakimi.

6. Add a comment at the top:

   # Temporary bootstrap ownership for the initial project stage.
   # Replace with approved enterprise teams before broad Beta or Production.

7. Validate:

   - CODEOWNERS syntax;
   - zero Unknown owner errors;
   - @hesam-hakimi exists;
   - @hesam-hakimi has sufficient repository access;
   - all repository paths are covered;
   - git diff --check passes;
   - PR #9 contains only CODEOWNERS.

8. Amend or create the required commit on the existing PR #9 branch.

9. Push normally without force push unless updating the existing branch
   technically requires a standard fast-forward push.

10. Keep PR #9 as Draft only if GitHub still reports an owner or syntax error.
    Otherwise report whether it is safe to mark Ready for Review.

11. Do not merge automatically.
12. Do not modify PR #7.
13. Do not change repository settings.

Return:

# Simplified CODEOWNERS Result

- Owner used
- Unknown owner count before
- Unknown owner count after
- CODEOWNERS content
- Commit SHA
- PR #9 head SHA
- Validation result
- Safe to mark PR #9 Ready for Review: YES/NO
- Safe to merge PR #9: YES/NO
- Effect on PR #7 after merge
