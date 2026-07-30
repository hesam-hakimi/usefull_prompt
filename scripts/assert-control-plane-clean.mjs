import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const protectedPaths = [".github", "AGENTS.md", "workflow/targets.yml"];

const result = spawnSync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all", "--", ...protectedPaths],
  {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(result.stderr || "Unable to inspect protected control-plane paths.");
}

const changes = result.stdout.trim();
if (changes) {
  console.error("Tests modified protected maintainer control-plane files:");
  console.error(changes);
  process.exit(1);
}

console.log("Maintainer control plane remained unchanged.");
