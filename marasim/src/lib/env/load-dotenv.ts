import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Minimal dotenv loader for Node scripts (seed, tests).
 * Next.js loads `.env.local` automatically — scripts must call this explicitly.
 *
 * Load order (first wins — does not override existing process.env):
 *   1. .env.local
 *   2. .dev.vars  (OpenNext / Cloudflare local compat)
 */
export function loadProjectEnv(cwd = process.cwd()): void {
  for (const file of [".env.local", ".dev.vars"]) {
    const path = resolve(cwd, file);
    if (!existsSync(path)) continue;
    applyEnvFile(path);
  }
}

function applyEnvFile(path: string): void {
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
