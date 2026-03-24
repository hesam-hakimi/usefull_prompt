We now have a real runtime failure with concrete evidence. I want you to debug and fix it using the exact runtime artifacts and logs, not assumptions.

Create TODOs first and keep them updated until all items are completed.

Goal:
Fix the malformed YAML / config rendering issue in the real ETL create flow for the customer_orders scenario.

What I observed in the real Extension Development Host run:
1. The flow correctly:
   - reused existing env config
   - selected Single Job Config
   - used no template (built from scratch)
   - generated one job config
2. But validation failed before write because generated YAML/content is malformed.
3. The error output shows YAML parsing failures around lines similar to:
   - source.storageaccount1: "edaaaecz1"${env}"cz",
   - source.storageaccount2: "edaaaedle1"${env}"srz",
   - FIELD_SPLITTER: ","
4. This suggests the generator is producing invalid YAML/string concatenation syntax, likely mixing quoted literals and ${env} interpolation incorrectly.

What I will provide to you next in the chat:
- the exact user request
- the ETL Copilot chat response
- the validation error output
- the generated artifact preview/content
- any Output / Debug Console / ETL Copilot logs I captured

Your tasks:
1. Use the evidence I provide as the source of truth.
2. Identify the exact generator/rendering path that produced the invalid YAML/config.
3. Trace whether the bug is in:
   - env config rendering
   - include file rendering
   - variable interpolation / placeholder formatting
   - YAML escaping / quoting rules
   - template/build-from-scratch path
4. Fix the root cause, not just the symptom.
5. Add or update tests using this exact customer_orders failing scenario so the bug cannot regress.
6. Verify the fix with:
   - compile
   - tests
   - runtime-oriented evidence if possible
7. Update the user-facing validation message if needed so it clearly points to the broken generated artifact and field.

Important rules:
- Do not guess.
- Do not only patch tests.
- Do not say “fixed” unless the real failing scenario is covered by tests and the rendering logic is corrected.
- Prefer framework-compatible output using etl-framework-adb as authoritative source.
- If YAML is not the correct format for that artifact, prove it from the repo and adjust the generator accordingly.
- If quoting/interpolation must follow a specific framework pattern, cite the exact matching sample or authoritative implementation path in the codebase.
- Keep a short repair report at the end with:
  - root cause
  - files changed
  - tests added/updated
  - why the generated YAML was invalid before
  - why it is valid now

Wait for my evidence messages and then debug from those exact artifacts.
