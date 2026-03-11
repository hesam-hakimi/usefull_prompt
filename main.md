Fix the current test/lint issues only. Do not refactor unrelated code.

Observed errors from `npm test`:
- `src/classifiers/IntentExtractor.ts`
  - line 117:72 `Unnecessary escape character: \/`
  - line 246:90 `Unnecessary escape character: \/`
  - line 342:27 `Unnecessary escape character: \/`
  - line 343:36 `Unnecessary escape character: \/`
- `src/validation/ValidationOrchestrator.ts`
  - line 411:13 `Unnecessary escape character: \/`

Also clean up these warnings only if they are trivial and safe:
- `src/chat/ETLChatParticipant.ts`
  - `ETLIntent` defined but never used
  - `compiledTransform` assigned but never used
- `src/compilers/TransformationCompiler.ts`
  - `intent` defined but never used
- `src/deployment/DbfsPublisher.ts`
  - `_result` assigned but never used
- `src/resolvers/ArtifactMappingResolver.ts`
  - `TemplateStrategy` defined but never used

Requirements:
1. Make the smallest safe patch.
2. Name the exact file, class, and function changed.
3. Do not change architecture.
4. After changes, tell me to run `npm test` again.
