Create TODOs first and keep them updated until everything below is completed.

Do NOT assume the issue is fixed just because tests pass.
The source of truth is the REAL runtime behavior in my actual workspace.

Current real failure evidence:
- Same customer_orders prompt still fails in the Extension Development Host
- Chat says: "Job artifacts generated, but validation failed. Files were not written."
- Errors shown at runtime:
  - Unresolved variable: adls.source.root
  - Unresolved variable: adls.curated.customer_order.root
  - Missing required property: process.name
  - Missing required property: jobname
- There is also a nested include/common-config warning in the real env-config chain

Your task:
1. Reproduce the failure using the exact real customer_orders scenario in the actual workspace.
2. Verify the latest code changes are truly applied:
   - all chat edits are kept
   - compile/watch picked them up
   - Extension Development Host restarted with latest code
3. Add detailed runtime logging for:
   - selected env config path
   - include resolution chain
   - merged effective config keys
   - generated job config keys
   - unresolved variable list
   - required-property validation source
4. Fix validation/generation against the REAL repo structure, not mocks.

Required fixes:
A. Include resolution
- Resolve env config includes recursively before validating job config.
- Support nested include chains.
- Distinguish:
  - missing include inside workspace = error
  - external include outside workspace that is expected in enterprise layout = warning unless it blocks required keys
- Show the full include chain in debug logs.

B. Variable resolution against real framework keys
- Build effective merged config from:
  - reused env config
  - its nested includes
  - common config
  - job config
- Validate unresolved variables against the merged effective config, not isolated fragments.
- Identify why adls.source.root and adls.curated.customer_order.root are unresolved in this real repo.
- Compare with actual sample files in the workspace and choose the real variable naming convention used by this repo.

C. Path generation correctness
- If the user prompt already provides a full abfss:// source path, do NOT generate:
  ${adls.source.root}/abfss://...
- Either:
  1. keep the full literal abfss path, or
  2. map it to the correct framework variable form actually used in this repo.
- Do the same for target path generation.

D. Required root properties
- Find from real framework examples in the workspace which root properties are mandatory for this repo.
- Ensure process.name and jobname are generated correctly for this customer_orders scenario.
- Do not invent fake defaults unless they match actual framework patterns.

E. Real-repo comparison
- Compare generated customer_orders output against:
  - real sample repo patterns
  - real framework repo patterns
  - previous legacy solution only as reference, not source of truth
- Explain the exact gap between generated output and actual repo expectations.

F. Regression protection
- Add at least one end-to-end regression test based on the real customer_orders scenario structure.
- The test must cover:
  - reused env config
  - nested includes
  - full abfss source path in prompt
  - single-job flow
  - validation pass when real required keys are available
  - write blocked only when a real unresolved dependency remains

Acceptance criteria:
1. Re-running the exact customer_orders prompt in the Extension Development Host must no longer fail for:
   - adls.source.root
   - adls.curated.customer_order.root
   - process.name
   - jobname
2. The generated source path must not contain duplicated prefix patterns like:
   ${adls.source.root}/abfss://...
3. The result must show real runtime evidence, not only tests.
4. If anything is still blocked, clearly explain the exact remaining blocker and whether it is generation, validation, include resolution, or missing real config.
5. End with:
   - TODO checklist
   - files changed
   - exact runtime proof from the real customer_orders run
   - compile result
   - test result

Important:
- Do not declare success based only on unit tests.
- Real runtime proof in the actual workspace is mandatory.
- Use the real repo as source of truth.
