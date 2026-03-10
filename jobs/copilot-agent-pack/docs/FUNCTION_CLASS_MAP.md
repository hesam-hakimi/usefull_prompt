# Function and Class Map for Precise Future Fixes

Use this file when the agent or a developer needs to identify the smallest code surface to change.

## 1. Chat orchestration

### File
`src/chat/EtlAuthoringParticipant.ts`

### Class
`EtlAuthoringParticipant`

### Methods
- `handleRequest(request: ChatRequest): Promise<ChatResponse>`
- `routeTask(intent: EtlTaskIntent): Promise<ChatResponse>`
- `handoffToValidator(context: ValidationContext): Promise<ChatResponse>`
- `handoffToDeployer(context: DeploymentContext): Promise<ChatResponse>`

### Change here when
- the overall chat flow is wrong
- the wrong sub-agent is called
- the output sections are missing or out of order

---

## 2. Task classification

### File
`src/planning/TaskClassifier.ts`

### Class
`TaskClassifier`

### Methods
- `classify(userPrompt: string): TaskType`
- `isCreateRequest(...)`
- `isCloneRequest(...)`
- `isModifyRequest(...)`
- `isTroubleshootRequest(...)`

### Change here when
- the request type is misclassified
- clone requests are treated as create requests
- troubleshoot requests trigger generation

---

## 3. Structured intent extraction

### File
`src/planning/IntentExtractor.ts`

### Class
`IntentExtractor`

### Methods
- `extract(userPrompt: string, context: DiscoveryContext): JobIntent`
- `normalizeEnvironment(intent: JobIntent): JobIntent`
- `collectMissingFields(intent: JobIntent): MissingField[]`

### Change here when
- source path is not parsed correctly
- environment defaults are wrong
- required fields are missing from the structured request

---

## 4. Similar-job and template resolution

### File
`src/planning/SimilarJobResolver.ts`

### Class
`SimilarJobResolver`

### Methods
- `findClosestMatches(intent: JobIntent): SimilarJobMatch[]`
- `selectBestMatch(matches: SimilarJobMatch[]): SimilarJobMatch | null`
- `selectGenerationStrategy(intent: JobIntent, matches: SimilarJobMatch[]): GenerationStrategy`

### Change here when
- the wrong job family is selected
- clone/template matching is weak
- scratch generation is chosen too often

---

## 5. Env config reuse logic

### File
`src/resolution/EnvConfigResolver.ts`

### Class
`EnvConfigResolver`

### Methods
- `resolveForJob(intent: JobIntent, matches: SimilarJobMatch[]): EnvConfigDecision`
- `canReuseExistingEnvConfig(...)`
- `needsJobLevelEnvOverride(...)`

### Change here when
- a new env config is generated unnecessarily
- an existing env config should have been reused
- job-level env settings are not respected

---

## 6. Path resolution

### File
`src/resolution/PathResolver.ts`

### Class
`PathResolver`

### Methods
- `resolveRepoPaths(blueprint: JobBlueprint): RepoPathPlan`
- `resolveDbfsPaths(blueprint: JobBlueprint): DbfsPathPlan`
- `applyConventionRules(...)`
- `applyOverrides(...)`

### Change here when
- repo output path is wrong
- DBFS upload path is wrong
- path convention selection is wrong

---

## 7. Blueprint building

### File
`src/planning/BlueprintBuilder.ts`

### Class
`BlueprintBuilder`

### Methods
- `build(intent: JobIntent, discovery: DiscoveryContext): JobBlueprint`
- `selectModules(...)`
- `buildArtifactList(...)`
- `buildValidationPlan(...)`

### Change here when
- the wrong module set is chosen
- required artifacts are missing from the plan
- Synapse steps are omitted incorrectly

---

## 8. Transformation generation

### File
`src/generation/TransformationCompiler.ts`

### Class
`TransformationCompiler`

### Methods
- `compile(blueprint: JobBlueprint): TransformationArtifacts`
- `renderSqlTransform(...)`
- `renderMaskingRules(...)`
- `renderAssertions(...)`

### Change here when
- SQL logic is wrong
- derived fields are wrong
- joins/filters/casts are wrong
- masking/assertions are missing

---

## 9. Top-level job config rendering

### File
`src/generation/JobConfigRenderer.ts`

### Class
`JobConfigRenderer`

### Methods
- `renderTopLevelConfig(blueprint: JobBlueprint): GeneratedArtifact`
- `renderModulesBlock(...)`
- `renderSourceBlock(...)`
- `renderWriterBlock(...)`

### Change here when
- the top-level `.json` structure is wrong
- module ordering is wrong
- references to include files are wrong

---

## 10. Include file rendering

### File
`src/generation/IncludeFileRenderer.ts`

### Class
`IncludeFileRenderer`

### Methods
- `renderAll(blueprint: JobBlueprint): GeneratedArtifact[]`
- `renderTransformationIncludes(...)`
- `renderConfIncludes(...)`
- `renderSqlIncludes(...)`

### Change here when
- include files are missing
- referenced include names do not match
- wrong file content is produced for included fragments

---

## 11. Validation

### File
`src/validation/ValidationOrchestrator.ts`

### Class
`ValidationOrchestrator`

### Methods
- `validateAll(bundle: GeneratedBundle): ValidationSummary`
- `validateSyntax(...)`
- `validateIncludes(...)`
- `validateSchemas(...)`
- `validateSql(...)`
- `validatePathPlan(...)`

### Change here when
- blockers are not detected
- validations are incomplete
- false positives or false negatives occur

---

## 12. Deployment plan

### File
`src/deploy/DeploymentPlanBuilder.ts`

### Class
`DeploymentPlanBuilder`

### Methods
- `build(bundle: GeneratedBundle, validation: ValidationSummary): DeploymentPlan`
- `assertDevOnly(...)`
- `collectUploadTargets(...)`

### Change here when
- non-dev deployment is allowed incorrectly
- upload lists are incomplete
- approval gating is missing

---

## 13. DBFS upload

### File
`src/deploy/DbfsPublisher.ts`

### Class
`DbfsPublisher`

### Methods
- `uploadArtifacts(plan: DeploymentPlan): UploadResult`
- `verifyUpload(result: UploadResult): VerificationResult`

### Change here when
- upload fails
- verification is incomplete
- wrong DBFS destinations are used

---

## 14. Runtime diagnosis

### File
`src/diagnostics/RuntimeDiagnosticService.ts`

### Class
`RuntimeDiagnosticService`

### Methods
- `summarizeFailure(error: unknown, context: RuntimeContext): FailureSummary`
- `mapFailureToOwner(...)`
- `recommendPatchArea(...)`

### Change here when
- runtime failures are mapped to the wrong owner
- fix advice is too generic
- the diagnostic summary misses the failing phase
