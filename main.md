Fix the path handling so the generated ETL job config does NOT hardcode full storage paths.

Problem
The generated job config currently contains literal paths like:
abfss://bronze@...dfs.core.windows.net/BRONZE/customer_order

I do NOT want full physical paths embedded in the job config or include files when they should come from env config.

Desired behavior
1. Reuse env-config variables for source and target paths.
2. Keep job config environment-agnostic.
3. Only use literal full paths when there is no approved env-config variable and that case must be surfaced explicitly.
4. Do not silently inline resolved paths into the generated job config.

What I want instead
- Put reusable path roots in env config.
- Reference them in job config / include files using variables.
- Validation should resolve those variables against the selected env config, but generated artifacts should preserve the variable references.

For this customer_orders scenario
Current wrong pattern:
- source path is rendered as a full abfss path inside the job config

Expected pattern:
- source should use an env-config-backed variable reference
- target should use an env-config-backed variable reference
- generated files should keep the variable expression, not the resolved final value

Example expectation
Wrong:
path: "abfss://bronze@edaaaed1e1devsrz.dfs.core.windows.net/BRONZE/customer_order"

Preferred:
path: "${adls.source.root}/customer_order"

or, if framework requires a more specific env key:
path: "${adls.source.customer_order.root}"

Use the framework’s real existing env-config naming conventions where available.
Do NOT invent new keys if an equivalent approved key already exists in the repo or standards.

Important rules
A. If env config is reused, do NOT create a new env config file.
B. If the selected env config already contains the needed source/target root variables, preserve variable references in output.
C. If a needed variable is missing, report that clearly and block write with a specific message like:
   - missing env-config key: adls.source.root
   - missing env-config key: adls.destination.root
Do NOT replace the missing variable with a literal path.
D. Validation must resolve variables using the selected env config, but rendering must keep variable placeholders.
E. This must apply to both:
   - main/root job config
   - generated include files such as source yaml / transform / write include files

Required implementation work
1. Find where the source path is being normalized/rendered into a literal path.
2. Change rendering so it emits variable references instead of resolved storage URIs.
3. Keep resolution logic only inside validation/runtime checking, not output generation.
4. Verify reused env config mode does not create or modify env config files.
5. Add tests that prove:
   - reused env config + variable-backed source path stays as ${...} in generated files
   - reused env config + variable-backed target path stays as ${...} in generated files
   - missing env key fails validation without inlining literal paths
   - write is blocked when required env variable is missing
   - write succeeds when env variable exists
6. Show exact before/after for customer_orders.

Return format
A. Root cause
B. Exact code locations changed
C. Before/after artifact snippet
D. Tests added
E. Proof that generated files now preserve variable references
F. Proof no new env config file was created
