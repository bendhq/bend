import path from 'path';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { CLIOptions } from '../types';
import { normalizeGenerateOptions } from '../scaffold/normalize';
import { resolveDeps } from '../scaffold/deps';
import { generateProjectFromTemplate } from '../scaffold/writer';
import { installDependencies, detectPackageManager } from '../utils/pm';
import { log, setSilent } from '../utils/log';
import { askQuestions } from './questions';

export async function createProject(
  inOpts: Partial<CLIOptions>
): Promise<void> {
  try {
    const normalized = await normalizeGenerateOptions(
      inOpts as Partial<CLIOptions> & { projectName?: string }
    );
    const runtime = inOpts.runtime ?? 'nodejs';
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
    
    const projectName = String(inOpts.projectName ?? ctx.projectName ?? path.basename(opts.targetRoot));
    
    p.note(
      `Creating project ${pc.cyan(projectName)}
Runtime: ${pc.green(runtime)}
Language: ${pc.green(language)}
Framework: ${pc.green(framework)}
ORM: ${pc.green(orm)}
Package Manager: ${pc.green(normalized.packageManager || 'npm')}`,
      'Bend Setup'
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
    
    p.outro(pc.green(`You're all set! Run: cd ${projectName} && ${normalized.packageManager || 'npm'} run dev`));
    
  } catch (err: any) {
    setSilent(false);
    log.error(String(err?.message ?? err));
    process.exit(1);
  }
}

export async function main() {
  const program = new Command();
  program
    .name('bend')
    .description('Bend - The Backend Bundler')
    .argument('[project-name]', 'Project name')
    .option('-t, --template <template>', 'Template to use')
    .option('--runtime <runtime>', 'Runtime (nodejs, bun)')
    .option('--pm <pm>', 'Package manager (npm, pnpm, yarn, bun)')
    .action(async (projectName, options) => {
      console.clear();
      p.intro(pc.bgMagenta(pc.black(' BEND ')));

      const runtime = options.runtime || ((process.versions as any).bun ? 'bun' : 'nodejs');
      const pm = options.pm || (await detectPackageManager());

      const answers: Partial<CLIOptions> = {};
      
      // If project name is not provided, ask for it in askQuestions (which we need to modify to accept initial values)
      // But askQuestions currently asks for everything.
      // We'll use askQuestions but override with options if provided.
      
      // Actually, askQuestions handles the interactive part.
      // We should pass what we know.
      
      const userAnswers = await askQuestions();
      
      // Merge detected/provided options with user answers
      const finalOptions: Partial<CLIOptions> = {
        projectName: projectName || userAnswers.projectName,
        runtime: runtime as 'nodejs' | 'bun',
        packageManager: pm as 'npm' | 'pnpm' | 'yarn' | 'bun',
        language: userAnswers.language,
        orm: userAnswers.orm,
        framework: userAnswers.framework,
        ...options
      };

      await createProject(finalOptions);
    });

  program.parse(process.argv);
}

// Execute main if run directly
if (require.main === module) {
  main();
}

// Export main as run for backwards compatibility
export const run = main;

