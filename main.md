Independently verify the current pending 13-file diff. Do not modify any code.

Verify directly from the implementation and tests that:

1. TrustedWriteApprovalStore is extension-owned and the production writer cannot receive or substitute a caller-created store.
2. previewId is cryptographically random and a preview operation writes no files.
3. Only an actual user action in the trusted VS Code modal can transition previewed to approved; tool arguments and the model cannot perform this transition.
4. The writer retrieves authoritative state by previewId and independently compares the exact workspace, destination, artifact set, artifact type, content hashes, and manifest checksum.
5. Caller-supplied approvalContext, hashes, approvalStatus: "approved", or a self-consistent forged manifest cannot authorize a write.
6. Expired, missing, consumed, replayed, mismatched, and concurrent approval attempts fail closed.
7. The approval is atomically consumed and cannot authorize a second write.
8. Extension reload or lost in-memory state fails closed rather than bypassing approval.
9. Existing non-onboarding writes remain backward-compatible.
10. Windows and POSIX path normalization are both covered.
11. The public package.json tool schema exposes no caller-controlled authoritative approval fields.
12. The bundled extension contains the trusted implementation.
13. The five remaining full-suite failures are pre-existing and unrelated.
14. No .github/**, maintainer agent, consumer repository, consumer configuration, golden baseline, or packaging exclusion was modified by this diff.

Run the adversarial forged-context, replay, concurrency, affected-suite, and bundle checks.

Return only:

* VERIFIED or CHANGES_REQUIRED;
* blocker/high/medium/low findings with exact file and function;
* exact tests executed and results;
* whether it is safe to press Keep.
