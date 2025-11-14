import * as p from "@clack/prompts";
import pc from "picocolors";
import type { Answers, Framework, Language, Orm, PackageManager } from "../types.js";
import { detectPackageManagerHint } from "../utils/pm.js";

function ensure<T>(val: unknown, _msg: string): T {
  if (p.isCancel(val)) {
    p.cancel("Operation cancelled.");
    process.exit(1);
  }
  return val as T;
}

export async function askSetup(): Promise<Answers> {
  p.intro(pc.cyan("Bend - backend project generator"));

  const language = ensure<Language>(
    await p.select({
      message: "Choose language:",
      options: [
        { label: pc.blue("TypeScript (TS)"), value: "typescript" },
        { label: pc.yellow("JavaScript (JS)"), value: "javascript" }
      ]
    }),
    "Language is required"
  );

  const framework = ensure<Framework>(
    await p.select({
      message: "Choose framework:",
      options: [
        { label: "Express", value: "express" },
        { label: "Fastify", value: "fastify" }
      ]
    }),
    "Framework is required"
  );

  const orm = ensure<Orm>(
    await p.select({
      message: "Choose ORM:",
      options: [
        { label: "Mongoose", value: "mongoose" },
        { label: "Prisma", value: "prisma" },
        { label: "None", value: "none" }
      ]
    }),
    "ORM is required"
  );

  const name = ensure<string>(
    await p.text({
      message: "Project name:",
      placeholder: "Bend-App",
      validate(v) {
        if (!v || !v.trim()) return "Project name is required";
        if (v.length > 214) return "Project name is too long";
      }
    }),
    "Project name is required"
  );

  const hinted = detectPackageManagerHint();

  const pkgm = ensure<PackageManager>(
    await p.select({
      message: "Package manager:",
      initialValue: hinted,
      options: [
        { label: "npm", value: "npm" },
        { label: "pnpm", value: "pnpm" },
        { label: "yarn", value: "yarn" },
        { label: "bun", value: "bun" }
      ]
    }),
    "Package manager is required"
  );

  p.outro(pc.green("Configuration captured."));
  return { language, framework, orm, name, pkgm };
}
