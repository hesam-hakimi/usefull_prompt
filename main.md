Fix the current failing test only. Do not refactor unrelated code.

Observed failing test:
- `ETL Copilot Extension Tests`
- `IntentExtractor`
- `extracts table name from prompt`

Observed assertion:
- expected `intent.source?.table === 'customers' || intent.target?.table === 'customers'`
- actual result did not extract `customers`

Requirements:
1. Inspect the current implementation before changing anything.
2. Patch the smallest safe code surface.
3. Prefer fixing `IntentExtractor.extract()` unless the test is clearly wrong.
4. Name the exact file, class, and function changed.
5. Do not change architecture.
6. After the fix, tell me to run `npm test` again.
