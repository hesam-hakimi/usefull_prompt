Select option 2: Deploy to shared dev with capture + restore.

Before deployment:

1. Capture and record the currently deployed Phase 0:
   - branch
   - commit SHA
   - deployment run ID
   - artifact/version
   - packaged config.yaml
   - relevant App Service settings
   - feature flags
   - rollback command and workflow

2. Confirm that the Phase 1 deployment will not:
   - run a destructive or irreversible database migration;
   - overwrite Phase 0 evidence;
   - change shared authorization mappings permanently;
   - modify repository settings;
   - promote anything to Beta or Production.

3. Label the deployment:

   Experimental Phase 1 Development Deployment
   Not Phase 0 closure evidence
   Not approved for Beta or Production

4. Deploy the current Phase 1 branch and exact commit to the shared
   Development App Service.

5. Run Phase 1 smoke and integration validation:
   - application health
   - React SPA
   - /api/config
   - Entra/MSAL login
   - bearer-token validation
   - protected routes
   - authorization
   - REST /api/chat
   - SSE /api/chat/stream
   - Azure SQL
   - Azure OpenAI
   - Azure AI Search fallback where applicable
   - new Phase 1 readiness functionality
   - diagnostics redaction

6. Capture all results with the deployed branch and SHA.

7. Restore the exact previous Phase 0 artifact and configuration.

8. After restoration, run Phase 0 smoke validation:
   - application health
   - React SPA
   - authentication
   - authorization
   - REST
   - SSE
   - deterministic route
   - offline golden baseline
   - confirm the deployed SHA is again the original Phase 0 SHA

9. Stop and report BLOCKED before deployment if:
   - the current Phase 0 artifact cannot be identified;
   - rollback cannot be proven;
   - persistent database/config changes are required;
   - the shared environment cannot be restored safely.

Do not merge, mark Ready for Review, or deploy to Beta/Production.
