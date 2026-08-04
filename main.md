Fix the incorrect clarification behavior for this question:

“How are total savings balances changing MoM?”

Treat this as a focused production defect. Create a dedicated bugfix branch, keep the change bounded, and do not mix it with unrelated roadmap or metadata work.

## Observed behavior

The runtime trace shows:

- selected_intent: `balance_trends_by_product`
- route/path: `primary_source_sql`
- planned recipe: `source_balance_mom_change`
- renderer: `source_balance_mom_change`
- source table: `dbo.v_dlv_dep_agmt_clr`
- measures include:
  - `SUM(CUR_BAL_AMT)`
  - `balance_change`
  - `mom_pct_change`
- time policy: latest/current versus previous month
- `source_balance_mom_sql` returns:

  “Source account balances are snapshot values; choose one balance per account snapshot before summing portfolio balances.”

- `error_handler_regular` converts this internal data-grain/safety failure into `ASK_CLARIFICATION`.
- The UI then incorrectly asks whether the user wants individual snapshot balances or average balances.

The user’s question is not ambiguous. “Total savings balances changing MoM” means the total authorized savings balance at the latest available monthly snapshot compared with the previous available monthly snapshot.

## Required investigation

1. Search the repository for these exact values and trace the complete live path:

   - `source_balance_mom_change`
   - `source_balance_mom_sql`
   - `balance_trends_by_product`
   - `Source account balances are snapshot values`
   - `ASK_CLARIFICATION`

2. Inspect the relevant implementation and tests, especially:

   - `semantic_models.py`
   - `query_recipes.py`
   - `orchestrator.py`
   - error-handling/triage code
   - source-code mappings
   - SQL safety and duplicate-balance guards
   - answer renderers
   - golden-question fixtures

3. Run read-only diagnostics against the source to determine the actual grain of
   `dbo.v_dlv_dep_agmt_clr`.

4. Check for duplicates at the expected account-snapshot grain, using the governed keys already established by the repository, likely including:

   - source code
   - agreement/account identifier
   - snapshot date

5. Identify why multiple rows can exist for one account and one snapshot. Do not invent a tie-breaker, `MAX`, `AVG`, or arbitrary `ROW_NUMBER()` ordering without evidence from schema, existing recipes, metadata, or a documented business rule.

6. Verify the existing governed source mapping for “savings.” Existing documentation may map savings to `STAX` and checking/DDA to `IMSB`; confirm this from the live repository and metadata. Do not duplicate source-code mappings in orchestration code.

## Required behavior

For a valid savings MoM request:

1. Resolve the requested source scope to savings.
2. Determine the latest available monthly snapshot.
3. Determine the previous available monthly snapshot according to the existing governed time policy.
4. Select exactly one valid balance per account per snapshot using a documented and deterministic account-snapshot rule.
5. Apply authorization and row-level scope before aggregation.
6. Sum the authorized account balances separately for the current and previous snapshots.
7. Calculate:
   - current total balance;
   - previous total balance;
   - absolute month-over-month change;
   - percentage month-over-month change.
8. Return a direct answer/report with the two snapshot dates and appropriate caveats.
9. Do not ask the user whether they want an average balance; the request explicitly asks for total balance.
10. If the previous snapshot is unavailable, return a governed insufficient-history/no-data response.
11. If the underlying source does not provide a deterministic way to choose one row per account snapshot, return a controlled data-quality error for owner review. Do not misrepresent that technical problem as user ambiguity.

## Safety requirements

- Do not disable or weaken the duplicate-balance safeguard.
- Do not sum duplicate snapshot rows.
- Do not average account balances merely to bypass the guard.
- Do not hardcode this exact question wording.
- Do not hardcode source mappings in the orchestrator when they belong in metadata/configuration.
- Preserve read-only SQL, authorization checks, row-level filtering, limits, and audit behavior.
- Ensure the same security scope is applied before computing totals, percentages, charts, reports, or cached results.
- Do not expose raw customer/account data in logs or evidence.

## Error-classification correction

Update the error flow so that it distinguishes:

- genuine user ambiguity → `need_clarification`;
- missing history/no data → governed no-data response;
- unresolved source-data grain or duplicate records → data-quality/blocked response;
- safe deterministic MoM result → normal successful answer.

The specific snapshot-grain error must not automatically become a user clarification question.

## Regression tests

Add targeted tests for:

1. “How are total savings balances changing MoM?”
2. “How did total savings balance change month over month?”
3. Checking/DDA MoM using its governed source mapping.
4. Total deposits across all approved sources where supported.
5. Duplicate physical rows representing one account snapshot.
6. Multiple accounts at current and previous snapshots.
7. Previous balance equal to zero.
8. Missing previous-month snapshot.
9. No savings data.
10. Unauthorized user or restricted row scope.
11. Same question through the suggested-question path.
12. Same question through a free-form wording variation.
13. Verification that the result is total balance, not average balance.
14. Verification that the incorrect clarification is no longer returned.

Add the exact question to the golden regression suite.

## Validation

Run:

- targeted recipe and orchestrator tests;
- SQL safety and authorization tests;
- the full backend suite with coverage;
- offline golden baseline;
- live golden baseline including this question;
- frontend tests if response status or rendering changes;
- lint/build where applicable;
- `git diff --check`.

## Completion report

At the end report:

- confirmed root cause;
- actual source-table grain;
- duplicate pattern found;
- governed one-row-per-account-snapshot rule used;
- files changed;
- before/after routing and error behavior;
- generated SQL structure before and after, with sensitive literals redacted;
- targeted and full test results;
- live result for the exact question;
- any remaining data-owner decision.

Do not merge the PR. Do not claim success unless the exact live question returns a correct MoM answer without the inappropriate clarification.
