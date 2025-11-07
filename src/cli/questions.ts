import * as p from "@clack/prompts";
import pc from "picocolors";
import type { Answers, PackageManager } from "../types.js";

function guessPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  if (ua.includes("bun")) return "bun";
  return "npm";
}

function isValidPkgName(name: string): boolean {
  // basic npm package-name validation (unscoped)
  // lowercase letters, digits, . _ - allowed; must not start/end with -
  return /^[a-z0-9._-]+$/.test(name) && !name.startsWith("-") && !name.endsWith("-");
}

export async function askSetup(): Promise<Answers> {
  p.intro(pc.bold(pc.cyan("Bend — backend project generator")));

  const initialPm = guessPackageManager();

  const answers = await p.group(
    {
      language: () =>
        p.select({
          message: "Choose language:",
          options: [
            { label: pc.yellow("JavaScript"), value: "js" },
            { label: pc.cyan("TypeScript (TS)"), value: "ts" }
          ]
        }),

      framework: () =>
        p.select({
          message: "Choose framework:",
          options: [
            { label: "Express", value: "express" },
            { label: "Fastify", value: "fastify" }
          ]
        }),

      orm: () =>
        p.select({
          message: "Choose ORM:",
          options: [
            { label: "Mongoose", value: "mongoose" },
            { label: "Prisma", value: "prisma" },
            { label: "None", value: "none" }
          ]
        }),

      name: () =>
        p.text({
          message: "Project name:",
          placeholder: "my-api",
          validate: (v) => {
            if (!v || !v.trim()) return "Project name is required.";
            const name = v.trim().toLowerCase();
            if (!isValidPkgName(name)) {
              return 'Use lowercase letters, digits, ".", "_" or "-". Cannot start/end with "-".';
            }
            return undefined;
          }
        }),

      pkgm: () =>
        p.select({
          message: "Package manager:",
          initialValue: initialPm,
          options: [
            { label: "npm", value: "npm" },
            { label: "pnpm", value: "pnpm" },
            { label: "yarn", value: "yarn" },
            { label: "bun", value: "bun" }
          ]
        })
    },
    {
      onCancel: () => {
        p.cancel("Aborted.");
        process.exit(0);
      }
    }
  );

  return answers as Answers;
}
