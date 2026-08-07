Implement ONLY the confirmed Config Explain fixture correction for the final
remaining Electron failure:

"Config Explain Integration resolves env variables for lineage outputs"

Task classification: source-only test correction.
Target type: extension-source.

Do not package, install, reload, publish, or run a live smoke test.

AUTHORITATIVE INVESTIGATION RESULT

ROOT_CAUSE: FIXTURE_DEFECT

The failing test fixture currently supplies the environment configuration as a
single-line inline object similar to:

{ synapse.schema: "acz0001" }

The current supported parser path is line-based. It interprets the opening brace
as part of the key, producing a malformed key such as:

"{ synapse.schema"

Therefore `${synapse.schema}` is not substituted, and the lineage target is
rendered incorrectly instead of:

synapse:acz0001.digital_event

The repository's canonical environment configs use normal HOCON-style
key/value entries rather than this single-line inline-object fixture shape.

SAFETY GATE

Before editing, confirm from repository documentation, canonical env configs,
neighboring fixtures, and tests that single-line inline HOCON objects are not an
explicitly supported product contract.

- If inline-object syntax is explicitly required or documented as supported,
  STOP without editing and report PRODUCT_DEFECT.
- Otherwise proceed with the fixture-only correction below.

REQUIRED CHANGE

Modify only:

src/test/suite/explain/explain.integration.test.ts

At the environment fixture near the failing test, replace the malformed
single-line inline object with the exact canonical key/value formatting used by
real repository environment configurations.

Use the repository-supported equivalent of:

synapse.schema = "acz0001"

Use the exact formatting style evidenced in canonical env configs; do not
invent a new syntax.

PRESERVE THE TEST CONTRACT

Keep unchanged:

- the dbTable expression;
- the writer format/provider input;
- the expected lineage value;
- the assertion requiring:
  synapse:acz0001.digital_event

Do not weaken, remove, broaden, or hard-code around the assertion.

PROTECTED FILES AND COMPONENTS

Do not modify:

- HOCONConfigValidator.ts
- ConfigExplainService.ts
- IncludeResolver.ts
- OutputClassifier.ts
- LineageBuilder.ts
- package.json
- any production source file
- any consumer-workspace file
- .github/**
- workflow/**
- AGENTS.md
- resources/copilot/**
- unrelated tests or pre-existing dirty files

EXECUTION PROCEDURE

1. Capture `git status --porcelain` before editing and record the task-start
   dirty-file baseline.

2. Make the smallest coherent fixture-only correction.

3. Run the exact focused Electron test:

   Config Explain Integration resolves env variables for lineage outputs

4. Confirm its actual lineage target contains exactly:

   synapse:acz0001.digital_event

5. Run the neighboring Config Explain test slice.

6. Run the relevant HOCON/environment-substitution unit tests, if already
   available. Do not create unrelated parser capabilities.

7. Run the normal full Electron/integration command:

   npm run test

8. Invoke a fresh independent Verifier scoped only to this task's diff.
   Give the Verifier the task-start dirty-file baseline so pre-existing changes
   are not attributed to this task.

EXPECTED RESULT

Previous verified baseline:

138 total / 135 passed / 1 failed / 2 pending

Expected after this correction:

138 total / 136 passed / 0 failed / 2 pending

The two pending Chat API tests may remain pending. Explain any count difference
with exact test names.

ACCEPTANCE CRITERIA

- The named Config Explain test passes.
- The expected lineage target remains:
  synapse:acz0001.digital_event
- Only `src/test/suite/explain/explain.integration.test.ts` is changed by this
  task.
- No assertion is weakened.
- No production code is changed.
- No parser capability is added.
- No consumer workspace is modified.
- No package/install/reload/live-smoke action occurs.
- Fresh independent Verifier returns VERIFIED.

RETURN

## CONTRACT_SAFETY_CHECK
State whether inline-object HOCON syntax is documented as supported and cite
the repository evidence used.

## EXACT_CHANGE
Show the old fixture shape and new fixture shape.

## FOCUSED_TEST_RESULT

## FULL_TEST_RESULT
Include total, passed, failed, and pending counts and names of any non-passing
tests.

## VERIFIER_RESULT

## SCOPE_CONFIRMATION
List:
- task-diff file;
- pre-existing dirty files;
- production files changed;
- consumer files changed;
- package/install status.

## FILES_CHANGED
