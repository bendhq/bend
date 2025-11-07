import path from "node:path";
import { promises as fs } from "node:fs";
import { renderFile } from "./render.js";
import { ensureDir } from "../utils/fs.js";

export async function writeTemplateFile(
  srcFile: string,
  destDir: string,
  ctx: Record<string, unknown>
): Promise<void> {
  const fileName = path.basename(srcFile);
  let destName = fileName;

  if (destName.startsWith("_")) destName = "." + destName.slice(1); // _gitignore -> .gitignore
  if (destName.endsWith(".ejs")) destName = destName.slice(0, -4);

  const destPath = path.join(destDir, destName);
  await ensureDir(path.dirname(destPath));

  const content = srcFile.endsWith(".ejs")
    ? await renderFile(srcFile, ctx)
    : await fs.readFile(srcFile, "utf8");

  await fs.writeFile(destPath, content);
}

export async function writeStaticDir(
  srcDir: string,
  destDir: string,
  ctx: Record<string, unknown>
): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await writeStaticDir(srcPath, destPath, ctx);
    } else {
      await writeTemplateFile(srcPath, destDir, ctx);
    }
  }
}
