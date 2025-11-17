export type Language = 'js' | 'ts';
export type LanguageInput = 'javascript' | 'typescript' | Language;

export type Runtime = 'nodejs' | 'bun';
export type Framework = 'express' | 'fastify';
export type Orm = 'mongoose' | 'prisma' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface Answers {
  runtime: Runtime;
  language: LanguageInput;
  framework: Framework;
  orm: Orm;
  name: string;
  pkgm: PackageManager;
}

export interface NormalizedAnswers {
  runtime: Runtime;
  language: Language;
  framework: Framework;
  orm: Orm;
  name: string;
  pkgm: PackageManager;
}

export interface TemplateContext extends Record<string, unknown> {
  name: string;
  runtime: Runtime;
  language: Language;
  framework: Framework;
  orm: Orm;
  pkgm: PackageManager;
}

export interface DependencyPlan {
  deps: string[];
  devDeps: string[];
}

export interface StackMeta {
  path: string;
  runtime: Runtime;
  language: Language;
  framework: Framework;
  orm: Orm;
  requiresPrisma?: boolean;
  hasDev?: boolean;
  hasBuild?: boolean;
  hasStart?: boolean;
}
