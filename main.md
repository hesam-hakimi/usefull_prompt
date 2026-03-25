Use `src/context_files/data_transformation.md` as a first-class implementation asset for generation and validation of ETL transformation modules.

Goal:
Make transformation generation framework-aware, deterministic, and aligned with the documented `data_transformation` module contract.

Requirements:

1. Create `DataTransformationKnowledgeProvider` that loads and caches `src/context_files/data_transformation.md`.

2. Extract structured rules from the markdown, including:
- module name: `data_transformation`
- method name: `process`
- supported top-level keys such as `sql`, `include`, `name`, `loggable`, `drop.columns`, `masking.columns`
- supported option keys such as `module`, `method`, `filter`, `location`, `table`
- whether inline SQL is supported
- whether external file references are supported
- requirement that external include paths be relative
- rule that config must be fully resolved before execution
- rule that each transform result is registered as a temp view by `name`

3. Use these rules in generation:
- generate `data_transformation` blocks only for transformation logic
- choose between inline SQL and external include based on complexity
- prefer external include for larger SQL logic
- generate one main transform for simple flows, and chained temp-view transforms for multi-step flows
- use documented keys only
- do not place writer/sync behavior inside transformation modules

4. Add `DataTransformationValidator`:
- require `options.module === "data_transformation"`
- require `options.method === "process"`
- validate supported key set
- validate include path is relative
- validate `name` exists for temp-view registration
- reject or warn on unresolved config placeholders that should have been resolved before execution
- reject unsupported invented fields

5. Add normalization:
- map invented transform shapes to the closest documented structure
- convert large inline SQL into external include when appropriate
- collapse trivial multi-step transforms into one main transform where possible
- keep multi-step temp-view chaining only when it adds clarity or is needed by the request

6. Update prompt building:
- inject only the relevant transformation doc fragments
- include one or two matching examples from `data_transformation.md`
- include module behavior reminders:
  - temp view registration by `name`
  - config must be fully resolved before execution
  - use external files for modularity and reuse

7. Add tests for:
- inline SQL transform generation
- external include transform generation
- relative include path enforcement
- name/temp-view registration enforcement
- unresolved-placeholder validation failure
- drop.columns support
- masking.columns support
- simple flow collapsing into one main transform
- multi-step flow chaining via temp views

Return format:
1. Root cause
2. Files changed
3. Structured rules extracted from `data_transformation.md`
4. How generation changed
5. How validation changed
6. Tests added
7. Proof that `data_transformation.md` is now actively used by implementation
