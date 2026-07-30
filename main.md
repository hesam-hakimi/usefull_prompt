فعلاً درست کردی که Agentهای توسعه را وارد `.github/agents` نکردی؛ ابتدا باید مرز مالکیت این پوشه اصلاح شود. این پرامپت را در Copilot Agent Mode اجرا کن:

Implement a strict ownership boundary between repository-maintainer Copilot agents and agent definitions delivered by the extension.

## Problem

Some extension code currently creates, copies, repairs, upgrades, or otherwise manages files under:

`.github/agents/**`

This is incorrect.

That directory belongs exclusively to the current repository’s maintainer/development workflow. Files there control how GitHub Copilot develops this repository and must never be treated as generated ETL extension output.

Do not modify, move, copy, rename, delete, or use the existing `.github/agents/**` files as templates or product source material.

## Required target architecture

1. `.github/agents/**` is a protected control-plane path.

2. Extension activation, initialization, workflow setup, audit, repair, upgrade, preview, and write operations must never create or modify files there.

3. Extension-delivered agent definitions must have one canonical packaged source, preferably:

   `resources/copilot/agents/**`

   If an existing canonical packaged location already exists, use it instead and document why. Do not create duplicate sources of truth.

4. Agent definitions must be loaded or registered through a supported extension/package mechanism.

5. If the platform cannot expose these agents without writing `.github/agents/**`, stop and report that platform constraint. Do not silently fall back to workspace file generation.

6. Existing `.github/agents/**` files in user repositories are user-owned. Never delete or rewrite them automatically.

7. Do not generate `.github/agents/**` in either the extension repository or consumer ETL repositories.

8. Optional consumer overlays must remain a separate, explicit, preview-first and approval-gated feature. They must not include agent files unless a future design explicitly reintroduces that capability.

## Phase 1 — Find the current behavior

Before changing code, locate every path that can create or manage `.github/agents/**`, including:

* asset catalogs;
* scaffold manifests;
* workflow initializers;
* repo-context initializers;
* preview services;
* writers;
* audit, repair, and upgrade services;
* hard-coded path constants;
* packaged templates;
* tests and fixtures;
* `package.json` contributions;
* documentation.

First output a short “Target Resolution” report containing:

* protected control-plane path;
* currently resolved product-source path;
* every writer or manifest referencing `.github/agents`;
* which operations can currently create those files;
* proposed canonical packaged location;
* expected files to change.

Do not begin implementation if ownership is still ambiguous.

## Phase 2 — Correct the implementation

Make the smallest coherent change that:

* removes `.github/agents/**` from generated workflow asset catalogs and manifests;
* prevents init, workflow, audit, repair, and upgrade operations from managing agent files;
* moves only genuine product agent definitions to the packaged canonical source;
* does not move or copy repository-maintainer agents;
* updates package registration or runtime loading as required;
* preserves existing prompt, skill, instruction, and context behavior unless directly affected;
* keeps preview and write behavior unchanged for legitimate generated assets;
* treats existing generated agent files as legacy user-owned files and leaves them untouched;
* optionally reports legacy files as an informational diagnostic, without modifying them.

Do not perform unrelated cleanup or refactoring.

## Required regression protection

Add deterministic tests proving that:

1. Extension activation writes no workspace files.
2. Repo initialization does not create `.github/agents/**`.
3. Workflow initialization does not create `.github/agents/**`.
4. Audit, repair, and upgrade do not modify existing `.github/agents/**`.
5. Consumer overlay operations do not generate agent files.
6. Existing user files under `.github/agents/**` remain byte-for-byte unchanged.
7. Packaged product agent definitions are included in the VSIX.
8. The supported runtime/package mechanism can find the packaged definitions.
9. A guard test fails if `.github/agents` is reintroduced into any generated-asset manifest or writer destination.

Run the relevant unit tests, evaluation checks, package verification, and VSIX-content verification.

## Acceptance criteria

The change is complete only when:

* no extension-owned runtime path writes `.github/agents/**`;
* `.github/agents/**` is documented as maintainer-owned and protected;
* product agent definitions have exactly one canonical packaged source;
* legacy files are not deleted;
* all affected tests pass;
* the VSIX contains the intended packaged assets;
* the final response lists the root cause, changed files, tests executed, compatibility impact, and any remaining platform limitation.

Do not claim completion based only on documentation changes. Verify the actual writer, manifests, generated output, and packaged VSIX contents.

بعد از اینکه این تغییر پیاده و تست شد، می‌توانی Agentهای مخصوص توسعه‌ی خود پروژه مثل Orchestrator و Verifier را داخل `.github/agents` قرار بدهی؛ آن زمان این پوشه فقط control plane توسعه خواهد بود و دیگر با خروجی Extension قاطی نمی‌شود.
