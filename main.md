# Copilot Implementation Prompt — External Module Strategy for ETL Framework Extension

Use this prompt in GitHub Copilot Chat / Codex inside the extension workspace.

---

## Goal

Implement a **rule-driven external module strategy** in the ETL Framework extension so the agent only generates `externalFlag: "True"` based external-module configs when it is actually appropriate.

The implementation must make the UX safer, clearer, and more predictable.

---

## High-level behavior

The extension must decide between:

1. **Native framework config generation**
   - prefer built-in framework modules such as:
     - `data_sourcing_process`
     - `data_transformation`
     - `dataframe_writer`
     - `load_enrich_process`
     - `data_sync`
   - use this as the default path

2. **External module generation**
   - only use when the request clearly requires custom logic that cannot be represented well by standard framework modules
   - emit config using:
     - `externalFlag: "True"`
     - `options.path`
     - `options.module`
     - `options.method`

---

## Important product rule

**Default must be native framework modules. External module is opt-in by intent and evidence, not a fallback.**

Do not generate an external module just because the request is complex.
Generate it only when the request strongly suggests:
- custom PySpark business logic
- unsupported algorithmic logic
- reusable domain-specific code already exists
- orchestration must invoke a custom executable module
- framework-native module composition would be awkward, brittle, or misleading

---

## Required implementation

### 1) Add a dedicated decision engine

Create a new file:

- `src/core/execution/ExecutionStrategySelector.ts`

This component should expose something like:

```ts
export type ExecutionStrategy =
  | "native_framework"
  | "external_module"
  | "hybrid_review_required";

export interface ExecutionStrategyDecision {
  strategy: ExecutionStrategy;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  signals: {
    mentionsCustomCode: boolean;
    mentionsPySpark: boolean;
    mentionsReusableModule: boolean;
    mentionsUnsupportedFrameworkPattern: boolean;
    mentionsSimpleFilterDeriveWrite: boolean;
    mentionsExternalPathOrModule: boolean;
  };
  reviewRequired: boolean;
}
```

And a method like:

```ts
selectExecutionStrategy(input: {
  userPrompt: string;
  parsedIntent: unknown;
  templateHints?: unknown;
}): ExecutionStrategyDecision
```

### Decision rules

Return `native_framework` when the request is mainly:
- read source
- filter
- derive columns
- write delta
- publish to Synapse with standard framework shape

Return `external_module` when the request clearly needs:
- custom PySpark module
- existing reusable Python business logic
- non-standard transformation algorithm
- custom iterative logic
- advanced data quality routine that is not simple SQL stacking
- explicit user ask like:
  - "use external module"
  - "call this PySpark module"
  - "run custom code from DBFS"

Return `hybrid_review_required` when:
- both native and external are plausible
- confidence is low
- request can be partially native but one step may need custom code

---

### 2) Add framework-knowledge-backed external module guidance provider

Create:

- `src/core/context/ExternalModuleContextProvider.ts`

This component should load and normalize guidance from:

- `src/context_files/external_module.md`

It should provide structured knowledge such as:

```ts
export interface ExternalModuleGuidance {
  requiredConfigKeys: string[];
  requiredMethodArguments: string[];
  bestPractices: string[];
  antiPatterns: string[];
  useCases: string[];
  nonUseCases: string[];
}
```

At minimum extract and expose these facts from the doc:

- `externalFlag: "True"` triggers external Python script execution
- config must provide:
  - `options.path`
  - `options.module`
  - `options.method`
- invoked method signature expects:
  - `spark_session`
  - `config`
  - `audit`
  - `exception`
- execution goes through `utilsRun.py`
- robust error handling should go through `exception`
- audit object should be used for tracking

Do not keep this as loose text only. Parse it into a structured helper so generation and validation can use it.

---

### 3) Add validator for external-module configs

Create:

- `src/core/validation/ExternalModuleConfigValidator.ts`

Add validation rules:

#### Required
- `externalFlag === "True"` if strategy is external module
- `options.path` present and non-empty
- `options.module` present and non-empty
- `options.method` present and non-empty

#### Warnings
- if `options.path` does not look like DBFS/workspace/module path
- if config mixes framework-native keys in confusing ways
- if `externalFlag` is set but no strong reason was recorded by strategy selector

#### UX validation message
When external module is selected, the final response should explain:
- why external module was chosen
- which step needs custom code
- which config keys must be provided/reviewed
- whether human review is recommended

---

### 4) Integrate into create flow

Update the creation pipeline so strategy selection happens **before rendering artifacts**.

Likely touch files such as:
- `CreateJobSessionService.ts`
- `ETLChatParticipant.ts`
- any blueprint builder / renderer involved in generation

Required flow:

1. Parse user intent
2. Run `ExecutionStrategySelector`
3. Load context from `ExternalModuleContextProvider`
4. If native:
   - keep existing framework generation
5. If external:
   - generate external-module config section
   - validate with `ExternalModuleConfigValidator`
6. If hybrid:
   - do not silently choose
   - generate a review-required response and propose the split

---

### 5) UX requirements in chat response

When native framework is selected, include a short statement like:

- `Execution strategy: native framework modules`
- `Reason: request fits standard sourcing/transformation/write flow`

When external module is selected, include:

- `Execution strategy: external module`
- `Reason: request requires custom executable logic beyond standard framework modules`
- `External module contract: utilsRun.py -> getModule/runModule`
- `Required config: externalFlag, options.path, options.module, options.method`
- `Method contract: spark_session, config, audit, exception`

When hybrid review is selected, include:

- `Execution strategy: review required`
- `Native candidate steps: ...`
- `External candidate steps: ...`
- `Reason: ambiguous whether custom code is necessary`

Do not make the agent sound certain when the decision is low confidence.

---

### 6) Add prompt-level policy so the model behaves consistently

Update the prompt/context assembly so these rules are injected:

- prefer framework-native modules first
- only use external module when explicitly justified
- never use external module to compensate for weak reasoning
- if the request is simple filter/derive/write, do not generate external module
- if external module is chosen, explain why native modules were insufficient

---

### 7) Add tests

Create or update tests around:
- strategy selector
- context provider
- validator
- end-to-end generation

#### Required test cases

1. **simple bronze-to-silver job stays native**
   - prompt: read bronze, filter active, derive status, write silver
   - expect: `native_framework`

2. **explicit custom pyspark request chooses external**
   - prompt mentions custom PySpark module
   - expect: `external_module`

3. **existing reusable code path chooses external**
   - prompt mentions DBFS path or reusable module name
   - expect: `external_module`

4. **ambiguous advanced logic returns hybrid**
   - prompt suggests unusual logic but not explicit enough
   - expect: `hybrid_review_required`

5. **external config missing method fails validation**
   - expect validator error

6. **external config missing path fails validation**
   - expect validator error

7. **chat response explains external contract**
   - when external chosen, response contains required explanation

8. **native flow does not leak external keys**
   - ensure `externalFlag` not added to native configs

---

## Desired code quality

- Keep logic rule-driven, not keyword-only hacks
- Centralize execution-strategy logic in one place
- Avoid scattering `"externalFlag"` checks throughout the codebase
- Prefer small pure functions with unit tests
- Add helpful logs where decisions are made
- Preserve existing working behavior for native job generation

---

## Logging to add

Add debug logs like:

- `Execution strategy selected: native_framework`
- `Execution strategy selected: external_module`
- `Execution strategy selected: hybrid_review_required`
- `Decision reasons: [...]`
- `External module validation errors: [...]`

Do not log secrets or full sensitive payloads.

---

## Acceptance criteria

Implementation is complete only if all are true:

1. Simple standard ETL requests still generate native framework configs
2. External module is selected only when justified
3. External configs are validated against the contract from `external_module.md`
4. Chat output explains the strategy decision
5. Ambiguous scenarios do not get silently forced into external module
6. Tests cover all three strategy types
7. No regression in existing create flow

---

## Final deliverable format from Copilot

When finished, respond with:

1. files created
2. files modified
3. exact decision rules implemented
4. tests added/updated
5. any remaining ambiguity
6. sample before/after behavior for:
   - standard ETL
   - explicit external-module request
   - hybrid ambiguous request

---

## Optional stretch goal

If easy, add a future-ready registry pattern:

```ts
interface ExecutionStrategyRule {
  id: string;
  matches(input: unknown): boolean;
  weight: number;
  strategy: ExecutionStrategy;
  reason: string;
}
```

This will make future expansion easier for:
- native sourcing
- native transformation
- dataframe writer
- external module
- mixed orchestration patterns

---

## Do not do

- do not hardcode a single customer_orders scenario
- do not default to external for all Synapse publish jobs
- do not invent unsupported framework syntax
- do not skip validation for external configs
- do not ask the user unnecessary follow-up questions if the rules are enough to decide

---

Now implement this end to end in the extension codebase, run tests, and summarize the exact changes with evidence.
