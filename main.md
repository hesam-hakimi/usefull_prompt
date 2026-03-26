# Next implementation step: Env Config Discovery and Reuse Layer

The runtime readiness layer is complete and passing tests.
Now build the next layer: automatic env-config discovery, scoring, reuse recommendation, and gap reporting.

## Goal

When a job is generated, the extension should not only report required env vars/secrets/pipelines, but should also:

- discover existing env config files in the workspace
- evaluate which env config best satisfies the generated job
- recommend reuse vs create-new
- explain missing items clearly
- surface the decision in chat and session state

This should improve UX by minimizing unnecessary env-config creation.

---

## Functional requirements

### 1. Discover env config candidates
Search the workspace for env config files using the repo’s existing conventions.

Examples may include:
- `conf/env/*.yml`
- `conf/env/*.yaml`
- other repo-supported env-config paths if already present

Do not invent unsupported search locations if the repo already has a convention.

Create a small discovery utility that returns candidate env config files.

---

### 2. Parse env config content safely
Read env config candidates and extract only the fields needed for matching/scoring.

At minimum, support matching on values relevant to current strategies, such as:
- `adls.source.root`
- `adls.destination.root`
- `adls.tibco.root`
- `destination.malcode`
- mail / tibco-related env values
- db / connection-related values
- any other fields already recognized by runtime readiness

If the repo already has a parser/helper for HOCON/YAML/env-style files, reuse it.

---

### 3. Build Env Config scoring
Create an advisor that compares runtime-readiness requirements against discovered env configs.

Suggested output shape:

```ts
type EnvConfigMatch = {
  path: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  satisfied: string[];
  missing: string[];
  warnings: string[];
};

type EnvConfigDecision = {
  mode: 'reuse_existing' | 'create_new' | 'review_required';
  selectedPath?: string;
  candidates: EnvConfigMatch[];
  reasons: string[];
  missingRequirements: string[];
  warnings: string[];
};
