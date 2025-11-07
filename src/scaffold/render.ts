import { promises as fs } from "node:fs";
import ejs, { Data } from "ejs";

export function renderString(template: string, ctx: Record<string, unknown>): string {
  return ejs.render(template, ctx as Data, { async: false });
}

export async function renderFile(filePath: string, ctx: Record<string, unknown>): Promise<string> {
  const tpl = await fs.readFile(filePath, "utf8");
  return renderString(tpl, ctx);
}
