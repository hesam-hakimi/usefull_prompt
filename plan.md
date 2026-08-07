Do not modify any files.

The fresh independent Verifier returned CHANGES_REQUIRED for the Artifact Reuse Intent Regression fix.

I need the exact Verifier findings before any further implementation.

Report, verbatim where possible:

1. Every finding returned by the fresh Verifier.
2. Severity of each finding.
3. Exact affected file(s) and function/test names.
4. Which acceptance criterion failed:
   - generic/non-prompt-specific implementation
   - ordinary CREATE prompts remain non-reuse
   - genuine contextual reuse/readiness still routes correctly
   - full Electron result / unrelated failure isolation
   - scope containment
5. Whether each finding is:
   - PRODUCT_DEFECT
   - TEST_DEFECT
   - REGRESSION
   - PRE_EXISTING
   - VERIFIER_MISINTERPRETATION
6. The smallest recommended correction for each real finding.

Do NOT implement the corrections yet.
Do NOT change source or tests.
Do NOT rerun implementation.
Do NOT package or install.

End with:

VERIFIER_FINDINGS:
- ...
- ...

RECOMMENDED_NEXT_ACTION:
...
