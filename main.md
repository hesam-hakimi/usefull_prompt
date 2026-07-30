Continue Phase 0 only. Do not start Phase 1.

The remaining repository-side technical blocker is backend test coverage: current coverage is 78.14%, while the required gate is greater than 85%.

Raise meaningful backend coverage above 85% without gaming the metric.

1. Generate and inspect the detailed coverage report by module and line.
2. Prioritize uncovered production-critical paths, especially:
   - authentication and authorization;
   - configuration and environment handling;
   - SQL validation and safety;
   - primary and fallback orchestration;
   - Azure OpenAI/MSI authentication;
   - error handling, timeout, cancellation, and safe-stop behavior;
   - API endpoints changed or relied on by Phase 0.

3. Add meaningful unit and integration tests covering:
   - success paths;
   - failure and exception paths;
   - boundary conditions;
   - unauthorized and deny-all scenarios;
   - invalid configuration;
   - dependency failure;
   - redaction and security behavior.

4. Do not:
   - exclude production files merely to increase coverage;
   - add empty or assertion-free tests;
   - test implementation details without business value;
   - weaken security, authorization, or SQL safety;
   - modify unrelated runtime behavior;
   - start Phase 1.

5. Production-code changes are allowed only when a test reveals a genuine defect. Document any such defect and keep the fix minimal and backward compatible.

6. Re-run:
   - the full backend suite with branch coverage if supported;
   - the offline golden baseline;
   - the live 25-question golden baseline;
   - all frontend tests;
   - frontend lint and build;
   - git diff --check.

7. Update the Phase 0 status and PR evidence with:
   - coverage before and after;
   - module-level coverage summary;
   - exact tests added;
   - commands and results;
   - any uncovered lines intentionally remaining and why.

8. Confirm that requirements.txt and pyproject.toml remain aligned and that no secrets, local paths, generated artifacts, or unrelated files were added.

9. Keep the PR in draft. Do not merge it and do not claim formal Phase 0 closure because repository rulesets, exact required GitHub Checks, evidence attachment, and stakeholder approvals remain manual blockers.

10. Inspect the uncommitted COPILOT_AGENT_EXECUTION_PROMPT.md change. Do not include it unless it is genuinely required for Phase 0 and contains no unrelated changes; otherwise restore or leave it explicitly excluded.

At the end report:
- coverage before and after;
- tests added by module;
- backend/frontend/golden validation results;
- production defects fixed, if any;
- final changed-file count;
- remaining manual blockers;
- whether Phase 0 is technically eligible for approval.
