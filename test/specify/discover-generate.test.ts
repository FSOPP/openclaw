import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

function readAgent() {
  return readFileSync(agentFile, "utf8");
}

describe("speckit.discover generation contract", () => {
  it("defines all required analysis phases", () => {
    const content = readAgent();
    expect(content).toContain("## Phase 0: Setup");
    expect(content).toContain("## Phase 1: Manifest & Documentation Analysis");
    expect(content).toContain("## Phase 2: Directory Tree Scan");
    expect(content).toContain("## Phase 3: API Surface Analysis");
    expect(content).toContain("## Phase 4: Source Sampling");
    expect(content).toContain("## Phase 5: Spec Generation");
  });

  it("requires mandatory output quality checks before writing spec", () => {
    const content = readAgent();
    expect(content).toContain("Quality Validation");
    expect(content).toContain("All mandatory sections populated");
    expect(content).toContain("No raw template placeholders");
    expect(content).toMatch(/Maximum\s+3.*NEEDS CLARIFICATION/s);
    expect(content).toContain("Write the completed spec to `SPEC_FILE`");
  });

  it("documents completion summary details", () => {
    const content = readAgent();
    expect(content).toContain("Summary:");
    expect(content).toContain("Total files analyzed");
    expect(content).toContain("Modules discovered");
    expect(content).toContain("Clarification markers");
  });
});
