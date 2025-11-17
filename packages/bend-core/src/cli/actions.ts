import fs from 'node:fs';
import { promises as fsp } from 'node:fs';
import pc from 'picocolors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir, copyDirRenderEJS } from '../utils/fs';
import { run } from '../utils/exec.js';
import { buildDeps } from '../scaffold/deps';
import { toValidPackageName } from '../scaffold/normalize';
import type { Answers, TemplateContext } from '../types';
import { spinner } from './spinner.js';
import { pmAvailable } from '../utils/pm.js';
import { renderFile } from '../scaffold/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveTemplatesRoot(): string {
  // Compiled CLI lives at dist/cli; templates are shipped at src/scaffold/templates
  const candidates = [
    path.resolve(__dirname, '../../src/scaffold/templates'), // normal when installed
    path.resolve(process.cwd(), 'src/scaffold/templates'), // dev repo root
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error(
    `Templates folder not found. Tried:\n${candidates
      .map(c => '  - ' + c)
      .join('\n')}`
  );
}

const TEMPLATES = resolveTemplatesRoot();

export async function createProject(a: Answers) {
  const projectDir = path.resolve(process.cwd(), a.name);
  const pkgName = toValidPackageName(a.name);
  const langDir = a.language === 'typescript' ? 'ts' : 'js';

  console.log(pc.cyan(`\nCreating project: ${pkgName}\n`));
  await ensureDir(projectDir);

  // verify PM; fallback to npm if missing
  const pm = (await pmAvailable(a.pkgm)) ? a.pkgm : 'npm';
  if (pm !== a.pkgm)
    console.warn(pc.yellow(`${a.pkgm} not found, falling back to npm.`));

  const ctx: TemplateContext = {
    name: pkgName,
    language: a.language,
    framework: a.framework,
    orm: a.orm,
    pkgm: pm,
  };

  spinner.start('Copying templates...');

  // common
  await copyDirRenderEJS(path.join(TEMPLATES, 'common'), projectDir, ctx);

  // runtime (selective for JS; full for TS)
  const runtimeDir = path.join(TEMPLATES, 'runtime');
  if (a.language === 'typescript') {
    await copyDirRenderEJS(runtimeDir, projectDir, ctx);
  } else {
    // JS: only esbuild.config.js + nodemon.json (no tsconfig)
    await writeRenderedFile(
      path.join(runtimeDir, 'esbuild.config.js.ejs'),
      path.join(projectDir, 'esbuild.config.js'),
      ctx
    );
    await writeRenderedFile(
      path.join(runtimeDir, 'nodemon.json.ejs'),
      path.join(projectDir, 'nodemon.json'),
      ctx
    );
  }

  // server (express/fastify + js/ts)
  await copyDirRenderEJS(
    path.join(TEMPLATES, 'server', a.framework, langDir),
    projectDir,
    ctx
  );

  // orm
  if (a.orm === 'mongoose') {
    await copyDirRenderEJS(
      path.join(TEMPLATES, 'orm', 'mongoose', langDir),
      projectDir,
      ctx
    );
  } else if (a.orm === 'prisma') {
    // Always schema
    await copyDirRenderEJS(
      path.join(TEMPLATES, 'orm', 'prisma', 'prisma'),
      projectDir,
      ctx
    );
    // TS helper only for TypeScript projects
    if (a.language === 'typescript') {
      await copyDirRenderEJS(
        path.join(TEMPLATES, 'orm', 'prisma', 'ts'),
        projectDir,
        ctx
      );
    }
  }

  spinner.succeed('Templates copied successfully.');

  // deps
  const { deps, devDeps } = buildDeps(a);
  console.log(pc.yellow(`\nInstalling dependencies with ${pm}...\n`));
  spinner.start('Installing packages...');
  await installDeps(pm, deps, devDeps, projectDir);
  spinner.succeed('Dependencies installed.');

  // prisma client
  if (a.orm === 'prisma') {
    console.log(pc.yellow('Generating Prisma client...'));
    await run(pm, ['run', 'prisma:generate'], projectDir).catch(() => {
      console.warn(pc.yellow('Prisma client generation skipped (optional).'));
    });
  }

  console.log(pc.green(`\n${pkgName} created successfully.`));
  console.log(pc.dim(`\nNext steps:\n  cd ${a.name}\n  ${pm} run dev\n`));
}

async function writeRenderedFile(
  srcEjsPath: string,
  destPath: string,
  ctx: Record<string, unknown>
) {
  const rendered = await renderFile(srcEjsPath, ctx);
  await ensureDir(path.dirname(destPath));
  await fsp.writeFile(destPath, rendered, 'utf8');
}

async function installDeps(
  pm: string,
  deps: string[],
  devDeps: string[],
  cwd: string
) {
  const exec = (cmd: string, args: string[]) =>
    run(cmd, args, cwd).catch(err => {
      console.error(
        pc.red(
          `Failed: ${cmd} ${args.join(' ')}\n${
            err instanceof Error ? err.message : String(err)
          }`
        )
      );
      process.exit(1);
    });

  if (pm === 'npm') {
    if (deps.length) await exec('npm', ['install', ...deps]);
    if (devDeps.length) await exec('npm', ['install', '-D', ...devDeps]);
    return;
  }
  if (pm === 'pnpm') {
    if (deps.length) await exec('pnpm', ['add', ...deps]);
    if (devDeps.length) await exec('pnpm', ['add', '-D', ...devDeps]);
    return;
  }
  if (pm === 'yarn') {
    if (deps.length) await exec('yarn', ['add', ...deps]);
    if (devDeps.length) await exec('yarn', ['add', '-D', ...devDeps]);
    return;
  }
  if (pm === 'bun') {
    if (deps.length) await exec('bun', ['add', ...deps]);
    if (devDeps.length) await exec('bun', ['add', '-d', ...devDeps]);
    return;
  }

  console.warn(pc.yellow(`Unknown package manager "${pm}", skipping install.`));
}
