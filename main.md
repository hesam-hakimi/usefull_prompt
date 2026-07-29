Continue Phase 0 only. Do not start Phase 1.

Resolve the remaining technical blockers that can be fixed in the repository:

1. Investigate the 7 backend test failures.
2. For the 6 `test_config_and_env.py` failures:
   - inspect the current diff in `config_loader.py`;
   - determine exactly which removed auth/security mappings and override-cleanup behavior caused the failures;
   - restore only the required behavior with the smallest safe change;
   - do not overwrite unrelated valid work;
   - show the exact before/after behavior and tests proving the fix.

3. For the `openai==2.8.1` Azure MSI token-provider incompatibility:
   - identify whether the issue is dependency pinning, SDK API usage, or the authentication adapter;
   - compare the installed version with the repository’s declared supported version;
   - implement the smallest compatible fix;
   - do not replace managed identity with an API key;
   - add a regression test for the Azure MSI authentication path.

4. After the fixes, rerun:
   - the complete backend test suite with coverage;
   - all frontend tests;
   - frontend lint and build;
   - the offline golden baseline;
   - the full live 25-question golden baseline.

5. For the live golden run, record per-question:
   - pass/fail/blocked;
   - route and model used;
   - selected dataset or recipe;
   - SQL validation result;
   - latency;
   - redacted failure reason.

6. Update `PHASE_0_STATUS_AND_EVIDENCE.md` with exact commands and results.

7. Keep GitHub branch protection, required-check configuration, evidence attachment, and stakeholder approvals listed as external/manual actions. Do not claim they are complete.

At the end, report:
- root cause of each backend failure;
- exact files changed;
- complete validation results;
- live golden-baseline results;
- remaining technical blockers;
- remaining manual blockers;
- whether Phase 0 is technically ready for approval.

Do not mark Phase 0 complete unless all repository-side tests pass and the live golden baseline has successfully executed. Do not modify unrelated files.
