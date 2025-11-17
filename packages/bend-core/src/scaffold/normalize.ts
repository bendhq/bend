import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import type { GenerateOptions, CLIOptions, Context } from '../types';

function sanitizeName(name: string): string {
  const n = name.trim().toLowerCase();
  const replaced = n.replace(/\s+/g, '-').replace(/[^a-z0-9._\-]/g, '');
  return replaced.replace(/^-+|-+$/g, '') || 'app';
}

function ensureAbsolute(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export function templatesFolderFor(input: {
  runtime: 'nodejs' | 'bun';
  language: 'ts' | 'js';
  orm: 'mongoose' | 'prisma';
  framework: 'express' | 'fastify';
}): string {
  const stackName = `${input.language}-${input.orm}-${input.framework}`;
  return path.join(
    __dirname,
    'templates',
    'stacks',
    input.runtime,
    input.language,
    stackName
  );
}

export async function normalizeGenerateOptions(
  inOpts: Partial<GenerateOptions> & Partial<CLIOptions>
): Promise<GenerateOptions> {
  const projectName =
    typeof inOpts.projectName === 'string' && inOpts.projectName.length > 0
      ? sanitizeName(inOpts.projectName)
      : 'my-app';
  const targetRoot = ensureAbsolute(
    inOpts.targetRoot
      ? String(inOpts.targetRoot)
      : path.join(process.cwd(), projectName)
  );
  const runtime =
    (inOpts.runtime as GenerateOptions['packageManager'] | undefined) ??
    (inOpts.runtime as any) ??
    'nodejs';
  const language = (inOpts.language as any) ?? 'ts';
  const orm = (inOpts.orm as any) ?? 'mongoose';
  const framework = (inOpts.framework as any) ?? 'express';
  const packageManager = (inOpts.packageManager as any) ?? 'npm';
  const context: Context = Object.assign({ projectName }, inOpts.context ?? {});
  const templatesRoot = inOpts.templatesRoot
    ? ensureAbsolute(String(inOpts.templatesRoot))
    : templatesFolderFor({ runtime, language, orm, framework });

  if (!fsSync.existsSync(templatesRoot)) {
    throw new Error(`templates root not found: ${templatesRoot}`);
  }

  return {
    templatesRoot,
    targetRoot,
    context,
    packageManager,
    skipInstall: !!inOpts.noInstall,
    concurrency: inOpts.concurrency,
    skipCache: !!inOpts.skipCache,
  };
}
