# Next implementation step: Runtime Readiness Layer

The output strategy layer now looks stable enough.
Do not rework naming or path conventions unless required by this task.

Build the next layer focused on runtime readiness for generated ETL artifacts.

## Goal

After a job is generated, the extension must also tell the user whether the artifact is operationally ready to run.

This means detecting:
- missing env variables
- missing secret/connection requirements
- missing required assertion metadata
- unresolved placeholders
- output-strategy-specific runtime prerequisites

The result should be visible in chat and testable.

---

## What to build

### 1. Add a Runtime Readiness evaluator
Create a small layer that runs after output strategy / rendering and before final response assembly.

It should inspect the generated artifact set and produce a structured result like:

```ts
type RuntimeReadinessReport = {
  isReady: boolean;
  severity: 'ok' | 'warning' | 'error';
  strategy: string;
  requiredEnvVars: string[];
  requiredSecrets: string[];
  requiredConnections: string[];
  requiredPipelines: string[];
  missingItems: Array<{
    type: 'env' | 'secret' | 'connection' | 'assertion' | 'include' | 'placeholder' | 'other';
    key: string;
    reason: string;
    moduleKey?: string;
  }>;
  warnings: Array<{
    key: string;
    reason: string;
    moduleKey?: string;
  }>;
  notes: string[];
};
