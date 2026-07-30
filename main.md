این مشکل با دستور «ادامه بده» حل نمی‌شود؛ خود Validator و Guarded Writer اکستنشن باید اصلاح شوند. پرامپت زیر را در Agent Mode و داخل ریپوی کد Extension اجرا کن، نه داخل ریپوی etl-acz0004-cd-renewal.

Fix the ETL extension’s guarded validation and write flow for onboarding artifacts without weakening or bypassing any guardrail.

Target Resolution

Target type: extension-source

The target is the extension implementation responsible for:

* etl_validate_artifacts;
* etl_write_to_workspace;
* onboarding preview, selection, approval, and writing;
* ADLS root validation;
* artifact-type classification.

Do not directly edit the consumer ETL repository’s generated files.

Do not modify:

* extension-maintainer agents under .github/agents/**;
* maintainer prompts or instructions under .github/**;
* existing consumer job or environment configuration files;
* existing user-managed assets.

Use isolated temporary consumer workspaces for all write-capable tests.

Confirmed problem

The onboarding artifact is complete and the user explicitly selected and approved its creation, but the guarded writer blocks the write with these errors:

Onboarding artifact generated without user selection
env_conf/dev/env_conf_tdous_dev.yaml:
adls.destination.root still has a placeholder value
env_conf/dev/env_conf_tdous_dev.yaml:
adls.source.root still has a placeholder value

These failures expose two separate bugs.

Bug 1 — Valid composed ADLS roots are rejected

The repository intentionally composes the ADLS roots through shared configuration such as common_config.yaml.

The raw values contain approved substitutions similar to:

${source.storageaccount}
${env}

They resolve at runtime to valid abfss://... roots.

The existing on-disk job and environment configurations already use this approved composition pattern. They must remain unchanged.

The validator currently examines the raw string, classifies every ${...} expression as an unresolved placeholder, and incorrectly requires a literal ADLS root.

Do not fix this by inlining literal ADLS roots or modifying the existing environment configuration.

Bug 2 — User selection and approval are lost

The user explicitly:

1. selected onboarding creation;
2. reviewed the rendered onboarding artifact;
3. approved the exact write;
4. invoked the guarded writer.

However, the writer or validator receives no structured evidence that onboarding was selected and approved. It therefore reports:

Onboarding artifact generated without user selection

Do not infer approval from conversational text and do not replace the guard with a hard-coded true.

Phase 1 — Root-cause inventory

Before editing, locate and report:

* the exact source of all three error messages;
* every caller of the affected validators;
* the implementation of etl_validate_artifacts;
* the implementation of etl_write_to_workspace;
* onboarding artifact classification and schema validation;
* the preview and approval mechanism;
* how the exact approved artifact set is passed to the writer;
* configuration loading, includes, substitution, and composition logic;
* tests covering placeholder detection and onboarding selection;
* the smallest coherent set of files to change.

Report the resolved canonical source paths and protected paths before implementation.

Required fix 1 — Semantic ADLS root validation

Replace raw placeholder-string detection with configuration-aware validation.

Classify an ADLS root as one of:

1. literal-resolved
    A valid literal abfss://... URI.
2. approved-composed
    A repository-supported expression that is traceable through approved shared configuration and uses recognized variables.
3. unresolved
    An unknown token, missing include, unsupported expression, malformed URI, or value that cannot be traced to an approved composition source.

Accept literal-resolved and approved-composed.

Reject unresolved.

Requirements:

* Use the existing configuration loader/composer when available.
* Resolve includes and substitutions before determining readiness.
* Do not use a simple “contains ${” regex as the final validation.
* Allow only known variables and approved composition paths.
* Reject arbitrary or misspelled substitutions.
* Preserve the Databricks compile-check as final runtime evidence where applicable.
* Return structured validation evidence showing the raw value, composition source, recognized variables, and final classification.
* Do not modify the existing job or environment files to force validation to pass.

Required fix 2 — Structured selection and approval provenance

Pass structured write context from preview and selection through approval and into the guarded writer.

Use the existing approval framework if one already exists.

The context must identify at least:

* selected workspace root;
* selected artifact types;
* stable artifact IDs or destinations;
* the exact previewed file set;
* a hash/checksum of the previewed content;
* approval status or approval reference;
* generator/version information when available.

The guarded writer must allow onboarding only when:

* onboarding was explicitly selected;
* the onboarding artifact appeared in the preview;
* the user approved that exact preview;
* the content being written still matches the approved checksum;
* the destination remains inside the selected consumer workspace.

If content, destination, or artifact set changes after approval, require a new preview and approval.

Do not infer selection or approval from the chat transcript.

Required fix 3 — Artifact-aware validation

Do not send onboarding JSON through a validator that only understands job, environment, and include artifacts.

Implement or preserve explicit artifact-type handling:

* job configuration validation;
* environment configuration validation;
* include/reference validation;
* onboarding schema validation;
* selection and approval validation;
* workspace containment and ownership validation.

etl_validate_artifacts may remain read-only, but it must not claim that an onboarding artifact was generated without selection when it was called without selection context.

The guarded writer must validate the exact selected write set and its required references immediately before writing.

Compatibility requirements

Preserve all of the following:

* existing valid literal ADLS roots;
* the repository’s approved shared-composition pattern;
* detection of genuinely unresolved placeholders;
* existing job and env artifacts byte-for-byte;
* preview-first and approval-gated writes;
* user-managed files;
* path traversal protection;
* managed-asset ownership checks;
* Windows and POSIX path behavior;
* separation between workspace write, DBFS publishing, and pipeline execution;
* /workflow create and onboarding generation.

Do not add a manual-write fallback and do not weaken the validator globally.

Required tests

Add deterministic tests proving:

1. A literal abfss://... root passes.
2. The existing approved common_config.yaml composition passes without modifying the env file.
3. An unknown substitution token fails.
4. A missing composition include fails.
5. A malformed resolved ADLS URI fails.
6. An unselected onboarding artifact is rejected.
7. A selected but unapproved onboarding artifact is rejected.
8. A selected, previewed, and approved onboarding artifact passes.
9. Content changed after approval is rejected.
10. Destination changed after approval is rejected.
11. An exact approved onboarding JSON is written successfully.
12. Existing job and env files remain byte-for-byte unchanged.
13. A path outside the selected workspace is rejected.
14. Tests write only inside isolated temporary consumer workspaces.
15. The extension source repository’s .github/** remains unchanged.
16. Tests pass on Windows-compatible Node path handling.
17. The packaged VSIX contains the corrected implementation.

Use temporary fixtures that reproduce the current shared-composition pattern. Do not run write tests against the real consumer repository.

Acceptance criteria

The change is complete only when:

* the existing composed ADLS roots are classified as valid;
* truly unresolved placeholders still fail;
* explicit onboarding selection and approval reach the guarded writer;
* the exact approved onboarding JSON can be written successfully;
* no existing job or env configuration is rewritten;
* DBFS publishing and pipeline execution remain separate approval-gated operations;
* all affected unit, integration, packaging, and VSIX-content tests pass.

The final report must include:

* root cause for each of the three original errors;
* exact files and functions changed;
* before/after validation flow;
* tests executed and results;
* compatibility impact;
* remaining limitations;
* explicit confirmation that no maintainer agent or consumer configuration was modified.
