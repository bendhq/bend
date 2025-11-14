import { promises as fs } from "node:fs";
import path from "node:path";
import { renderFile } from "../scaffold/render.js";

/**
 * Ensures a directory exists; creates it recursively if missing.
 */
export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Recursively copies files from one directory to another,
 * rendering `.ejs` templates along the way.
 */
export async function copyDirRenderEJS(
  srcDir: string,
  destDir: string,
  ctx: Record<string, unknown>
): Promise<void> {
  await ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name.replace(/^_/, ".").replace(/\.ejs$/, ""));

    if (entry.isDirectory()) {
      await copyDirRenderEJS(srcPath, destPath, ctx);
      continue;
    }

    const content = entry.name.endsWith(".ejs")
      ? await renderFile(srcPath, ctx)
      : await fs.readFile(srcPath, "utf8");

    await ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, content);
  }
}

/**
 * Checks if a file or directory exists.
 */
export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a directory or file recursively (safe cleanup).
 */
export async function remove(target: string): Promise<void> {
  if (await pathExists(target)) {
    await fs.rm(target, { recursive: true, force: true });
  }
}
