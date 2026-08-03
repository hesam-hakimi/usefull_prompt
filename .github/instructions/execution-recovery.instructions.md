---
applyTo: "**"
---

# Evidence-driven execution and recovery

- Follow `workflow/execution-recovery.md` whenever root cause, runtime identity, package completeness, question provenance, or failure ownership is unclear.
- Before asking the user a question, classify it as `DERIVABLE_FROM_STTM`, `DERIVABLE_FROM_REPO`, `AUTHORITATIVE_LITERAL`, `BUSINESS_DECISION`, `USER_APPROVAL`, `TOOLING_GAP`, or `SECURITY_BLOCKER`.
- Do not ask the user to paste or reconstruct information that exists in an authorized workbook, repository, schema, manifest, package, or runtime source.
- Treat truncation, missing retrieval, stale state, parser limits, serialization limits, and unavailable tools as `TOOLING_GAP`, not business ambiguity.
- On unexpected failure, stop the current mutation, preserve exact evidence, emit an execution checkpoint, classify the failure, and use Evidence Researcher when required.
- Do not repeatedly retry a failed action without new evidence.
- Block only affected artifacts or lifecycle stages when unrelated work can continue safely.
- A source change discovered after package verification, installation, activation, or live smoke requires a new task, new plan, new package identity when applicable, and fresh verification.
- Distinguish source verification, build, package, package verification, installation, activation, and live smoke evidence.
- Label failures pre-existing only when reproduced against a grounded baseline.
- Before session handoff or user action, emit the checkpoint fields required by `workflow/execution-recovery.md`.
