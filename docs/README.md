# ETL Copilot Extension Reference Pack

This pack is a reusable reference set for future sessions working on the **VS Code + GitHub Copilot Chat ETL Framework extension**.

## What this pack contains

1. **01-project-architecture.md**  
   Overall mission, extension architecture, main layers, and how the ETL generation flow is supposed to work.

2. **02-implementation-progress-and-status.md**  
   What has been completed, what was fixed during this effort, and what still remains.

3. **03-framework-rules-and-artifact-conventions.md**  
   The framework-specific rules that future prompts must respect, including output strategy rules, file naming, include conventions, and module structure.

4. **04-extension-code-map-and-runtime-flow.md**  
   The important files/classes that participate in the end-to-end flow, with emphasis on creation, validation, preview, and write.

5. **05-testing-validation-and-known-issues.md**  
   Testing approach, known warnings, temp-repo vs real workspace behavior, and how to avoid false confidence.

6. **06-prompting-playbook-and-next-steps.md**  
   A practical guide for writing future Copilot prompts, including prompt structure, quality gates, and the next recommended work items.

7. **07-review-and-gap-notes.md**  
   Review notes confirming what this pack covers and what still needs confirmation in the repo.

## Recommended reading order

- Read **01** first for the big picture.
- Read **03** before writing any prompt that affects job config generation.
- Read **04** before debugging code paths.
- Read **05** before trusting a passing test run.
- Use **06** when drafting the next Copilot task.

## Core truths captured in this pack

- The extension is now much more **doc-driven** and **layered** than at the start of the effort.
- Temp-repo test success is **not enough**; future work must keep verifying **real workspace writes**.
- The framework rules for `load_enrich_process`, `dataframe_writer`, `database_out`, and `tibco_out` are central and must not be “simplified away”.
- Reuse of existing env configs, artifact reuse, and conversation orchestration are now first-class concerns, not side topics.
- Future work should prefer **fixing orchestration/state/path issues** over weakening validators.

## Quick current state

Based on the work captured in this conversation:

- Major architecture layers for output strategy, env reuse, artifact reuse, action flow, and conversation orchestration were implemented.
- Test count grew significantly and eventually reached the high 400s in Copilot reports.
- The big unresolved operational theme was validating **real workspace writes** in the Extension Development Host and making sure previewed artifacts are actually written to the selected workspace.
- A concrete `customer_orders -> curated + Synapse` scenario was used as the main golden flow.

## Important caution

Some details in this pack come from:
- direct requirements you provided,
- architecture decisions discussed during the chat,
- Copilot progress reports,
- and screenshots of framework guidance files.

That means this pack is highly useful for continuity, but a future coding session should still confirm exact file names, signatures, and line numbers against the current repo before making large refactors.
