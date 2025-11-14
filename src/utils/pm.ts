import type { PackageManager } from "../types.js";
import { spawn } from "node:child_process";

const isWin = process.platform === "win32";

function resolveCmd(bin: string): string {
  if (!isWin) return bin;
  if (bin === "bun") return "bun.exe";
  return `${bin}.cmd`;
}

/**
 * Pure hint from user-agent (no spawning). Safe to use during prompts.
 */
export function detectPackageManagerHint(): PackageManager {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  if (ua.includes("bun")) return "bun";
  return "npm";
}

/**
 * Runtime check if a PM is actually available.
 * Uses a Windows-friendly spawn (with shell on Windows only).
 */
export function pmAvailable(pm: PackageManager): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(resolveCmd(pm), ["--version"], {
      stdio: "ignore",
      shell: isWin // important: avoid EINVAL on some Windows setups
    });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}
