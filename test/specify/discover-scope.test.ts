import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

describe("speckit.discover scoped analysis contract", () => {
  it("restricts each analysis phase to TARGET_PATH when scoped", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("## Scoping Rules (Subdirectory Mode)");
    expect(content).toContain("Read manifest and README from `TARGET_PATH`");
    expect(content).toContain("Scan directory tree ONLY within `TARGET_PATH`");
    expect(content).toContain("Analyze API surface only from files under `TARGET_PATH`");
    expect(content).toContain("Sample source files only from `TARGET_PATH`");
  });

  it("requires scoped title/module behavior and no sibling scanning", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("Spec title");
    expect(content).toContain("not the entire repo name");
    expect(content).toContain("Do not scan sibling directories");
  });
});
