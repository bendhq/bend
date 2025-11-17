export type Context = Record<string, unknown>;

export type TemplateRelativePath = string;

export interface TemplateFileMeta {
  rel: TemplateRelativePath;
  abs: string;
  isDirectory: boolean;
  size: number;
  mode: number;
  mtimeMs: number;
  isBinary?: boolean;
}

export interface CompiledManifestEntry {
  compiled?: string;
  binary?: boolean;
}

export type CompiledManifest = Record<
  TemplateRelativePath,
  CompiledManifestEntry
>;

export interface RenderResult {
  content: string;
  size: number;
  hash: string;
}

export interface GenerateOptions {
  templatesRoot: string;
  targetRoot: string;
  context?: Context;
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
  skipInstall?: boolean;
  concurrency?: number;
  skipCache?: boolean;
}

export interface GenerateResult {
  success: boolean;
  targetRoot: string;
  createdFiles: string[];
  skipped?: string[];
  warnings?: string[];
  error?: string;
}

export interface WriterOptions {
  templatesRoot: string;
  targetRoot: string;
  context?: Context;
  concurrency?: number;
  skipCache?: boolean;
  onFileWritten?: (absPath: string) => void;
}

export interface Renderer {
  init(distCompiledRoot?: string): Promise<void>;
  render(
    templatesRoot: string,
    absTemplatePath: string,
    context?: Context
  ): Promise<RenderResult>;
  loadIndex(templatesRoot: string): Promise<TemplateFileMeta[]>;
  clearCache(): void;
}

export interface Writer {
  writeTree(
    opts: WriterOptions
  ): Promise<{ created: string[]; skipped: string[] }>;
}

export interface CLIOptions {
  runtime?: 'nodejs' | 'bun';
  language?: 'ts' | 'js';
  orm?: 'prisma' | 'mongoose';
  framework?: 'express' | 'fastify';
  projectName?: string;
  path?: string;
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
  noInstall?: boolean;
}
