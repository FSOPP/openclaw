import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

describe("speckit.discover no-marker fast path", () => {
  it("confirms completion when no clarification markers are present", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("If no markers exist");
    expect(content).toContain("Spec is complete — no clarification markers found");
    expect(content).toContain("Ready for `/speckit.plan`");
  });
});
