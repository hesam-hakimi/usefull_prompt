Create TODOs first and keep them updated until everything is verified.

We have completed acceptance verification for the ETL extension and now need pilot-readiness preparation.

Current state:
- 123/123 tests passing
- 15 end-to-end acceptance tests passing
- 8 acceptance scenarios verified
- ACCEPTANCE_REPORT.md created
- Recommendation: ready for supervised pilot usage on simple bronze-to-silver jobs

New goal:
Prepare the extension for a controlled pilot release.

Do the following:

1. Review ACCEPTANCE_REPORT.md and extract:
   - confirmed capabilities
   - known limitations
   - pilot-safe scenarios
   - scenarios that should remain out of scope for pilot

2. Create a PILOT_READINESS.md document containing:
   - supported scenarios
   - unsupported scenarios
   - operator/user instructions
   - known limitations and risks
   - rollback/fallback guidance
   - how to report failures

3. Add a small “safe usage guardrail” section to the chat response logic so the extension clearly warns users when:
   - request is outside supported pilot scope
   - required fields are ambiguous
   - validation passes structurally but business logic may still need human review

4. Verify release readiness:
   - compile
   - test
   - confirm no broken launch/prelaunch behavior
   - confirm packaging readiness
   - list anything still blocking a pilot package

5. Produce a final pilot summary with:
   - ready / not ready
   - exact remaining risks
   - recommended version/tag
   - supervised pilot plan

Important rules:
- Keep TODOs visible and updated.
- Do not mark any item complete without evidence.
- Focus on safe pilot usage, not broad general availability.
- If any pilot blocker is found, fix it or clearly label it as a blocker.
