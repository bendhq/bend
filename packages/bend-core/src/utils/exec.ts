import { spawn } from "node:child_process";
import fs from "node:fs";

const isWin = process.platform === "win32";

function winWrap(cmd: string, args: string[]) {
  // Run via cmd.exe to avoid EINVAL/ENOENT quirks on Windows
  return {
    command: "cmd.exe",
    args: ["/c", cmd, ...args]
  };
}

export function run(cmd: string, args: string[], cwd: string): Promise<void> {
  // Ensure cwd exists to avoid EINVAL
  if (!fs.existsSync(cwd)) {
    return Promise.reject(new Error(`run(): cwd does not exist: ${cwd}`));
  }

  return new Promise((resolve, reject) => {
    const spec = isWin ? winWrap(cmd, args) : { command: cmd, args };

    const child = spawn(spec.command, spec.args, {
      cwd,
      stdio: "inherit",
      shell: false // no DEP0190
    });

    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

export function hasCommand(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    const spec = isWin ? winWrap(cmd, ["--version"]) : { command: cmd, args: ["--version"] };

    const child = spawn(spec.command, spec.args, {
      stdio: "ignore",
      shell: false
    });

    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}
