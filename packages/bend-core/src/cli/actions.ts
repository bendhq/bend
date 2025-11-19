import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { normalizeGenerateOptions } from '../scaffold/normalize';
import { generateProjectFromTemplate } from '../scaffold/writer';
import { installDependencies, detectPackageManager } from '../utils/pm';
import { log, setSilent } from '../utils/log';
import type { CLIOptions } from '../types';

async function pathIsEmpty(dir: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir);
    return entries.length === 0;
  } catch {
    return true;
  }
}

async function ensureTargetAvailable(targetRoot: string): Promise<void> {
  const exists = fsSync.existsSync(targetRoot);
  if (!exists) await fs.mkdir(targetRoot, { recursive: true });
  const empty = await pathIsEmpty(targetRoot);
  if (!empty) {
    throw new Error(
      `Target directory already exists and is not empty: ${targetRoot}`
    );
  }
}

export async function createProject(
  opts: Partial<CLIOptions> = {}
): Promise<void> {
  setSilent(Boolean(opts.noInstall));
  const normalized = await normalizeGenerateOptions(opts as Partial<any>);

  const targetRoot = String(normalized.targetRoot);
  const templatesRoot = String(normalized.templatesRoot);

  try {
    await ensureTargetAvailable(targetRoot);
  } catch (err: any) {
    log.error(`cannot create project: ${err?.message ?? String(err)}`);
    throw err;
  }

  try {
    log.info(`generating project at ${targetRoot}`);
    const result = await generateProjectFromTemplate({
      templatesRoot,
      targetRoot,
      context: normalized.context,
      concurrency: normalized.concurrency,
      skipCache: normalized.skipCache,
      skipInstall: normalized.skipInstall,
      packageManager: normalized.packageManager,
    });

    if (!result.success) {
      log.error('generation failed');
      if (result.error) log.error(result.error);
      throw new Error('generation failed');
    }

    log.success(`project generated: ${targetRoot}`);
    if (result.createdFiles && result.createdFiles.length > 0) {
      log.info(`created ${result.createdFiles.length} files`);
    }

    if (!normalized.skipInstall && !normalized.skipInstall) {
      const pm = await detectPackageManager(targetRoot);
      log.info(`installing dependencies using ${pm}`);
      const res = await installDependencies(targetRoot, pm);
      if (res.code !== 0) {
        log.warn(
          `install finished with code ${String(res.code)}. stdout: ${
            res.stdout
          }`
        );
      } else {
        log.success('dependencies installed');
      }
    } else {
      log.info('skipping install (skipInstall enabled)');
    }
  } catch (err: any) {
    log.error(`error: ${err?.message ?? String(err)}`);
    throw err;
  }
}

export async function createProjectAndExit(
  opts: Partial<CLIOptions> = {}
): Promise<void> {
  try {
    await createProject(opts);
    process.exit(0);
  } catch {
    process.exit(1);
  }
}

export default createProject;
