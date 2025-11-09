import fs from "node:fs";
import pc from "picocolors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDir, copyDirRenderEJS } from "../utils/fs.js";
import { run } from "../utils/exec.js";
import { buildDeps } from "../scaffold/deps.js";
import { toValidPackageName } from "../scaffold/normalize.js";
import type { Answers, TemplateContext } from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveTemplatesRoot(): string {
  const here = __dirname; // dist/
  const candidates = [
    path.resolve(here, "../templates"),
    path.resolve(here, "../src/scaffold/templates"),
    path.resolve(here, "../../src/scaffold/templates")
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Templates folder not found. Searched:\n${candidates.join("\n")}`);
}

const TEMPLATES = resolveTemplatesRoot();

export async function createProject(a: Answers) {
  const projectDir = path.resolve(process.cwd(), a.name);
  const pkgName = toValidPackageName(a.name);

  console.log(pc.cyan(`Creating project: ${pkgName}`));
  await ensureDir(projectDir);

  const ctx: TemplateContext = {
    name: pkgName,
    language: a.language,
    framework: a.framework,
    orm: a.orm
  };

  const serverDir = path.join(TEMPLATES, "server", a.framework, a.language);
  const runtimeDir = path.join(TEMPLATES, "runtime");
  const commonDir = path.join(TEMPLATES, "common");

  await copyDirRenderEJS(commonDir, projectDir, ctx);
  await copyDirRenderEJS(runtimeDir, projectDir, ctx);
  await copyDirRenderEJS(serverDir, projectDir, ctx);

  if (a.orm === "mongoose") {
    const ormDir = path.join(TEMPLATES, "orm", "mongoose", a.language);
    await copyDirRenderEJS(ormDir, projectDir, ctx);
  } else if (a.orm === "prisma") {
    const prismaSchema = path.join(TEMPLATES, "orm", "prisma", "prisma");
    const prismaTs = path.join(TEMPLATES, "orm", "prisma", "ts");
    await copyDirRenderEJS(prismaSchema, projectDir, ctx);
    await copyDirRenderEJS(prismaTs, projectDir, ctx);
  }

  const { deps, devDeps } = buildDeps(a);
  console.log(pc.yellow("Installing dependencies..."));
  await installDeps(a.pkgm, deps, devDeps, projectDir);

  if (a.orm === "prisma") {
    console.log(pc.yellow("Generating Prisma client..."));
    await run(a.pkgm, ["run", "prisma:generate"], projectDir).catch(() => {
      console.warn(pc.yellow("Prisma client generation skipped (optional)."));
    });
  }

  console.log(pc.green(`${pkgName} created successfully.`));
  console.log(pc.dim(`\nNext steps:\n  cd ${a.name}\n  ${a.pkgm} run dev\n`));
}

async function installDeps(pm: string, deps: string[], devDeps: string[], cwd: string) {
  if (pm === "npm") {
    if (deps.length) await run("npm", ["install", ...deps], cwd);
    if (devDeps.length) await run("npm", ["install", "-D", ...devDeps], cwd);
  } else if (pm === "pnpm") {
    if (deps.length) await run("pnpm", ["add", ...deps], cwd);
    if (devDeps.length) await run("pnpm", ["add", "-D", ...devDeps], cwd);
  } else if (pm === "yarn") {
    if (deps.length) await run("yarn", ["add", ...deps], cwd);
    if (devDeps.length) await run("yarn", ["add", "-D", ...devDeps], cwd);
  } else if (pm === "bun") {
    if (deps.length) await run("bun", ["add", ...deps], cwd);
    if (devDeps.length) await run("bun", ["add", "-d", ...devDeps], cwd);
  }
}
