You can proceed with Phase 1 without waiting for more answers, but here is the best guidance I have from the reference pack.

## 1) Write Command Handler
**Best answer:** it is **most likely triggered through VS Code chat command handling**, centered around `ETLChatParticipant.ts`, not just a standalone file writer.

Why I say that:
- the runtime flow notes say the user request enters through chat, likely through `ETLChatParticipant.ts`
- that same note says `@etl /write` is expected to retrieve session artifacts, resolve workspace path, and write files
- the important names explicitly called out for debugging are `RepoWriter.getWorkspacePath()`, `handleWriteCommand`, and `ETLChatParticipant.ts`  [oai_citation:0‡04-extension-code-map-and-runtime-flow.md](sediment://file_00000000196871fda8fb620a878d64f1)

**What I do not know:** I do **not** know whether there is also a separate command registration in `package.json`.  
So the practical instruction is:

- inspect `ETLChatParticipant.ts` first
- search for `handleWriteCommand`
- then check `package.json` for any related command registration

## 2) Test Fixtures / Smoke Scenarios
**Best answer:** the scenarios are already recognized in the plan/reference pack, and there is evidence that `customer_orders -> curated + Synapse` has acceptance coverage, but I do **not** know whether there are already dedicated fixture files in a specific fixtures folder.

What is supported:
- the plan/reference pack explicitly says the system needs manual smoke scenarios including:
  - curated load/enrich
  - curated + Synapse publish
  - database_out
  - tibco_out
  - env reuse
  - artifact reuse  [oai_citation:1‡02-implementation-progress-and-status.md](sediment://file_00000000f2e871fd811c16ad9784c693)
- the implementation status says the `customer_orders -> Synapse` scenario was a major reference flow and that acceptance coverage was added for Synapse publish presence  [oai_citation:2‡02-implementation-progress-and-status.md](sediment://file_00000000f2e871fd811c16ad9784c693)
- the code map lists `extension.test.ts`, `artifactFidelity.test.ts`, and other strategy tests as likely existing test locations  [oai_citation:3‡04-extension-code-map-and-runtime-flow.md](sediment://file_00000000196871fda8fb620a878d64f1)

**What I do not know:** whether those scenarios already exist as reusable fixture files under something like `src/test/fixtures`.

So the practical instruction is:

- inspect `extension.test.ts` first
- inspect any existing `src/test/` helper/fixture structure
- if there is no reusable fixture layer, create it as part of implementation

## 3) Workspace Root Resolution
**Best answer:** there is **likely a specific utility/service path for this**, not just random inline logic everywhere.

Why:
- the runtime flow notes explicitly say production write path must rely on the real workspace resolution method
- the important names called out are `RepoWriter.getWorkspacePath()`, `handleWriteCommand`, and `ETLChatParticipant.ts`  [oai_citation:4‡04-extension-code-map-and-runtime-flow.md](sediment://file_00000000196871fda8fb620a878d64f1)

So the practical assumption should be:

- start with `RepoWriter.ts`
- find `getWorkspacePath()`
- trace who calls it during `@etl /write`

That said, I do **not** know whether some workspace-root logic is also duplicated elsewhere, so still search the repo for:
- `getWorkspacePath`
- `workspaceFolders`
- `rootPath`
- `fsPath`

## 4) Include File Write Logic
**Best answer:** I would treat this as **distributed across multiple files until proven otherwise**.

Why:
- the architecture pack separates:
  - planning
  - rendering
  - pre-write validation
  - repo/file writing  [oai_citation:5‡04-extension-code-map-and-runtime-flow.md](sediment://file_00000000196871fda8fb620a878d64f1)
- the code map explicitly lists both:
  - `RepoWriter`-style write flow references
  - `NewArtifactWriter.ts`
  - `ArtifactActionCoordinator.ts` in the action/apply layer  [oai_citation:6‡04-extension-code-map-and-runtime-flow.md](sediment://file_00000000196871fda8fb620a878d64f1)
- the real write checklist explicitly says one of the things to trace is whether include files are written together with the main job config  [oai_citation:7‡04-extension-code-map-and-runtime-flow.md](sediment://file_00000000196871fda8fb620a878d64f1)

So my practical guidance is:

- assume `RepoWriter.ts` is central for actual persistence/path resolution
- assume `NewArtifactWriter.ts` may participate in creation/apply flows
- verify whether include enumeration happens in renderer/planner code and whether actual persistence happens in writer code

**I do not know** which one is the single source of truth until the repo is inspected.

## 5) Synapse Publish Artifacts
**Best answer:** this looks like it is **embedded as a section/module inside the main job config**, not a separate standalone artifact type.

Why:
- the implementation status says when Synapse publishing is requested, “the generated flow contains the publish section/module” and that `data_sync` is present where expected  [oai_citation:8‡02-implementation-progress-and-status.md](sediment://file_00000000f2e871fd811c16ad9784c693)
- the framework conventions doc describes generated artifacts as:
  - main job config
  - include SQL/YAML files
  and shows module-based HOCON structures inside the job config  [oai_citation:9‡03-framework-rules-and-artifact-conventions.md](sediment://file_00000000b07071f8bdd1dbd25cd70529)
- the artifact structure example lists job config plus include files like `main_transform.json`, `database_out.yaml`, `tibco_out.yaml`; it does **not** describe Synapse publish as a separate dedicated file artifact type  [oai_citation:10‡03-framework-rules-and-artifact-conventions.md](sediment://file_00000000b07071f8bdd1dbd25cd70529)

So the working assumption should be:

- Synapse publish is likely a **module/section in the generated job config**
- not a separate file type
- but it may depend on existing include files already used by the main flow

## Bottom line
You do **not** need to stop for these answers.

Proceed with Phase 1 and treat these as discovery targets:
1. trace `@etl /create` and `@etl /write` through `ETLChatParticipant.ts`
2. trace `handleWriteCommand`
3. trace `RepoWriter.getWorkspacePath()`
4. inspect `extension.test.ts` for the customer_orders + Synapse scenario
5. inspect whether include-file writing is handled by `RepoWriter.ts`, `NewArtifactWriter.ts`, or both
6. treat Synapse publish as embedded in job config unless repo inspection proves otherwise

## What I know vs don’t know
**I know:**
- chat flow is expected to drive create/write
- `RepoWriter.getWorkspacePath()` is an important real-write path
- `customer_orders -> Synapse` is a real golden scenario
- Synapse publish is described as a generated section/module with `data_sync`

**I don’t know:**
- whether `package.json` also registers a separate command path
- whether dedicated fixtures already exist in a fixtures folder
- whether include writing is centralized in one file or spread across several
- the exact final repo implementation without inspecting current code
