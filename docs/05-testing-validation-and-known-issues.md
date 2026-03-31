# 05. Testing, Validation, and Known Issues

## Main lesson

A huge amount of work in this project went into making tests pass, but the most important lesson is:

**A passing test suite is necessary, not sufficient.**

The system also needs:
- real Extension Development Host validation
- real workspace writes
- real artifact presence in expected folders

---

## Test categories added or referenced during the project

The screenshots and progress reports indicated coverage in these areas:

- output strategy tests
- artifact fidelity tests
- prompt-to-artifact acceptance tests
- blueprint tests
- intent extraction tests
- runtime readiness tests
- env config discovery tests
- env config patch tests
- artifact reuse tests
- artifact action tests
- conversation orchestration tests
- extension acceptance tests
- customer_orders + Synapse scenario acceptance coverage

Reported test totals increased across the effort:
- ~250+
- ~276
- ~312
- ~333
- ~369
- ~401
- ~442
- ~488

These exact totals should be re-confirmed in the repo.

---

## Why temp-repo tests can mislead

The project explicitly identified that tests were sometimes writing into a temp directory.

### What temp tests prove
- artifact generation shape
- include refs
- path generation logic in isolation
- session orchestration logic under harness
- acceptance scenarios under controlled test conditions

### What temp tests do not prove
- actual workspace resolution in the extension host
- actual persisted files under the selected VS Code workspace
- user-facing write summary correctness in real sessions

This is why “all tests passing” and “user still sees no files created” can both happen.

---

## Validation classes of interest

Multiple validation layers were discussed:

### 1. Structural validation
Checks whether config shape matches framework expectations.

### 2. Strategy validation
Checks whether selected strategy matches the artifact shape.

### 3. Runtime readiness validation
Checks whether unresolved placeholders, env vars, secrets, and required metadata are satisfied.

### 4. Pre-write validation
Final gate before write.

### 5. Human review guardrails
Warnings or blockers for scenarios needing SME confirmation, especially Synapse publish / merge behaviors.

---

## Known recurring warnings and issues

## A. TypeScript / editor warnings
A VS Code TypeScript language service caching issue was mentioned:
- new files may not be recognized immediately
- fix via “TypeScript: Restart TS Server”
- or “Developer: Reload Window”

This is a tooling problem, not always a code problem.

## B. Existing lint warnings
Several runs showed:
- no lint errors
- but a set of pre-existing warnings remained

These should be kept separate from new regressions.

## C. Mutex warning in VS Code test harness
A warning like:
- `Error mutex already exists`

was reported in test runs but did not always fail the run.  
Still worth tracking as noise vs true failure.

## D. Include resolution warnings
Examples from the customer_orders run:
- include not found in workspace because referenced shared config path was unresolved in current workspace
- this may be a real warning or an expected gap in a reduced test workspace

## E. Source/path mismatch warning
Example:
- `customer_order` path leaf vs `customer_orders` table name

This became a key scenario-specific bug and later fix target.

## F. Curated zone validation
A load_enrich module rendered with a non-framework-valid zone could block write.

## G. Synapse publish guardrails
The system surfaced warnings such as:
- Synapse publishing outside core pilot scope
- merge config needs careful review
- SME review recommended

These warnings should not be silently removed.

---

## Acceptance criteria future work should enforce

For any important scenario, especially real write scenarios, verify all of the following:

1. correct source table name
2. correct source alias
3. transform SQL reads from sourced alias
4. selected output strategy is correct
5. output module shape matches framework docs
6. required include files exist
7. env config decision is surfaced
8. runtime readiness is surfaced
9. write creates expected files in real workspace
10. user gets explicit write summary

---

## Current likely known gap

The biggest likely remaining operational gap after the work shown in screenshots:

### Real workspace write verification
The system still needed proof that:
- `@etl /create`
- followed by `@etl /write`
- writes into the actual workspace folder and not only into temp test folders

This should be treated as a top priority validation task.

---

## How to review future Copilot claims

When Copilot says something is “complete”, review with this checklist:

### Ask for evidence of:
- exact files changed
- exact generated artifact excerpts
- exact paths written
- test names added
- temp vs real workspace distinction
- final result of `npm test`
- whether a live Extension Development Host run was done

### Be cautious if:
- it only shows temp folder paths
- it only shows test output
- it says write is complete but does not list real files created
- it says “fixed” without showing preview vs actual write path

---

## Human-review-required areas

Even if validation passes, these areas may still require review before deployment:

- Synapse target behavior
- merge mode configuration
- CDC/SCD semantics
- business transformation SQL
- ADLS path correctness
- env config correctness
- mailbox / connection naming conventions
