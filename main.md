# Copilot Implementation Prompt — Next Layer: Data Transformation Guidance Integration

Use this prompt in GitHub Copilot Chat / Codex inside the extension workspace.

---

## Review of the sourcing layer

The sourcing layer looks good enough to move forward.

What appears correct from the report:

- data sourcing guidance is now wired into generation, rendering, validation, and chat UX
- `srz_zone` is used for bronze/raw
- `curated_zone` is used for silver/gold
- hardcoded ABFSS paths are rejected unless explicitly review-required
- tests were added and `npm test` passes
- the renderer now uses the project’s canonical HOCON interpolation style

One item should remain visible as a tracked follow-up, but it should not block this next layer:

- curated root selection is still assumed as `${adls.destination.root}` for non-bronze sources unless a more explicit doc-driven mapping is added

Proceed now with the **data transformation** layer.

---

## Goal

Implement a **framework-guided data transformation generation layer** so the ETL extension uses:

- `src/context_files/data_transformation.md`
- `src/context_files/hocon_template.txt`
- any existing HOCON rendering/provider helpers
- existing sourcing layer outputs

to generate transformation configs that follow real ETL framework behavior instead of arbitrary SQL/module guesses.

The main outcome is:

1. generated transformation modules must follow the framework doc structure
2. simple business logic should stay in **one logical transform step** unless the docs or request justify multiple chained steps
3. temp-view chaining must follow the transformation module rules from the docs
4. SQL, filter, location/table, masking, drop columns, and include-based patterns must be used only when supported
5. config must be fully resolved before execution
6. transformation output should be easier to review and closer to actual framework practice

---

## Core user pain this layer must fix

From the earlier generated output, there was a tendency to:

- create too many transformation fragments
- split logic into unnecessary steps
- drift away from framework-native temp-view patterns
- generate transformation structure without clearly following the documented module behavior

This layer must make the extension prefer:

- one clean transformation block when the request is simple
- external include/reference files only when they add real value
- documented temp-view chaining when multiple steps are actually needed

---

## Source material that must become code behavior

### A) `data_transformation.md`
Use this as the primary behavioral source.

At minimum, encode these documented points into structured logic:

- transformation config is JSON/HOCON-based
- multiple SQL modules can exist, but should be used intentionally
- SQL may reference:
  - environment variables
  - external files
  - module options such as `filter`
  - location or table
- each SQL result is registered as a temp view in Spark
- config supports:
  - `options.module = data_transformation`
  - `options.method = process`
  - `name`
  - `loggable`
  - `sql`
  - `include`
  - `drop.columns`
  - `masking.columns`
  - `options.filter`
  - `options.location` or `options.table` when appropriate
- the module itself does not execute side effects directly; it prepares transformed temp views for downstream steps
- config must be fully resolved before execution
- external file references are supported using relative paths
- temp views can be chained across transformations

### B) `hocon_template.txt`
Use this to preserve the project’s expected HOCON/JSON-like rendering style.

At minimum:

- keep interpolation and quoting consistent with the house style already adopted in sourcing
- avoid malformed strings
- avoid mixing raw literal snippets with unresolved placeholders
- reuse canonical rendering helpers instead of inventing transformation-specific quote logic

---

## Required implementation

### 1) Add a structured transformation context provider

Create:

- `src/core/context/DataTransformationContextProvider.ts`

This must read and normalize guidance from:

- `src/context_files/data_transformation.md`
- `src/context_files/hocon_template.txt`

Suggested interface:

```ts
export interface DataTransformationGuidance {
  requiredOptions: {
    module: string;
    method: string;
  };
  supportedFields: string[];
  supportsExternalInclude: boolean;
  supportsTempViewChaining: boolean;
  supportedOptionKeys: string[];
  supportedTopLevelKeys: string[];
  bestPractices: string[];
  antiPatterns: string[];
  splittingRules: string[];
}
```

This provider must return structured guidance, not only raw markdown text.

---

### 2) Add a transformation strategy advisor

Create:

- `src/core/transformation/DataTransformationAdvisor.ts`

Suggested interface:

```ts
export interface DataTransformationDecision {
  strategy: "single_sql_module" | "multi_step_temp_view_chain" | "external_include" | "review_required";
  reasons: string[];
  warnings: string[];
  shouldUseSingleStep: boolean;
  shouldUseExternalInclude: boolean;
  shouldUseFilterOption: boolean;
  shouldUseLocationOrTableOption: boolean;
}
```

Decision rules:

#### Prefer `single_sql_module` when:
- the request is simple
- the business logic is basically:
  - filter rows
  - derive one or a few columns
  - rename/select columns
  - simple projection
- one temp view is enough before write/publish

#### Prefer `multi_step_temp_view_chain` only when:
- there are clearly multiple logical intermediate views
- the request requires staged SQL logic
- the generated SQL would be materially less readable as one module
- separate steps are justified by framework guidance

#### Prefer `external_include` only when:
- the transformation SQL is large or reusable
- the request explicitly implies reusable external SQL/script logic
- modularity materially improves maintainability

#### Return `review_required` when:
- the transformation intent is ambiguous
- the docs do not support the inferred structure confidently

Important:
Do not split a simple bronze-to-silver transform into multiple modules just because multiple verbs appear in the request.

For example:
- “filter active records, derive order_status, write to silver”
should usually remain **one logical transform module** unless the user or framework pattern clearly requires otherwise.

---

### 3) Add a transformation config validator

Create:

- `src/core/validation/DataTransformationConfigValidator.ts`

Required checks:

#### Must pass
- `options.module === "data_transformation"`
- `options.method === "process"`
- a transformation module has either:
  - inline `sql`, or
  - supported `include`
- `name` exists when required by the framework pattern
- temp view references are internally consistent
- option keys are only documented/supported keys
- `drop.columns` and `masking.columns` follow supported structure when present
- config is fully resolved before execution

#### Must fail
- unsupported transformation module names
- unsupported method values
- empty transformation blocks
- multiple split modules for a simple request when generated by default path without justification
- invalid include paths
- malformed SQL placeholders / malformed interpolation
- unsupported or invented config keys

#### May warn
- multi-step transformation chosen but a single step likely would have been enough
- external include used for a very small transform
- location/table/filter options inferred with low confidence

---

### 4) Add a transformation SQL planner

Create:

- `src/core/transformation/TransformationSqlPlanner.ts`

Purpose:
Turn user intent plus sourcing outputs into the cleanest framework-aligned transformation shape.

This should decide:

- one SQL block vs multiple SQL blocks
- whether `filter` belongs in `options.filter` vs inline SQL
- whether an external include file is better than inline SQL
- temp view naming for chained steps
- whether masking/drop columns should be emitted

Required behavior:

#### For simple cases like customer_orders:
Prefer one module shaped roughly like:

```hocon
main_transform: {
  loggable: true
  sql: "SELECT ..., CASE ... END AS order_status FROM vw_customer_orders WHERE active_flag = 1"
  options: {
    module: "data_transformation"
    method: "process"
  }
  name: "main_transform"
}
```

or the equivalent house-style structure already used in the project.

Do not split into:
- one filter module
- one derive module
unless there is a documented reason or a user-requested reason.

#### For larger reusable SQL:
Prefer an external include with a relative path only when the SQL becomes long enough or is clearly reusable.

---

### 5) Integrate transformation guidance before rendering

Update the create flow so transformation planning happens before final rendering.

Likely touch files such as:

- `BlueprintBuilder.ts`
- `JobConfigRenderer.ts`
- `CreateJobSessionService.ts`
- existing response/state files
- any renderer/validator entry points already added in the sourcing layer

Required flow:

1. parse request
2. run sourcing decision
3. run transformation decision
4. plan SQL/module structure
5. render transformation config using canonical HOCON style
6. validate transformation config
7. include decision details in state and chat response

---

### 6) UX requirements in chat output

Add a transformation block in the response similar to sourcing.

It should clearly say:

- `Transformation strategy: single_sql_module` or equivalent
- `Reason: simple filter + derive logic; no intermediate temp view needed`
- `SQL placement: inline` or `external include`
- `Temp view chaining: yes/no`
- `Config resolution requirement: must be fully resolved before execution`

For multi-step cases, the response should briefly explain why multiple steps were chosen.
Do not hide the reason.

---

### 7) Required generation behavior for the customer_orders scenario

For a request like:

- read data from bronze customer_orders
- filter active records
- derive order_status
- write to silver customer_orders_curated
- publish to Synapse

The transformation layer should prefer:

- **one main transform module**
- source temp view from sourcing module
- filter + derive in the same SQL unless the framework docs clearly push otherwise
- no unnecessary fragment explosion
- names and references that are consistent with the final write step

That means:
- do not automatically create separate `transform_filter` and `transform_derive` modules for a simple request
- do not create intermediate temp views unless justified

---

### 8) Use the docs as executable guidance, not just preview/help

The markdown docs should drive:

- strategy selection
- field validation
- splitting rules
- include vs inline decisions
- temp-view chaining decisions
- response explanations

Do not keep these docs as preview-only content.

If there is already a provider pattern from the sourcing layer, reuse the same architecture.

---

### 9) Tests to add

Create or update tests such as:

- `dataTransformationContextProvider.test.ts`
- `dataTransformationAdvisor.test.ts`
- `dataTransformationConfigValidator.test.ts`
- `transformationSqlPlanner.test.ts`
- end-to-end create flow tests

#### Required test cases

1. **simple filter + derive stays single-step**
   - input: customer_orders style request
   - expect one transformation module by default

2. **multi-step chosen only when justified**
   - input: clearly staged workflow with intermediate temp views
   - expect multi-step temp-view chain

3. **external include chosen only when justified**
   - input: large reusable SQL
   - expect include-based transform

4. **required options enforced**
   - `options.module = data_transformation`
   - `options.method = process`

5. **inline sql accepted**
   - simple transform with SQL inline passes validation

6. **include-based transform accepted**
   - valid relative include path passes validation

7. **unsupported keys rejected**
   - invented fields fail validation

8. **empty transform rejected**
   - no sql and no include should fail

9. **resolved-before-execution behavior enforced**
   - unresolved placeholders or malformed references fail validation

10. **docs influence output**
   - provider guidance affects advisor/planner decisions

11. **customer_orders end-to-end remains simple**
   - one sourcing step
   - one transformation step
   - one write step
   - no unnecessary fragmentation

---

## Desired code quality

- keep provider / advisor / planner / validator responsibilities separate
- centralize decision rules; do not scatter heuristics across renderer code
- do not hardcode the customer_orders scenario
- preserve existing working behavior unless it conflicts with framework guidance
- make reasons/warnings easy to inspect in logs and chat response
- keep rendering consistent with the project’s HOCON style

---

## Logging to add

Add non-secret debug logs such as:

- `Data transformation guidance loaded`
- `Transformation strategy selected: single_sql_module`
- `External include selected: false`
- `Temp view chain required: false`
- `Transformation validation errors: [...]`
- `Transformation module count: 1`

Do not log secrets or sensitive SQL beyond what is already acceptable in current diagnostics.

---

## Acceptance criteria

Implementation is complete only if all are true:

1. `data_transformation.md` materially affects generation logic
2. simple business logic defaults to one transformation module
3. multi-step chains are only used when justified
4. external include is only used when justified
5. required transformation options are enforced
6. validator rejects unsupported/empty transformation configs
7. response includes a clear transformation strategy block
8. tests cover positive and negative cases
9. end-to-end create flow still works

---

## Final deliverable format from Copilot

When finished, respond with:

1. files created
2. files modified
3. exact transformation rules implemented from the docs
4. tests added/updated
5. sample before/after output for a simple filter + derive request
6. any remaining ambiguity, especially around when to split into multiple temp-view steps

---

## Do not do

- do not hardcode only the customer_orders scenario
- do not create multiple transformation modules for a simple request unless justified
- do not keep docs as preview-only material
- do not invent unsupported config keys
- do not move simple inline SQL into external files without a clear reason
- do not ask unnecessary follow-up questions if the docs and codebase are enough to implement

---

Now implement this end to end in the extension codebase, run tests, and summarize the exact changes with evidence.
