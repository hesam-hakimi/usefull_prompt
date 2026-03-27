# Next Step: Real Workspace Write Validation + Fix Pass

We have already verified artifact generation in the temp test repo and added acceptance coverage for the `customer_orders -> Synapse` scenario.

Now move to the next phase: validate and fix the **real workspace write flow** in the Extension Development Host.

## Goal

Prove that `@etl /create` followed by `@etl /write` writes the generated ETL artifacts into the **actual selected workspace folder**, not only into temp test locations, and fix any issues found.

## Scope

Focus on this exact scenario:

- source: `customer_orders`
- transform: filter active records + derive `order_status`
- output: curated load/enrich
- publish target: Synapse
- env config: reuse existing
- include style: keep framework-valid behavior already implemented

## What to do

### 1. Execute the real extension flow in the Extension Development Host

Use the real chat flow, not the temp test harness:

1. Run `@etl /create` for the `customer_orders -> Synapse` scenario.
2. Then run `@etl /write`.
3. Confirm whether files are created in the actual workspace folder selected by the extension.

### 2. Trace the real write path

Inspect and document the real code path used during write, including at minimum:

- command handler that receives `@etl /write`
- session/artifact state used for the write
- workspace path resolution
- file write orchestration
- overwrite/create behavior
- include file write behavior
- env config handling during write

Show the exact methods/classes involved.

### 3. Verify real written artifacts

Confirm the actual workspace receives the expected files for this scenario:

- main job config
- transform include file
- any Synapse-related output module/config produced for this scenario

For each file, provide:

- exact full path
- whether created or overwritten
- short excerpt of actual written content

### 4. Compare preview vs real write

Verify that the files written to the real workspace match the generated preview/output already validated in tests.

Explicitly check:

- source table remains `customer_orders`
- source alias remains `vw_customer_orders`
- transform SQL reads from `vw_customer_orders`
- output strategy remains `curated_load_enrich`
- curated zone rendering remains framework-valid
- Synapse publish module/section exists when requested
- include refs are written and resolvable
- no temp-repo-only assumptions leak into production write path

### 5. Fix any real-write issues found

If real workspace write is failing or partial, fix the root cause.

Possible areas to inspect:

- session state not preserved between `/create` and `/write`
- artifact list not persisted correctly
- `RepoWriter.getWorkspacePath()` not resolving correctly in extension host
- write command still using temp-only code path
- preview artifacts generated but not passed into actual writer
- include files omitted from write phase
- overwrite safety blocking valid writes
- wrong workspace root or relative path handling

### 6. Improve user-facing write feedback

After fixing, improve the write UX so the chat response clearly reports:

- write started
- target workspace root
- files created
- files overwritten
- files skipped
- any blocked writes and why

The user should not have to guess whether anything was actually written.

### 7. Add automated coverage

Add tests that cover the real write orchestration logic as much as possible.

At minimum add coverage for:

- `/create` produces artifacts in session state
- `/write` consumes the same session artifacts
- writer receives actual artifact set
- include files are written with the job config
- Synapse publish artifacts are written when requested
- workspace path resolution is not temp-only in production code
- user-facing write summary is returned

If true end-to-end real workspace write cannot be fully automated in tests, then:
- add the highest-value integration/unit coverage possible, and
- document the exact manual validation steps used.

## Deliverable format

Provide a final report with these sections:

1. **Real Write Result**
   - success/failure
   - actual workspace path used
   - files written

2. **Root Cause**
   - if anything was broken, explain the exact cause

3. **Fix Applied**
   - exact files changed
   - exact methods changed
   - why the fix works

4. **Real Written Artifacts**
   - exact paths
   - short excerpts

5. **Preview vs Real Comparison**
   - pass/fail checklist

6. **Tests Added/Updated**
   - names of tests
   - what each test verifies

7. **Remaining Gaps**
   - anything still manual or unresolved

## Acceptance criteria

This task is complete only if all of the following are true:

- `@etl /create` followed by `@etl /write` writes files to the real selected workspace
- the written artifacts match the validated preview for the scenario
- job config + include files + Synapse-related artifacts are all present when expected
- the chat response clearly reports what was written
- automated coverage is added or improved for the write orchestration path
- `npm test` passes after the changes

## Important constraints

- Do not regress the already-passing temp artifact tests
- Do not remove the existing doc-driven output strategy behavior
- Do not weaken validators just to make write pass
- Prefer fixing orchestration/state/path issues over bypassing safeguards
- Keep the implementation aligned with the framework docs and current naming conventions
