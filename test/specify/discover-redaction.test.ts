import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const agentFile = join(repoRoot, ".github/agents/speckit.discover.agent.md");

describe("speckit.discover redaction contract", () => {
  it("requires secret-like values to be redacted", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toMatch(/redact likely secrets/i);
    expect(content).toMatch(/raw secret values never appear in output artifacts/i);
  });

  it("requires redaction in snippets, status output, and generated spec", () => {
    const content = readFileSync(agentFile, "utf8");
    expect(content).toContain("snippets");
    expect(content).toContain("status output");
    expect(content).toContain("generated `spec.md`");
  });
});
