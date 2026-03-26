# Next implementation step: Env Config Patch Plan + Reuse Action Layer

The Env Config Discovery and Reuse Layer is complete and passing tests.
Now implement the next layer: convert env discovery decisions into actionable patch/scaffold output.

## Goal

After env discovery/scoring decides `reuse_existing`, `review_required`, or `create_new`, the system must also generate a concrete env action plan:

- what keys are missing
- why they are needed
- what values can be safely suggested
- whether to patch an existing env config or create a new one
- a minimal patch/scaffold artifact the user can review

This should improve UX by turning recommendation into action.

---

## Functional requirements

### 1. Add structured env gap model

Create types for missing items and patch/scaffold plans.

Suggested shape:

```ts
type EnvMissingItem = {
  key: string;
  reason: string;
  required: boolean;
  suggestedValue?: string;
  source: 'runtime_readiness' | 'output_strategy' | 'doc_rule';
};

type EnvPatchPlan = {
  mode: 'patch_existing' | 'create_new' | 'manual_review';
  targetPath?: string;
  missing: EnvMissingItem[];
  patchText?: string;
  scaffoldText?: string;
  warnings: string[];
};
