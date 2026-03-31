# ETL Copilot Extension — Next Steps Implementation Plan

## Purpose

This plan is designed to be used directly by a coding agent in future sessions.

It has four jobs:

1. show what is already implemented
2. show what is partially implemented or unverified
3. define the next implementation steps in priority order
4. provide update blocks the agent can edit after each milestone

---

## How the agent should use this file

### Status legend

- `[x]` completed and repo-verified or strongly evidenced
- `[-]` implemented but still needs real-workspace or repo confirmation
- `[ ]` not complete / not yet validated / still remaining
- `[?]` uncertain and must be re-checked in the repo before changing behavior

### Update rule

When finishing a section, the agent should update:

- the status checkbox
- the "What changed" block
- the "Evidence" block
- the "Remaining gaps" block

Do not mark a section complete only because tests passed in a temp repo.
A section involving real writes is only complete after a live Extension Development Host run proves files were written to the real workspace.

---

# 1. Snapshot of current state

## 1.1 Architecture status

| Capability area | Status | Notes |
|---|---|---|
| Intent understanding | `[x]` | Present in the layered architecture and conversation routing stack |
| Transformation planning | `[x]` | Advisor + planner + validator + context provider implemented |
| Output strategy selection | `[x]` | Supports curated_load_enrich, generic_dataframe_write, database_out, tibco_out |
| Runtime readiness checks | `[x]` | Readiness evaluator and strategy-specific requirements implemented |
| Env config discovery | `[x]` | Discovery + scoring + advisor implemented |
| Env config patch planning | `[x]` | Patch/scaffold/manual-review planning implemented |
| Artifact reuse discovery/scoring | `[x]` | Discovery + scoring + advisor implemented |
| Artifact patch/apply safety layer | `[x]` | Preview/apply/create with safety checks and backups implemented |
| Conversation orchestration | `[x]` | Multi-turn reuse/review/apply flow implemented |
| Pre-write validation | `[x]` | Validation layers exist and are wired into flow |
| Real workspace write proof | `[-]` | This is still the biggest operational gap |
| Live smoke test matrix | `[ ]` | Still needs end-to-end real extension validation |
| User-facing write clarity | `[-]` | Desired, but must be verified in live host |
| Repo-grounded technical handbook | `[ ]` | Still recommended as a later hardening task |

---

## 1.2 Completed feature inventory

### Implemented with high confidence

- `[x]` transformation guidance layer
- `[x]` output strategy layer
- `[x]` runtime readiness layer
- `[x]` env config discovery and reuse recommendation
- `[x]` env config patch planning
- `[x]` artifact reuse discovery/scoring/advice
- `[x]` artifact action/review/apply layer
- `[x]` multi-turn conversation orchestration for artifact reuse
- `[x]` customer_orders golden scenario fix for alias/path/curated rendering
- `[x]` doc-fidelity corrections for `database_out` and `tibco_out`
- `[x]` broad automated test expansion

### Implemented but still operationally incomplete

- `[-]` real workspace `@etl /create` to `@etl /write` persistence
- `[-]` proof that previewed artifacts are the same artifacts written in the live extension host
- `[-]` proof that include files are written together with main job config in the real workspace
- `[-]` proof that Synapse publish artifacts are written in the real workspace when requested

### Still remaining

- `[ ]` live smoke-test matrix across the main output strategies
- `[ ]` write summary hardening with explicit created / overwritten / skipped / blocked output
- `[ ]` repo-grounded documentation extracted from actual current source tree
- `[ ]` final repo confirmation for some naming/signature details before deep refactors

---

# 2. Source-of-truth rules the agent must preserve

## 2.1 Non-negotiable rules

- The extension is a **layered decision engine**, not just a prompt wrapper.
- Output strategy must remain **doc-driven**.
- `database_out` and `tibco_out` must stay **specialized** and must not be flattened into a generic writer shape.
- Env-config linkage is **external to the job config**.
- Trivial output/write SQL should **not** be externalized into meaningless include files.
- Passing temp-repo tests is **not proof** of real write success.
- Validators must not be weakened just to make write succeed.

## 2.2 Framework conventions to preserve

### curated_load_enrich
- use `load_enrich_process`
- keep framework-valid curated zone behavior
- preserve merge / CDC / SCD semantics

### generic_dataframe_write
- use `dataframe_writer`
- keep output/write SQL inline unless there is a real reason not to

### database_out
- dual-file pattern
- generic YAML includes
- stable generic module keys
- root variable should follow `${adls.source.root}`

### tibco_out
- dual-file pattern
- generic YAML includes
- root variable should follow `${adls.tibco.root}`
- assertion should use literal `'tibco' AS log_type`

---

# 3. Priority-ordered implementation plan

# Phase 1 — Prove and harden real workspace writes

## Goal
Close the biggest remaining operational gap: prove that live extension usage writes artifacts into the actual selected workspace, not just a temp test repo.

## Status
`[-]` implemented in principle, not yet fully proven end-to-end

## Why this is first
Without this proof, all other work has lower value because preview/test success can still fail the real user workflow.

## Work items

### 1.1 Trace the live write path end-to-end
- [ ] inspect the real command path from chat request to file write
- [ ] confirm which command handles `@etl /create`
- [ ] confirm which command handles `@etl /write`
- [ ] confirm session artifacts created during `/create` are the same ones used by `/write`
- [ ] confirm the production workspace root is not overridden by temp-repo test logic

### 1.2 Instrument the live write flow
- [ ] log the resolved workspace root
- [ ] log the artifact list before write
- [ ] log each target file path before write
- [ ] log create vs overwrite vs skip decision per file
- [ ] log any validator block reason per file set

### 1.3 Validate real file creation in Extension Development Host
- [ ] run the customer_orders → curated + Synapse scenario in the live host
- [ ] execute `@etl /create`
- [ ] execute `@etl /write`
- [ ] verify files exist physically in the actual selected workspace
- [ ] verify include files exist together with the main job config
- [ ] verify preview content matches written content

### 1.4 Add regression protection
- [ ] add/update tests for write command orchestration
- [ ] add/update tests for session artifact reuse between create and write
- [ ] add/update tests proving include files are included in the write set
- [ ] add/update tests proving no temp writer leaks into production path resolution

## Files likely to inspect
- `ETLChatParticipant.ts`
- `CreateJobSessionService.ts`
- `SessionState.ts`
- `PreWriteValidationPipeline.ts`
- `RepoWriter.ts` or equivalent workspace writer
- `JobConfigRenderer.ts`
- any write-command orchestration handler

## Acceptance criteria
- [ ] chat reports actual workspace root used
- [ ] chat lists actual files created/overwritten/skipped/blocked
- [ ] main job config is written to the real workspace
- [ ] include files are written to the real workspace
- [ ] Synapse publish section is written when requested
- [ ] real workspace result matches previewed artifacts

## Hints for the agent
- Compare production workspace path resolution against the temp test harness path override.
- Verify that preview mode and write mode use the same rendered artifact objects.
- Check whether validators return warnings vs hard blocks and whether that block state is incorrectly stopping write without surfacing the reason.
- Add explicit evidence in the final report: real path, exact files, content excerpt, preview vs write comparison.

## Agent update block

### What changed
- TODO

### Evidence
- TODO

### Remaining gaps
- TODO

---

# Phase 2 — Manual smoke-test matrix in the live extension

## Goal
Validate the core user scenarios end-to-end in the real extension host.

## Status
`[ ]` not complete

## Scenarios to run
- [ ] curated load/enrich only
- [ ] curated load/enrich + Synapse publish
- [ ] database_out
- [ ] tibco_out
- [ ] env reuse + patch suggestion
- [ ] artifact reuse + patch suggestion

## For each scenario, verify
- [ ] strategy decision is correct
- [ ] preview is correct
- [ ] validation output is understandable
- [ ] write executes in the real workspace
- [ ] include files are created when required
- [ ] warnings are surfaced but not hidden
- [ ] generated artifact shape matches framework conventions

## Extra operational checks
- [ ] confirm healthcheck-style validation catches unresolved variables and config shape issues before execution
- [ ] confirm smoke-test outputs support ETL operational workflows like task queue / execution checks after deployment

## Acceptance criteria
- [ ] all six scenarios complete with evidence
- [ ] each scenario has exact file list produced
- [ ] each scenario has expected warnings documented
- [ ] each scenario notes whether human review is required

## Hints for the agent
- Use the operations handbook as a reminder that deployment validation should ultimately support job execution, monitoring, and smoke tests, not only file generation.
- Keep the customer_orders scenario as the golden path, but do not stop there.
- Save screenshots or exact file path evidence for each live scenario.

## Agent update block

### What changed
- TODO

### Evidence
- TODO

### Remaining gaps
- TODO

---

# Phase 3 — Write UX hardening

## Goal
Make the live write experience impossible to misunderstand.

## Status
`[ ]` still needs explicit hardening and live verification

## Problems this phase should solve
- success message shown but no files obvious to the user
- unclear whether files were written, skipped, or blocked
- unclear where the files went
- unclear whether warnings were non-blocking or blocking

## Required behavior
- [ ] show workspace root
- [ ] show main job config path
- [ ] show include file paths
- [ ] show created/overwritten/skipped/blocked counts
- [ ] show validator block reasons clearly
- [ ] show next step guidance when write is blocked

## Suggested response shape

```md
## Write Result
- Workspace root: <path>
- Created: <n>
- Overwritten: <n>
- Skipped: <n>
- Blocked: <n>

### Files created
- ...

### Files overwritten
- ...

### Files skipped
- ...

### Block reasons
- ...

### Next step
- ...
```

## Acceptance criteria
- [ ] live chat output always states real workspace root
- [ ] live chat output always lists exact file outcomes
- [ ] block reasons are explicit and actionable
- [ ] success is never claimed without file-level evidence

## Hints for the agent
- Reuse the same artifact list assembled for actual write rather than rebuilding a second summary list.
- Separate validator warnings from validator blocks.
- Make sure the response builder never shows a generic success message without enumerating files.

## Agent update block

### What changed
- TODO

### Evidence
- TODO

### Remaining gaps
- TODO

---

# Phase 4 — Repo confirmation and doc-drift sweep

## Goal
Re-check the parts still marked uncertain before any big refactor.

## Status
`[?]` needs repo-grounded confirmation

## Items to confirm in the repo
- [ ] exact final TIBCO control module key
- [ ] exact latest file paths and class signatures for newly added layers
- [ ] exact write path method names
- [ ] exact latest test suite names and counts
- [ ] exact latest path patterns after recent corrections
- [ ] exact final generated naming for database_out and tibco_out artifacts

## Why this matters
The reference pack is very useful, but some details came from progress reports and screenshots rather than a fresh repo diff.

## Acceptance criteria
- [ ] uncertainty list reduced to near zero for active code paths
- [ ] any doc drift found is fixed or documented
- [ ] tests updated to protect the confirmed conventions

## Hints for the agent
- Do this phase before deep renaming/refactoring.
- If repo reality differs from older screenshots, prefer the repo + framework docs over older assumptions.

## Agent update block

### What changed
- TODO

### Evidence
- TODO

### Remaining gaps
- TODO

---

# Phase 5 — Controlled prompt library for future development

## Goal
Turn the best working tasks into reusable prompt templates for future sessions.

## Status
`[-]` partially available in notes, not yet organized as a maintainable library

## Prompt families to create
- [ ] real workspace write validation prompt
- [ ] output strategy doc-fidelity prompt
- [ ] env config reuse / patch prompt
- [ ] artifact reuse / apply prompt
- [ ] smoke-test execution prompt
- [ ] repo-grounded technical handbook extraction prompt

## Deliverable format
Create a folder such as:

```text
/docs/agent-prompts/
  01-real-write-validation.md
  02-output-strategy-doc-fidelity.md
  03-env-reuse-and-patch.md
  04-artifact-reuse-and-apply.md
  05-live-smoke-test-matrix.md
  06-repo-technical-handbook-extraction.md
```

## Acceptance criteria
- [ ] each prompt has goal, scenario, files to inspect, constraints, acceptance criteria, and required evidence
- [ ] prompts explicitly forbid validator weakening and temp-only proof
- [ ] prompts are short enough to reuse but detailed enough to avoid ambiguity

## Hints for the agent
- Start from the prompting playbook structure.
- Keep the customer_orders scenario in the real-write prompt.
- Add a standard “Final report must include” section in every prompt.

## Agent update block

### What changed
- TODO

### Evidence
- TODO

### Remaining gaps
- TODO

---

# Phase 6 — Repo-grounded technical handbook

## Goal
Produce a fresh technical handbook directly from the current repo, not from screenshots.

## Status
`[ ]` not yet done

## Deliverables
- [ ] exact source-tree map
- [ ] command flow for `/create`, `/validate`, `/preview`, `/write`
- [ ] key interfaces and important types
- [ ] renderer / validator / writer sequence diagram
- [ ] output strategy mapping registry
- [ ] env reuse and artifact reuse flow map
- [ ] live test coverage map

## Suggested file set

```text
/docs/repo-handbook/
  01-source-tree-map.md
  02-command-flow.md
  03-key-interfaces.md
  04-render-validate-write-sequence.md
  05-output-strategy-registry.md
  06-reuse-flow-map.md
  07-test-coverage-map.md
```

## Acceptance criteria
- [ ] all content derived from current repo inspection
- [ ] links back to exact files/classes/functions
- [ ] handbook is usable without needing screenshot history

## Hints for the agent
- This should happen after Phase 1 is stable.
- Use it to reduce future ambiguity and shorten future prompts.

## Agent update block

### What changed
- TODO

### Evidence
- TODO

### Remaining gaps
- TODO

---

# 4. Practical backlog board

## P0 — do first
- [ ] Phase 1: prove and harden real workspace writes
- [ ] Phase 2: run live smoke-test matrix for core scenarios
- [ ] Phase 3: harden write UX summary

## P1 — do next
- [ ] Phase 4: repo confirmation and doc-drift sweep
- [ ] Phase 5: controlled prompt library

## P2 — do after P0/P1 stabilize
- [ ] Phase 6: repo-grounded technical handbook

---

# 5. Final definition of done

The next phase is complete only when all of the following are true:

- [ ] `@etl /create` stores the correct artifacts in session state
- [ ] `@etl /write` writes those exact artifacts into the real selected workspace
- [ ] main job config and include files both exist in the workspace
- [ ] customer_orders curated + Synapse scenario works in the live extension host
- [ ] database_out and tibco_out both pass live smoke tests
- [ ] write summary clearly reports created/overwritten/skipped/blocked files
- [ ] no validator weakening was introduced
- [ ] framework doc conventions are still preserved
- [ ] remaining repo uncertainties are documented or closed

---

# 6. Suggested first agent task

Use this exact starting objective for the next session:

> Validate and fix the real workspace write flow for `@etl /create` → `@etl /write` using the `customer_orders -> curated + Synapse` scenario. Prove that the extension writes the main job config and required include files into the actual selected workspace root, not a temp test folder, and return exact file paths, before/after evidence, and tests updated.

