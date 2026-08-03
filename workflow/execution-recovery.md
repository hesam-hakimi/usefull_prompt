# Evidence-Driven Execution and Recovery Contract

This contract makes investigation, remediation, packaging, activation, and live verification repeatable. It supplements `AGENTS.md` and `workflow/README.md`; it does not replace target ownership, approval, or independent-verification rules.

## When this contract applies

Use this contract when any of the following is true:

- current behavior or root cause is not yet grounded;
- source, generated output, bundle, VSIX, installed files, and active runtime disagree;
- a tool is missing, unavailable, truncated, stale, or returns incomplete evidence;
- a user question may be answerable from STTM, repository, schema, runtime, or package evidence;
- a test failure is claimed to be pre-existing;
- a live smoke test fails after source or package verification;
- implementation evidence invalidates the accepted plan;
- a long-running session needs a durable checkpoint or handoff.

Do not use ad hoc workarounds to bypass this contract.

## Optional evidence gate

The normal lifecycle remains:

```text
INTAKE
→ TARGET_RESOLVED
→ CONTEXT_READY
→ PLAN_READY
→ IMPLEMENTING
→ IMPLEMENTED
→ VERIFIED
→ DONE
```

When evidence is insufficient, insert this conditional gate:

```text
CONTEXT_READY
→ EVIDENCE_REQUIRED
→ Evidence Researcher
→ EVIDENCE_READY
→ PLAN_READY
```

The Evidence Researcher returns exactly one leading state:

```text
EVIDENCE_READY
```

or:

```text
EVIDENCE_BLOCKED
```

`EVIDENCE_READY` is not approval to edit. It is grounded input for Planner and Orchestrator.

## Automatic topology

```text
User request
    ↓
Orchestrator
    ↓
Evidence Researcher, when triggered
    ↓
Planner
    ↓
Orchestrator implementation
    ↓
Fresh Verifier
    ↓
Result or bounded recovery
```

The user should not have to switch agents manually.

## Evidence-research triggers

The Orchestrator must invoke Evidence Researcher before planning or remediation when:

1. the exact source of behavior is unknown;
2. a runtime result conflicts with source or tests;
3. package, installed, and active versions may differ;
4. a tool response is incomplete, summarized, or truncated;
5. the answer may already exist in a workbook, repository, schema, manifest, logs, or accepted examples;
6. the scope of a failure is unclear;
7. pre-existing failures have not been independently reproduced;
8. a change may affect protected paths or another workspace;
9. a recovery would add a dependency, version bump, new agent, new tool, or broader capability.

## Question classification

Before asking the user a question, classify it as exactly one of:

| Classification | Meaning | Required action |
| --- | --- | --- |
| `DERIVABLE_FROM_STTM` | The authoritative workbook contains or references the answer | Resolve sheets, rule IDs, versions, and original cells; do not ask the user |
| `DERIVABLE_FROM_REPO` | Current repository artifacts contain the answer | Inspect the owning workspace and canonical files; do not ask the user |
| `AUTHORITATIVE_LITERAL` | A schema, contract, accepted example, or registration record must supply an exact value | Search authoritative sources; ask only if still unresolved |
| `BUSINESS_DECISION` | Multiple valid behaviors remain and the user or owner must choose | Ask one focused question with consequences |
| `USER_APPROVAL` | Exact preview, manifest, write, package, install, deploy, or run needs consent | Bind approval to the exact operation |
| `TOOLING_GAP` | The answer exists but tooling cannot retrieve, parse, preserve, or expose it | Report a product defect; do not ask the user to paste or reconstruct the data |
| `SECURITY_BLOCKER` | Safe target, containment, authority, or data handling cannot be established | Stop and report the blocker |

Every proposed question must include:

```text
Question:
Classification:
Sources checked:
Why unresolved:
Affected artifacts:
Can unrelated work continue: yes | no
```

Do not ask the user to paste workbook cells, source files, logs, or values that exist in an authorized source but were hidden by truncation, serialization, context limits, stale state, or unavailable tooling.

## Failure classification

Classify an unexpected failure before remediation:

- `EVIDENCE_GAP`
- `TOOLING_GAP`
- `BUSINESS_CONFLICT`
- `AUTHORITATIVE_VALUE_GAP`
- `AUTHORIZATION_GAP`
- `REGRESSION`
- `PACKAGE_RUNTIME_MISMATCH`
- `SECURITY_BLOCKER`

Record the classification in the execution checkpoint and evidence packet.

## Recovery loop

When an unexpected failure occurs:

1. Stop the current mutation or operational sequence.
2. Preserve the exact error, tool call, task state, artifact state, and changed-file list.
3. Emit an `## Execution Checkpoint`.
4. Classify the failure and all pending questions.
5. Invoke Evidence Researcher when any trigger applies.
6. Determine whether remediation stays in the current task or requires a new task.
7. Update the change contract and acceptance criteria using grounded evidence.
8. Invoke Planner for the bounded remediation.
9. Implement only the accepted remediation.
10. Re-run the failed stage and adjacent critical checks.
11. Invoke a fresh Verifier.
12. Resume the original lifecycle only when the recovered evidence is compatible with the original request.

Do not repeatedly retry the same failed action without new evidence.

## Same-task remediation versus new task

A remediation may remain in the current task only when all are true:

- it is inside the accepted target and change contract;
- it does not add a new operational action or approval;
- it does not change the produced package identity or version after package verification;
- it does not expand public behavior, dependencies, schemas, security, or deployment scope;
- it occurs before `VERIFIED` or `DONE`;
- the original acceptance criteria still describe the exact result.

Start a new task at `INTAKE` when any of these is true:

- a verified, packaged, installed, or live-tested artifact needs source changes;
- a dependency, package version, agent role, tool contract, or deployment behavior must change;
- a live smoke test reveals a new product defect;
- a new build, package, install, publish, deploy, repair, upgrade, or run is requested;
- the target, workspace, artifact set, destination, or approval changes;
- the remediation exceeds the accepted plan;
- the conversation or host was restored and trusted task state cannot be proven.

The earlier task must report its actual terminal state and evidence. Do not retroactively rewrite it as successful.

## Execution checkpoint

Emit a checkpoint:

- after target resolution;
- after Evidence Researcher returns;
- after Planner returns;
- after implementation;
- after package verification;
- after installation;
- before a required user action such as host reload;
- after live smoke;
- whenever the task becomes blocked;
- before handing work to another session.

Use this format:

```text
## Execution Checkpoint

Task ID:
Request class:
Current workflow state:
Target type:
Workspace root:
Canonical source:
Package/install/active version:
Evidence gathered:
Changed files or operation manifest:
Checks completed:
Open classifications:
Current blockers:
Next allowed action:
New task required: yes | no
```

A checkpoint is evidence, not approval.

## Source-to-runtime evidence chain

For behavior shipped in the extension, trace all applicable layers:

```text
canonical source
→ generated assets
→ compiled bundle
→ package manifest
→ extracted VSIX
→ installed extension directory
→ active host version
→ live consumer behavior
```

Do not infer a later layer from an earlier one. Build success does not prove package completeness; installation does not prove activation; activation does not prove the changed live path.

## Baseline and pre-existing failures

A failure may be labeled pre-existing only when grounded by one of:

- reproduction at the task-start commit or `HEAD`;
- comparison with the task diff safely removed or isolated;
- an existing authoritative baseline with matching failure identity;
- an independent Verifier reproduction.

Report the exact command, failure identity, and comparison. Do not weaken tests, delete assertions, or modify unrelated files to obtain a green result.

## Partial progress

Block only the affected artifact or stage when unrelated work can safely continue.

Examples:

- unresolved onboarding literals block onboarding, not local job/config preview;
- a truncated STTM rule blocks artifacts depending on that rule, not unrelated sheet inventory;
- unavailable deployment credentials block deploy, not package inspection;
- a package/runtime mismatch blocks post-install completion, not the already verified source diff.

The final manifest and report must identify each unaffected, conflicting, and blocked item separately.

## Evidence and handoff packet

Use `templates/evidence-packet.md`.

The packet must separate:

- verified facts;
- source trace;
- runtime trace;
- question classifications;
- hypotheses;
- disproved hypotheses;
- missing evidence;
- same-task or new-task decision;
- smallest coherent next action.

Do not include secrets, credentials, customer records, or unrestricted logs.

## Stop conditions

Stop rather than work around the issue when:

- target or ownership cannot be established;
- authorized evidence cannot be accessed;
- a required tool or dependency is unavailable;
- complete source data exists but only a lossy fallback is available;
- a business conflict materially changes output;
- the recovery requires unapproved mutation or operation;
- package, installed, and active identities cannot be distinguished;
- independent verification cannot be performed;
- the next action would overwrite unmanaged or protected files.
