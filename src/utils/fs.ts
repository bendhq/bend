import { promises as fs } from "node:fs";
import path from "node:path";
import ejs from "ejs";

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeFileSafe(file: string, content: string) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, content);
}

export async function copyDirRenderEJS(
  srcDir: string,
  destDir: string,
  ctx: Record<string, unknown>
) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    let name = entry.name;

    if (name.startsWith("_")) name = "." + name.slice(1); // _gitignore -> .gitignore
    const isEJS = name.endsWith(".ejs");
    const destName = isEJS ? name.slice(0, -4) : name;
    const dest = path.join(destDir, destName);

    if (entry.isDirectory()) {
      await copyDirRenderEJS(src, dest, ctx);
    } else if (isEJS) {
      const tpl = await fs.readFile(src, "utf8");
      const out = ejs.render(tpl, ctx, { async: false });
      await writeFileSafe(dest, out);
    } else {
      const content = await fs.readFile(src);
      await writeFileSafe(dest, content.toString());
    }
  }
}
