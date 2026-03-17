Fix the ETL create flow so it follows this exact contract.

Required contract:
1. Ask the user for the env config file first.
2. If the user provides an existing env config path, reuse that exact file.
3. If the user says it does not exist, create a new env config file.
4. Do not create a new env config when the user already provided an existing one for the correct target environment.
5. Generate a SINGLE ETL framework job config by default, not split extract/load/onboarding artifacts.
6. Use the real framework pattern:
   - first module: `data_sourcing_process`
   - sourcing defines `sourceList` and source objects
   - sourcing creates the sourced/temp view
   - later `data_transformation` modules consume that sourced view
   - writer/synapse modules consume transformed outputs
7. Do not start the job with `data_transformation` when the first step is reading source data.
8. Do not bypass the sourced view by reading the source path again in later modules unless the real framework example requires it.
9. After generation, validate that the selected env config + generated job config can be parsed/resolved using the real framework behavior from `etl-framework-adb`.

Observed wrong behavior to fix:
- existing env config was ignored and a new env config was created
- generator created two job configs plus onboarding instead of one ETL job
- first module was `data_transformation` instead of `data_sourcing_process`
- later modules read directly from source/Delta path instead of consuming the sourced view

Patch the smallest safe surface first.

Most likely files:
- `src/chat/ETLChatParticipant.ts`
- `src/builders/BlueprintBuilder.ts`
- `src/renderers/JobConfigRenderer.ts`
- `src/renderers/IncludeFileRenderer.ts`
- `src/renderers/EnvConfigRenderer.ts`
- `src/validation/ValidationOrchestrator.ts`

Requirements:
- preserve architecture
- use `etl-framework-adb` as source of truth
- name the exact file, class, and function changed
- after the fix, tell me to run F5 and retest with:
  1. an existing DEV env config path
  2. the same customer_orders request
  3. 
