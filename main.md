# ETL Framework Extension — External Module Strategy Implementation

## Goal
Implement a rule-driven strategy selector so the extension chooses between:
- `internal_standard`
- `internal_with_includes`
- `external_module`

And uses `src/context_files/external_module.md` as a structured source of truth for:
- decision rules
- generation rules
- validation rules
- user-facing explanation rules

This implementation must improve UX by making external modules an explicit, justified choice instead of a default escape hatch.

---

## Scope
Implement these capabilities:

1. Read and structure guidance from `src/context_files/external_module.md`
2. Add a decision engine that selects execution strategy before artifact generation
3. Add external-module-specific validation
4. Update response rendering so the user sees *why* a strategy was chosen
5. Add tests covering positive and negative strategy-selection scenarios

Do **not** regress existing create / validate / write flows.

---

## Product Rules

### Default behavior
Use internal ETL modules by default.

### Use external module only when justified
External module should be selected only when one or more of these are true:
- request clearly asks for custom PySpark / Python logic
- request implies reusable logic across multiple jobs
- requested transformation is too complex for current framework SQL/module patterns
- request references existing enterprise external module / custom module
- request needs DataFrame API style logic rather than plain SQL chaining

### Avoid external module when not needed
Do **not** choose external module for:
- simple sourcing
- simple filter / derive / rename / cast
- normal write / publish patterns
- standard bronze-to-silver or silver-to-gold flows expressible via framework modules

---

## Files to Add

### 1) `src/chat/context/ExternalModuleContextProvider.ts`
Purpose:
- Load `src/context_files/external_module.md`
- Parse it into structured guidance
- Expose reusable APIs to the rest of the extension

Suggested interface:

```ts
export interface ExternalModuleGuidance {
  preferredUseCases: string[];
  avoidUseCases: string[];
  requiredConfigKeys: string[];
  runtimeContract: {
    requiredArgs: string[];
    configKeys: {
      path: string;
      module: string;
      method: string;
      externalFlag: string;
    };
  };
  uxRules: string[];
  bestPractices: string[];
}

export class ExternalModuleContextProvider {
  getGuidance(): Promise<ExternalModuleGuidance>;
}
```

Implementation notes:
- Keep parsing deterministic. Do not rely on fuzzy LLM parsing here.
- A lightweight section-based parser is enough.
- If parsing fails, fall back to safe defaults that bias toward **not** using external modules.

---

### 2) `src/chat/strategy/ExecutionStrategySelector.ts`
Purpose:
- Decide which execution strategy to use before generation starts

Suggested types:

```ts
export type ExecutionStrategy =
  | "internal_standard"
  | "internal_with_includes"
  | "external_module";

export interface ExecutionStrategyDecision {
  strategy: ExecutionStrategy;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  requiredContexts: string[];
  requiresUserReview: boolean;
}
```

Suggested public API:

```ts
export interface StrategySelectionInput {
  userRequest: string;
  detectedComplexitySignals: string[];
  templateMode?: string;
  optionalArtifacts?: string[];
  envConfigMode?: "reuse" | "create";
}

export class ExecutionStrategySelector {
  constructor(private readonly externalGuidance: ExternalModuleGuidance) {}

  select(input: StrategySelectionInput): ExecutionStrategyDecision;
}
```

Decision rules:
- If request is standard ETL and compatible with existing framework modules → `internal_standard`
- If request benefits from modularization via SQL / JSON includes → `internal_with_includes`
- If request clearly needs custom Python / reusable logic → `external_module`
- When ambiguous, prefer internal strategy and include an explanation

---

### 3) `src/chat/validation/ExternalModuleConfigValidator.ts`
Purpose:
- Validate generated external module config before write/deploy

Suggested checks:
- `externalFlag` must be present and truthy when external strategy selected
- `options.path` exists
- `options.module` exists
- `options.method` exists
- no placeholder values like `test_external_module`, `TODO`, `your_module_here`
- referenced path format is valid for framework expectations
- response includes review note for external module strategy

Suggested API:

```ts
export interface ExternalModuleValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ExternalModuleConfigValidator {
  validate(configText: string): ExternalModuleValidationResult;
}
```

---

## Files to Modify

### 4) Update the main chat/create orchestration service
Likely candidates based on current project patterns:
- `CreateJobSessionService.ts`
- `ETLChatParticipant.ts`
- any existing blueprint orchestration / generation coordinator

Required changes:
- run `ExecutionStrategySelector` before artifact generation
- persist the decision in session state
- pass decision to generators / renderers / validators
- include chosen strategy in final response

Expected session fields:

```ts
interface StrategySessionState {
  executionStrategy: ExecutionStrategy;
  executionStrategyReasons: string[];
  executionStrategyConfidence: "high" | "medium" | "low";
}
```

---

### 5) Update generation pipeline
If strategy is:

#### `internal_standard`
- build normal framework job config
- keep using internal modules

#### `internal_with_includes`
- prefer modular SQL / JSON includes
- generate include files where it improves clarity and reuse

#### `external_module`
- generate external-module-compatible config
- generate or reference Python module artifact when appropriate
- ensure config matches contract from `external_module.md`

Important:
- Do not auto-switch to external module just because generation is hard.
- Do not invent external paths or placeholder module names unless explicitly presented as TODOs for human completion, and those TODOs must block deployment if required fields are missing.

---

### 6) Update response renderer / chat UX
Add a new response section:

```text
Execution Strategy
- Selected: internal_standard | internal_with_includes | external_module
- Confidence: high | medium | low
- Reasons:
  - ...
  - ...
```

If external module is selected, include:
- why standard modules were not enough
- what extra artifacts were generated
- what must be reviewed by a human before deployment

If external module is **not** selected for a complex-looking request, explain why internal modules are still preferred.

---

## How to Leverage `external_module.md`
Use it in four places:

### A. Decision support
Drive the strategy selector with hard rules extracted from the doc.

### B. Prompt assembly
Only inject the external module context when the selected or candidate strategy is `external_module`.
Do **not** always include that context in every generation prompt.

### C. Validation
External strategy must be validated against the documented runtime contract.

### D. UX explanation
User-facing response should mention that the choice follows framework guidance from the external module contract.

---

## Prompt-Assembly Rule
Refactor prompt building so context selection becomes targeted.

Suggested shape:

```ts
interface PromptContextSelection {
  includeDataSourcing: boolean;
  includeDataTransformation: boolean;
  includeDataframeWriter: boolean;
  includeExternalModule: boolean;
  includeHoconTemplate: boolean;
}
```

Rules:
- standard sourcing flow → sourcing + transformation + writer + hocon
- includes flow → sourcing + transformation + writer + hocon + include guidance
- external flow → external module + hocon + only the other relevant module docs

This prevents context overload and improves model behavior.

---

## UX Rules

### Good UX behavior
- explain the strategy choice
- avoid unnecessary external modules
- generate reviewable, framework-aligned artifacts
- block invalid external module output

### Bad UX behavior to prevent
- silently switching to external module
- generating placeholder external config without telling the user
- choosing external module for simple ETL flows
- mixing internal and external patterns without explanation

---

## Testing Requirements
Add tests for all of the following.

### Strategy selector tests
1. Simple bronze-to-silver request → `internal_standard`
2. Request that benefits from modular includes → `internal_with_includes`
3. Request mentioning custom PySpark reusable logic → `external_module`
4. Ambiguous request → prefer internal, low/medium confidence, explanatory reasons

### External validator tests
5. Valid external config passes
6. Missing `externalFlag` fails
7. Missing `options.path` fails
8. Missing `options.module` fails
9. Missing `options.method` fails
10. Placeholder values produce errors

### Response rendering tests
11. Final response includes execution strategy block
12. External-module response includes justification and review note
13. Internal response includes justification when external was not chosen

### Non-regression tests
14. Existing internal generation flows still pass
15. Existing validation/write behavior still passes

---

## Acceptance Criteria
Implementation is complete only if all of these are true:

1. `external_module.md` is read through code, not just manually referenced
2. Strategy selection happens before generation
3. External module is not the default
4. Standard ETL requests still generate standard module configs
5. External module configs are validated with dedicated checks
6. Final user response explains strategy choice
7. Tests cover selector, validator, renderer, and non-regression behavior
8. Build passes with no TypeScript errors
9. Existing extension behavior is not broken

---

## Suggested Implementation Order

### Step 1
Create `ExternalModuleContextProvider.ts`

### Step 2
Create `ExecutionStrategySelector.ts`

### Step 3
Wire strategy selection into job/session orchestration

### Step 4
Create `ExternalModuleConfigValidator.ts`

### Step 5
Update prompt assembly and artifact generation pipeline

### Step 6
Update final response rendering

### Step 7
Add tests

### Step 8
Run full verification:

```bash
npm run compile
npm test
npm audit --audit-level=high
```

If all pass, package:

```bash
npm version patch
npx vsce package
```

---

## Copy-Paste Prompt for Copilot / Codex

```text
Implement a rule-driven execution-strategy system in the ETL Framework extension.

Goal:
Use src/context_files/external_module.md as a structured source of truth so the extension can decide between:
- internal_standard
- internal_with_includes
- external_module

Requirements:
1. Add src/chat/context/ExternalModuleContextProvider.ts
   - Read src/context_files/external_module.md
   - Parse it into a structured ExternalModuleGuidance object
   - If parsing fails, fall back to safe defaults that bias against external-module selection

2. Add src/chat/strategy/ExecutionStrategySelector.ts
   - Export ExecutionStrategy = internal_standard | internal_with_includes | external_module
   - Export ExecutionStrategyDecision with strategy, confidence, reasons, requiredContexts, requiresUserReview
   - Selector must prefer internal strategies by default
   - Choose external_module only when the request clearly implies custom PySpark/Python reusable logic or complexity beyond standard framework modules

3. Add src/chat/validation/ExternalModuleConfigValidator.ts
   - Validate external module config text
   - Require externalFlag, options.path, options.module, options.method
   - Reject placeholder values like TODO, test_external_module, your_module_here

4. Modify orchestration flow (likely CreateJobSessionService.ts / ETLChatParticipant.ts and related pipeline code)
   - Run strategy selection before artifact generation
   - Save decision in session state
   - Pass decision into generation, validation, and response rendering

5. Update prompt assembly
   - Only include external_module.md guidance when external_module is selected or a strong candidate
   - Do not inject every context file into every prompt

6. Update final response rendering
   - Add “Execution Strategy” section with selected strategy, confidence, and reasons
   - If external_module selected, explain why it was needed and what requires human review
   - If not selected, explain why internal modules were sufficient

7. Add tests:
   - simple bronze-to-silver => internal_standard
   - modular include-friendly request => internal_with_includes
   - custom PySpark reusable logic => external_module
   - ambiguous request => prefer internal with explanation
   - validator failure cases for missing externalFlag/path/module/method/placeholders
   - response includes execution strategy block
   - non-regression tests for existing internal flows

Constraints:
- Do not regress existing create/validate/write flows
- Do not silently fall back to external_module because generation is hard
- Keep external_module as a specialized option, not the default
- Keep implementation deterministic and testable

Deliverables:
- new provider file
- new strategy selector file
- new external validator file
- orchestration updates
- renderer updates
- tests

Verification:
Run:
- npm run compile
- npm test
- npm audit --audit-level=high

Then summarize:
- files added/modified
- strategy rules implemented
- tests added
- proof that standard ETL requests still use internal modules
```

---

## Recommended Follow-Up After This Change
After this is merged, implement the same pattern for:
- `data_sourcing.md`
- `data_transformation.md`
- `dataframe_writer.md`
- `hocon_template.txt`

That will let the extension become a true rule-driven framework assistant instead of relying on a single large prompt.
