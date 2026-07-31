import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "docs/business-context.md",
  "docs/system-map.md",
  "docs/change-contract.md",
  "docs/definition-of-done.md",
  "workflow/README.md",
  "workflow/targets.yml",
  "templates/request.md",
  "templates/result.md",
  ".github/copilot-instructions.md",
  ".github/agents/orchestrator.agent.md",
  ".github/agents/planner.agent.md",
  ".github/agents/verifier.agent.md",
  ".github/prompts/build.prompt.md",
  ".github/prompts/plan-change.prompt.md",
  ".github/prompts/verify-change.prompt.md",
  ".github/instructions/business-context.instructions.md",
  ".github/instructions/change-safety.instructions.md",
  ".github/instructions/workflow-asset-boundaries.instructions.md",
  ".github/instructions/workflow-coherence.instructions.md",
  "scripts/assert-control-plane-clean.mjs",
];

const frontmatterFiles = [
  ".github/agents/orchestrator.agent.md",
  ".github/agents/planner.agent.md",
  ".github/agents/verifier.agent.md",
  ".github/prompts/build.prompt.md",
  ".github/prompts/plan-change.prompt.md",
  ".github/prompts/verify-change.prompt.md",
  ".github/instructions/business-context.instructions.md",
  ".github/instructions/change-safety.instructions.md",
  ".github/instructions/workflow-asset-boundaries.instructions.md",
  ".github/instructions/workflow-coherence.instructions.md",
];

const requiredAgentRules = [
  "Do not guess",
  "Asset ownership and target resolution",
  "Change-safety invariants",
  "Regression policy",
  "Output contract",
  "Stop conditions",
];

const requiredTargetRules = [
  "default_unqualified_agent_target: extension-product-agent",
  "extension-source: deny-generated-output",
  "consumer-etl-workspace: allow-after-approval",
  "temporary-test-workspace: allow-during-test",
  "unknown: block",
];

const requiredOrchestratorRules = [
  "agents:",
  "- Planner",
  "- Verifier",
  "Invoke `Planner` as a subagent",
  "Invoke `Verifier` as a fresh subagent",
  "Do not perform or simulate final verification yourself",
  "maximum of two remediation cycles",
  "If the agent tool or either required subagent is unavailable, return `BLOCKED`",
];

const requiredVerifierRules = [
  "disable-model-invocation: false",
  "Do not edit files",
  "`VERIFIED`",
  "`CHANGES_REQUIRED`",
  "`BLOCKED`",
];

const requiredBuildRules = [
  "invoke `Planner` as an actual subagent",
  "invoke `Verifier` as a fresh, independent subagent",
  "Do not role-play or simulate Planner or Verifier",
  "return `DONE` only after `VERIFIED`",
];

async function read(relativePath) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

function assertContains(content, rules, relativePath) {
  for (const rule of rules) {
    if (!content.includes(rule)) {
      throw new Error(`${relativePath} is missing required rule: ${rule}`);
    }
  }
}

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(repoRoot, relativePath);
  let fileStat;
  try {
    fileStat = await stat(absolutePath);
  } catch {
    throw new Error(`Missing workflow file: ${relativePath}`);
  }

  if (!fileStat.isFile() || fileStat.size === 0) {
    throw new Error(`Missing or empty workflow file: ${relativePath}`);
  }
}

const agentContract = await read("AGENTS.md");
assertContains(agentContract, requiredAgentRules, "AGENTS.md");

const targetContract = await read("workflow/targets.yml");
assertContains(targetContract, requiredTargetRules, "workflow/targets.yml");

const orchestratorContract = await read(".github/agents/orchestrator.agent.md");
assertContains(
  orchestratorContract,
  requiredOrchestratorRules,
  ".github/agents/orchestrator.agent.md",
);

const verifierContract = await read(".github/agents/verifier.agent.md");
assertContains(
  verifierContract,
  requiredVerifierRules,
  ".github/agents/verifier.agent.md",
);

const buildContract = await read(".github/prompts/build.prompt.md");
assertContains(buildContract, requiredBuildRules, ".github/prompts/build.prompt.md");

const workflowContract = await read("workflow/README.md");
assertContains(
  workflowContract,
  [
    "## Automatic subagent orchestration",
    "Orchestrator → Planner subagent → Orchestrator implementation → fresh Verifier subagent → Result",
    "The agent tool and the `agents` allowlist are the required automatic delegation mechanism.",
  ],
  "workflow/README.md",
);

for (const relativePath of frontmatterFiles) {
  const content = await read(relativePath);
  const [firstLine] = content.split(/\r?\n/u);
  if (firstLine !== "---") {
    throw new Error(`Missing YAML frontmatter in ${relativePath}`);
  }
}

console.log("Copilot workflow contract is valid.");
