import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

describe("speckit.discover interactive refinement", () => {
  it("defines marker-triggered interactive refinement flow", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("## Interactive Refinement");
    expect(content).toContain("Check for clarification markers");
    expect(content).toContain("Would you like to resolve them now?");
    expect(content).toContain("Replace the marker in `SPEC_FILE` with the user's answer");
  });

  it("requires post-refinement validation and completion summary", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("re-validate the spec");
    expect(content).toContain("Refinement Complete");
    expect(content).toContain("Sections updated");
  });
});
