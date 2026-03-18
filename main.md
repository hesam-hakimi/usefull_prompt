You are working inside the ETL VS Code extension codebase. Do not give me a high-level summary only. Implement the required behavior end to end in code.

Before making changes:
1. Read the current create-flow runtime path completely.
2. Create a concrete TODO checklist in your response.
3. Keep the TODOs updated as you work.
4. Do not mark a TODO as done unless the code, tests, and runtime behavior are actually updated.
5. At the end, verify every requirement below one by one and explicitly show pass/fail for each item.

Mission:
Fix and complete the ETL job creation flow so that env config handling, template/reference selection, structured UI selection, and generation behavior all work correctly and transparently.

Important rule:
Do not silently invent output structure, split jobs, onboarding files, or env config files unless the user explicitly chose that behavior or the workflow rules require it. The system must be deterministic, transparent, and user-driven.

==================================================
REQUIRED BEHAVIOR
==================================================

A) ENV CONFIG BEHAVIOR

1. If the user includes an env config inline in the initial create prompt, such as:
   ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml
   env_config=...
   --env-config=...
   env config: ...
   then the system must parse it immediately and skip the env config question.

2. If the user provided an existing env config path:
   - reuse it
   - do not create a new env config file
   - show clearly in the response that the env config is being reused
   - keep that selection in session state

3. If the user did not provide an env config path:
   - ask which env config file should be used
   - present structured candidate options in the UI
   - do not require free-text typing if candidates are available

4. If the user says the env config does not exist / wants a new one:
   - generate a new env config file
   - clearly mark envConfigMode = create

5. After artifact generation, validate that the generated job config can be resolved with the selected env config according to the real framework behavior.
   This validation must not be fake. Inspect the source code / parser / include resolution path used by the framework and validate using that logic as closely as possible.
   The validation result must be shown in the final response.

6. If the user provides an env config path for the wrong environment (for example PAT or PRD while the request is for DEV):
   - do not silently continue
   - ask for clarification with structured options
   - do not create a new env config automatically in that case

==================================================
B) TEMPLATE / REFERENCE JOB SELECTION
==================================================

7. The system must not silently copy structure from an existing job config/template/reference job.
   It must explicitly tell the user what template/reference candidates were found.

8. Add a template discovery step after env config is resolved.
   The system should scan the workspace for relevant job config candidates and score them.

9. The system must present template/reference choices in structured UI form, not as “type whatever you want”.
   The user must be able to choose one of these modes:
   - Use recommended template as full structure
   - Use template as hints only
   - Do not use a template / build from scratch

10. If multiple candidate templates exist, present them as selectable options.
    Each option must show:
    - file name
    - path
    - why it matched
    - whether it is recommended

11. If the user chooses “no template”:
    - do not use any template/reference job
    - build from scratch
    - explicitly say so in the final summary

12. If the user chooses “hints only”:
    - only reuse high-level patterns such as naming, module ordering, synapse block shape, onboarding shape, etc.
    - do not silently clone business logic SQL or source/target-specific values
    - explicitly list what was reused as hints

13. If the user chooses “full structure”:
    - explicitly list which parts came from the template and which parts were replaced

14. Final response must include a section called:
    Template decision
    and show exactly:
    - selected template path or “none”
    - selected mode: full_structure / hints_only / none
    - why it was selected
    - what was reused

==================================================
C) JOB SHAPE / OUTPUT STRUCTURE SELECTION
==================================================

15. The system must not assume there is always only one job config or always split EXTRACT/LOAD.
   It must support structured selection of job shape.

16. Add a structured job-shape selection step.
   Supported options:
   - Single Job Config
   - Split Extract/Load

17. This selection must be shown as structured UI options, not free text.
   If a matched template strongly suggests one shape, that can be recommended, but the user must still control the choice.

18. Behavior:
   - Single Job Config:
     create exactly one job config
     no separate *_EXTRACT.json
     no separate *_LOAD.json
     no onboarding file unless user explicitly selected optional onboarding artifact
   - Split Extract/Load:
     create separate extract and load configs only if the user selected this mode
     create onboarding only if selected or required by explicit workflow choice

19. The final summary must state clearly which job shape was selected and why.

==================================================
D) OPTIONAL ARTIFACTS
==================================================

20. Add a structured optional-artifacts selection step after job shape selection.
   Selectable options should include at least:
   - onboarding
   - success email
   - validation query
   - smoke test
   - none

21. This must be UI-driven, not “please type comma separated text” unless the VS Code chat API forces that as fallback.
   Prefer quick-pick or button-like structured choices if supported.

22. If the user does not select onboarding, do not generate onboarding files.

==================================================
E) FRAMEWORK-CORRECT MODULE ORDER AND GENERATION LOGIC
==================================================

23. Generated job configs must follow the real framework pattern.

24. For a standard bronze -> curated/silver -> synapse flow, the module order must be framework-correct:
   - first: data_sourcing_process
   - then: data_transformation
   - then: dataframe_writer / load_enrich_process / relevant write module
   - then: synapse publish step if requested in the same job
   unless the selected template mode explicitly changes this and the user approved it

25. Sourcing behavior:
   - sourcing modules read from the true source path/table
   - sourcing creates temp views / sourceList / aliases according to framework behavior
   - downstream transformation must consume the sourced view, not directly reread the raw source path again unless the chosen template explicitly requires that and the user selected it

26. Fix the intent extraction / generation path so that prompts like:
   “Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev”
   correctly produce:
   - source = bronze customer_orders
   - transform = derive/filter logic
   - write target = curated/silver target
   - synapse target = stage.customer_orders_curated
   in the correct sequence

27. If the request includes both curated write and Synapse publish, do not lose one of the targets.

==================================================
F) DO NOT IGNORE USER INPUT
==================================================

28. The system must not ignore:
   - inline ENV_CONFIG=...
   - explicit “do not use template”
   - explicit “use this template”
   - explicit “single job”
   - explicit “split extract/load”
   - explicit “do not create onboarding”

29. User-provided selections must survive through the session and be visible in session state.

==================================================
G) RUNTIME TRANSPARENCY
==================================================

30. Add debug logging to the ETL output channel so runtime behavior can be proven.
   At minimum log:
   - received request prompt
   - detected environment
   - parsed inline env config path, if any
   - candidate env configs
   - env config selection result
   - template candidates
   - chosen template mode
   - chosen job shape
   - chosen optional artifacts
   - artifact generation path
   - validation result

31. The logs must make it easy to confirm whether the code path really used:
   - existing env reuse
   - single-job generation
   - template or no-template mode

==================================================
H) TESTS
==================================================

32. Update/add automated tests. Do not stop until tests cover the scenarios below.

Required tests:
- inline ENV_CONFIG skips env question and reuses existing env config
- no inline env config asks for env selection
- wrong environment env config triggers clarification
- explicit “new” creates env config
- template candidates are discovered and shown
- choose “none” template builds from scratch
- choose “hints only” uses hints without cloning business SQL
- choose “full structure” shows template provenance
- single job shape creates exactly one job config
- split extract/load creates separate extract/load configs only when selected
- onboarding file is only created when selected
- generated job uses data_sourcing_process first
- transform references sourced view rather than re-reading raw source incorrectly
- curated target and synapse target can coexist in same job when single-job mode is selected
- final response includes “Template decision”
- final response includes validation result
- session state preserves env/template/shape/artifact selections across follow-ups

33. Run compile and tests.
   Do not claim success without actually running them.

==================================================
I) FINAL VERIFICATION CHECKLIST
==================================================

At the end, give me a final checklist with PASS/FAIL for each of these items:

1. Inline ENV_CONFIG is parsed from first command
2. Existing env config is reused and not recreated
3. Wrong-environment env config triggers clarification
4. Template/reference candidates are shown to the user
5. User can choose full_structure / hints_only / none
6. User can choose Single Job Config vs Split Extract/Load
7. User can choose optional artifacts in structured way
8. No silent template reuse
9. Template decision is shown in final summary
10. Single-job mode creates exactly one job config
11. Split mode creates separate extract/load only when selected
12. Onboarding is created only when selected
13. Module order starts with data_sourcing_process
14. Transform consumes sourced view correctly
15. Curated write + Synapse publish both work in same single job
16. Validation against env config is performed and shown
17. Output channel logging is added
18. All tests pass
19. Manual runtime path matches actual implementation
20. No TODO remains incomplete

==================================================
J) IMPLEMENTATION DISCIPLINE
==================================================

34. Do not fabricate what the code does. Inspect and modify the real code.
35. Do not leave partial TODOs hidden in comments.
36. If any VS Code chat UI limitation prevents true structured buttons/quick picks, implement the best real UI supported by the extension/chat API and clearly explain the limitation in code comments and final summary.
37. Prefer small, composable services over bloated logic in ETLChatParticipant.
38. Keep ETLChatParticipant thin; orchestration should stay in session/service layers.
39. Keep naming explicit and readable.
40. Preserve existing working behavior that is not part of these fixes.

Now start by:
- tracing the current runtime path,
- creating the TODO checklist,
- implementing the fixes,
- updating tests,
- running compile/tests,
- and then showing the final PASS/FAIL verification table.
