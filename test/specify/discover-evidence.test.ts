import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

describe("speckit.discover evidence contract", () => {
  it("requires explicit source evidence for generated scenarios and requirements", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toMatch(/attach explicit source evidence/i);
    expect(content).toMatch(/items lacking source evidence.*omit/i);
  });

  it("enforces evidence-backed quality limits", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("Maximum 3");
    expect(content).toContain("[NEEDS CLARIFICATION]");
  });
});
