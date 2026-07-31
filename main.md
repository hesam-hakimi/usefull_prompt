Fix the approval-security blocker identified by the independent verification. Continue from the current pending 12-file diff; preserve the correct ADLS-root classifier and artifact-aware validation work.

Do not press or assume Keep. Modify the pending implementation and verify it again.

Confirmed blocker

The current approvalContext is caller-fabricatable.

writeToWorkspace currently accepts caller-supplied approval fields, checksums, selected artifacts, and previewed files. A caller can construct a self-consistent forged context, set the status to approved, recompute all hashes, and pass the gate.

The same context can also be replayed.

This is not an acceptable user-approval control.

Required security model

Approval authority must come from extension-controlled state—not from Copilot tool arguments.

Use the repository’s existing trusted preview, conversation-state, or workflow-state infrastructure if available. Inspect facilities such as ConversationStateStore, TrustedCreatePreviewService, and existing preview/approval command handlers before creating new state machinery.

Do not create a parallel source of truth when a suitable extension-controlled store already exists.

Trusted lifecycle

Implement this lifecycle:

rendered → previewed → explicitly approved → writing → consumed

1. During preview, the extension must compute and store an authoritative record containing:
    * cryptographically random preview/approval ID;
    * normalized selected workspace root;
    * target classification;
    * exact relative destinations;
    * artifact types and selected artifact set;
    * SHA-256 of every exact artifact body;
    * checksum of the canonical complete manifest;
    * conversation/workflow identity when available;
    * creation and expiration timestamps;
    * state: previewed.
2. Explicit user approval must transition that stored record to approved.
3. The transition to approved must be caused by a trusted extension-controlled UI, command, or approval callback. A tool argument such as approved: true must never create or authorize approval.
4. The write tool may accept only an opaque preview/approval ID where necessary. It must retrieve the authoritative record from extension-controlled state.
5. Caller-supplied copies of approval status, checksums, previewed files, selected artifacts, workspace roots, or destinations must not be trusted as approval evidence.
6. Immediately before writing, compare the actual write request with the stored authoritative record:
    * workspace identity;
    * normalized workspace root;
    * target type;
    * artifact set;
    * artifact types;
    * relative destinations;
    * exact content hashes;
    * canonical manifest checksum;
    * unexpired approved state.
7. Perform a fail-closed, atomic one-time transition so the approval cannot be replayed or used concurrently.
8. After a successful write, mark the approval consumed.
9. A consumed, expired, missing, mismatched, cross-workspace, cross-conversation, or already-in-progress approval must be rejected.
10. Any content, destination, workspace, or artifact-set change requires a new preview and a new explicit approval.

If the platform does not expose a trusted explicit-approval event, stop and report the limitation. Do not simulate approval using model-supplied tool arguments.

Tool schema

Update the package.json tool schema accordingly:

* Do not expose authoritative approvalContext fields as caller-controlled security claims.
* Prefer an opaque previewId or approvalId.
* Treat any legacy caller-supplied approvalContext as untrusted compatibility data only; it must never authorize onboarding writes.
* Existing non-onboarding writes must remain backward-compatible.
* Onboarding writes must fail closed unless a trusted stored approval record exists.

Consolidation

Remove the duplicated onboarding-path predicate.

Create one canonical exported predicate and reuse it from both:

* PreWriteValidationPipeline;
* OnboardingWriteApprovalValidator.

Do not perform unrelated refactoring.

Required regression tests

Add deterministic tests proving:

1. A self-consistent forged approvalContext is rejected.
2. approved: true without an extension-stored record is rejected.
3. Caller-computed matching hashes cannot authorize a write.
4. A real preview followed by trusted explicit approval succeeds.
5. Changed content after approval is rejected.
6. Changed destination is rejected.
7. Changed selected workspace is rejected.
8. Changed artifact set or artifact type is rejected.
9. An expired approval is rejected.
10. A consumed approval cannot be replayed.
11. Two concurrent writes cannot consume the same approval.
12. A preview from another conversation/workflow cannot be used when identity is available.
13. Legacy tool payloads cannot bypass the trusted gate.
14. Non-onboarding writes still follow their existing compatible path.
15. Windows and POSIX paths normalize consistently.
16. All write-capable tests use isolated temporary consumer workspaces.
17. No test modifies the extension repository’s .github/**.
18. The guarded writer writes exactly the previewed and approved bytes.

Include a specific adversarial test that constructs the exact forged context described by the verifier: caller-selected onboarding artifact, caller-generated file hashes, caller-generated manifest checksum, and approvalStatus = "approved". The test must prove that it is rejected because no trusted extension-side record exists.

Protected scope

Do not modify:

* .github/**;
* maintainer agents;
* consumer repositories;
* consumer job or environment configs;
* packaged product templates unrelated to this fix;
* golden/evaluation baselines;
* packaging exclusions.

Preserve:

* the semantic ADLS-root classification;
* valid shared common_config.yaml composition;
* detection of genuinely unresolved placeholders;
* preview-first behavior;
* path traversal protection;
* Windows/POSIX compatibility;
* separate approvals for workspace write, DBFS publish, and pipeline execution.

Validation

Run:

1. the new adversarial approval tests;
2. all affected readiness, validation, preview, and write suites;
3. the full unit suite;
4. bundle/VSIX verification;
5. a repository check proving tests did not modify .github/**.

Do not regenerate the golden baseline.

Final response

Return:

* VERIFIED or CHANGES_REQUIRED;
* exact trusted state owner and lifecycle;
* exact public tool arguments after the change;
* how explicit approval reaches trusted state;
* replay and concurrency behavior;
* files changed;
* tests and exact results;
* confirmation that the forged-context test fails closed;
* confirmation that protected files were untouched;
* whether it is now safe to press Keep.

Do not claim completion merely because caller-provided checksums match. Approval must be extension-issued, extension-stored, independently verified, and one-time.
