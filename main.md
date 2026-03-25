# Copilot Implementation Prompt — Next Layer: Data Sourcing Guidance Integration

Use this prompt in GitHub Copilot Chat / Codex inside the extension workspace.

---

## First: quick review of the previous layer

The external-module layer looks good enough to move forward.

Two small follow-up checks should be kept in mind while implementing this next layer:

1. The screenshot shows strategy value `internal_standard` while the original prompt used `native_framework`.
   - Keep one canonical enum name everywhere, or document the rename clearly.

2. The screenshot proves native vs external coverage, but I do not yet see explicit proof for an ambiguous/hybrid scenario.
   - Do not block this task on that.
   - Add or keep that as a later hardening step.

Proceed with the next layer now.

---

## Goal

Implement a **framework-guided data sourcing generation layer** so the ETL extension uses:

- `src/context_files/data_sourcing.md`
- `src/context_files/hocon_template.txt`
- existing `HoconTemplateProvider.ts` if present

to generate sourcing configs that follow real ETL framework behavior instead of ad-hoc guesses.

The main outcome is:

1. generated sourcing config must follow the framework doc structure
2. source paths in job config must use **framework variables**, not hardcoded full ADLS/ABFSS paths
3. generated HOCON/JSON-style interpolated strings must be **quoted correctly**
4. bronze/raw sources must use the correct framework zone terminology:
   - **SRZ = standard raw zone**
5. silver and gold sources/targets belong to **curated zone**
6. the generator must stop inventing unstable path conventions when the framework guidance is insufficient

---

## Product rule

**If an env/root variable exists, do not write the full physical storage path into the job config.**
Prefer framework variables such as:

- `"${adls.source.root}/customer_orders"`

instead of:

- `"abfss://bronze@...dfs.core.windows.net/BRONZE/customer_orders"`

The job config should stay environment-agnostic whenever possible.

---

## Source material that must become code behavior

### A) `data_sourcing.md`
Use this as the main behavioral source for sourcing generation.

At minimum, encode these documented points into structured logic:

- supported source types include:
  - `srz_zone`
  - `curated_zone`
- supported `read-format` patterns include:
  - `view`
  - `sql`
  - `sql_script`
  - `view_script`
- sourcing module uses:
  - `options.module = data_sourcing_process`
  - `options.method = process`
- config uses:
  - `sourceList`
  - one or more named sources
- config can use:
  - `path`
  - `view`
  - `sql`
  - `filter`
  - aliases / combine patterns where applicable
- config should be fully resolved before execution
- sources are registered as temp views for downstream processing

### B) `hocon_template.txt`
Use this as the source of truth for interpolation style and quoting style.

At minimum, follow these conventions:

- interpolated path strings must be rendered in quoted string form
- do not emit broken mixed interpolation
- do not emit unquoted path expressions when the template expects quoted strings
- preserve valid HOCON/JSON-like structure already used by the framework

---

## Required implementation

### 1) Add a structured data sourcing context provider

Create:

- `src/core/context/DataSourcingContextProvider.ts`

This must read and normalize guidance from:

- `src/context_files/data_sourcing.md`
- `src/context_files/hocon_template.txt`

It should expose something like:

```ts
export interface DataSourcingGuidance {
  supportedSourceTypes: string[];
  supportedReadFormats: string[];
  requiredOptions: {
    module: string;
    method: string;
  };
  requiredTopLevelFields: string[];
  supportedSourceFields: string[];
  interpolationExamples: string[];
  quotingRules: string[];
  bestPractices: string[];
  antiPatterns: string[];
}
```

This provider must return structured guidance, not only raw markdown text.

---

### 2) Add a path rendering helper

Create or extend a helper such as:

- `src/core/rendering/InterpolatedPathRenderer.ts`

or extend an existing HOCON helper if that is cleaner.

This helper must render framework-variable-based paths safely.

Examples:

```ts
renderInterpolatedPath("${adls.source.root}", "customer_orders")
-> "\"${adls.source.root}/customer_orders\""
```

```ts
renderInterpolatedPath("${adls.destination.root}", "customer_orders_curated")
-> "\"${adls.destination.root}/customer_orders_curated\""
```

Required behavior:

- always return correctly quoted config strings
- normalize duplicate slashes
- do not remove or corrupt `${...}` placeholders
- do not silently singularize/pluralize table names
- preserve the final entity suffix unless a documented naming rule explicitly changes it

Important:
If the source path is provided explicitly by the user as a full ABFSS path, the generator should try to convert it to an env-root-relative expression **only when it can do so safely**.
If safe conversion is not possible, surface a review-required warning instead of inventing a wrong path.

---

### 3) Add a sourcing decision advisor

Create:

- `src/core/sourcing/DataSourcingAdvisor.ts`

This component should decide the sourcing shape using the structured guidance.

Suggested output:

```ts
export interface DataSourcingDecision {
  sourceType: "srz_zone" | "curated_zone" | "review_required";
  readFormat: "view" | "sql" | "sql_script" | "view_script" | "review_required";
  pathMode: "env_variable" | "literal_path_review_required";
  chosenRootVariable?: string;
  chosenEntitySuffix?: string;
  alias?: string;
  reasons: string[];
  warnings: string[];
}
```

Decision rules:

#### Use `srz_zone` when:
- the user refers to bronze/raw source
- the request is sourcing from standard raw zone
- the source path appears to point to raw/bronze landing content

#### Use `curated_zone` when:
- the request clearly says the source is from curated/silver/gold content
- the source is already a curated zone object

#### If the zone cannot be determined from framework rules:
- do not guess a new zone token
- return `review_required`

#### Read format rules
- use `view` when the source is read as a path/table-backed view according to framework pattern
- use `sql` when the request is naturally a query against an existing object
- use `sql_script` / `view_script` only when the request or template explicitly requires external SQL/script usage
- do not default to script-based sourcing unless there is evidence

---

### 4) Add a validator for generated sourcing config

Create:

- `src/core/validation/DataSourcingConfigValidator.ts`

Required checks:

#### Must pass
- `options.module === "data_sourcing_process"`
- `options.method === "process"`
- `sourceList` exists and references defined source keys
- each source key listed in `sourceList` exists
- source `type` is one of supported framework types
- `read-format` is one of supported framework formats
- interpolated `path` strings are quoted correctly
- no malformed `${...}` syntax

#### Must fail
- `type: "bronze_zone"` or other invented zone tokens
- full hardcoded ABFSS path written into job config when a framework env variable should be used
- mixed malformed strings like broken interpolation + literal path fragments
- `sourceList` item missing a matching source block
- path suffix changed incorrectly from what the user/source evidence supplied

#### May warn
- literal path retained because safe env-variable conversion could not be proven
- curated root variable is not confidently derivable from current framework guidance
- read format seems plausible but confidence is low

---

### 5) Integrate into generation flow before rendering

Update the creation pipeline so sourcing decisions are made before config rendering.

Likely touch files such as:

- `CreateJobSessionService.ts`
- `BlueprintBuilder.ts`
- `JobConfigRenderer.ts`
- existing naming/path utilities if present

Required flow:

1. parse user request
2. run `DataSourcingAdvisor`
3. load framework guidance from `DataSourcingContextProvider`
4. build sourcing config using framework-supported fields
5. render path via `InterpolatedPathRenderer`
6. validate with `DataSourcingConfigValidator`
7. include sourcing decision details in debug output / response

---

### 6) Required generation behavior for the customer_orders scenario

For a bronze/raw source like customer orders, the generator should prefer something shaped like:

```hocon
read_source: {
  options: {
    module: "data_sourcing_process"
    method: "process"
  }
  loggable: true
  sourceList: ["customer_orders"]
  customer_orders: {
    type: "srz_zone"
    read-format: "view"
    table.name: "customer_orders"
    path: "${adls.source.root}/customer_orders"
    alias: "vw_customer_orders"
  }
}
```

Important:
- do not emit `type: "bronze_zone"`
- do not emit full ABFSS path in the job config if env-root form is available
- do not emit the wrong entity suffix such as `customer_order` if the correct suffix is `customer_orders`
- keep interpolation quoted in whatever exact style the renderer uses consistently across the project

If the extension outputs JSON-like HOCON, keep that house style consistent, but the path must still be a properly quoted interpolated string.

---

### 7) Use the docs as executable guidance, not just UI preview

The markdown docs currently appear to be previewable in the extension.
That is not enough.

Implement the docs so they actively improve generation behavior.

Required principle:
- the same docs used for preview/help should also drive generation constraints, validation rules, and examples

If there is already a provider such as `HoconTemplateProvider.ts`, extend/reuse it rather than duplicating logic.

---

### 8) UX requirements in chat output

When a sourcing config is generated, the response should clearly state:

- `Sourcing strategy: framework-guided`
- `Source type selected: srz_zone` or `curated_zone`
- `Read format selected: view/sql/...`
- `Path mode: env variable`
- `Root variable used: ${adls.source.root}` when applicable
- `Final source path expression: ${adls.source.root}/customer_orders`

If the generator could not safely convert a literal path into a variable-based path, say so clearly and mark it for review.
Do not pretend confidence when the rule set is incomplete.

---

### 9) Tests to add

Create or update tests such as:

- `dataSourcingContextProvider.test.ts`
- `dataSourcingAdvisor.test.ts`
- `dataSourcingConfigValidator.test.ts`
- end-to-end create flow tests

#### Required test cases

1. **bronze/raw source maps to SRZ**
   - input: bronze customer_orders
   - expect: `type = "srz_zone"`

2. **curated source maps to curated_zone**
   - input clearly says curated source
   - expect: `type = "curated_zone"`

3. **job config uses env variable path**
   - input includes raw source path
   - expect generated config path uses `${adls.source.root}`
   - expect no full ABFSS path in job config

4. **quoted interpolation is rendered correctly**
   - expect valid quoted string containing `${adls.source.root}/customer_orders`

5. **entity suffix is preserved**
   - if input indicates `customer_orders`, do not generate `customer_order`

6. **sourceList matches source blocks**
   - every sourceList entry resolves to an actual source definition

7. **invented bronze_zone is rejected**
   - validator fails on unsupported zone token

8. **malformed path interpolation is rejected**
   - validator fails on broken mixed interpolation

9. **simple native sourcing stays simple**
   - single logical source should not explode into unnecessary sourcing fragments

10. **docs influence output**
   - changing/reading guidance provider changes selected supported types/read formats accordingly

---

## Desired code quality

- keep provider/advisor/validator responsibilities separate
- do not hardcode only the customer_orders case
- avoid regex-only hacks when structured parsing is possible
- keep rendering consistent with existing HOCON house style
- centralize path interpolation logic
- add debug logs at each decision point
- preserve existing working behavior unless it conflicts with framework guidance

---

## Logging to add

Add non-secret debug logs such as:

- `Data sourcing guidance loaded`
- `Sourcing decision selected: srz_zone`
- `Read format selected: view`
- `Path rendered via env variable root: ${adls.source.root}`
- `Source suffix preserved: customer_orders`
- `Data sourcing validation errors: [...]`

Do not log secrets, tokens, or full sensitive storage paths if avoidable.

---

## Acceptance criteria

Implementation is complete only if all are true:

1. bronze/raw source generation uses `srz_zone`
2. silver/gold curated source generation uses `curated_zone`
3. job config uses env-variable-based source paths whenever safely possible
4. HOCON/JSON-like interpolation is quoted correctly
5. no silent singular/plural corruption of entity names
6. `data_sourcing.md` and `hocon_template.txt` materially affect generation logic
7. validator rejects invented zone names and malformed interpolation
8. tests cover both positive and negative sourcing cases
9. existing create flow still works

---

## Final deliverable format from Copilot

When finished, respond with:

1. files created
2. files modified
3. exact sourcing rules implemented from the docs
4. tests added/updated
5. sample before/after output for a bronze/raw source
6. any remaining ambiguity, especially around curated root variables

---

## Do not do

- do not hardcode one scenario only
- do not keep using full ABFSS path in job config if an env variable exists
- do not invent `bronze_zone`
- do not silently rewrite `customer_orders` into `customer_order`
- do not treat preview markdown as documentation-only; it must drive runtime generation behavior
- do not ask unnecessary follow-up questions if the docs and existing code are enough to implement

---

Now implement this end to end in the extension codebase, run tests, and summarize the exact changes with evidence.
