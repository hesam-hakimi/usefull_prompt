---
description: Independently verify target resolution, delivery classification, and the current change against ownership rules, contracts, tests, package evidence, and regression risks.
mode: agent
---

Use `.github/agents/verifier.agent.md` and the applicable lifecycle contract in `workflow/shipped-extension-delivery.md`.

Start with:

## Target Resolution

- Target type:
- Delivery classification: `source-only / shipped-extension / operational-only`
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Review the exact current diff or bounded operational manifest. Map each acceptance criterion to evidence, identify ownership violations, accidental scope, test-isolation failures, compatibility risks, and checks that were not run.

For `shipped-extension`, also verify the applicable pre-install package evidence: exact package/version identity, canonical build/package path, package contents, required product resources/registrations, forbidden-file absence, and exact package path. A pre-install `VERIFIED` result authorizes continuation to the same-task local install; it is not `DONE` and does not prove activation or live behavior.

If this review is post-activation, require evidence from the newly active version and the exact changed-path smoke before supporting `POST_INSTALL_VERIFIED`.

Do not repair findings unless the user separately asks for implementation. Do not convert a source/package verification result into a live-runtime completion claim.
