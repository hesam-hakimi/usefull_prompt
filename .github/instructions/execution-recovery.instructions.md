---
applyTo: "**"
---

# Evidence-driven execution and recovery

- Follow `workflow/execution-recovery.md` whenever root cause, runtime identity, package completeness, question provenance, or failure ownership is unclear.
- Follow `workflow/shipped-extension-delivery.md` when the changed behavior must be exercised from the installed VSIX.
- Before asking the user a question, classify it as `DERIVABLE_FROM_STTM`, `DERIVABLE_FROM_REPO`, `AUTHORITATIVE_LITERAL`, `BUSINESS_DECISION`, `USER_APPROVAL`, `TOOLING_GAP`, or `SECURITY_BLOCKER`.
- Do not ask the user to paste or reconstruct information that exists in an authorized workbook, repository, schema, manifest, package, or runtime source.
- Treat truncation, missing retrieval, stale state, parser limits, serialization limits, and unavailable tools as `TOOLING_GAP`, not business ambiguity.
- On unexpected failure, stop the current mutation, preserve exact evidence, emit an execution checkpoint, classify the failure, and use Evidence Researcher when required.
- Do not repeatedly retry a failed action without new evidence.
- Block only affected artifacts or lifecycle stages when unrelated work can continue safely.
- A source or package-content change discovered after package verification, installation, activation, or live smoke invalidates the verified artifact and requires a new task, new plan, new package identity when applicable, and fresh verification.
- A shipped-extension implementation/fix request already authorizes the bounded local build/package/verify/install/activation/smoke chain for that exact task artifact. Do not apply the new-task rule between those internal delivery stages.
- A later standalone build/package/install/upgrade request after the earlier task ended is a new operational task.
- Distinguish source verification, build, package, package verification, installation, activation, and live smoke evidence.
- Label failures pre-existing only when reproduced against a grounded baseline.
- Before session handoff or user action, emit the checkpoint fields required by `workflow/execution-recovery.md`.
