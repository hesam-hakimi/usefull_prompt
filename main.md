The retest still failed.

Observed behavior:
- After accepting the include-file fix and rerunning the extension, the generated job config is still inline.
- The saved file still contains inline `sql` blocks instead of referenced include files.
- So the previous fix did not change the actual create/write output path.

Please debug the real end-to-end generation path and patch the smallest safe surface.

Required debugging steps:
1. Trace the exact code path used by `@etl /create`
2. Trace how `handleCreateJob()` builds the blueprint
3. Trace how the top-level job config content is actually assembled before local write
4. Trace how include files are added to the artifact list
5. Find why the saved output still contains inline `sql` instead of include references

Most likely files:
- `src/chat/ETLChatParticipant.ts`
- `src/builders/BlueprintBuilder.ts`
- `src/renderers/JobConfigRenderer.ts`
- `src/renderers/IncludeFileRenderer.ts`
- `src/writers/RepoWriter.ts`

Expected behavior:
- top-level job config uses include-style references
- separate include files are created and written locally
- saved job config must no longer inline the SQL blocks

Requirements:
- preserve architecture
- name the exact file, class, and function changed
- after the fix, tell me to run F5 and retest the same `@etl /create ...` request again
- do not stop at explanation; patch the code path that actually writes the inline file
