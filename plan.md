Investigate and fix ONLY the Run Diagnosis regression group from the current Electron integration suite.

Repository:
etl_framework_extension

Branch:
feature/v3-agentic-redesign

This is a narrowly scoped INVESTIGATE → IMPLEMENT → TEST → VERIFY task.

Current verified integration baseline:

- Total: 136
- Passed: 122
- Failed: 12
- Pending: 2

The workspace-visibility defect has already been fixed and independently VERIFIED.

Do NOT modify or revisit that fix.

This task addresses ONLY the Run Diagnosis regression group, currently accounting for 8 failures.

Known triage evidence from the previous investigation:

Affected areas include RunDiagnosisService / RunDiagnosisRenderer / TroubleshootingAdvisor and related integration tests.

Observed failures include:

1. full flow column mismatch scenario
   - actual diagnosis: `unknown`
   - expected: `schema_mismatch`

2. remediation prompt rendering
   - expected job-specific remediation wording is missing or changed

3. multiple error log entries
   - expected multiple matched errors
   - actual result differs

4. permission-denied diagnosis
   - `result.diagnosis` is falsy

5. resource-exhausted / OOM diagnosis
   - `result.diagnosis` is falsy

6. log filtering
   - expected ERROR/WARN log details count differs

7. generic ADF output error extraction
   - actual diagnosis `unknown`
   - expected `missing_source`

8. related diagnosis timing / extraction behavior reported by the integration suite

Prior investigation identified likely contract drift across:

- error extraction
- diagnosis pattern matching
- SQL/log-detail handling
- TroubleshootingAdvisor input expectations
- remediation renderer wording

Important evidence already observed:

- `RunDiagnosisService.ts` only maps SQL log details when both
  `logResult.found` and `logResult.executionLog` are present.

- Some tests provide `found=true` and `logDetails` / `errorMessage`
  without the expected `executionLog`, resulting in missing diagnostic evidence.

- `TroubleshootingAdvisor` expects an AnalysisException-style shape before some
  `cannot resolve ... given input columns` messages can classify correctly;
  otherwise they fall through to `unknown`.

- `RunDiagnosisRenderer.ts` remediation wording has changed to guarded-remediation
  language while at least one integration test still expects older job-config wording.

Older Electron logs showed these diagnosis tests passing, so determine whether each
failure represents:
A. a real product regression,
B. an intentional contract change with a stale test,
or
C. an invalid/misaligned test fixture.

Do not assume all 8 share one fix.

Required approach:

1. Re-run ONLY the Run Diagnosis failing tests and capture exact assertions,
   actual values, and stack locations.

2. Group the 8 failures by root cause.

3. For each root cause, inspect the production implementation and test history/current
   contract before editing.

4. Decide explicitly whether PRODUCT CODE or TEST EXPECTATION is wrong.

5. Fix the canonical contract, not merely the assertions.

Guardrails:

- Do NOT weaken tests simply to make them pass.
- Do NOT blanket-map unknown errors to expected diagnoses.
- Do NOT introduce message-specific hacks for these exact test strings.
- Do NOT special-case CD Renewal, STTM, or any workbook.
- Do NOT alter STTM parsing or ExcelJS behavior.
- Do NOT modify the workspace visibility fix in `runTests.ts`.
- Do NOT touch `.github/**`, `AGENTS.md`, `workflow/**`, or consumer workspaces.
- Do NOT fix:
  - Artifact Reuse Router
  - Config Explain env/HOCON substitution
  - Copilot workflow command routing
  - activationEvents/chatParticipants
- Preserve fail-closed behavior for genuinely unrecognized runtime errors.

The resulting diagnosis pipeline must generically support:

raw runtime/ADF/log evidence
→ normalized evidence
→ error extraction
→ diagnosis classification
→ remediation/advisor
→ rendered user guidance

Validation:

A. Run the affected Run Diagnosis unit tests.
B. Run the affected Run Diagnosis integration tests in Electron.
C. Run relevant focused diagnosis suites.
D. Run normal `npm run test` after the focused tests pass.
E. Report the new full-suite counts.
F. Invoke a FRESH independent Verifier.

Acceptance criteria:

PASS only if:

1. All 8 currently identified Run Diagnosis failures are either:
   - fixed and passing, OR
   - individually demonstrated with evidence to be stale/incorrect tests and
     corrected to the canonical contract.

2. No unrelated failure group is modified.

3. Unknown/unrecognized errors still fail closed rather than being guessed.

4. Permission, resource exhaustion/OOM, schema mismatch, missing-source,
   multi-error, and log-filtering cases are correctly distinguished.

5. Remediation output reflects the current intended product contract.

6. Focused tests pass.

7. Electron integration confirms the behavior.

8. Fresh Verifier returns VERIFIED.

Final report:

## Run Diagnosis Regression Closure

### Baseline
### Failure Matrix
For each of the 8 failures:
- test
- observed behavior
- expected behavior
- root cause
- PRODUCT_DEFECT / STALE_TEST / FIXTURE_DEFECT
- fix

### Canonical Diagnosis Contract
### Files Changed
### Focused Test Results
### Full Electron Result
### Remaining Failures by Other Existing Root-Cause Groups
### Verifier Result
### Out-of-Scope Files Changed

Do not package or install the VSIX.
This is source-level product/test-contract correction only.
