import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "COPY_ORDER.md",
  "docs/business-context.md",
  "docs/system-map.md",
  "docs/change-contract.md",
  "docs/definition-of-done.md",
  "workflow/README.md",
  "workflow/targets.yml",
  "workflow/execution-recovery.md",
  "workflow/shipped-extension-delivery.md",
  "templates/request.md",
  "templates/evidence-packet.md",
  "templates/result.md",
  ".github/copilot-instructions.md",
  ".github/agents/orchestrator.agent.md",
  ".github/agents/evidence-researcher.agent.md",
  ".github/agents/planner.agent.md",
  ".github/agents/verifier.agent.md",
  ".github/prompts/build.prompt.md",
  ".github/prompts/investigate.prompt.md",
  ".github/prompts/plan-change.prompt.md",
  ".github/prompts/verify-change.prompt.md",
  ".github/prompts/verify-live-flow.prompt.md",
  ".github/instructions/business-context.instructions.md",
  ".github/instructions/change-safety.instructions.md",
  ".github/instructions/workflow-asset-boundaries.instructions.md",
  ".github/instructions/workflow-coherence.instructions.md",
  ".github/instructions/execution-recovery.instructions.md",
  ".github/workflows/validate-workflow.yml",
  "scripts/assert-control-plane-clean.mjs",
];

const frontmatterFiles = [
  ".github/agents/orchestrator.agent.md",
  ".github/agents/evidence-researcher.agent.md",
  ".github/agents/planner.agent.md",
  ".github/agents/verifier.agent.md",
  ".github/prompts/build.prompt.md",
  ".github/prompts/investigate.prompt.md",
  ".github/prompts/plan-change.prompt.md",
  ".github/prompts/verify-change.prompt.md",
  ".github/prompts/verify-live-flow.prompt.md",
  ".github/instructions/business-context.instructions.md",
  ".github/instructions/change-safety.instructions.md",
  ".github/instructions/workflow-asset-boundaries.instructions.md",
  ".github/instructions/workflow-coherence.instructions.md",
  ".github/instructions/execution-recovery.instructions.md",
];

const copyOrderPaths = [
  "workflow/execution-recovery.md",
  "workflow/shipped-extension-delivery.md",
  ".github/instructions/execution-recovery.instructions.md",
  ".github/agents/evidence-researcher.agent.md",
  ".github/prompts/investigate.prompt.md",
  ".github/prompts/verify-live-flow.prompt.md",
  "templates/evidence-packet.md",
  ".github/workflows/validate-workflow.yml",
];

const requiredAgentRules = [
  "Do not guess",
  "Asset ownership and target resolution",
  "Consumer workspace and external-path policy",
  "Workflow states",
  "Automatic orchestration",
  "Change-safety invariants",
  "Regression policy",
  "Output contract",
  "Stop conditions",
];

const requiredTargetRules = [
  "target_class: extension-produced-agent",
  "generated_output_allowed: false",
  "explicit_approval_required: true",
  "root_policy: unique-os-temporary-directory",
  "description: Target cannot be proven safely",
  "implementation_request_authorizes_local_delivery_chain: true",
  "automatic_version_policy: next-patch-on-collision-only",
  "new_task_between_internal_stages: false",
  "package_or_source_change_after_package_verification: new-task",
  "package_installed: INSTALLED_NOT_ACTIVATED",
  "host_reloaded: ACTIVATED_NOT_SMOKE_TESTED",
  "host_reloaded_and_live_smoke_passed: POST_INSTALL_VERIFIED",
];

const requiredOrchestratorRules = [
  "agents:",
  "- Evidence Researcher",
  "- Planner",
  "- Verifier",
  "Immediately emit the required `## Target Resolution` report",
  "invoke `Evidence Researcher` as a subagent",
  "Invoke `Planner` as a subagent",
  "Invoke `Verifier` as a fresh subagent",
  "Before asking the user any question, classify it",
  "A source or package change discovered after package verification",
  "INSTALLED_NOT_ACTIVATED",
  "POST_INSTALL_VERIFIED",
  "Do not perform or simulate final verification yourself",
  "maximum of two same-task remediation cycles",
];

const requiredEvidenceResearcherRules = [
  "disable-model-invocation: false",
  "Do not:",
  "EVIDENCE_READY",
  "EVIDENCE_BLOCKED",
  "Question classification",
  "templates/evidence-packet.md",
  "does not implement",
];

const requiredVerifierRules = [
  "disable-model-invocation: false",
  "Do not edit files",
  "## Shipped-extension checks",
  "POST_INSTALL_VERIFIED",
  "`VERIFIED`",
  "`CHANGES_REQUIRED`",
  "`BLOCKED`",
];

const requiredBuildRules = [
  "classify delivery as `source-only`, `shipped-extension`, or `operational-only`",
  "emit the complete `## Target Resolution` report before any delegation",
  "invoke `Evidence Researcher` as an actual subagent",
  "invoke `Planner` as an actual subagent",
  "continue automatically through the delivery chain instead of stopping at source validation",
  "invoke `Verifier` as a fresh, independent subagent",
  "locally install exactly the verified package once",
  "Do not role-play or simulate Evidence Researcher, Planner, or Verifier",
  "Do not repeatedly retry a failed action without new evidence",
  "only then may a shipped-extension task return `DONE`",
  "INSTALLED_NOT_ACTIVATED",
  "POST_INSTALL_VERIFIED",
];

const requiredRecoveryRules = [
  "## Optional evidence gate",
  "EVIDENCE_REQUIRED",
  "EVIDENCE_READY",
  "EVIDENCE_BLOCKED",
  "## Question classification",
  "DERIVABLE_FROM_STTM",
  "DERIVABLE_FROM_REPO",
  "AUTHORITATIVE_LITERAL",
  "BUSINESS_DECISION",
  "USER_APPROVAL",
  "TOOLING_GAP",
  "SECURITY_BLOCKER",
  "## Recovery loop",
  "## Same-task remediation versus new task",
  "## Execution checkpoint",
  "## Source-to-runtime evidence chain",
  "## Baseline and pre-existing failures",
  "## Partial progress",
];

const requiredShippedDeliveryRules = [
  "# Shipped Extension Delivery Contract",
  "`source-only`",
  "`shipped-extension`",
  "`operational-only`",
  "SOURCE_VERIFIED",
  "PACKAGE_VERIFIED",
  "INSTALLED_NOT_ACTIVATED",
  "ACTIVATED_NOT_SMOKE_TESTED",
  "POST_INSTALL_VERIFIED",
  "The user must not be required to send separate follow-up messages merely to build, package, verify, or locally install",
  "use the next patch version only",
  "locally install **exactly that verified package once**",
  "The required host reload/restart is a user/environment action, not a new task",
  "Do not split the automatic local delivery chain",
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
assertContains(
  agentContract,
  [
    "Before moving beyond `TARGET_RESOLVED`, emit a visible target-resolution report",
    "A new mutating or operational request starts a new task at `INTAKE`",
    "INSTALLED_NOT_ACTIVATED",
    "POST_INSTALL_VERIFIED",
  ],
  "AGENTS.md",
);

const targetContract = await read("workflow/targets.yml");
assertContains(targetContract, requiredTargetRules, "workflow/targets.yml");

const orchestratorContract = await read(".github/agents/orchestrator.agent.md");
assertContains(
  orchestratorContract,
  requiredOrchestratorRules,
  ".github/agents/orchestrator.agent.md",
);

const evidenceResearcherContract = await read(
  ".github/agents/evidence-researcher.agent.md",
);
assertContains(
  evidenceResearcherContract,
  requiredEvidenceResearcherRules,
  ".github/agents/evidence-researcher.agent.md",
);

const verifierContract = await read(".github/agents/verifier.agent.md");
assertContains(
  verifierContract,
  requiredVerifierRules,
  ".github/agents/verifier.agent.md",
);

const buildContract = await read(".github/prompts/build.prompt.md");
assertContains(buildContract, requiredBuildRules, ".github/prompts/build.prompt.md");

const investigateContract = await read(".github/prompts/investigate.prompt.md");
assertContains(
  investigateContract,
  [
    "read-only",
    "invoke `Evidence Researcher` as an actual subagent",
    "EVIDENCE_READY",
    "EVIDENCE_BLOCKED",
    "templates/evidence-packet.md",
    "stop without invoking Planner",
  ],
  ".github/prompts/investigate.prompt.md",
);

const liveFlowContract = await read(".github/prompts/verify-live-flow.prompt.md");
assertContains(
  liveFlowContract,
  [
    "INSTALLED_NOT_ACTIVATED",
    "POST_INSTALL_VERIFIED",
    "active version",
    "live",
    "requires a new task at `INTAKE`",
    "fresh `Verifier`",
  ],
  ".github/prompts/verify-live-flow.prompt.md",
);

const workflowContract = await read("workflow/README.md");
assertContains(
  workflowContract,
  [
    "## Agent topology",
    "User request",
    "Fresh Verifier",
    "## State contract",
    "A new mutating or operational user message always begins a new task at `INTAKE`.",
    "## Build and installation lifecycle",
    "INSTALLED_NOT_ACTIVATED",
    "POST_INSTALL_VERIFIED",
  ],
  "workflow/README.md",
);

const recoveryContract = await read("workflow/execution-recovery.md");
assertContains(
  recoveryContract,
  requiredRecoveryRules,
  "workflow/execution-recovery.md",
);

const shippedDeliveryContract = await read("workflow/shipped-extension-delivery.md");
assertContains(
  shippedDeliveryContract,
  requiredShippedDeliveryRules,
  "workflow/shipped-extension-delivery.md",
);

const copilotInstructions = await read(".github/copilot-instructions.md");
assertContains(
  copilotInstructions,
  [
    "workflow/shipped-extension-delivery.md",
    "original request authorizes one bounded local delivery chain",
    "must not split an already-authorized shipped-extension delivery chain",
  ],
  ".github/copilot-instructions.md",
);

const recoveryInstruction = await read(
  ".github/instructions/execution-recovery.instructions.md",
);
assertContains(
  recoveryInstruction,
  [
    "Before asking the user a question, classify it",
    "Do not repeatedly retry a failed action without new evidence",
    "A source or package-content change discovered after package verification",
    "Do not apply the new-task rule between those internal delivery stages",
    "pre-existing only when reproduced",
  ],
  ".github/instructions/execution-recovery.instructions.md",
);

const copyOrder = await read("COPY_ORDER.md");
for (const relativePath of copyOrderPaths) {
  if (!copyOrder.includes(`\`${relativePath}\``)) {
    throw new Error(`COPY_ORDER.md is missing workflow asset: ${relativePath}`);
  }
}

for (const relativePath of frontmatterFiles) {
  const content = await read(relativePath);
  const [firstLine] = content.split(/\r?\n/u);
  if (firstLine !== "---") {
    throw new Error(`Missing YAML frontmatter in ${relativePath}`);
  }
}

console.log("Copilot workflow contract is valid.");
