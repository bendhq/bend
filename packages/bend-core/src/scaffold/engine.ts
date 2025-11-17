import path from 'path';
import {
  initRenderer,
  render,
  loadTemplateIndex,
  clearRenderCache,
} from './renderer';
import { generateProjectFromTemplate, writeTree } from './writer';
import {
  detectPackageManager,
  installDependencies,
  runScript,
} from '../utils/pm';
import type { GenerateOptions, GenerateResult } from '../types';

export async function init(opts?: {
  templatesRoot?: string;
  distCompiledRoot?: string;
}) {
  if (!opts?.templatesRoot) return;
  await initRenderer({
    templatesRoot: opts.templatesRoot,
    distCompiledRoot: opts.distCompiledRoot,
  });
}

export async function generate(opts: GenerateOptions): Promise<GenerateResult> {
  const templatesRoot = path.resolve(opts.templatesRoot);
  const result = await generateProjectFromTemplate(opts);
  if (!result.success) return result;
  if (!opts.skipInstall) {
    const pm = await detectPackageManager(result.targetRoot);
    await installDependencies(result.targetRoot, pm);
  }
  return result;
}

export async function generateNoInstall(
  opts: GenerateOptions
): Promise<GenerateResult> {
  const o = Object.assign({}, opts, { skipInstall: true });
  return generateProjectFromTemplate(o);
}

export async function writeOnly(opts: Parameters<typeof writeTree>[0]) {
  return writeTree(opts);
}

export async function renderFile(
  templatesRoot: string,
  absTemplatePath: string,
  context?: Record<string, unknown>
) {
  return render(templatesRoot, absTemplatePath, context);
}

export async function listTemplates(templatesRoot: string) {
  return loadTemplateIndex(templatesRoot);
}

export function clearCache() {
  clearRenderCache();
}
