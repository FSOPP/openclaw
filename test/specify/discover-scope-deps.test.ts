import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

describe("speckit.discover scoped dependency assumptions", () => {
  it("captures cross-package dependencies without documenting shared code in full", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("Cross-package dependencies");
    expect(content).toContain("note these dependencies in the Assumptions section");
    expect(content).toContain("Do NOT attempt to fully document the shared code");
  });
});
