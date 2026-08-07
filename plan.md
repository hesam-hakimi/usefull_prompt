Continue the just-completed STTM inactive-reference hardening through the packaged-runtime lifecycle.

Do NOT make additional functional changes unless packaging or live verification exposes a defect.

The implementation and focused verification have already passed.

Now:

1. Determine the current package version and bump to the next patch version.
2. Compile/package the extension using the repository's canonical packaging workflow.
3. Produce the VSIX.
4. Verify the packaged VSIX contains the exact updated runtime/source behavior for:
   - STTM strikethrough handling
   - STTM_REFERENCE_INACTIVE preservation
   - active mapping -> inactive required reference blocking
   - TrustedCreatePreviewService blocked-preview behavior
5. Run the repository's VSIX-content/package verification.
6. Install the newly built VSIX locally.
7. Report lifecycle as INSTALLED_NOT_ACTIVATED if VS Code reload is still required.
8. Do NOT claim POST_INSTALL_VERIFIED until a fresh VS Code host has loaded the new version.

After installation, give me:
- exact installed version
- exact VSIX filename
- confirmation that the relevant changed runtime files are present in the packaged VSIX
- any packaging/test failures
- the exact consumer-workspace smoke-test prompt I should run after Reload Window

Do not modify consumer workspace files.
Do not make unrelated changes.
Do not touch pre-existing unrelated WIP.
Require an independent Verifier for the packaged delta.
