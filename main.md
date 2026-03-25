We need a focused fix pass for the ETL generator. Do not add unrelated features.

Problems seen from real output:
1. The generated source module uses invented zone terminology like `bronze_zone`. In our framework, bronze input is the SRZ layer and should use framework-consistent naming such as `srz_zone` where appropriate.
2. Silver/gold outputs are part of curated-zone behavior. Do not invent zone vocabulary if the framework/repo uses a different convention.
3. The generated job config is expanding or composing paths incorrectly. When an existing env config is reused, the job config must keep HOCON variable expressions instead of hardcoding physical ABFSS paths.
4. There is already a canonical HOCON example file in the extension repo at `src/context_files/hocon_template.txt`. The current implementation is not using it as a real generation asset.
5. The current output is splitting simple logic too much. For a simple request like filter + derive + write + publish, use one main transform unless framework rules require otherwise.
6. Do not create or modify env config when user selected reuse existing env config.

Required fixes:
A. Zone / naming correction
- Replace generated source type terminology with framework-consistent SRZ terminology.
- Ensure curated output uses framework-consistent naming for target/write modules.
- Remove invented zone labels unless they are explicitly supported by repo examples.

B. HOCON path/interpolation correction
- Keep source and target paths as HOCON expressions, not expanded physical paths, when env config is reused.
- Follow canonical quoting/interpolation style from repo examples and from `hocon_template.txt`.
- Example intent:
  - source path should remain variable-based, like `"${adls.source.root}"/customer_order` or the correct framework equivalent
  - target path should remain variable-based, like `"${adls.destination.root}"/customer_orders_curated`
- Fix renderer so path/value interpolation is emitted as valid HOCON, not malformed JSON-like strings.

C. Use `hocon_template.txt` in implementation
- Treat `src/context_files/hocon_template.txt` as a packaged canonical template asset.
- Load it at runtime from the extension package, not as dead documentation.
- Feed it into the generation pipeline so the model/blueprint renderer uses real framework HOCON structure.
- Use it to drive generation of:
  - data sourcing module structure
  - data transformation module structure
  - dataframe writer structure
  - valid interpolation/quoting conventions
- Add a small helper/provider for this template and unit tests that confirm:
  - template file loads successfully
  - generation path actually consumes it
  - expected tokens from template influence rendered output

D. Transform consolidation
- For simple flow requests, consolidate into one main transform instead of unnecessary multiple transform fragments, unless framework rules explicitly require split modules.
- Keep includes only where they add real value and match framework patterns.

E. Env config reuse rule
- If the user selected an existing env config, never create a new env config file.
- Job config must reference env-driven variables and assume runtime linkage.

Implementation guidance:
1. Find the code that assigns source zone/type names and fix it to use framework terminology.
2. Find the renderer that emits `path`, `target-path`, and related HOCON values and make it follow template-driven quoting/interpolation.
3. Introduce a `HoconTemplateProvider` or similar helper that reads `src/context_files/hocon_template.txt`.
4. Inject that template into the generator / blueprint builder / prompt construction path.
5. Add regression tests for:
   - SRZ source generation
   - curated target generation
   - reused env config does not create env file
   - path values remain variable-based
   - rendered HOCON matches template style
   - simple customer_orders flow uses consolidated transform structure

Use the screenshots as behavioral evidence:
- left-side reference config shows the expected style
- right-side current generated config shows the wrong style

Return format:
1. Root cause
2. Files changed
3. Exact behavior before
4. Exact behavior after
5. Tests added/updated
6. Proof that `hocon_template.txt` is now used in implementation
7. Re-run result for customer_orders
