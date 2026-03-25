# Implement Output Strategy Layer for ETL Framework Generator

You are working in the ETL framework generator codebase.

Your task is to implement the **next layer: output strategy**, using the existing documentation and without regressing the already-implemented sourcing and transformation layers.

## Goal

Add a doc-driven **Output Strategy** layer that decides how the final output should be generated after transformation is known.

This layer must decide between:

- `load_enrich_process`
- `dataframe_writer`
- `database_out`
- `tibco_out`

and must enforce the correct artifact pattern, module selection, and validation rules.

---

## Important constraints

1. **Do not hardcode rules directly from memory.**
   Use the docs in `src/context_files` as the source of truth.

2. **Do not rely on intent keywords alone.**
   Final strategy selection must use structured signals from the request/blueprint, such as:
   - target zone
   - target system
   - whether output is curated write vs file export
   - whether delivery is database or tibco
   - whether control file is required
   - CDC/SCD hints
   - mailbox / schema / table / file metadata requirements

3. **Do not regress previous layers.**
   Keep existing sourcing and transformation behavior stable unless a change is required strictly for output-strategy integration.

4. **No scattered hardcoding.**
   Centralize doc parsing / doc-driven rules.

5. **Run lint and tests at the end.**
   Fix issues you introduce instead of stopping early.

---

## Docs to use

Read and use these files as the rule source:

- `src/context_files/load_enrich.md`
- `src/context_files/dataframe_writer.md`
- `src/context_files/dataout_database.md`
- `src/context_files/dataout_tibco.md`

Use them to derive behavior and validation rules.

---

## Required design

Implement a new **doc-driven output layer** with these responsibilities:

### 1. Context provider
Create a provider that loads/parses the four docs above and exposes normalized rules needed by the advisor/planner/validator.

Create:

- `src/core/output/OutputStrategyContextProvider.ts`

This provider should:
- load the four docs
- extract normalized guidance/rules
- return a structured output context object
- be reusable by advisor/planner/validator

Do **not** duplicate parsing logic in multiple files.

---

### 2. Strategy advisor
Create:

- `src/core/output/OutputStrategyAdvisor.ts`

This advisor should decide the output strategy based on:
- request intent + structured blueprint signals
- transformation decision already computed
- doc-driven rules from the context provider

Expected strategies should be explicit, for example:
- `curated_load_enrich`
- `dataframe_writer_generic`
- `database_out`
- `tibco_out`
- `review_required`

The advisor output must include:
- `strategy`
- `confidence`
- `reasons`
- `warnings`
- `requiredArtifacts`
- `requiredAssertions`

---

### 3. Strategy planner
Create:

- `src/core/output/OutputStrategyPlanner.ts`

This planner should convert the chosen strategy into the correct blueprint/rendering expectations.

Examples:
- curated zone write -> `load_enrich_process`
- generic file export -> `dataframe_writer`
- database delivery -> dual-file pattern (data + control)
- tibco delivery -> dual-file pattern (data + control)

It must not directly render final text; it should produce a structured plan for the builder/renderer.

---

### 4. Strategy validator
Create:

- `src/core/validation/OutputStrategyConfigValidator.ts`

This validator must enforce strategy-specific rules before write.

Examples:

#### For `curated_load_enrich`
- require `load_enrich_process`
- validate presence of required load/enrich settings
- block incompatible database/tibco dual-file patterns unless explicitly intended

#### For `dataframe_writer_generic`
- require `dataframe_writer`
- validate output format/path behavior from docs

#### For `database_out`
- require **two artifacts/modules**
  - data file
  - control file
- require `dataframe_writer`
- require expected ADLS-first pattern
- require the expected `assert.sql.after` metadata contract
- validate required schema/table/path fields

#### For `tibco_out`
- require **two artifacts/modules**
  - tibco data file
  - tibco control file
- require `dataframe_writer`
- require mailbox / filename / container semantics
- require required `assert.sql.after` metadata contract
- support ETL2.0-related fields such as `pin_container` / delete-file behavior where applicable

---

## Types / exports

If needed, add:
- `src/core/output/index.ts`
- type definitions in existing type files or a dedicated output type file if necessary

Keep types clean and explicit.

---

## Integration points

Wire the new output layer into the existing flow.

Update these files as needed:

- `src/core/IntentExtractor.ts`
- `src/core/BlueprintBuilder.ts`
- `src/core/CreateJobSessionService.ts`
- `src/core/SessionState.ts`
- `src/core/CreateJobResponse.ts`
- `src/core/ETLChatParticipant.ts`
- `src/core/validation/PreWriteValidationPipeline.ts`
- `src/index.ts` or relevant barrel files

### Integration requirements

- output strategy is computed **after transformation decision is known**
- output strategy is computed **before rendering/validation**
- session state stores output decision
- create response includes output decision
- chat response shows an **Output Strategy** section
- pre-write validation invokes the output validator
- blueprint/build logic applies the selected strategy when constructing modules/artifacts

---

## Specific implementation expectations

### A. Database out
Use the database-out doc to implement:
- ADLS file staging first
- separate data/control file handling
- required SQL/assert metadata structure
- schema/table/path validation

### B. TIBCO out
Use the TIBCO doc to implement:
- separate data/control file handling
- mailbox semantics
- filename/path/container handling
- assert metadata contract
- ETL2.0 additions when applicable

### C. Dataframe writer
Use the dataframe writer doc to decide when plain `dataframe_writer` is the correct final strategy vs when more specialized handling is required.

### D. Load enrich
Use the load_enrich doc to ensure curated load behavior remains aligned with framework expectations.

---

## Tests to add

Create or update tests so this layer is protected.

Add at least:

- `src/test/suite/outputStrategy.test.ts`

Update any existing tests as needed.

### Required test scenarios

1. curated target selects `load_enrich_process`
2. simple generic file output selects `dataframe_writer`
3. database out creates **data + control**
4. tibco out creates **data + control**
5. database out fails if required `assert.sql.after` metadata is missing
6. tibco out fails if required mailbox/assert metadata is missing
7. invalid mix of curated load + database out fails
8. invalid mix of curated load + tibco out fails
9. output decision appears in session state and response
10. chat output includes Output Strategy section
11. validator catches incomplete paired-output configs
12. existing sourcing/transformation tests do not regress

---

## Deliverables

At the end, provide:

1. A concise summary of:
   - files created
   - files modified
   - output rules implemented from docs

2. A short before/after example showing:
   - old behavior
   - new behavior with explicit output strategy

3. Actual command results for:
   - lint
   - tests

Do not just say “should pass”.
Run them and report real results.

---

## Acceptance criteria

The task is complete only if:

- output strategy is doc-driven
- `OutputStrategyContextProvider.ts` exists and is used
- advisor/planner/validator are all implemented
- database and tibco are handled as dual-file output strategies
- output decision is surfaced in response/chat/session state
- pre-write validation enforces output rules
- no regression is introduced to sourcing/transformation behavior
- lint and tests are run and results are reported

Start implementation now.
