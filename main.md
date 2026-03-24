Create TODOs first and keep them updated until every item below is implemented, tested, and verified.

We found the next root cause in validation.

Current problem:
The validator still fails after the HOCON/YAML fix because it appears to validate generated job config/include files before resolving the full include graph and before building the effective merged config.

Observed symptoms:
- unresolved variable: adls.source.root
- unresolved variable: adls.curated.customer_order.root
- missing required property: process.name
- missing required property: jobname

Why this is likely wrong:
1. The env config includes shared/common framework files where some variables are defined.
2. The job config also uses include fragments.
3. Some generated include files are fragments, not standalone root configs.
4. Validation must happen on the effective merged config, not on isolated fragments.

Required implementation changes:

1. Add recursive include resolution for BOTH:
   - env config side
   - job config side

2. Support nested includes:
   - include inside include
   - relative include paths resolved from the current file’s directory
   - cycle detection
   - duplicate include protection / deterministic merge order

3. Build an effective config model before semantic validation:
   - parse root job config
   - recursively load included fragments
   - parse reused env config
   - recursively load env includes
   - merge everything in framework-compatible order
   - only then perform variable resolution + required-property validation

4. Differentiate file roles:
   - top-level job config
   - SQL/include fragment
   - env config
   - shared/common included framework file

5. Apply required-property checks ONLY to the correct role:
   - process.name / jobname / other required root fields should be checked on the final effective top-level job config
   - not on every included fragment
   - not on env include files
   - not on SQL fragments

6. Variable resolution must be context-aware:
   - resolve variables against the merged config graph
   - if unresolved, show where the system searched
   - show whether the key was expected from root job config, env config, or included common config

7. Add debug output that explicitly shows:
   - root job config path
   - env config path
   - full include graph discovered
   - final merge order
   - which file defined each key if possible
   - whether validation is running on root config or fragment
   - exact unresolved key and why it remained unresolved after merge

8. Add regression tests for the real scenario:
   - reused env config with nested includes
   - common_config defining shared keys like adls.source.root
   - job config with include fragments
   - fragment files must not fail root-required-field validation
   - variable resolution happens after merge
   - validation should pass when the key exists in an included config
   - cycle detection for includes
   - relative-path nested include resolution

9. Very important:
   Do NOT just suppress unresolved-variable checks.
   Fix the validation pipeline so that resolution happens after include expansion/merge.

10. Provide a short final report with:
   - root cause
   - exact validation order before
   - exact validation order after
   - files changed
   - tests added
   - sample debug output from the real customer_orders scenario

Suggested target validation pipeline:
A. detect file role
B. parse syntax by role/format
C. resolve include graph recursively
D. merge effective config
E. validate role-specific required fields
F. resolve substitutions/variables
G. gate write/deploy

Important reminder:
The ETL framework repo is still the source of truth.
Do not invent generic config rules.
Match framework behavior as closely as possible.
