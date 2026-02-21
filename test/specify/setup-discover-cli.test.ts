import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const scriptPath = join(repoRoot, ".specify/scripts/bash/setup-discover.sh");

function runSetup(args: string[] = []) {
  return spawnSync(scriptPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      SPECIFY_FEATURE: "001-spec-from-project",
    },
  });
}

describe("setup-discover.sh", () => {
  it("prints usage and exits successfully with --help", () => {
    const result = runSetup(["--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage:");
    expect(result.stdout).toContain("[--json] [--help] [TARGET_PATH]");
  });

  it("returns contract-compliant json output", () => {
    const result = runSetup(["--json"]);
    expect(result.status).toBe(0);

    const parsed = JSON.parse(result.stdout.trim()) as Record<string, string>;
    expect(parsed.FEATURE_DIR).toContain("/specs/001-spec-from-project");
    expect(parsed.SPEC_FILE).toContain("/specs/001-spec-from-project/spec.md");
    expect(parsed.SPEC_TEMPLATE).toContain("/.specify/templates/spec-template.md");
    expect(parsed.TARGET_PATH).toBe(repoRoot);
    expect(["true", "false"]).toContain(parsed.SPEC_EXISTS);
    expect(parsed.BRANCH).toBe("001-spec-from-project");
    expect(["true", "false"]).toContain(parsed.HAS_GIT);
  });

  it("rejects missing target paths with a clear error", () => {
    const result = runSetup(["--json", "./definitely-does-not-exist"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("ERROR: Target path does not exist");
  });

  it("rejects non-directory target paths with a clear error", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "openclaw-discover-setup-"));
    const tempFile = join(tempDir, "target.txt");
    writeFileSync(tempFile, "file-not-dir");

    const result = runSetup(["--json", tempFile]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("ERROR: Target path is not a directory");
  });

  it("keeps executable permission set on the script", () => {
    const result = spawnSync("bash", ["-lc", `test -x "${scriptPath}"`], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
  });
});
