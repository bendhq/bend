import path from 'path';
import { normalizeGenerateOptions } from './normalize';
import { generateProjectFromTemplate } from './writer';
import { installDependencies, detectPackageManager } from '../utils/pm';
import type { GenerateOptions, GenerateResult } from '../types';

export async function generate(
  input: Partial<GenerateOptions>
): Promise<GenerateResult> {
  const opts = await normalizeGenerateOptions(input);
  const res = await generateProjectFromTemplate(opts);

  if (!opts.skipInstall) {
    const cwd = path.resolve(opts.targetRoot);
    const pm = await detectPackageManager(cwd);
    await installDependencies(cwd, pm);
  }

  return res;
}
