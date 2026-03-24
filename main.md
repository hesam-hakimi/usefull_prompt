Fix the source-path normalization bug in the customer_orders generation flow.

Confirmed bug from real generated output:
- User prompt source was:
  abfss://bronze@edaaaedle1devsrz.dfs.core.windows.net/BRONZE/customer_order
- Generated job config changed it to:
  ${adls.source.root}/core
- This is incorrect:
  1) the leaf name changed from customer_order to core
  2) the explicit user path was replaced by an unverified symbolic path
  3) the generator is inventing a normalized source path instead of preserving or correctly mapping it

This is NOT a validation bug.
This is a generator bug in source extraction / blueprint normalization / rendering.

Required behavior:
1. If user provides an explicit source path, preserve it unless there is a verified framework mapping.
2. Only convert explicit source paths into framework variables when the mapping is authoritative and lossless.
3. Never change the source leaf/object name during normalization.
4. Never replace an explicit source with a generic placeholder like /core.
5. If confidence is low, keep the literal source path from the user prompt.

Implement the fix by reviewing:
- IntentExtractor
- BlueprintBuilder
- JobConfigRenderer
- any source-path normalization helper
- any code that derives table.name, alias, source root, or logical source path from the request

Add tests for these cases:
1. Explicit bronze abfss source path remains unchanged when no verified variable mapping exists.
2. If a verified mapping exists, the mapped output must preserve the same semantic path and same leaf name.
3. customer_order must not become core.
4. table name / alias inference must not rewrite the physical source path.
5. Generated customer_orders scenario must assert the final read path is either:
   - the original explicit abfss path
   OR
   - an authoritative framework variable expression that resolves to the same path
   but never ${adls.source.root}/core unless that exact mapping is proven from source-of-truth examples.

Decision rule to implement:
- Prefer correctness over abstraction.
- Literal explicit source path is better than an invented variable path.

Also check whether inline ENV_CONFIG in the prompt is already being provided.
If yes, do not ask the user to select env config again in this flow.

Acceptance criteria:
- Re-run the exact customer_orders prompt
- Show before/after for source-path handling
- Show exact generated read_source.path
- Show test evidence
- No regression in reuse-mode behavior
