import path from "node:path";
import { promises as fs } from "node:fs";
import { renderFile } from "./render.js";
import { ensureDir } from "../utils/fs.js";

const SKIP = new Set([".DS_Store", "Thumbs.db"]);

function destNameFor(srcName: string): string {
  let name = path.basename(srcName);
  if (name.startsWith("_")) name = "." + name.slice(1);
  if (name.endsWith(".ejs")) name = name.slice(0, -4);
  return name;
}

export async function writeTemplateFile(
  srcFile: string,
  destDir: string,
  ctx: Record<string, unknown>
): Promise<void> {
  const base = destNameFor(srcFile);
  const destPath = path.join(destDir, base);
  await ensureDir(path.dirname(destPath));

  if (srcFile.endsWith(".ejs")) {
    const content = await renderFile(srcFile, ctx);
    await fs.writeFile(destPath, content, "utf8");
  } else {
    const buf = await fs.readFile(srcFile);
    await fs.writeFile(destPath, buf);
  }
}

export async function writeStaticDir(
  srcDir: string,
  destDir: string,
  ctx: Record<string, unknown>
): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;

    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      const nextDest = path.join(destDir, destNameFor(entry.name));
      await writeStaticDir(srcPath, nextDest, ctx);
    } else {
      await writeTemplateFile(srcPath, destDir, ctx);
    }
  }
}
