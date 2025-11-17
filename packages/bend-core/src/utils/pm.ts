import path from 'path';
import { exec } from '../utils/exec';
export type PM = 'pnpm' | 'npm' | 'yarn' | 'bun';

export async function detectPackageManager(cwd = process.cwd()): Promise<PM> {
  const p = path.resolve(cwd);
  try {
    const fs = await import('fs/promises');
    const has = async (name: string) => {
      try {
        await fs.access(path.join(p, name));
        return true;
      } catch {
        return false;
      }
    };
    if (process.env.BUN_INSTALLER || process.env.BUN_VERSION) return 'bun';
    const userAgent = process.env.npm_config_user_agent ?? '';
    if (typeof userAgent === 'string') {
      if (userAgent.startsWith('pnpm')) return 'pnpm';
      if (userAgent.startsWith('yarn')) return 'yarn';
      if (userAgent.startsWith('bun')) return 'bun';
      if (userAgent.startsWith('npm')) return 'npm';
    }
    if (await has('bun.lockb')) return 'bun';
    if (await has('pnpm-lock.yaml')) return 'pnpm';
    if (await has('yarn.lock')) return 'yarn';
    if (await has('package-lock.json')) return 'npm';
  } catch {}
  return 'npm';
}

export async function installDependencies(cwd = process.cwd(), pm?: PM) {
  const manager = pm ?? (await detectPackageManager(cwd));
  if (manager === 'pnpm') return exec('pnpm', ['install'], { cwd });
  if (manager === 'yarn') return exec('yarn', ['install'], { cwd });
  if (manager === 'bun') return exec('bun', ['install'], { cwd });
  return exec('npm', ['install'], { cwd });
}

export async function addDependency(
  pkg: string,
  opts: { cwd?: string; dev?: boolean; pm?: PM } = {}
) {
  const cwd = opts.cwd ?? process.cwd();
  const manager = opts.pm ?? (await detectPackageManager(cwd));
  if (manager === 'pnpm')
    return exec('pnpm', ['add', ...(opts.dev ? ['-D'] : []), pkg], { cwd });
  if (manager === 'yarn')
    return exec('yarn', ['add', ...(opts.dev ? ['-D'] : []), pkg], { cwd });
  if (manager === 'bun')
    return exec('bun', ['add', ...(opts.dev ? ['-d'] : []), pkg], { cwd });
  return exec('npm', ['install', ...(opts.dev ? ['-D'] : []), pkg], { cwd });
}

export async function runScript(script: string, cwd = process.cwd(), pm?: PM) {
  const manager = pm ?? (await detectPackageManager(cwd));
  if (manager === 'pnpm')
    return exec('pnpm', ['run', script], { cwd, shell: false });
  if (manager === 'yarn')
    return exec('yarn', ['run', script], { cwd, shell: false });
  if (manager === 'bun')
    return exec('bun', ['run', script], { cwd, shell: false });
  return exec('npm', ['run', script], { cwd, shell: false });
}

export async function runCommand(
  cmd: string,
  args: string[] = [],
  cwd = process.cwd()
) {
  return exec(cmd, args, { cwd, shell: false });
}
