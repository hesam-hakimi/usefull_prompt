Fix the runtime input-resolution bug that causes the installed extension to request access to the extension-source sample_sttm directory while operating in a consumer ETL workspace.

Required behavior:

1. User-provided STTM files inside the selected consumer workspace are the only runtime STTM inputs.
2. Packaged examples and sample_sttm directories are documentation/test fixtures only and must never be resolved as runtime input.
3. Runtime code, agents, prompts, skills, instructions, and session-store recovery must never reference or access:
   - the extension source repository;
   - the extension installation directory;
   - an absolute developer-machine path;
   - docs/product/sttm-document-understanding/sample_sttm.
4. A stale session-store path outside the current workspace must be rejected and discarded.
5. Resolve the STTM path relative to the explicitly selected VS Code workspace folder.
6. Normalize Windows and POSIX paths and reject any resolved input outside the selected workspace.
7. Do not solve this by removing STTM interpretation or packaged documentation.

Before editing, emit TARGET_RESOLVED and inventory every reference to:
- sample_sttm;
- docs/product/sttm-document-understanding;
- absolute Windows paths;
- stored STTM paths;
- fallback input-resolution logic.

Add regression tests proving:
- a workspace-relative STTM file is accepted;
- an extension-source sample path is rejected;
- a stale session path outside the workspace is ignored;
- Windows and POSIX containment checks behave consistently;
- the installed VSIX contains no machine-specific absolute path;
- runtime does not request external-directory permission during normal STTM processing.

Run Planner → implementation → fresh Verifier. Build and inspect the VSIX after the fix, but do not install it until verification returns VERIFIED.
