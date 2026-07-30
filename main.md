## Mandatory correction — Test workspace isolation

A confirmed bug exists in the current test setup:

When tests run, generated ETL agents are written into the extension source repository’s `.github/agents/**` directory.

This must be fixed without disabling end-user agent generation.

### Required behavior

* Tests that verify `/workflow create` must still generate real ETL agent files.
* Those files must be generated only inside an isolated temporary consumer ETL workspace.
* No unit, integration, evaluation, or VS Code extension test may write generated assets into the extension source repository.

### Test workspace rules

1. Create a unique temporary workspace for every write-capable test, for example using `fs.mkdtemp()` under the operating system’s temporary directory.

2. Populate that workspace with only the minimum ETL fixture files required by the test.

3. Pass its path explicitly as `targetWorkspaceRoot`.

4. Do not use any of the following as a test output destination:

   * `process.cwd()`;
   * repository root;
   * extension development path;
   * extension installation path;
   * `vscode.workspace.workspaceFolders[0]` without explicit fixture validation.

5. Preview tests must not write any files.

6. Create/write tests may write only inside the temporary fixture.

7. Audit, repair, and upgrade tests must operate only on managed assets inside the fixture.

8. Remove the temporary fixture in a `finally`/teardown step, including when the test fails.

9. Test cleanup must never delete files from the real repository.

### VS Code integration tests

If Extension Development Host tests are used:

* launch the test with a dedicated fixture workspace;
* keep `extensionDevelopmentPath` separate from the opened test workspace;
* never open the extension source repository as the consumer workspace for write tests;
* explicitly verify that the resolved consumer target is not equal to `extensionDevelopmentPath`.

### Production safety guard

Add a fail-closed guard to the actual writer—not only to tests.

Before writing generated assets, reject the operation when:

* target root equals the extension source or installation root;
* target is inside the extension package;
* target classification is `extension-source` or `unknown`;
* the resolved output escapes the selected consumer workspace.

The error should clearly say:

`Generated ETL workflow assets cannot be written into the extension source repository. Select an end-user ETL workspace.`

### Regression tests

Add tests proving:

1. Workflow-create tests generate agents successfully inside a temporary consumer fixture.
2. The fixture contains the expected `.github/agents/etl-*.agent.md` files.
3. The extension repository’s `.github/agents/**` remains byte-for-byte unchanged.
4. Failed tests leave no generated files in the extension repository.
5. The writer rejects the extension source repository as a target.
6. Temporary fixtures are cleaned up after success and failure.
7. Running the complete test suite produces no untracked or modified generated files under the real `.github/**` directory.

Add a CI post-test guard that fails when tests modify or create files under the repository’s `.github/**` directory.

Do not fix this by removing agent generation. Fix the incorrectly resolved test workspace and preserve the intended `/workflow create` behavior for end users.
