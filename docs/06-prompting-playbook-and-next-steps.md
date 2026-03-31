# 06. Prompting Playbook and Next Steps

This file is intended to help future sessions write better prompts for Copilot or any coding agent.

## General prompt rules

A good prompt for this project should always contain:

1. **Goal**
2. **Exact scenario**
3. **Scope boundaries**
4. **Files expected to inspect**
5. **Files expected to change**
6. **Acceptance criteria**
7. **Evidence required in final report**
8. **Warnings about not weakening validators**
9. **Reminder to use framework docs as source of truth**

---

## Prompt template for future coding tasks

Use a structure like this:

```md
# Task

## Goal
<State the exact objective>

## Scenario
<Give a concrete scenario, preferably one golden flow>

## Source of truth
- framework docs
- current repo behavior
- relevant tests

## Constraints
- do not invent framework structure
- do not weaken validators
- preserve doc-driven behavior
- preserve passing tests

## Work items
1. inspect current implementation
2. identify root cause
3. apply fix
4. add/update tests
5. run validation
6. provide evidence

## Final report must include
- root cause
- files changed
- exact fix
- exact generated artifact excerpts
- test results
- remaining gaps
```

---

## Prompt pattern for debugging real workspace writes

```md
# Task: Validate and fix real workspace writes

## Goal
Prove that @etl /create followed by @etl /write writes the generated artifacts into the actual selected workspace folder.

## Scenario
Use the customer_orders -> curated + Synapse scenario.

## Required checks
- create stores artifacts in session state
- write uses same session artifacts
- actual workspace root is resolved correctly
- main job config is written
- include files are written
- Synapse publish section is written when requested
- chat reports exact files created/overwritten/skipped

## Do not
- rely only on temp repo tests
- weaken validation to force writes
- bypass doc-driven output strategy rules

## Final report must include
- real workspace path used
- exact files written
- exact content excerpts
- preview vs real comparison
- tests added/updated
```

---

## Prompt pattern for framework doc fidelity fixes

```md
# Task: Align implementation to framework docs

## Goal
Find and fix doc drift between the extension implementation and framework reference docs.

## Focus
- output strategy behavior
- include file naming
- module keys
- path roots
- assert.sql.after formats
- table-specific vs stable naming

## Requirements
- show before/after behavior
- cite which doc rule caused the correction
- update tests to protect the corrected behavior
- do not normalize different strategies into one generic output shape
```

---

## Prompt pattern for env config reuse improvements

```md
# Task: Improve env config reuse / patch planning

## Goal
Make env config recommendation and patch planning more accurate and explainable.

## Must handle
- reuse_existing
- review_required
- create_new
- patch_existing
- manual_review

## Evidence required
- candidate scoring factors
- chosen decision and why
- missing vars
- suggested values
- generated patch/scaffold text
- tests added
```

---

## Prompt pattern for artifact reuse improvements

```md
# Task: Improve artifact reuse discovery and apply flow

## Goal
Reuse existing job/env/include artifacts safely when they are a high-confidence fit, otherwise recommend patching or creation.

## Must include
- discovery
- grouping into artifact sets
- scoring
- advisor decision
- preview mode
- apply mode
- safety checks
- backups before modification

## Must report
- why candidate won/lost
- what will be patched
- what new files are needed
- what blocks auto-apply
```

---

## Recommended next development steps

Based on the conversation history, the next steps should be:

## 1. Real workspace write validation
Highest priority.

### Why
This is the main place where confidence can still be false:
- preview okay
- tests okay
- temp repo okay
- real files still missing

### Expected output
A live run proving file creation in the selected workspace.

---

## 2. Manual smoke test matrix
Run a small but meaningful set of real scenarios:

1. curated load/enrich only
2. curated + Synapse publish
3. database_out
4. tibco_out
5. env reuse flow
6. artifact reuse flow

For each:
- preview
- validation
- write
- resulting files
- expected warnings

---

## 3. User-facing write summary hardening
Make write feedback impossible to misunderstand.

Desired chat output:
- workspace root
- files created
- files overwritten
- files skipped
- blocked reasons
- follow-up guidance

---

## 4. Controlled prompt library
Turn the best successful prompts into a small library:
- output strategy fixes
- real write validation
- env reuse enhancements
- artifact reuse enhancements
- smoke test execution prompts

---

## 5. Repo-grounded technical reference extraction
At some point, generate a repo-verified technical handbook from the current codebase itself, not only from screenshots and reports.

This should include:
- exact file map
- key interfaces
- key command paths
- sequence diagrams for create/validate/write
- real naming registry
- current tests and their coverage

---

## Things future prompts must avoid

Do not ask Copilot to:

- invent framework structures
- fake env-job linkage inside job config
- convert YAML include patterns to JSON without evidence
- externalize trivial writer SQL
- bypass validators
- declare success without real file evidence
- claim production write success using only temp repo output
