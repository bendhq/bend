import { promises as fs } from "node:fs";
import ejs from "ejs";

export function renderString(template: string, ctx: Record<string, unknown>): string {
  return ejs.render(template, ctx, { async: false, rmWhitespace: true });
}

export async function renderFile(filePath: string, ctx: Record<string, unknown>): Promise<string> {
  const template = await fs.readFile(filePath, "utf8");
  return renderString(template, ctx);
}
