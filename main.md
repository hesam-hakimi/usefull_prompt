Good progress. Now I need runtime proof, not sample output.

Create TODOs first and keep them updated until everything below is fully implemented and verified.

I do NOT want only “sample validation-failure output” or “sample successful write output”.
I want real end-to-end evidence from the actual create flow.

Do all of the following:

1. Run a real @etl /create scenario that intentionally produces invalid generated artifacts.
Use a case that triggers at least one of these:
- invalid JSON include
- placeholder SQL / TODO / NULL AS derived column
- wrong single_job vs split job shape
- unresolved env variable
- include file extension/content mismatch

2. Show the REAL runtime result from the extension:
- exact request used
- exact generated artifact paths
- exact validation errors
- proof that files were NOT written
- proof that /write and /deploy are also blocked for the same invalid artifacts

3. Run a second real @etl /create scenario that succeeds.
Show:
- exact request used
- exact generated artifact paths
- validation stages passed
- proof that files were written only after validation success

4. Prove the repair pass is real.
For one failing case:
- show original generated artifact content
- show what the repair pass changed
- show second validation result
- if still failing, prove write remained blocked

5. Add tests for real behavior, not just helper methods:
- failed validation prevents RepoWriter.writeArtifacts from being called
- failed validation prevents /write
- failed validation prevents /deploy
- successful validation allows write
- repair pass re-validates before write

6. Address the VS Code run/debug issue if still present:
- fix npm:watch prelaunch task / launch configuration
- show the exact tasks.json and launch.json changes if needed
- confirm extension host launches cleanly

7. Final response format:
- TODO checklist
- files changed
- real failing scenario output
- real passing scenario output
- proof of blocked write
- proof of successful write
- compile result
- test result
- whether prelaunch/debug issue is fixed

Important:
Do not give me mock outputs or sample outputs.
Do not stop at unit tests.
I need actual runtime verification from the extension flow.
