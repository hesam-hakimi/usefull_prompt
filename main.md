Perform an independent verification of the current 12-file diff. Do not modify any code.

Focus on these points:

1. Verify that approvalContext cannot be fabricated through the Copilot tool arguments.
   The guarded writer must validate it against extension-controlled preview and approval state, not merely trust fields such as approved=true or a caller-provided checksum.

2. Verify that the preview checksum is calculated and stored by the extension before approval, and that the writer compares the exact artifact content, destination, selected artifact type, workspace root, and approval record against that stored state.

3. Confirm that changed content after approval, replayed approval, wrong workspace, wrong destination, or forged approvalContext is rejected.

4. Confirm that package.json schema changes are backward-compatible and existing write operations without onboarding still work.

5. Prove that the five failing full-suite tests were already failing before this implementation and are unrelated to the 12 changed files. Do not modify or regenerate the golden baseline.

6. Review the exact diff for accidental scope, duplicated validation logic, and unnecessary complexity.

7. Confirm that no .github/** file, maintainer agent, consumer job config, env config, or consumer repository file was modified.

Return only:
- VERIFIED or CHANGES_REQUIRED;
- blocker/high/medium/low findings;
- exact file and function for every finding;
- test evidence;
- whether it is safe to press Keep.
