export type Language = "javascript" | "typescript";
export type Framework = "express" | "fastify";
export type Orm = "mongoose" | "prisma" | "none";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface Answers {
  language: Language;
  framework: Framework;
  orm: Orm;
  name: string;
  pkgm: PackageManager;
}

export interface TemplateContext extends Record<string, unknown> {
  name: string;
  language: Language;
  framework: Framework;
  orm: Orm;
  pkgm: PackageManager;
}

export interface DependencyPlan {
  deps: string[];
  devDeps: string[];
}
