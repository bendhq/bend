import path from 'path';
import type { CLIOptions } from '../types';
import { normalizeGenerateOptions } from '../scaffold/normalize';
import { resolveDeps } from '../scaffold/deps';
import { generateProjectFromTemplate } from '../scaffold/writer';
import { installDependencies } from '../utils/pm';
import { log, setSilent } from '../utils/log';

export async function createProject(
  inOpts: Partial<CLIOptions>
): Promise<void> {
  try {
    const normalized = await normalizeGenerateOptions(
      inOpts as Partial<CLIOptions> & { projectName?: string }
    );
    const runtime = (inOpts.runtime ?? 'nodejs') as 'nodejs' | 'bun';
    const language = (inOpts.language ?? 'ts') as 'ts' | 'js';
    const orm = (inOpts.orm ?? 'mongoose') as 'mongoose' | 'prisma';
    const framework = (inOpts.framework ?? 'express') as 'express' | 'fastify';
    const stackDeps = resolveDeps({ runtime, language, orm, framework });
    const ctx = Object.assign({}, normalized.context ?? {}, {
      deps: stackDeps.dependencies,
      devDependencies: stackDeps.devDependencies,
      scripts: stackDeps.scripts ?? {},
    });
    const opts = {
      templatesRoot: String(normalized.templatesRoot),
      targetRoot: String(normalized.targetRoot),
      context: ctx,
      skipCache: !!normalized.skipCache,
      concurrency: normalized.concurrency,
    };
    setSilent(false);
    log.info(
      `Creating project ${String(
        inOpts.projectName ?? ctx.projectName ?? path.basename(opts.targetRoot)
      )} at ${opts.targetRoot}`
    );
    const result = await generateProjectFromTemplate(opts as any);
    if (!result.success) {
      log.error('Generation failed');
      process.exit(1);
    }
    log.success(`Project created: ${opts.targetRoot}`);
    if (!normalized.skipInstall) {
      log.info('Installing dependencies...');
      await installDependencies(
        opts.targetRoot,
        normalized.packageManager as any
      );
      log.success('Dependencies installed');
    } else {
      log.info('Skipping install as requested');
    }
  } catch (err: any) {
    setSilent(false);
    log.error(String(err?.message ?? err));
    process.exit(1);
  }
}

export async function init(): Promise<void> {
  /* noop exported for compatibility */
}
